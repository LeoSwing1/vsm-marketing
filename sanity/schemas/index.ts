// Plain schema objects (no imports) so they type-check without the studio installed.
const order = { name: 'order', title: 'Order', type: 'number' };
const lines = (name: string, title: string) => ({ name, title, type: 'array', of: [{ type: 'string' }] });

export const schemaTypes = [
  {
    name: 'siteSettings', title: 'Site settings', type: 'document',
    fields: [
      { name: 'phone', type: 'string' }, { name: 'phoneDisplay', type: 'string' }, { name: 'whatsapp', type: 'string', description: 'Digits only, with 91' },
      { name: 'email', type: 'string' }, { name: 'hours', type: 'string' }, { name: 'instagram', type: 'url' }, { name: 'facebook', type: 'url' },
      { name: 'gstin', type: 'string' }, { name: 'reviewsUrl', title: 'Google reviews link', type: 'url' },
      { name: 'offices', type: 'array', of: [{ type: 'object', fields: [{ name: 'city', type: 'string' }, lines('lines', 'Address lines'), { name: 'maps', type: 'url' }] }] },
    ],
  },
  {
    name: 'caseStudy', title: 'Case study', type: 'document',
    fields: [
      { name: 'client', type: 'string', validation: (r: { required(): unknown }) => r.required() },
      { name: 'slug', type: 'slug', options: { source: 'client' } },
      { name: 'sector', type: 'string' }, { name: 'city', type: 'string' }, { name: 'category', type: 'string', description: 'Filter label, e.g. Social media' },
      { name: 'tone', type: 'string', options: { list: ['peach', 'blue', 'pink', 'lime'] } }, { name: 'result', type: 'string', description: 'One-line headline result' },
      { name: 'outcome', type: 'text', rows: 2 },
      { name: 'stats', type: 'array', of: [{ type: 'object', fields: [{ name: 'value', type: 'string' }, { name: 'label', type: 'string' }] }], validation: (r: { max(n: number): unknown }) => r.max(3) },
      lines('services', 'Services'), { name: 'challenge', type: 'text', rows: 3 }, lines('approach', 'Approach (one point per line)'),
      { name: 'reels', type: 'array', of: [{ type: 'file', options: { accept: 'video/mp4' } }], description: '3 vertical reels, MP4 under 4 MB each' },
order,
    ],
  },
  { name: 'client', title: 'Client logo', type: 'document', fields: [{ name: 'name', type: 'string' }, { name: 'logo', type: 'image' }, order] },
  { name: 'service', type: 'document', fields: [
    { name: 'key', type: 'string', description: 'social / ads / seo / video / web / pr' }, { name: 'slug', type: 'slug', options: { source: 'name' } }, { name: 'n', title: 'Number', type: 'string' },
    { name: 'name', type: 'string' }, { name: 'short', type: 'string' }, { name: 'desc', title: 'Description', type: 'text', rows: 2 }, { name: 'line', type: 'text', rows: 2 },
    lines('tags', 'Tags'), lines('includes', 'Includes'), lines('deliverables', 'Deliverables'), lines('process', 'Process steps'),
    { name: 'faqs', type: 'array', of: [{ type: 'object', fields: [{ name: 'q', type: 'string' }, { name: 'a', type: 'text', rows: 2 }] }] }, order] },
  { name: 'plan', title: 'Pricing plan', type: 'document', fields: [{ name: 'name', type: 'string' }, { name: 'price', type: 'string' }, { name: 'blurb', type: 'string' }, { name: 'featured', type: 'boolean' }, lines('includes', 'Includes'), order] },
  { name: 'faq', title: 'FAQ', type: 'document', fields: [{ name: 'q', title: 'Question', type: 'string' }, { name: 'a', title: 'Answer', type: 'text', rows: 3 }, order] },
  { name: 'product', title: 'Built by VSM', type: 'document', fields: [{ name: 'name', type: 'string' }, { name: 'kind', type: 'string' }, { name: 'line', type: 'text', rows: 2 }, order] },
];
