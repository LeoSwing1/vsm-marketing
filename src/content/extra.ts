/**
 * Content taken from VSM's current live site (screenshots, 21 Nov 2026) plus detailed service playbooks.
 * Claims here (badges, testimonials, follower/ad-spend totals) are VSM's own: keep them matched to real records.
 */

export const heroTags = [
  { big: '4.9★', small: 'Google rating · 47 reviews' },
  { big: '50+', small: 'brands grown' },
  { big: '₹2Cr+', small: 'ad spend managed' },
  { big: '2021', small: 'making noise since' },
];

export const pillars = [
  { name: 'Attention', line: 'Content and reels people actually stop scrolling for.' },
  { name: 'Performance', line: 'Ads where every rupee is tracked and every result reported.' },
  { name: 'Growth', line: 'Funnels that turn followers and clicks into revenue.' },
];

export const different = [
  { value: '5+', title: 'Years in the game', line: "Since 2021, we've helped 50+ businesses across Meerut, Noida and Delhi NCR build a digital presence that actually converts. Not theory: real revenue." },
  { value: '1', title: 'Team. Everything in-house.', line: 'Strategy, content, reels, filming, editing, ads, SEO, web, all done by our team under one roof. No outsourcing, no "we\'ll get back to you".' },
  { value: '₹2Cr+', title: 'Ad spend managed', line: 'Over ₹2 crore in Meta and Google Ads budgets managed at an average 3–5× ROAS. Every rupee tracked, every result reported to you.' },
  { value: '1.2M+', title: 'Followers built', line: 'Combined following built across client accounts. No bought followers: real, engaged audiences that drive enquiries and sales.' },
  { value: '48hr', title: 'Onboarding', line: 'From signed plan to content calendar, ad accounts and shoot schedule in two working days.' },
  { value: '₹0', title: 'Commission on ad spend', line: 'You pay Meta and Google directly from your own card. Our fee is flat, so we never profit from you spending more.' },
];

export const badges = [
  { icon: 'medal', title: 'Meta Business Partner', sub: 'Certified ad management' },
  { icon: 'chart', title: 'Google Ads Certified', sub: 'Search, Display & Video' },
  { icon: 'star', title: '4.9★ Google Rating', sub: '47 reviews on Google' },
  { icon: 'clap', title: 'In-House Production', sub: 'Full studio setup' },
  { icon: 'trophy', title: '50+ Brands Served', sub: 'Since 2021' },
  { icon: 'trend', title: '₹2Cr+ Ad Spend', sub: 'Managed profitably' },
];

export const team = [
  { initials: 'VM', name: 'Vishant Malik', role: 'Co-Founder & Lead Strategist', line: 'Built VSM from a laptop in Meerut to a full-service agency serving 50+ brands. Personally leads campaign strategy, client acquisition and business growth across every vertical.', founder: true },
  { initials: 'SM', name: 'Sushant Malik', role: 'Co-Founder & Creative Director', line: 'Drives the creative engine, from content strategy and video production to ad creatives and brand identity. Makes sure every piece of content that leaves VSM meets the highest quality bar.', founder: true },
  { icon: 'palette', name: 'Design Team', role: 'Graphic & Motion Design', line: 'Custom creatives for every brand, with no templates and no shortcuts. Social media graphics, ad creatives, brand identities and motion content.' },
  { icon: 'clap', name: 'Production Crew', role: 'Video & Photography', line: 'In-house filming setup with professional lighting, audio and editing. Reels, ad films, product shoots and brand documentaries, all done internally.' },
  { icon: 'chart', name: 'Ads & SEO Unit', role: 'Performance Marketing', line: 'Google and Meta certified team managing ₹2Cr+ in ad spend. Data-driven decisions, A/B testing and constant optimisation for maximum ROAS.' },
];

