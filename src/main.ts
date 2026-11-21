import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, projects, stats, packages, industries, serviceDetails } from "./data";
import { mountHeroScene } from "./scene";

gsap.registerPlugin(ScrollTrigger);

const app = document.querySelector<HTMLDivElement>("#app")!;
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const nav = [
  ["Studio", "/studio"],
  ["Work", "/work"],
  ["Services", "/services"],
  ["Pricing", "/#pricing"],
  ["Journal", "/journal"],
  ["Contact", "/contact"]
];

function header() {
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="VSM Marketing home"><img src="/vsm-marketing-logo.png" alt="VSM Marketing" /></a><nav class="desktop-nav">${nav.map(([label, href]) => `<a href="${href}" class="${path === href ? "active" : ""}">${label}</a>`).join("")}</nav><a class="header-cta" href="/contact">Start a project <span>↗</span></a><button class="menu-toggle" aria-label="Toggle menu"><i></i><i></i></button></header><div class="mobile-menu">${nav.map(([label, href]) => `<a href="${href}">${label}<span>↗</span></a>`).join("")}</div>`;
}

function footer() {
  return `<footer class="footer"><div class="footer-top"><p class="eyebrow">HAVE A GOOD ONE IN MIND?</p><h2>Let's make<br><em>something move.</em></h2><a class="round-link" href="/contact" aria-label="Contact VSM">↗</a></div><div class="footer-bottom"><a class="wordmark" href="/" aria-label="VSM Marketing home"><img src="/vsm-marketing-logo.png" alt="VSM Marketing" /></a><p>Digital marketing, creative and growth.<br>Meerut HQ · Noida Branch · Serving brands across India.</p><div><a href="https://www.instagram.com/vsmmarketing_/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://share.google/IpqDA5kiRv7GQdxTC" target="_blank" rel="noreferrer">Google Reviews ↗</a><a href="mailto:info@vsmgrowth.com">Email us ↗</a><a href="https://wa.me/918279574755" target="_blank" rel="noreferrer">WhatsApp ↗</a></div><small>© ${new Date().getFullYear()} VSM Growth. All rights reserved.</small></div></footer>`;
}

function projectCards(items = projects) {
  return items.map((p) => {
    const i = projects.indexOf(p);
    return `<a class="project-card project-${p.tone}" href="/work#${i + 1}" data-category="${p.category.toLowerCase()}"><div class="project-art"><span class="project-index">SELECTED PROJECT / 0${i + 1}</span><div class="art-shape shape-${p.tone}"></div><span class="project-arrow">↗</span><span class="art-caption">VSM® / ${p.category.toUpperCase()}</span></div><div class="project-meta"><div><p class="eyebrow">${p.category}</p><h3>${p.client}</h3></div><p>${p.result}</p></div><div class="project-metrics">${(p.metrics || []).map((metric, index) => `<span><strong>${metric}</strong><small>${p.metricLabels[index]}</small></span>`).join("")}</div></a>`;
  }).join("");
}

function serviceCards() {
  return services.map(s => `<a class="service-row" href="/services#${s.slug}"><span class="service-number">${s.n}</span><div><h3>${s.name}</h3><p>${s.desc}</p></div><span class="service-arrow">↗</span></a>`).join("");
}

