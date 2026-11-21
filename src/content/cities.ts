/** Local landing pages for "digital marketing agency in <city>" searches. Each has its own copy, not a template swap. */
export interface City { slug: string; city: string; area: string; office?: 'Meerut' | 'Noida'; intro: string; why: string[]; industries: string[]; nearby: string[]; faqs: [string, string][] }

export const cities: City[] = [
  {
    slug: 'digital-marketing-agency-meerut', city: 'Meerut', area: 'Meerut, Uttar Pradesh', office: 'Meerut',
    intro: 'VSM started in Meerut in 2021 and our headquarters is still here, at Aakansha Tower in Mangal Pandey Nagar. We know which bazaars, colleges and neighbourhoods your customers come from, and we shoot in your shop, not a stock studio.',
    why: ['Head office in Meerut: meet us in person any working day', 'Shoots across Meerut city, Cantt, Modipuram and Partapur', 'Local case studies: Pushpdeep Collection, Hotel Quivira, KQ Salon', 'Hinglish content that sounds like your customers'],
    industries: ['Textiles & home furnishing', 'Jewellers & sarrafa', 'Hotels, restaurants & banquets', 'Schools, coaching & colleges', 'Sports goods', 'Clinics & salons'],
    nearby: ['Modinagar', 'Muzaffarnagar', 'Hapur', 'Baghpat', 'Sardhana'],
    faqs: [['Do you have an office in Meerut?', 'Yes. Our headquarters is at Aakansha Tower, 3rd Floor, Mangal Pandey Nagar, Meerut 250001. Monday to Saturday, 10am–7pm.'], ['Can you shoot at our shop in Meerut?', 'Yes. Our crew shoots at your location anywhere in and around Meerut, usually within the same week.'], ['How much does digital marketing cost in Meerut?', 'Our monthly plans start at ₹12,000 + GST. Ad budget is separate and paid directly to Meta or Google.']],
  },
  {
    slug: 'digital-marketing-agency-noida', city: 'Noida', area: 'Noida & Greater Noida', office: 'Noida',
    intro: 'Our Noida branch in H Block, Sector 63 works with retail brands, clinics, startups and B2B companies across Noida and Greater Noida, with the same in-house crew and the same flat, transparent pricing.',
    why: ['Branch office in Sector 63, Noida', 'Shoots across Noida sectors, Greater Noida and Noida Extension', 'B2B, IT and manufacturing experience alongside retail', 'Ads targeted by sector and pin code'],
    industries: ['Startups & IT services', 'Manufacturing & B2B', 'Real estate & builders', 'Clinics & diagnostics', 'Restaurants & cafes', 'Coaching institutes'],
    nearby: ['Greater Noida', 'Noida Extension', 'Ghaziabad', 'Indirapuram', 'East Delhi'],
    faqs: [['Where is your Noida office?', 'H Block, Sector 63, Noida 201301.'], ['Do you work with B2B companies in Noida?', 'Yes. We run LinkedIn, Google Ads, SEO and websites for manufacturers and service companies, alongside social for retail brands.'], ['Can we meet before signing?', 'Yes. Book a free audit call and we can meet at our Noida office or yours.']],
  },
  {
    slug: 'digital-marketing-agency-ghaziabad', city: 'Ghaziabad', area: 'Ghaziabad, Indirapuram & Raj Nagar',
    intro: 'Ghaziabad brands like Deesha Couture and RKGIT work with VSM from our Noida branch, a short drive away. We cover Raj Nagar, Indirapuram, Vaishali, Crossings Republik and Raj Nagar Extension for shoots and meetings.',
    why: ['15–30 minutes from our Noida branch', 'Ghaziabad case study: Deesha Couture (3% → 22% engagement)', 'Education and fashion experience in the city', 'Local SEO for Ghaziabad "near me" searches'],
    industries: ['Fashion & boutiques', 'Colleges & institutes', 'Real estate', 'Restaurants', 'Clinics & hospitals', 'Retail showrooms'],
    nearby: ['Indirapuram', 'Vaishali', 'Raj Nagar Extension', 'Crossings Republik', 'Modinagar'],
    faqs: [['Do you have clients in Ghaziabad?', 'Yes, including Deesha Couture and RKGIT.'], ['Will you come to Ghaziabad for shoots?', 'Yes, our crew shoots across Ghaziabad from the Noida branch.'], ['Do you do local SEO for Ghaziabad?', 'Yes. Google Business Profile, local keywords and reviews for Ghaziabad searches.']],
  },
  {
    slug: 'digital-marketing-agency-delhi', city: 'Delhi', area: 'Delhi NCR',
    intro: 'For Delhi brands we bring a small-team agency with a full in-house production crew: reels, ads, SEO and websites, without big-agency layers or retainers you can\'t exit. Trackonn India in Karol Bagh is one of our Delhi clients.',
    why: ['Delhi NCR shoots from our Noida branch', 'Delhi client: Trackonn India, Karol Bagh', 'Flat monthly pricing, no lock-in', 'Founders on every account'],
    industries: ['Wholesale & retail markets', 'Fashion & apparel', 'Restaurants & cloud kitchens', 'Healthcare', 'Education', 'D2C brands'],
    nearby: ['East Delhi', 'Karol Bagh', 'Chandni Chowk', 'Lajpat Nagar', 'Gurugram'],
    faqs: [['Do you work with Delhi businesses?', 'Yes. Our Noida team covers Delhi NCR for meetings and shoots.'], ['Are you cheaper than Delhi agencies?', 'Our plans start at ₹12,000 + GST a month with no lock-in, which is usually well below big-agency retainers.'], ['Do you handle wholesale markets?', 'Yes. Trackonn India, a Karol Bagh clothing wholesaler, runs reels with us.']],
  },
];
