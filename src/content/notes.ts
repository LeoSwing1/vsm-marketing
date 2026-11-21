/** "Notes from the studio": short, practical journal posts. Each becomes /journal/<slug>/ and the newest three show on the homepage. */
export interface Note { slug: string; title: string; dek: string; tag: string; date: string; read: string; body: { h?: string; p?: string; list?: string[] }[] }

export const notes: Note[] = [
  {
    slug: 'reel-hooks-that-bring-walk-ins',
    title: 'Reel hooks that bring people to your shop, not just likes',
    dek: 'The first second decides whether a local customer watches, saves or scrolls past. Here is how we plan hooks for shops and showrooms.',
    tag: 'Reels', date: '2026-11-10', read: '4 min',
    body: [
      { p: 'Most local brands lose the viewer before the reel even starts. The product is good, the shoot is fine, but the first second shows a logo, a slow pan or a "Hello friends". For a shop, the job of a reel is simple: make someone nearby want to come in. That starts with the hook.' },
      { h: 'Open on the thing they came for', p: 'Show the product, the price or the result in the first frame. A bedsheet unfolding across a bed, a bridal look already finished, a plate landing on the table. Context can come later.' },
      { h: 'Say the local part out loud', p: 'Naming the area ("Abu Lane wale dhyan dein", "Sector 18 mein pehli baar") tells the viewer this is for them. It also helps Instagram show the reel to people nearby.' },
      { h: 'Hooks we reuse because they work', list: ['"Price batao?" answered on screen in the first second', 'Before and after, with the after first', 'A customer reacting, then the product', 'A myth your customers believe, busted in one line', 'Owner talking straight to camera with one strong claim'] },
      { h: 'End with one action', p: 'Not "follow, like, share and comment". Pick one: DM for price, tap the location, or WhatsApp us. One clear action gets more walk-ins than four vague ones.' },
    ],
  },
  {
    slug: 'google-maps-ranking-checklist',
    title: 'A Google Maps checklist for local businesses',
    dek: 'For "near me" searches, your Google Business Profile is often seen before your website. Twelve things we fix first.',
    tag: 'Local SEO', date: '2026-10-28', read: '5 min',
    body: [
      { p: 'When someone searches "salon near me" or "best sweets in Meerut", Google shows three businesses on the map before anything else. Getting into those three is mostly about doing the basics well, and keeping them up every week.' },
      { h: 'Set up properly once', list: ['Exact business name, same as your signboard', 'The most specific primary category, plus 3–5 secondary ones', 'Address, phone and hours that match your website and Instagram', 'Services or products listed with short descriptions', 'A pin that sits on your actual entrance'] },
      { h: 'Keep it alive every week', list: ['Add 3–5 real photos: team, shop, work, customers (with permission)', 'Post an update or offer', 'Answer every new review, good or bad, within two days', 'Add common questions and answers yourself'] },
      { h: 'Reviews: ask, don\'t buy', p: 'Fake reviews get removed and can get a listing suspended. Ask happy customers at the right moment: right after delivery or a good visit. A short link on WhatsApp or a QR code at the counter makes it a ten-second job.' },
      { h: 'Check what your competitors do', p: 'Search your category in your area and look at the top three. Count their photos, their reviews this month and how often they post. That gap is usually your plan for the next 90 days.' },
    ],
  },
  {
    slug: 'meta-ads-on-a-local-budget',
    title: 'Meta Ads on a local budget: where the first ₹10,000 should go',
    dek: 'Small budgets don\'t fail because they are small. They fail because they are spread too thin. A simple structure that works.',
    tag: 'Ads', date: '2026-10-14', read: '4 min',
    body: [
      { p: 'Boosting a post now and then feels like advertising, but it rarely builds a steady flow of enquiries. With a small monthly budget, structure matters more than spend.' },
      { h: 'One goal, one campaign', p: 'Decide what a result is: a WhatsApp message, a form, a call or a store visit. Run one campaign for that goal instead of five small ones. Meta learns faster when it has one thing to optimise for.' },
      { h: 'Tight area, broad audience', p: 'Draw the radius your customers actually travel, often 3–8 km for a shop. Inside that radius, let Meta find the people instead of stacking interests.' },
      { h: 'Three creatives, one offer', list: ['A reel showing the product or result', 'A simple image with the offer and price', 'A customer or owner talking to camera', 'Same offer across all three, so you learn which format works'] },
      { h: 'Reply fast', p: 'Most local ad leads go cold within an hour. Set up quick replies on WhatsApp, and make sure someone answers during business hours. Speed often matters more than the ad itself.' },
      { h: 'Measure what matters', p: 'Track cost per enquiry and how many enquiries became customers. Likes and reach are not the goal. If you can\'t tell which leads bought, start a simple sheet: date, name, source, bought or not.' },
    ],
  },
];

export const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