function home() {
  return `<main>
    <section class="hero dark-section"><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> INDEPENDENT GROWTH PARTNER · INDIA</p><h1>Make your brand<br><em>impossible</em> to ignore.</h1><div class="hero-bottom"><p>A digital marketing agency in Delhi, Noida and Meerut. We bring social media, paid ads, SEO, video and web together to make brands impossible to ignore.</p><a class="text-link" href="/work">Explore selected work <span>↓</span></a></div></div><div class="hero-visual" id="hero-canvas"><div class="visual-label">VSM / CREATIVE ENGINEERING</div><div class="visual-cross">✳</div><div class="hero-orbit-label">IDEAS INTO<br>IMPACT <span>↗</span></div></div><div class="hero-foot"><span>STRATEGY — CREATIVE — PERFORMANCE — TECHNOLOGY</span><span>SCROLL TO EXPLORE ↓</span></div></section>
    <section class="intro section-pad"><p class="eyebrow">01 / THE BIG PICTURE</p><div class="intro-grid"><h2>Good marketing gets attention.<br><em>Great marketing</em> earns growth.</h2><div><p class="large-copy">VSM Marketing helps businesses get seen, trusted and chosen through strategic digital marketing, content and performance campaigns.</p><p class="muted">From Reels and brand films to paid campaigns, search visibility and conversion-first websites, our team connects the moving parts of growth.</p><a class="under-link" href="/studio">Get to know VSM ↗</a></div></div></section>
    <section class="proof-strip"><div class="proof-heading"><p class="eyebrow">BUILT ON MOMENTUM</p><p>Numbers currently published by VSM — pending source verification before final launch.</p></div>${stats.map(s => `<div class="proof-item"><strong>${s.value}</strong><span>${s.label}</span><small>${s.note}</small></div>`).join("")}</section>
    <section class="work-section section-pad"><div class="section-heading"><div><p class="eyebrow">02 / SELECTED WORK</p><h2>Work that<br><em>moves the needle.</em></h2></div><a class="under-link" href="/work">All projects ↗</a></div><div class="work-filters" role="group" aria-label="Filter selected work"><button class="filter-chip is-active" data-filter="all">All work <span>04</span></button><button class="filter-chip" data-filter="social media">Social media</button><button class="filter-chip" data-filter="hospitality">Hospitality</button><button class="filter-chip" data-filter="lead generation">Lead generation</button></div><div class="project-grid" id="home-project-grid">${projectCards()}</div></section>
    <section class="services-section dark-section section-pad"><div class="section-heading"><div><p class="eyebrow">03 / WHAT WE DO</p><h2>One partner.<br><em>Every moving part.</em></h2></div><p class="section-aside">Social, ads, SEO, video, web and reputation — connected around the growth goals that matter to your business.</p></div><div class="service-list">${serviceCards()}</div></section>
    <section class="market-section section-pad"><div class="section-heading"><div><p class="eyebrow">04 / WHO WE HELP</p><h2>Built for the<br><em>business you run.</em></h2></div><p class="section-aside">Industry-aware marketing for the way your customers discover, compare and choose.</p></div><div class="industry-grid">${industries.map((item, i) => `<span><small>0${i + 1}</small>${item}</span>`).join("")}</div></section>
    <section class="approach section-pad"><p class="eyebrow">05 / HOW WE WORK</p><h2>Clear thinking.<br><em>Committed doing.</em></h2><div class="steps"><article><span>01</span><h3>Understand</h3><p>We get close to your business, customers, category and commercial goals.</p></article><article><span>02</span><h3>Find the edge</h3><p>We identify the opportunity and shape a focused plan around it.</p></article><article><span>03</span><h3>Make & launch</h3><p>Our team creates, builds and activates the work with care.</p></article><article><span>04</span><h3>Learn & scale</h3><p>We measure what matters, improve what works and keep moving.</p></article></div></section>
    <section class="pricing-section section-pad" id="pricing"><div class="section-heading"><div><p class="eyebrow">06 / CLEAR MONTHLY PACKAGES</p><h2>Simple plans.<br><em>Serious momentum.</em></h2></div><p class="section-aside">Published VSM starting packages. Ad spend is paid directly to Meta or Google and is separate from management fees.</p></div><div class="pricing-grid">${packages.map(plan => `<article class="price-card ${plan.popular ? "is-popular" : ""}">${plan.popular ? `<span class="popular-label">MOST POPULAR</span>` : ""}<h3>${plan.name}</h3><strong>${plan.price}<small> / month</small></strong><ul>${plan.features.map(feature => `<li>${feature}</li>`).join("")}</ul><a href="/contact" class="under-link">Discuss this plan ↗</a></article>`).join("")}</div></section>
    <section class="testimonial-section dark-section section-pad"><p class="eyebrow">07 / CUSTOMER FEEDBACK</p><h2>See what clients<br><em>say about VSM.</em></h2><div class="review-layout"><div class="review-score"><span class="review-stars">★★★★★</span><strong>4.9</strong><span>Google rating · 47 reviews (as stated on the main website)</span><small>Check the live profile for the latest rating and review count.</small><a class="text-link" href="https://share.google/IpqDA5kiRv7GQdxTC" target="_blank" rel="noreferrer">Read VSM Google reviews ↗</a></div><div class="review-placeholder"><span class="quote-mark">“</span><blockquote>Explore feedback from businesses that have worked with VSM — directly on our Google Business Profile.</blockquote><div><strong>VSM Marketing on Google</strong><span>Open the original review source</span></div></div></div></section>
    <section class="contact-band section-pad"><p class="eyebrow">08 / YOUR NEXT MOVE</p><h2>Ready to make<br><em>things happen?</em></h2><a class="pill-button" href="/contact">Tell us what you're building <span>↗</span></a></section>
  </main>`;
}

