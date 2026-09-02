/* Генератор чотирьох статичних сторінок. Запускається один раз:
   node build-pages.js   →   index.html, posluhy.html, atmosfera.html, kontakty.html */
const fs = require("fs");

const SITE = "https://bashevnik.github.io/ashad-barbershop";
const A = "assets/";

/* ── SVG ────────────────────────────────────────────── */
const CAP_D =
  '<path d="M16 21v-5c0-7 5-12 12-12s12 6 12 13v4z"/>' +
  '<path d="M41 21H5c-1.6 0-2-2-.4-2.6L16 15h25z"/>';

const mark = (cls = "", light = false) =>
  `<img class="mark ${cls}" src="${A}logo${light ? "-light" : "-mark"}.png" ` +
  `alt="ASHAD Barbershop" width="320" height="320" decoding="async">`;


const ico = {
  scissors:
    '<svg class="grid-caps__ico" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="7" cy="24" r="4"/><circle cx="25" cy="24" r="4"/><path d="M9.8 21.2 25 5M22.2 21.2 7 5"/></svg>',
  razor:
    '<svg class="grid-caps__ico" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="4" y="6" width="24" height="9" rx="1.5"/><path d="M8 15v9M12 15v11M16 15v9M20 15v11M24 15v9"/></svg>',
  bulb:
    '<svg class="grid-caps__ico" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M16 3a9 9 0 0 0-5 16.5V23h10v-3.5A9 9 0 0 0 16 3Z"/><path d="M13 26h6M14 29h4"/></svg>',
  cap:
    '<svg class="grid-caps__ico" viewBox="0 0 48 30" fill="currentColor" aria-hidden="true">' + CAP_D + "</svg>",
  drag:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"/></svg>'
};

/* ── фото ───────────────────────────────────────────── */
const P = n => A + "photo_52224093273338103" + n + "_y.jpg";
const PHOTO = {
  capGirl:   P("64"), mirror:  P("65"), facade1: P("66"),
  wash:      P("67"), fadeBack:P("68"), youngCl: P("69"),
  beard:     P("70"), profile: P("71"), brickCorner: P("72"),
  cowboy:    P("73"), lounge:  P("74"), sink:    P("75"),
  mustache:  P("77"), ledFrame:P("78"), capsGrid:P("79"),
  velvet:    P("80"),
  facade2:   A + "photo_5456503783908121708_y.jpg"
};

const VIDEOS = ["356","357","359","361","363","371","372","374","375","376","378","380"]
  .map(n => ({ src: A + "document_5222409326873846" + n + ".mp4", poster: A + "poster-" + n + ".jpg" }));

/* ── локації ────────────────────────────────────────── */
const LOC = [
  {
    id: "centr", tag: "Зала перша", name: "На Полі",
    street: "просп. Олександра Поля, 50, офіс 62",
    hours: "щодня 09:00–20:00", opens: "09:00", closes: "20:00",
    phone: "095 690 60 55", tel: "+380956906055",
    ig: "ashad_barbershop.dnipro",
    maps: "https://maps.google.com/?cid=17836078881062854415",
    about: "Низька стеля, цегла, лампи на голих дротах і зелений честерфілд у кутку. На дивані буває пудель — він тут раніше за всіх."
  },
  {
    id: "topol", tag: "Зала друга", name: "На Тополі",
    street: "вул. Авіаторів, 1Ч",
    hours: "щодня 09:00–21:00", opens: "09:00", closes: "21:00",
    phone: "093 888 40 50", tel: "+380938884050",
    ig: "ashad_barbershop.dnipro_2",
    maps: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("ASHAD Barbershop Dnipro 2"),
    about: "Висока, світла, вітрина на всю стіну. На стіні — решітка з кашкетами, і той самий зелений диван."
  }
];

const PRICES = [
  ["Стрижка", "750 ₴", ""],
  ["Стрижка + борода", "1100 ₴", "найчастіше беруть саме це"],
  ["Борода", "600 ₴", ""],
  ["Камуфляж", "від 350 ₴", "залежить від сивини"],
  ["Ваксинг", "100 ₴", "вуха, ніс"]
];