export const testimonials = [
  { quote: 'VSM Marketing ne mere business ko completely transform kar diya. Pehle monthly sales ₹2–3 lakh thi, ab ₹8–10 lakh tak aa gayi.', name: 'Rohit Sharma', role: 'Owner — Sharma Electronics, Delhi', initials: 'RS' },
  { quote: 'VSM turned our Instagram into a booking machine. Brides now find us online and book our bridal packages months in advance.', name: 'KQ Salon Team', role: 'Bridal & Beauty — Meerut', initials: 'KQ', href: '/work/kq-salon-academy/' },
  { quote: 'VSM ne gym membership 3× increase kar di sirf 90 dinon mein. Proper funnel aur local targeting se genuine members aaye.', name: 'Sandeep Chauhan', role: 'Owner — Fitness Hub Gym, Delhi NCR', initials: 'SC' },
  { quote: 'Boutique pehle sirf offline tha, VSM ne online orders start karwa diye. Ab all-India orders aa rahe hain.', name: 'Neha Kapoor', role: 'Owner — NK Boutique, Meerut', initials: 'NK' },
];

/** "Trusted by" wall, as on the live site, plus other VSM clients. */
/**
 * Office, team and shoot photos from the live vsmgrowth.com (public/media/office/).
 * Add more by dropping a file there and listing it here; a missing file is simply skipped.
 */
export const gallery = [
  { file: 'office/production-floor.webp', alt: 'Production floor at the VSM Meerut office' },
  { file: 'office/bridal-jewellery-shoot.webp', alt: 'Bridal jewellery shoot for KQ Salon' },
  { file: 'office/client-consultation.webp', alt: 'Client consultation at VSM Marketing' },
  { file: 'office/employee-of-the-month.webp', alt: 'Employee of the Month award at VSM Scholars' },
];

/** The VSM promise, shown one by one around a circle on the homepage. */
export const promise = [
  'Everything created by our in-house team',
  'Custom designs for every brand',
  'Weekly reports with ROAS, leads & real revenue impact',
  'Same-day response, usually within hours',
  'Full video production: shoot, edit, publish',
  'Unlimited revisions included',
  'Dedicated team per client',
  'Month-to-month, cancel anytime',
  '8+ industries with proven playbooks',
  'Every decision backed by platform data',
];

export const brands = [
  'KQ Salon', 'Sharma Electronics', 'Fitness Hub Gym', 'NK Boutique', 'Millennium Kids School', 'AV Builders',
  'Hotel Quivira', 'Pushpdeep Collection', 'Deesha Couture', 'Trackonn India', 'Janta Timbers', 'Dough & Pan',
  'Taruvan', 'RKGIT', 'ORAM Jewellers', 'Khanna Opticians', 'Sight Care Centre', 'Vertex Polymers', 'Attraqtive', 'Script Aura',
];

export interface Step { title: string; when: string; detail: string }
export interface Deep { intro: string; idealFor: string[]; steps: Step[]; monthly: string[]; kpis: string[]; tools: string[] }