function subpage() {
  if (path === "/services") return `<main class="subpage"><section class="sub-hero dark-section"><p class="eyebrow">WHAT WE DO / STRATEGY — CREATIVE — PERFORMANCE — TECHNOLOGY</p><h1>Marketing built<br><em>around outcomes.</em></h1><p>Explore VSM's services, what each engagement can include, how we work and the questions businesses ask before getting started.</p><a class="pill-button" href="/contact">Talk to a growth specialist <span>↗</span></a></section><section class="sub-content section-pad">${services.map(s => { const d = serviceDetails[s.slug]; return `<article class="service-detail-block" id="${s.slug}"><div class="service-detail-head"><span>${s.n} / CAPABILITY</span><div><h2>${s.name}</h2><p class="large-copy">${s.desc}</p><div class="tag-list">${s.tags.map(t => `<span>${t}</span>`).join("")}</div></div><a class="under-link" href="/contact?service=${encodeURIComponent(s.name)}">Discuss this service ↗</a></div><div class="service-detail-columns"><div><p class="eyebrow">TYPICAL DELIVERABLES</p><ul>${d.deliverables.map(x => `<li>${x}</li>`).join("")}</ul></div><div><p class="eyebrow">HOW WE APPROACH IT</p><ol>${d.process.map(x => `<li>${x}</li>`).join("")}</ol></div></div><div class="service-faq"><p class="eyebrow">COMMON QUESTIONS</p>${d.faqs.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></article>`; }).join("")}<section class="service-final-cta"><p class="eyebrow">NOT SURE WHAT YOU NEED?</p><h2>Let's find the right<br><em>growth mix.</em></h2><p>Tell us about your business, your audience and what you want to improve. We'll help identify a sensible starting point.</p><a class="pill-button" href="/contact">Plan a conversation ↗</a></section></section></main>`;
  if (path === "/work") return `<main class="subpage"><section class="sub-hero dark-section"><p class="eyebrow">SELECTED WORK / PROOF IN PROGRESS</p><h1>Less noise.<br><em>More outcome.</em></h1><p>Selected VSM campaigns and outcomes as currently presented on the main VSM website. Confirm client approvals and reporting evidence before republishing detailed results.</p></section><section class="sub-content section-pad"><div class="project-grid">${projectCards()}</div></section></main>`;
  if (path === "/studio") return `<main class="subpage"><section class="sub-hero dark-section"><p class="eyebrow">THE STUDIO / VSM GROWTH</p><h1>Small enough<br>to care. <em>Built to move.</em></h1><p>A digital marketing agency based in Meerut with a Noida branch, serving businesses across India.</p></section><section class="sub-content section-pad"><div class="intro-grid"><h2>Make the work<br><em>mean something.</em></h2><div><p class="large-copy">VSM works with brands that want a clear point of view, a thoughtful plan and a partner who takes the outcome personally.</p><p class="muted">Founder biographies, team portraits, office photography and verified credentials can be added in the final content pass.</p></div></div></section></main>`;
  if (path === "/journal") return `<main class="subpage"><section class="sub-hero dark-section"><p class="eyebrow">THINKING / NOTES FROM VSM</p><h1>Ideas for<br><em>what's next.</em></h1><p>Useful perspectives on visibility, demand, brand building and digital growth.</p></section><section class="sub-content section-pad"><div class="journal-empty"><span>01 / COMING NEXT</span><h2>Insights worth<br>your <em>attention.</em></h2><p>Connect a CMS to publish articles, guides and practical growth resources.</p></div></section></main>`;
  return `<main class="subpage"><section class="sub-hero dark-section"><p class="eyebrow">LET'S TALK / START A PROJECT</p><h1>Tell us what<br>you're <em>building.</em></h1><p>A little context helps us make the first conversation useful.</p></section><section class="contact-layout section-pad"><div><p class="eyebrow">DIRECT LINE</p><h2>Good things<br>start with a <em>hello.</em></h2><p><a href="mailto:info@vsmgrowth.com">info@vsmgrowth.com ↗</a></p><p><a href="https://wa.me/918279574755" target="_blank" rel="noreferrer">WhatsApp +91 82795 74755 ↗</a></p><p class="muted">Meerut · Noida · Serving brands everywhere.</p></div><form id="lead-form"><label>Your name<input name="name" required placeholder="How should we call you?"></label><label>Work email<input type="email" name="email" required placeholder="you@company.com"></label><label>Website / Instagram<input name="website" placeholder="https://"></label><label>What do you need?<select name="service"><option>Brand & social</option><option>Performance marketing</option><option>Search & visibility</option><option>Film & production</option><option>Digital experiences</option><option>PR & reputation</option><option>Not sure yet</option></select></label><label>Tell us a little about the project<textarea name="message" rows="4" placeholder="Your goals, challenges, timeline..."></textarea></label><button class="pill-button" type="submit">Prepare enquiry <span>↗</span></button><p class="form-note">This opens your email app with the enquiry details. A CRM-backed form can be connected for launch.</p></form></section></main>`;
}

app.innerHTML = `${header()}${path === "/" ? home() : subpage()}${footer()}`;

// Unique route metadata and structured business information for search engines.
const pageMeta: Record<string, { title: string; description: string }> = {
  "/": { title: "VSM Marketing | Digital Marketing Agency in Delhi, Noida & Meerut", description: "VSM Marketing brings social media, paid advertising, SEO, video production, web development and digital PR together to help businesses grow." },
  "/services": { title: "Digital Marketing Services | VSM Marketing", description: "Explore VSM services: social media marketing, Meta and Google Ads, SEO, video production, web development, PR and brand reputation." },
  "/work": { title: "Client Work & Marketing Case Studies | VSM Marketing", description: "Explore VSM Marketing projects, campaign approaches and reported outcomes across hospitality, beauty, retail and other industries." },
  "/studio": { title: "About VSM Marketing | Growth, Creative & Performance", description: "Meet VSM Marketing, a digital growth partner based in Meerut and Noida, serving businesses across India." },
  "/journal": { title: "Digital Marketing Insights | VSM Marketing", description: "Practical insights on search visibility, social media, paid campaigns, content and digital growth from VSM Marketing." },
  "/contact": { title: "Contact VSM Marketing | Discuss Your Growth Goals", description: "Contact VSM Marketing to discuss social media, paid advertising, SEO, video, web development or brand reputation." }
};
const meta = pageMeta[path] || pageMeta["/"];
document.title = meta.title;
const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
if (descriptionTag) descriptionTag.content = meta.description;
const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = `https://vsmgrowth.com${path === "/" ? "/" : path}`; document.head.append(canonical);
const schema = document.createElement("script"); schema.type = "application/ld+json";
schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "ProfessionalService", name: "VSM Marketing", url: "https://vsmgrowth.com/", image: "https://vsmgrowth.com/vsm-marketing-logo.png", email: "info@vsmgrowth.com", telephone: "+91-82795-74755", areaServed: ["Delhi", "Noida", "Meerut", "India"], sameAs: ["https://www.instagram.com/vsmmarketing_"], serviceType: services.map(s => s.name) });
document.head.append(schema);