const NAV = [
  ["index.html", "Головна"],
  ["posluhy.html", "Послуги і ціни"],
  ["atmosfera.html", "Атмосфера"],
  ["kontakty.html", "Контакти"]
];


/* ── шматки розмітки ────────────────────────────────── */
const header = cur => `
<div class="scrim" aria-hidden="true"></div>
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="brand" href="index.html">
      ${mark("brand__logo")}
      <span class="brand__city">Дніпро</span>
    </a>
    <button class="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="nav"><span></span></button>
    <nav class="nav" id="nav" aria-label="Головне меню">
      ${NAV.map(([h, t]) => `<a href="${h}"${h === cur ? ' aria-current="page"' : ""}>${t}</a>`).join("\n      ")}
    </nav>
  </div>
</header>`;

const footer = `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div>
        ${mark("ftr__mark", true)}
        <p style="max-width:30ch;margin:0">Барбершоп ASHAD. Дві зали в Дніпрі — на проспекті Поля і на Тополі.</p>
      </div>
      <div>
        <h4>Де ми</h4>
        <ul>
          ${LOC.map(l => `<li><a href="${l.maps}" target="_blank" rel="noopener">${l.street}</a><br><span style="opacity:.7">${l.hours}</span></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h4>Сторінки</h4>
        <ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul>
      </div>
    </div>
    <div class="ftr__bottom">
      <span>© <span id="year">2026</span> ASHAD Barbershop, Дніпро</span>
      <span>Записатись: <a href="tel:${LOC[0].tel}">${LOC[0].phone}</a> · <a href="https://instagram.com/${LOC[0].ig}" target="_blank" rel="noopener">Instagram</a></span>
    </div>
  </div>
</footer>`;

const jsonld = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "ASHAD Barbershop",
  description: "Барбершоп у Дніпрі: дві зали — на проспекті Олександра Поля та на вулиці Авіаторів (Тополь).",
  url: SITE + "/",
  image: SITE + "/" + PHOTO.facade1,
  priceRange: "600–1100 ₴",
  currenciesAccepted: "UAH",
  areaServed: "Дніпро",
  telephone: LOC[0].tel,
  sameAs: LOC.map(l => "https://instagram.com/" + l.ig),
  makesOffer: PRICES.map(([n, p]) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: n },
    price: p.replace(/[^\d]/g, ""),
    priceCurrency: "UAH"
  })),
  department: LOC.map(l => ({
    "@type": "HairSalon",
    name: "ASHAD Barbershop — " + l.name,
    telephone: l.tel,
    sameAs: ["https://instagram.com/" + l.ig],
    hasMap: l.maps,
    address: {
      "@type": "PostalAddress",
      streetAddress: l.street,
      addressLocality: "Дніпро",
      addressRegion: "Дніпропетровська область",
      addressCountry: "UA"
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: l.opens,
      closes: l.closes
    }
  }))
}, null, 0);

const page = ({ file, title, desc, body, cur, og }) => `<!doctype html>
<html lang="uk" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}/${file}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ASHAD Barbershop">
<meta property="og:locale" content="uk_UA">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/${file}">
<meta property="og:image" content="${SITE}/${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F2E9D8">
<link rel="icon" href="${A}logo.png">
<link rel="preload" href="fonts/bitter-800-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/golos-text-400-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.className="js";</script>
<script type="application/ld+json">${jsonld}</script>
</head>
<body>
<div id="curtain" aria-hidden="true">${mark("curtain__mark", true)}</div>
${header(cur)}
<main id="main">
${body}
</main>
${footer}
<script src="js/lib/gsap.min.js"></script>
<script src="js/lib/ScrollTrigger.min.js"></script>
<script src="js/lib/lax.min.js"></script>
<script src="js/app.js"></script>
</body>
</html>
`;

/* ── повторювані блоки ──────────────────────────────── */
const capsStrip = `
<section class="caps" aria-hidden="true">
  <div class="wrap caps__row">
    ${[
      "зелений оксамит",
      "кашкети на стіні",
      "колажі 50-х у рамах",
      "лампи Едісона",
      "кільце лампочок на вивісці"
    ].map(t => `<span class="caps__item">${ico.cap.replace('class="grid-caps__ico"', "")}${t}</span>`).join("\n    ")}
  </div>
