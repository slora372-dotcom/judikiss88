(function () {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (key) => esc(S.links[key] || "#");

  // ---------- Carousel ----------
  const track = $("carouselTrack");
  const dots = $("carouselDots");
  track.innerHTML = S.banners.map((src, i) =>
    `<a class="slide" href="${link("register")}"><img src="${esc(src)}" alt="Promosi ${esc(S.brand.name)} ${i + 1}" width="1400" height="600"${i ? ' loading="lazy"' : ' fetchpriority="high"'}></a>`
  ).join("");
  dots.innerHTML = S.banners.map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join("");

  let slide = 0;
  const goTo = (i) => {
    slide = (i + S.banners.length) % S.banners.length;
    track.scrollTo({ left: slide * track.clientWidth, behavior: "smooth" });
  };
  const syncDots = () => {
    slide = Math.round(track.scrollLeft / track.clientWidth);
    [...dots.children].forEach((d, i) => d.classList.toggle("active", i === slide));
  };
  [...dots.children].forEach((d, i) => d.addEventListener("click", () => goTo(i)));
  track.addEventListener("scroll", syncDots, { passive: true });
  syncDots();
  // The first banner stays for 8s before rotating every 4s. A slide change in
  // the first few seconds makes speed tests count the page as still loading.
  let timer = setTimeout(() => {
    goTo(slide + 1);
    timer = setInterval(() => goTo(slide + 1), 4000);
  }, 8000);
  track.addEventListener("pointerdown", () => { clearTimeout(timer); clearInterval(timer); }, { once: true });

  // ---------- Games ----------
  $("hotGames").innerHTML = S.hotGames.map((g) => `
    <a class="hot" href="${link("games")}">
      <img src="${esc(g.img)}" alt="${esc(g.name)}" width="300" height="335" loading="lazy">
      <span class="hot-name">${esc(g.name)}</span>
      <span class="play">Play</span>
    </a>`).join("");
  $("categories").innerHTML = S.categories.map((c) =>
    `<a class="cat${c.on ? " on" : ""}" href="${link("games")}"><img src="${esc(c.img)}" alt="${esc(c.label)}" width="160" height="147" loading="lazy"></a>`
  ).join("");
  $("providers").innerHTML = S.providers.map((p) =>
    `<a class="prov" href="${link("games")}"><img src="${esc(p.img)}" alt="${esc(p.name)}" width="200" height="200" loading="lazy"></a>`
  ).join("");

  // ---------- Daily check-in ----------
  $("crowns").innerHTML = Array.from({ length: 7 }, (_, i) =>
    `<div class="crown"><img src="assets/ui/crown.png" alt="" width="120" height="120" loading="lazy"><span>Day ${i + 1}</span></div>`
  ).join("");

  // ---------- Referral ----------
  const copyLink = () =>
    navigator.clipboard.writeText(S.referralUrl).then(() => toast("Link referral disalin"), () => toast(S.referralUrl));
  $("copyBtn").addEventListener("click", copyLink);
  $("shareBtn").addEventListener("click", () => {
    if (navigator.share) navigator.share({ title: S.brand.name, url: S.referralUrl }).catch(() => {});
    else copyLink();
  });

  // ---------- Footer ----------
  const icons = (list) => list.map((p) => `<img src="${esc(p.img)}" alt="${esc(p.name)}" width="${p.w}" height="30" loading="lazy">`).join("");
  $("certifications").innerHTML = icons(S.certifications);
  $("payments").innerHTML = icons(S.payments);

  // ---------- Map (click to load) ----------
  $("mapBtn").addEventListener("click", (e) => {
    const frame = document.createElement("iframe");
    frame.className = "map";
    frame.title = "JUDIKISS88 location map";
    frame.src = e.currentTarget.dataset.src;
    e.currentTarget.replaceWith(frame);
  });

  // ---------- Change Luck float ----------
  $("changeLuckClose").addEventListener("click", () => { $("changeLuck").hidden = true; });

  // ---------- Links ----------
  document.querySelectorAll("[data-link]").forEach((el) => {
    el.href = S.links[el.dataset.link] || "#";
  });

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }
})();