/** Detailed playbook for each service page, keyed by service slug. */
export const deep: Record<string, Deep> = {
  'social-media': {
    intro: 'Social media is where your customers decide whether you look worth a visit. We run your pages like a publication: a plan every month, reels and films shot by our own production crew, and replies before the lead goes cold. Video production is part of the service, not an extra vendor.',
    idealFor: ['Shops and showrooms that want walk-ins', 'Salons, boutiques, cafes and restaurants', 'Brands launching a new page from zero', 'Owners who are tired of posting with no plan'],
    steps: [
      { title: 'Audit & benchmark', when: 'Day 1–2', detail: 'We go through your profile, last 30 posts, highlights, bio and DMs, and three local competitors. You get a one-page scorecard: what works, what is costing you followers, and quick wins.' },
      { title: 'Content pillars & calendar', when: 'Day 3–5', detail: 'We set 3–4 content pillars (offers, proof, behind-the-scenes, education) and turn them into a dated monthly calendar with hooks and captions, sent for your approval on WhatsApp.' },
      { title: 'Scripts & shot list', when: 'Day 5–6', detail: 'Hooks and scripts in Hindi, English or Hinglish, a shot list, props and talent plan, so the shoot day runs on time.' },
      { title: 'Shoot day (video production)', when: 'Week 1', detail: 'Our crew comes to your store or site with cameras, lights and mics. One shoot day covers a month of reels, product shots, stories and a brand film if planned, shot vertical, square and wide at once.' },
      { title: 'Edit, approve, publish', when: 'Week 1–4', detail: 'Editing, colour, captions, music, sound and motion graphics, approved by you on WhatsApp, then published when your audience is online. Paid-ad cuts come from the same footage.' },
      { title: 'Community & DMs', when: 'Daily', detail: 'Comments and DMs get replies the same day, with enquiries routed to your WhatsApp so a sales person can close them.' },
      { title: 'Report & next month', when: 'Month end', detail: 'Reach, engagement, profile visits, link clicks and DM enquiries, with the top and bottom reels explained. Next month\'s calendar is built from what worked.' },
    ],
    monthly: ['12–20 posts and 4–8 reels (by plan)', 'Shoot day with our production crew', 'Brand films and product shoots (on request)', 'Stories, captions, hashtags, covers', 'Comment and DM replies', 'Monthly report and strategy call'],
    kpis: ['Reach and accounts engaged', 'Hook rate and reel watch time', 'Shares and saves', 'Profile visits and link clicks', 'DM and WhatsApp enquiries', 'Follower growth from real people'],
    tools: ['Instagram, Facebook & YouTube', 'Cinema cameras, gimbals & lights', 'Wireless audio', 'Premiere Pro & DaVinci Resolve', 'After Effects & AI video tools', 'Meta Business Suite'],
  },
  'meta-google-ads': {
    intro: 'Paid ads should behave like a sales team you can switch on. We build campaigns around the one number you care about, whether that\'s leads, bookings, walk-ins or orders, and report it every week in plain language.',
    idealFor: ['Businesses that need leads this month', 'Clinics, institutes and real estate', 'E-commerce stores with a catalogue', 'Anyone burning budget on "boost post"'],
    steps: [
      { title: 'Account & tracking audit', when: 'Day 1–2', detail: 'We check your ad accounts, pixel, conversions API, Google tag and past campaigns. Broken tracking is fixed first, because optimising without it is guessing.' },
      { title: 'Offer & audience map', when: 'Day 2–4', detail: 'We agree the offer, the area (pin codes and radius), the audience and the lead value. For Google, we map keywords by intent and add negatives so you don\'t pay for the wrong searches.' },
      { title: 'Creatives & landing', when: 'Day 4–7', detail: '3–5 ad creatives per campaign (reels, statics, carousels) and either a lead form, a WhatsApp click-to-chat or a fast landing page built for one action.' },
      { title: 'Controlled launch', when: 'Week 2', detail: 'Campaigns launch with a test budget split across audiences and creatives. We watch cost per lead daily and cut losers within 72 hours.' },
      { title: 'Optimise & scale', when: 'Week 3 onward', detail: 'Winning ads get more budget, retargeting picks up visitors who didn\'t convert, and lead quality feedback from your team shapes targeting.' },
      { title: 'Weekly reporting', when: 'Every week', detail: 'Spend, leads, cost per lead, ROAS and what we changed, sent on WhatsApp. No dashboards you need a course to read.' },
    ],
    monthly: ['Meta and/or Google campaign management', 'New creatives every month', 'Lead forms and WhatsApp funnels', 'Retargeting and lookalike audiences', 'Conversion tracking upkeep', 'Weekly report, monthly strategy call'],
    kpis: ['Cost per lead / per booking', 'Return on ad spend (ROAS)', 'Lead-to-customer rate', 'Click-through rate', 'Frequency and creative fatigue'],
    tools: ['Meta Ads Manager', 'Google Ads', 'Meta Pixel & CAPI', 'Google Tag Manager', 'GA4'],
  },
  seo: {
    intro: 'When someone nearby searches for what you sell, you should be the first name they see, on Google Maps and in results. SEO is slower than ads but it keeps paying without a daily budget.',
    idealFor: ['Local businesses that depend on "near me"', 'Service companies with a website', 'Clinics, schools and showrooms', 'E-commerce sites with product pages'],
    steps: [
      { title: 'Technical audit', when: 'Week 1', detail: 'Crawl of the whole site: speed, mobile, indexing, broken links, duplicate pages, schema and Core Web Vitals. You get a prioritised fix list.' },
      { title: 'Keyword & intent map', when: 'Week 1–2', detail: 'We find what your customers type, in English and Hinglish, and map each keyword to one page so pages stop competing with each other.' },
      { title: 'Google Business Profile', when: 'Week 2', detail: 'Categories, services, photos, posts, Q&A and a review routine. For local businesses this is often the fastest win.' },
      { title: 'On-page fixes', when: 'Week 2–6', detail: 'Titles, headings, copy, internal links and schema on your key pages, plus new service and location pages where there are gaps.' },
      { title: 'Content & authority', when: 'Month 2 onward', detail: 'Helpful articles and local mentions that earn links and answer the questions buyers ask before they call.' },
      { title: 'Track & report', when: 'Monthly', detail: 'Rankings, Maps views, calls, direction requests, organic traffic and enquiries, from Search Console and GA4.' },
    ],
    monthly: ['Technical fixes and monitoring', 'On-page optimisation of key pages', 'Google Business Profile posts and photos', 'Review generation routine', 'Content and local link building (Premium)', 'Monthly ranking and enquiry report'],
    kpis: ['Map pack and keyword positions', 'Calls and direction requests from Maps', 'Organic traffic and enquiries', 'Pages indexed and Core Web Vitals', 'Review count and rating'],
    tools: ['Google Search Console', 'Google Business Profile', 'GA4', 'Semrush / Ahrefs', 'PageSpeed Insights'],
  },
  'web-development': {
    intro: 'Your website is the one place online you fully own. We build sites that load fast on a phone, explain what you sell in five seconds and turn visitors into WhatsApp chats, calls and orders.',
    idealFor: ['Businesses with no site or an old one', 'Online stores (WooCommerce or custom)', 'Campaign landing pages', 'Service brands that need enquiries'],
    steps: [
      { title: 'Discovery', when: 'Week 1', detail: 'Who visits, what they need to see and what action counts. We review competitors and agree a sitemap and the main conversion on each page.' },
      { title: 'Content & wireframes', when: 'Week 1–2', detail: 'We write the copy with you and lay out each page on a wireframe, so structure is agreed before design starts.' },
      { title: 'Design', when: 'Week 2–3', detail: 'Mobile-first designs in your brand, shared as clickable screens. Two rounds of changes included.' },
      { title: 'Build', when: 'Week 3–5', detail: 'Development on WordPress/WooCommerce or a custom stack, with Razorpay, WhatsApp, forms, pixel and GA4 connected.' },
      { title: 'Test & launch', when: 'Week 5', detail: 'Speed, SEO basics, forms and payments tested on real phones, then launched on your domain with redirects from the old site.' },
      { title: 'Care', when: 'After launch', detail: 'Updates, backups, small changes and a written handover, so you can edit products and pages yourself.' },
    ],
    monthly: ['Landing pages for campaigns', 'Business websites', 'E-commerce stores', 'Payment gateway (Razorpay)', 'Pixel, GA4 and Search Console setup', 'Hosting, updates and backups'],
    kpis: ['Mobile load time', 'Conversion rate', 'Enquiries and orders', 'Bounce rate on key pages', 'Search impressions'],
    tools: ['WordPress & WooCommerce', 'Astro / Next.js', 'Razorpay', 'Cloudflare', 'GA4 & Search Console'],
  },
  'software-development': {
    intro: 'Most local businesses run on WhatsApp groups, Excel sheets and memory. We turn that into software: one place where leads, bookings, staff, stock and money live, built around how you already work. We run our own agency this way.',
    idealFor: ['Businesses outgrowing Excel and WhatsApp', 'Hotels, clinics, institutes and showrooms', 'Teams that need attendance, payroll or a CRM', 'Founders with an app idea to launch'],
    steps: [
      { title: 'Workflow mapping', when: 'Week 1', detail: 'We sit with you and the people who will use it, and map every step: who enters what, who approves, what reports you need. Nothing is built until this is agreed.' },
      { title: 'Prototype', when: 'Week 1–2', detail: 'Clickable screens on your phone and laptop, with real labels and sample data, so you can feel the app before a line of code is written.' },
      { title: 'Architecture & quote', when: 'Week 2', detail: 'Stack, database, hosting, integrations and a fixed quote with milestones. Usually Next.js or Astro with a cloud database, built to scale.' },
      { title: 'Build in weekly releases', when: 'Week 3 onward', detail: 'Every week you get a working version to try. Feedback goes straight into the next release, so there are no surprises at the end.' },
      { title: 'Integrations & data', when: 'Alongside build', detail: 'Razorpay, WhatsApp, email, SMS, Google and your existing sheets connected. Old data is imported so the team starts with history.' },
      { title: 'Launch, train & support', when: 'Launch + 30 days', detail: 'Go-live on your domain, a training session for your team, a written guide and 30 days of fixes. Monthly care plans after that.' },
    ],
    monthly: ['Hosting, backups and security updates', 'Bug fixes and small changes', 'New features on request', 'Usage reports', 'Priority WhatsApp support', 'Quarterly product review'],
    kpis: ['Hours saved per week', 'Errors and missed follow-ups', 'Daily active users in the team', 'Load time and uptime', 'Revenue tracked through the system'],
    tools: ['Next.js & Astro', 'TypeScript', 'Supabase / Postgres', 'Vercel & Cloudflare', 'Razorpay & WhatsApp API'],
  },
  'pr-reputation': {
    intro: 'People Google you before they call you. PR and reputation work makes sure what they find is recent, credible and in your favour, from local news to your review replies.',
    idealFor: ['Founders building a personal brand', 'Businesses with a few bad reviews', 'Launches, events and milestones', 'Brands entering a new city'],
    steps: [
      { title: 'Reputation audit', when: 'Week 1', detail: 'What shows up when people search your name: reviews, articles, social mentions and gaps. We list what to fix and what to amplify.' },
      { title: 'Story angles', when: 'Week 1–2', detail: 'We find the stories worth telling: milestones, founder journey, community work, unusual numbers. Each becomes a pitch.' },
      { title: 'Press kit & releases', when: 'Week 2', detail: 'Press release, founder bio, photos and fact sheet, written for editors and ready to send.' },
      { title: 'Outreach', when: 'Week 2–6', detail: 'Pitches to relevant local and trade publications and digital media. Editors decide what runs; we make the story worth their space.' },
      { title: 'Review system', when: 'Ongoing', detail: 'A routine to ask happy customers for reviews, and drafted replies to every review, especially the negative ones, for your approval.' },
      { title: 'Monitor & report', when: 'Monthly', detail: 'Coverage won, mentions, review count and rating, and what to do next.' },
    ],
    monthly: ['Press releases and pitches', 'Founder profile and LinkedIn content', 'Review requests and replies', 'Media coverage tracking', 'Crisis response plan', 'Monthly reputation report'],
    kpis: ['Coverage pieces won', 'Branded search volume', 'Review count and average rating', 'Share of positive mentions', 'Referral traffic from coverage'],
    tools: ['Google Alerts', 'Google Business Profile', 'Press databases', 'LinkedIn', 'Review management'],
  },
};