</section>`;

const priceList = `
<ul class="price">
  ${PRICES.map(([n, v, note]) => `<li>
    <span class="price__name">${n}${note ? `<span class="price__note">${note}</span>` : ""}</span>
    <span class="price__dots"></span>
    <span class="price__val">${v}</span>
  </li>`).join("\n  ")}
</ul>`;

const fig = (src, cap, cls = "") =>
  `<figure class="frame ${cls}"><img src="${src}" alt="${cap}" loading="lazy" decoding="async"><figcaption>${cap}</figcaption></figure>`;

const reel = `
<section class="reel" id="video">
  <div class="wrap reel__head reveal">
    <div class="rule"><h2>Як це виглядає</h2>${mark("rule__mark")}</div>
    <p class="lead">Дванадцять коротких відео з обох зал.</p>
    <span class="reel__hint">${ico.drag} гортай убік</span>
  </div>
  <div class="reel__track">
    ${VIDEOS.map((v, i) => `<div class="reel__card"><video data-src="${v.src}" poster="${v.poster}" muted loop playsinline preload="none" aria-label="Відео ${i + 1} з барбершопу"></video></div>`).join("\n    ")}
  </div>
</section>`;

/* ── 1. ГОЛОВНА ─────────────────────────────────────── */
const home = `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      ${mark("hero__mark lax-spin")}
      <h1>Стрижемо<br>на Полі<br>і на <em>Тополі</em></h1>
      <p class="hero__hand">Дві зали в Дніпрі. Заходь — каву наллємо, пса погладиш.</p>
      <div class="hero__cta">
        <a class="btn" href="kontakty.html"><span class="btn__dot"></span>Записатись</a>
        <a class="btn btn--ghost" href="posluhy.html">Ціни</a>
      </div>
    </div>
    <figure class="frame frame--wood hero__photo frame--tilt-r lax-slow">
      <img src="${PHOTO.capGirl}" alt="Майстриня в кашкеті на зеленому дивані" loading="eager" decoding="async">
      <figcaption>Зала на Полі. Кашкет свій, диван теж.</figcaption>
    </figure>
  </div>
</section>

${capsStrip}