const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(document.body.classList.contains("menu-open")));
});

const filterButtons = [...document.querySelectorAll<HTMLButtonElement>(".filter-chip")];
const projectGrid = document.querySelector<HTMLElement>("#home-project-grid");
filterButtons.forEach((button) => button.addEventListener("click", () => {
  const filter = button.dataset.filter || "all";
  filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  const filtered = filter === "all" ? projects : projects.filter((project) => project.category.toLowerCase() === filter);
  if (projectGrid) projectGrid.innerHTML = projectCards(filtered);
  if (projectGrid) gsap.fromTo(projectGrid.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .35, stagger: .06, clearProps: "all" });
}));

const canvasHost = document.querySelector<HTMLElement>("#hero-canvas");
let cleanupScene: (() => void) | undefined;
if (canvasHost && !window.matchMedia("(max-width: 700px)").matches) cleanupScene = mountHeroScene(canvasHost);

gsap.from(".hero-copy > *", { y: 32, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });
gsap.utils.toArray<HTMLElement>(".section-pad, .proof-strip, .project-card, .detail-row, .steps article").forEach((el: HTMLElement) => {
  gsap.from(el, { y: 36, opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
});

document.querySelector<HTMLFormElement>("#lead-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const body = [...data.entries()].map(([key, value]) => `${key}: ${value}`).join("\n");
  const subject = encodeURIComponent(`New VSM project enquiry — ${data.get("name")}`);
  window.location.href = `mailto:info@vsmgrowth.com?subject=${subject}&body=${encodeURIComponent(body)}`;
});

window.addEventListener("pagehide", () => cleanupScene?.());
