/**
 * All site content. Used when Sanity isn't configured, and as the shape Sanity must return.
 * Numbers marked in cases/stats are VSM's own published figures: keep them matched to client reports.
 */
export interface Stat { value: string; label: string }
export interface CaseStudy {
  slug: string; client: string; sector: string; city: string; category: string;
  tone: 'peach' | 'blue' | 'pink' | 'lime'; result: string;
  stats: Stat[]; services: string[];
  challenge: string; approach: string[]; outcome: string;
  reels: string[];
  /** Optional cover photo (file in public/media/), shown behind the case art. */
  cover?: string;
}
export interface Service {
  id: string; slug: string; n: string; name: string; short: string; desc: string; line: string; tags: string[];
  includes: string[]; deliverables: string[]; process: string[]; faqs: [string, string][];
}
export interface Plan { name: string; price: string; blurb: string; featured?: boolean; includes: string[] }
export interface Faq { q: string; a: string }
export interface Product { name: string; kind: string; line: string }
export interface Site {
  phone: string; phoneDisplay: string; whatsapp: string; email: string; hours: string;
  instagram: string; facebook: string; gstin: string; reviewsUrl: string; gmb: string; rating: string; reviewCount: string;
  offices: { city: string; label: string; lines: string[]; maps: string }[];
  stats: Stat[]; industries: string[]; steps: { name: string; line: string }[];
  cases: CaseStudy[]; clients: { name: string; logo?: string }[];
  services: Service[]; plans: Plan[]; faqs: Faq[]; products: Product[];
}