<section class="sec">
  <div class="wrap">
    <div class="rule reveal"><h2>Дві зали, один диван</h2>${mark("rule__mark")}</div>
    <div class="halls">
      ${LOC.map((l, i) => `<article class="hall reveal">
        <span class="hall__tag">${l.tag}</span>
        <h3>${l.name}</h3>
        ${fig(i === 0 ? PHOTO.brickCorner : PHOTO.velvet, i === 0 ? "Цегла, колажі, капелюх на стіні" : "Вітрина, чорні штори, зелений оксамит")}
        <p>${l.about}</p>
        <p class="hall__meta"><b>${l.street}</b><br>${l.hours}</p>
      </article>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec" style="background:var(--paper-2);border-block:1px solid var(--line)">
  <div class="wrap">
    <div class="rule reveal"><h2>Скільки коштує</h2>${mark("rule__mark")}</div>
    <div class="reveal">${priceList}</div>
    <p style="margin-top:26px"><a class="btn btn--ghost" href="posluhy.html">Уся послуга з деталями</a></p>
  </div>
</section>

<section class="sec">
  <div class="wrap-wide">
    <div class="rule reveal" style="width:min(100%,var(--wrap));margin-inline:auto"><h2>Стіна</h2>${mark("rule__mark")}</div>
    <div class="wall">
      <figure class="frame w5 tall reveal frame--tilt-l"><img src="${PHOTO.youngCl}" alt="Стрижка молодого клієнта" loading="lazy"><figcaption>Поля, 50 — робочий день</figcaption></figure>
      <figure class="frame w4 sq reveal down"><img src="${PHOTO.wash}" alt="Мийка голови, пудель на дивані" loading="lazy"><figcaption>Пудель у кадр проситься сам</figcaption></figure>
      <figure class="frame w3 port reveal"><img src="${PHOTO.cowboy}" alt="Майстриня в капелюсі на зеленому дивані" loading="lazy"><figcaption>Капелюх — з тієї ж стіни</figcaption></figure>
      <figure class="frame w4 tall reveal frame--tilt-r"><img src="${PHOTO.mustache}" alt="Клієнт з ватними вусами на паличках" loading="lazy"><figcaption>Тополь. Вуса не наші, але ми не проти</figcaption></figure>
      <figure class="frame w5 tall reveal down"><img src="${PHOTO.lounge}" alt="Зона очікування: диван, колажі, лампи" loading="lazy"><figcaption>Почекати можна отут</figcaption></figure>
      <figure class="frame w3 port reveal"><img src="${PHOTO.capsGrid}" alt="Решітка з колекцією кашкетів" loading="lazy"><figcaption>Колекція росте</figcaption></figure>
    </div>
    <p style="text-align:center;margin-top:36px"><a class="btn" href="atmosfera.html"><span class="btn__dot"></span>Подивитись обидві зали</a></p>
  </div>
</section>
`;

/* ── 2. ПОСЛУГИ І ЦІНИ ──────────────────────────────── */
const posluhy = `
<section class="sec sec--tight">
  <div class="wrap">
    ${mark("hero__mark")}
    <h1>Послуги<br>і ціни</h1>
    <p class="lead" style="margin-top:22px">Однаково на Полі і на Тополі. Без пакетів і без зірочок.</p>
  </div>
</section>

<section class="sec--tight">
  <div class="wrap">${priceList}</div>
</section>

${capsStrip}

<section class="sec">
  <div class="wrap halls">
    <div class="reveal">
      <div class="rule"><h2>Як проходить</h2>${mark("rule__mark")}</div>
      <p>Сідаєш, кажеш, що хочеш. Якщо не знаєш — подивимось разом, що росте і що взагалі буде добре лежати. Далі стрижка, помиємо голову, вкладемо.</p>
      <p>Борода — окремо або разом зі стрижкою, як зручніше. Камуфляж робимо м’яко, щоб не було ефекту фарбованого.</p>
      <p>Приходити краще за записом — зал невеликий, у живій черзі можна довго сидіти.</p>
    </div>
    <figure class="frame frame--wood reveal frame--tilt-l">
      <img src="${PHOTO.beard}" alt="Майстриня підрівнює бороду біля вікна" loading="lazy">
      <figcaption>Борода, Поля 50</figcaption>
    </figure>
  </div>
</section>

<section class="sec" style="background:var(--paper-2);border-block:1px solid var(--line)">
  <div class="wrap">
    <div class="rule reveal"><h2>Що ще спитати</h2>${mark("rule__mark")}</div>
    <div class="halls">
      <div class="hall reveal"><h3>Скільки часу</h3><p>Стрижка — приблизно година. Зі бородою — довше, десь півтори.</p></div>
      <div class="hall reveal"><h3>Чим платити</h3><p>Готівкою або карткою — як зручно.</p></div>
      <div class="hall reveal"><h3>Дітей стрижемо?</h3><p>Так. Якщо дитина маленька — попередь заздалегідь, підберемо спокійніший час.</p></div>
      <div class="hall reveal"><h3>А просто підрівняти?</h3><p>Теж приходь. Порахуємо як стрижку.</p></div>
    </div>
    <p style="margin-top:32px"><a class="btn" href="kontakty.html"><span class="btn__dot"></span>Записатись</a></p>
  </div>
</section>
`;

/* ── 3. АТМОСФЕРА ───────────────────────────────────── */
const atmosfera = `
<section class="sec sec--tight">
  <div class="wrap">
    ${mark("hero__mark")}
    <h1>Атмосфера</h1>
    <p class="lead" style="margin-top:22px">Дві зали, зовсім різні на вигляд. Спільне — зелений диван, кашкети і колажі на стінах.</p>
  </div>
</section>

<section class="sec--tight">
  <div class="wrap">
    <nav class="grid-caps" aria-label="Розділи сторінки">
      <a href="#centr">${ico.cap}<b>Зала на Полі</b><span>цегла, лампи, пудель</span></a>
      <a href="#topol">${ico.bulb}<b>Зала на Тополі</b><span>вітрина, кашкети, оксамит</span></a>
      <a href="#video">${ico.scissors}<b>Відео</b><span>12 роликів із залів</span></a>
      <a href="kontakty.html">${ico.razor}<b>Як дійти</b><span>адреси і години</span></a>
    </nav>
  </div>
</section>

<section class="sec" id="centr">
  <div class="wrap-wide">
    <div class="rule reveal" style="width:min(100%,var(--wrap));margin-inline:auto">
      <h2>Зала на Полі</h2>${mark("rule__mark")}
    </div>
    <div class="wall">
      <figure class="frame w5 tall reveal frame--tilt-l"><img src="${PHOTO.lounge}" alt="Зона очікування з диваном і трьома колажами" loading="lazy"><figcaption>Три колажі, лампи на дротах, кава поруч</figcaption></figure>
      <figure class="frame w4 port reveal down"><img src="${PHOTO.brickCorner}" alt="Цегляний кут з колажами і шкіряним капелюхом" loading="lazy"><figcaption>Той самий кут із капелюхом</figcaption></figure>
      <figure class="frame w3 tall reveal"><img src="${PHOTO.sink}" alt="Мийка, чорний стелаж з флаконами, постер" loading="lazy"><figcaption>Мийка і стелаж</figcaption></figure>
      <figure class="frame w4 tall reveal"><img src="${PHOTO.wash}" alt="Миють голову, поруч на дивані пудель" loading="lazy"><figcaption>Пудель у робочий час</figcaption></figure>
      <figure class="frame w4 tall reveal down frame--tilt-l"><img src="${PHOTO.mirror}" alt="Робоче місце майстра, дзеркало, інструмент" loading="lazy"><figcaption>Робоче місце</figcaption></figure>
      <figure class="frame w4 tall reveal"><img src="${PHOTO.fadeBack}" alt="Стрижка ззаду, машинка" loading="lazy"><figcaption>Фейд</figcaption></figure>
      <figure class="frame w5 tall reveal"><img src="${PHOTO.profile}" alt="Клієнт після стрижки, профіль" loading="lazy"><figcaption>Готово</figcaption></figure>
      <figure class="frame w7 wide reveal down"><img src="${PHOTO.facade1}" alt="Фасад на проспекті Поля: кругла вивіска і барбер-стовп" loading="lazy"><figcaption>Вхід із двору, повз барбер-стовп</figcaption></figure>
    </div>
  </div>
</section>

<section class="sec" id="topol" style="background:var(--paper-2);border-block:1px solid var(--line)">
  <div class="wrap-wide">
    <div class="rule reveal" style="width:min(100%,var(--wrap));margin-inline:auto">
      <h2>Зала на Тополі</h2>${mark("rule__mark")}
    </div>
    <div class="wall">
      <figure class="frame w5 tall reveal"><img src="${PHOTO.velvet}" alt="Зелений честерфілд біля вітрини, чорні штори" loading="lazy"><figcaption>Диван біля вітрини</figcaption></figure>
      <figure class="frame w4 port reveal down frame--tilt-l"><img src="${PHOTO.capsGrid}" alt="Решітка з колекцією кашкетів на стіні" loading="lazy"><figcaption>Решітка з кашкетами</figcaption></figure>
      <figure class="frame w3 tall reveal"><img src="${PHOTO.ledFrame}" alt="Світлодіодна рама-підвіс над кріслом" loading="lazy"><figcaption>Квадрат світла над кріслом</figcaption></figure>
      <figure class="frame w5 sq reveal frame--tilt-r"><img src="${PHOTO.mustache}" alt="Клієнт з ватними вусами на паличках" loading="lazy"><figcaption>Тут веселіше, ніж на фото</figcaption></figure>
      <figure class="frame w7 wide reveal down"><img src="${PHOTO.facade2}" alt="Фасад на Авіаторів: кругла вивіска і барбер-стовп" loading="lazy"><figcaption>Шукай круглу вивіску і стовп</figcaption></figure>
    </div>
  </div>
</section>

${reel}
`;

/* ── 4. КОНТАКТИ ────────────────────────────────────── */
const kontakty = `
<section class="sec sec--tight">
  <div class="wrap">
    ${mark("hero__mark")}
    <h1>Контакти</h1>
    <p class="lead" style="margin-top:22px">Дві адреси в Дніпрі. Обидві — з круглою вивіскою і барбер-стовпом біля дверей.</p>
  </div>
</section>

<section class="sec--tight">
  <div class="wrap cards">
    ${LOC.map((l, i) => `<article class="card reveal">
      <span class="hall__tag">${l.tag}</span>
      <h3>${l.name}</h3>
      ${fig(i === 0 ? PHOTO.facade1 : PHOTO.facade2, i === 0 ? "Вхід на проспекті Поля, 50" : "Вхід на Авіаторів, 1Ч")}
      <dl>
        <dt>Адреса</dt><dd>${l.street}<br>Дніпро</dd>
        <dt>Години</dt><dd>${l.hours}</dd>
        <dt>Телефон</dt><dd><a href="tel:${l.tel}">${l.phone}</a></dd>
      </dl>
      <div class="card__links">
        <a class="btn" href="${l.maps}" target="_blank" rel="noopener"><span class="btn__dot"></span>Google Maps</a>
        <a class="btn btn--ghost" href="https://instagram.com/${l.ig}" target="_blank" rel="noopener">@${l.ig}</a>
      </div>
    </article>`).join("\n    ")}
  </div>
</section>

${capsStrip}

<section class="sec">
  <div class="wrap halls">
    <div class="reveal">
      <div class="rule"><h2>Як записатись</h2>${mark("rule__mark")}</div>
      <p>Найшвидше — подзвонити або написати в Instagram. Скажи, на яку залу і приблизно коли зручно, ми підкажемо вільний час.</p>
      <p>Якщо не додзвонився — напиши, передзвонимо, коли звільниться крісло.</p>
    </div>
    <figure class="frame frame--wood reveal frame--tilt-r">
      <img src="${PHOTO.capGirl}" alt="Майстриня в кашкеті на зеленому дивані" loading="lazy">
      <figcaption>До зустрічі</figcaption>
    </figure>
  </div>
</section>
`;

/* ── запис ──────────────────────────────────────────── */
const pages = [
  {
    file: "index.html", cur: "index.html", body: home, og: PHOTO.brickCorner,
    title: "ASHAD Barbershop — барбершоп у Дніпрі на просп. Поля і на Тополі",
    desc: "Барбершоп ASHAD у Дніпрі: дві зали — просп. Олександра Поля, 50 та вул. Авіаторів, 1Ш. Стрижка 750 ₴, стрижка з бородою 1100 ₴."
  },
  {
    file: "posluhy.html", cur: "posluhy.html", body: posluhy, og: PHOTO.beard,
    title: "Послуги і ціни — ASHAD Barbershop, Дніпро",
    desc: "Ціни барбершопу ASHAD у Дніпрі: стрижка 750 ₴, стрижка з бородою 1100 ₴, борода 600 ₴, камуфляж від 350 ₴, ваксинг 100 ₴."
  },
  {
    file: "atmosfera.html", cur: "atmosfera.html", body: atmosfera, og: PHOTO.velvet,
    title: "Атмосфера — інтер’єри, роботи і відео ASHAD Barbershop",
    desc: "Дві зали барбершопу ASHAD у Дніпрі: цегла і лампи на Полі, вітрина і колекція кашкетів на Тополі. Фото робіт і відео із залів."
  },
  {
    file: "kontakty.html", cur: "kontakty.html", body: kontakty, og: PHOTO.facade1,
    title: "Контакти — ASHAD Barbershop у Дніпрі",
    desc: "Адреси барбершопу ASHAD у Дніпрі: просп. Олександра Поля, 50, офіс 62 (09:00–19:00) і вул. Авіаторів, 1Ш (09:00–21:00)."
  }
];

pages.forEach(p => fs.writeFileSync(p.file, page(p)));

fs.writeFileSync("sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(p =>
    `  <url>\n    <loc>${SITE}/${p.file}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${p.file === "index.html" ? "1.0" : "0.8"}</priority>\n  </url>`
  ).join("\n") + "\n</urlset>\n");

fs.writeFileSync("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log("готово:", pages.map(p => p.file).join(", "));