export const site: Site = {
  phone: '+918279574755', phoneDisplay: '+91 82795 74755', whatsapp: '918279574755',
  email: 'info@vsmgrowth.com', hours: 'Mon–Sat, 10am–7pm',
  instagram: 'https://www.instagram.com/vsmmarketing_/', facebook: 'https://www.facebook.com/vsmmarketing',
  gstin: '09AAVFV8024A1ZW', reviewsUrl: 'https://share.google/tWNXKK3oV4GFiah31', gmb: 'https://share.google/tWNXKK3oV4GFiah31', rating: '4.9', reviewCount: '47',
  offices: [
    { city: 'Meerut', label: 'Headquarters', lines: ['Aakansha Tower, 3rd Floor', 'Mangal Pandey Nagar, Meerut 250001'], maps: 'https://www.google.com/maps/search/?api=1&query=VSM+Marketing+Aakansha+Tower+Meerut' },
    { city: 'Noida', label: 'Branch', lines: ['H Block, Sector 63', 'Noida 201301'], maps: 'https://www.google.com/maps/search/?api=1&query=VSM+Marketing,+H+Block,+Sector+63,+Noida' },
  ],
  stats: [
    { value: '50+', label: 'brands grown' },
    { value: '₹2Cr+', label: 'ad spend managed' },
    { value: '4.9★', label: 'Google rating, 47 reviews' },
    { value: '5 yrs', label: 'building brands since 2021' },
  ],
  industries: ['Salon & Beauty', 'Real Estate', 'Education', 'Retail & E-commerce', 'Food & Hospitality', 'Healthcare', 'Fitness & Gym', 'Manufacturing & B2B'],
  steps: [
    { name: 'Understand', line: 'We get close to your business, customers, category and commercial goals. A free audit call starts it.' },
    { name: 'Find the edge', line: 'We find the opportunity and put a focused, written plan around it: content, budget, fee.' },
    { name: 'Make & launch', line: 'Our crew scripts, shoots, edits and builds. You approve, it goes live.' },
    { name: 'Learn & scale', line: 'Reach, leads and spend in every report. Budget moves to whatever is working.' },
  ],
  cases: [
    {
      slug: 'pushpdeep-collection', client: 'Pushpdeep Collection', sector: 'Home furnishing store', city: 'Meerut', category: 'Social media', tone: 'peach',
      result: '340% reach growth · 12× reel views',
      stats: [{ value: '340%', label: 'reach growth' }, { value: '12×', label: 'reel views' }, { value: '₹2.8L', label: 'monthly sales lift' }],
      services: ['Instagram reels', 'Meta Ads', 'Google Business Profile', 'Offline banners'],
      challenge: 'A Meerut bedsheet and home-furnishing store with loyal regulars and almost no presence online. The goal was simple: more people walking through the door.',
      approach: [
        'Launched the Instagram page from zero with 24 in-house reels built around everyday family moments, scripted in Hinglish.',
        'Turned in-store offers, like free stitching, into reels and offline banners so the feed and the shop said the same thing.',
        'Ran location-targeted Meta Ads at households near the store and cleaned up the Google Business Profile for "near me" searches.',
      ],
      outcome: '8K followers and a 40% rise in walk-in customers within 90 days.',
      reels: ['pushpdeep-1.mp4', 'pushpdeep-2.mp4', 'pushpdeep-3.mp4'],
    },
    {
      slug: 'hotel-quivira', client: 'Hotel Quivira', sector: 'Hotel and restaurant', city: 'Meerut', category: 'Hospitality', tone: 'blue',
      result: '5.2× ROAS · 85% more table bookings',
      stats: [{ value: '5.2×', label: 'return on ad spend' }, { value: '1.8M', label: 'views in 60 days' }, { value: '85%', label: 'rise in bookings' }],
      services: ['Interview-style reels', 'Chef-led content', 'Instagram & Google Ads'],
      challenge: 'The party hall was always booked, but the restaurant lived in its shadow. People knew Quivira for weddings, not for dinner.',
      approach: [
        'No direct ads in the feed. Street-style interview reels shot inside the restaurant, with the dining room full behind the speaker.',
        'Questions people already ask, like where to find the best paneer in Meerut, so the answer did the selling. Chef-led and customer-reaction reels alongside.',
        'Hyper-local Instagram and Google Ads behind the reels that took off, aimed at diners within driving distance.',
      ],
      outcome: '1.8M views in 60 days and 85% more restaurant bookings.',
      reels: ['quivira-1.mp4', 'quivira-2.mp4', 'quivira-3.mp4'],
    },
    {
      slug: 'kq-salon-academy', cover: 'office/bridal-jewellery-shoot.webp', client: 'KQ Salon & Academy', sector: 'Bridal salon and beauty academy', city: 'Meerut', category: 'Lead generation', tone: 'pink',
      result: '200+ leads a month · ₹18 cost per lead',
      stats: [{ value: '200+', label: 'leads a month' }, { value: '₹18', label: 'cost per lead' }, { value: '3×', label: 'course enrolments' }],
      services: ['Lead generation', 'Meta Ads', 'Dual funnel'],
      challenge: 'Two businesses under one name: a bridal salon that needed bookings, and an academy that needed students. One page had to feed both.',
      approach: [
        'Built two parallel funnels: salon appointments on one side, academy admissions on the other.',
        'Transformation reels for the salon; career-focused ads and student stories for the academy.',
        'Lead forms routed to WhatsApp so the team could reply while the enquiry was still warm.',
      ],
      outcome: '200+ enquiries a month at ₹18 each, and course enrolments up three times.',
      reels: ['kq-1.mp4', 'kq-2.mp4', 'kq-3.mp4'],
    },
    {
      slug: 'deesha-couture', client: 'Deesha Couture', sector: 'Ladies ethnic wear', city: 'Ghaziabad', category: 'Social media', tone: 'lime',
      result: '500K+ monthly reach · 4× DM enquiries',
      stats: [{ value: '500K+', label: 'monthly reach' }, { value: '22%', label: 'engagement (from 3%)' }, { value: '4×', label: 'DM enquiries' }],
      services: ['Content calendar', 'Instagram reels', 'Brand building'],
      challenge: 'A boutique with beautiful work and a quiet Instagram. The page needed to bring women into the Ghaziabad store, not just collect likes.',
      approach: [
        'A phased reel plan, each phase with its own hooks: product close-ups, behind-the-scenes and styling videos, written in Hinglish.',
        'A backup "emergency kit" of quick reels for weeks when shoots slipped, so posting never stopped.',
        'Every reel ends with a reason to visit or DM, so engagement turns into enquiries.',
      ],
      outcome: 'Engagement from 3% to 22%, 500K+ monthly reach and four times the DM enquiries.',
      reels: ['deesha-1.mp4', 'deesha-2.mp4', 'deesha-3.mp4'],
    },
  ],
  clients: [
    { name: 'Pushpdeep Collection' }, { name: 'Hotel Quivira' }, { name: 'Deesha Couture' }, { name: 'KQ Salon & Academy' },
    { name: 'Dough & Pan', logo: 'logos/dough-and-pan.svg' }, { name: 'Janta Timbers', logo: 'logos/janta-timbers.svg' },
    { name: 'Taruvan', logo: 'logos/taruvan.svg' }, { name: 'Trackonn India', logo: 'logos/trackonn.svg' },
    { name: 'RKGIT', logo: 'logos/rkgit.svg' }, { name: 'ORAM Jewellers', logo: 'logos/oram.svg' },
    { name: 'Khanna Opticians', logo: 'logos/khanna-opticians.svg' }, { name: 'Sight Care Centre', logo: 'logos/sight-care.svg' },
    { name: 'Millennium Kids School', logo: 'logos/millennium-kids.svg' }, { name: 'Vertex Polymers', logo: 'logos/vertex.svg' },
    { name: 'Attraqtive', logo: 'logos/attraqtive.svg' }, { name: 'Script Aura', logo: 'logos/script-aura.svg' },
  ],
  services: [
    {
      id: 'social', slug: 'social-media', n: '01', name: 'Social Media Marketing', short: 'Social & video',
      desc: 'Strategy, reels, video production and community management that build real audiences, not vanity metrics. Scripted, shot and edited by our in-house crew.',
      line: 'Reels people share, brand films and shoots done in-house, and DMs answered on time.',
      tags: ['Reels strategy', 'Video production', 'Brand films', 'Product shoots', 'Content calendar', 'Community management'],
      includes: ['Monthly content calendar', 'Script, shoot and edit in-house', 'Captions, posting, community'],
      deliverables: ['Platform and audience audit', 'Monthly content themes and calendar', 'Reels, brand films and product shoots', 'Posts, carousels and stories', 'Community engagement and moderation', 'Monthly reach, engagement and enquiry review'],
      process: ['Audit profiles, audience and competitors', 'Define content pillars and campaign themes', 'Create and approve content', 'Publish, engage and optimise'],
      faqs: [['Which platforms can VSM manage?', 'Instagram, Facebook, YouTube and LinkedIn, chosen by where your customers actually spend time.'], ['Is video production included?', 'Yes. Our in-house crew scripts, shoots and edits reels, product shoots and brand films. Reel count and shoot days depend on the plan; one-off films are quoted separately.'], ['Can you shoot at our location?', 'Yes. We shoot across Delhi NCR at your shop, office or site, with lights, mics and a full crew.'], ['How do you measure social media?', 'Reach, engagement, profile actions, enquiries and campaign outcomes. Follower count alone never.']],
    },
    {
      id: 'ads', slug: 'meta-google-ads', n: '02', name: 'Meta & Google Ads', short: 'Paid ads',
      desc: 'Data-driven paid advertising, lead generation and retargeting, with every rupee tracked and reported.',
      line: 'Every rupee tracked. Targeted at people near you who can actually buy.',
      tags: ['Meta Ads', 'Google Ads', 'Lead generation', 'Retargeting', 'WhatsApp funnels'],
      includes: ['Campaign and pixel setup', 'Lead forms and WhatsApp ads', 'Cost per lead in every report'],
      deliverables: ['Campaign and account audit', 'Audience, location and competitor research', 'Campaign structure and conversion tracking', 'Ad copy and creative direction', 'Lead forms, landing pages and retargeting', 'Budget pacing and performance reporting'],
      process: ['Understand margins, offers and lead quality', 'Map audiences, keywords and campaign structure', 'Launch controlled tests', 'Optimise spend against qualified enquiries'],
      faqs: [['Is ad budget included in the fee?', 'No. You pay Meta or Google directly. Our fee covers management only, with no commission on spend.'], ['Do you run ads for local businesses?', 'Yes. Campaigns are targeted by service area, pin code, audience and intent.'], ['Do you guarantee a number of leads?', 'No one can honestly. We set targets, track every lead and optimise on real data.']],
    },
    {
      id: 'seo', slug: 'seo', n: '03', name: 'SEO Services', short: 'SEO & Maps',
      desc: 'Technical SEO, keyword strategy, local search and content that improve how customers find your business.',
      line: 'Show up first for "near me". Turn your Maps listing into phone calls.',
      tags: ['Technical SEO', 'Local SEO', 'Keyword strategy', 'Google Business Profile'],
      includes: ['Google Business Profile', 'Local keywords and on-page SEO', 'Review strategy'],
      deliverables: ['Technical and indexability audit', 'Keyword and search-intent mapping', 'On-page titles, headings and content', 'Local SEO and Google Business Profile', 'Internal linking and content plan', 'Visibility and organic enquiry reporting'],
      process: ['Audit the website and search landscape', 'Prioritise technical and content fixes', 'Implement on-page and local improvements', 'Measure rankings, traffic and enquiries'],
      faqs: [['How long does SEO take?', 'Usually 3 to 6 months for visible movement, longer for competitive keywords. It compounds.'], ['Is Google Business Profile included?', 'Yes. Local SEO covers your profile, categories, photos, posts and review visibility.'], ['Can you guarantee page one?', 'No ethical SEO can. We focus on relevant traffic and enquiries you can count.']],
    },
    {
      id: 'web', slug: 'web-development', n: '04', name: 'Web Development', short: 'Websites',
      desc: 'Conversion-first websites, landing pages and online stores built to be fast, mobile-first and lead-generating.',
      line: 'Fast, mobile-first sites that bring enquiries. WooCommerce or custom, with Razorpay.',
      tags: ['Landing pages', 'E-commerce', 'Web design', 'Performance', 'Razorpay'],
      includes: ['Design, copy and build', 'Payments, pixel, analytics', 'Domain and hosting in your name'],
      deliverables: ['Discovery of audiences and conversion goals', 'Site structure and page planning', 'Responsive design and development', 'Landing pages and enquiry journeys', 'Technical SEO and analytics setup', 'Speed, accessibility and device QA'],
      process: ['Define audiences, content and goals', 'Plan structure and user journey', 'Design and develop', 'Test, launch and improve'],
      faqs: [['Will it work on mobile?', 'Mobile first. Every page is tested on common phones before launch.'], ['Can you build landing pages for campaigns?', 'Yes, built around one offer, one audience and one action.'], ['Who owns the website?', 'You do: domain, hosting and code are in your name.']],
    },
    {
      id: 'dev', slug: 'software-development', n: '05', name: 'Software & App Development', short: 'Development',
      desc: 'Custom web apps, CRMs, dashboards, booking systems and mobile apps that run your business, built by the team that runs its own studio on software it wrote.',
      line: 'Web apps, CRMs, dashboards and mobile apps, built around how your business actually works.',
      tags: ['Web apps', 'CRM & dashboards', 'Booking systems', 'Mobile apps (PWA)', 'Automation', 'Integrations'],
      includes: ['Product design and build', 'Logins, roles and dashboards', 'Hosting, updates and support'],
      deliverables: ['Requirements and workflow mapping', 'Clickable prototype before code', 'Web app or mobile app (PWA)', 'Logins, roles, dashboards and reports', 'Payments, WhatsApp, email and API integrations', 'Hosting, backups, updates and handover'],
      process: ['Map how the business works today', 'Prototype the screens and flows', 'Build in weekly releases', 'Launch, train the team and support'],
      faqs: [['What kind of software do you build?', 'Internal tools (CRM, attendance, payroll, inventory), customer apps (booking, ordering, portals) and dashboards that pull your numbers into one place.'], ['Web app or mobile app?', 'Most businesses start with a web app that installs on phones like an app (PWA). Native Android/iOS apps are possible when you need them.'], ['Who owns the code?', 'You do. Code, database and hosting accounts are in your name, with a written handover.']],
    },
    {
      id: 'pr', slug: 'pr-reputation', n: '06', name: 'PR & Brand Reputation', short: 'PR',
      desc: 'Media placements, press releases and reputation management that make your brand the authority in its market.',
      line: 'Local press, a clean Google presence, and the right reply when a bad review lands.',
      tags: ['Media coverage', 'Press releases', 'Review management', 'Authority building'],
      includes: ['Press releases', 'Review management', 'Founder profile building'],
      deliverables: ['Brand and reputation assessment', 'Messaging and story angles', 'Press releases and editorial content', 'Publication and outreach planning', 'Review response guidance', 'Coverage and mention monitoring'],
      process: ['Understand the story and reputation goals', 'Develop stories and assets', 'Find the right outreach', 'Track coverage and response'],
      faqs: [['Can PR guarantee coverage?', 'No. Editors decide. Good PR makes your story worth their space.'], ['Do you handle review replies?', 'We set up a response approach and draft replies for your approval.'], ['Does PR help SEO?', 'Relevant coverage supports discovery and authority. We never promise links or rankings.']],
    },
  ],
  plans: [
    { name: 'Starter', price: '₹12,000', blurb: 'One platform, for new brands.', includes: ['Social media on 1 platform', '12 posts a month', 'Graphic design', 'Monthly performance report', 'WhatsApp support'] },
    { name: 'Growth', price: '₹28,000', blurb: 'Content plus ads.', featured: true, includes: ['Social media on 3 platforms', '20 posts and 4 reels a month', 'Meta Ads management', 'On-page SEO and Google Business Profile', 'Report every two weeks', 'Monthly strategy call'] },
    { name: 'Premium', price: '₹55,000', blurb: 'Your full marketing team.', includes: ['All platforms, including YouTube', 'Unlimited posts and 8 reels a month', 'Meta and Google Ads management', 'Full SEO with backlinks', 'One shoot day a month', 'PR and media outreach', 'Dedicated manager, weekly report'] },
  ],
  faqs: [
    { q: 'How soon will we see results?', a: 'Reels and ads usually show movement in reach and enquiries within the first 30 days. SEO takes 3 to 6 months, longer for competitive keywords.' },
    { q: 'How long does a reel take?', a: '3 to 5 working days after the shoot. For festive or urgent work, tell us early and we can turn it around in 48 hours.' },
    { q: 'Is the ad budget included in your fee?', a: 'No. You pay Meta or Google directly from your own card. Our fee covers management only, and we take no commission on ad spend.' },
    { q: 'How do we cancel?', a: "There is no lock-in. Give us 15 days' notice on WhatsApp and the plan stops from the next month." },
    { q: 'Who owns the accounts and the website?', a: 'You do. Domain, hosting, Instagram, ad accounts and website code are all in your name. We only hold access.' },
    { q: 'Do you work outside Meerut and Noida?', a: 'Yes. We shoot across Delhi NCR, and run social, ads, SEO and websites for clients anywhere in India.' },
  ],
  products: [
    { name: 'The Aurelia', kind: 'Hotel operations', line: 'A web app that runs rooms, bookings and staff for a working hotel.' },
    { name: 'VSM Growth Ops', kind: 'Business OS', line: 'Our own system for attendance, payroll, CRM and team chat. The whole studio runs on it.' },
    { name: 'VSM Khata', kind: 'Finance', line: 'Payments, expenses and receivables across two businesses, in one place.' },
  ],
};
