import { createClient } from '@sanity/client';
import { site as local, type Site } from '../content/site';

/**
 * Build-time content. With SANITY_PROJECT_ID set, pulls from Sanity and fills any gaps from local content.
 * Without it, the site builds from src/content/site.ts, so the site never breaks on a CMS outage.
 */
let cache: Promise<Site> | null = null;

export function getSite(): Promise<Site> {
  return (cache ??= load());
}

async function load(): Promise<Site> {
  const projectId = import.meta.env.SANITY_PROJECT_ID as string | undefined;
  if (!projectId) return local;
  try {
    const client = createClient({
      projectId,
      dataset: (import.meta.env.SANITY_DATASET as string | undefined) || 'production',
      apiVersion: '2025-01-01',
      useCdn: false,
      token: import.meta.env.SANITY_READ_TOKEN as string | undefined,
    });
    const d = await client.fetch<Partial<Site>>(`{
      "settings": *[_type == "siteSettings"][0]{phone, phoneDisplay, whatsapp, email, hours, instagram, facebook, gstin, reviewsUrl, offices},
      "cases": *[_type == "caseStudy"] | order(order asc){ "slug": slug.current, client, sector, city, category, tone, result, stats, services, challenge, approach, outcome, "reels": reels[].asset->url },
      "clients": *[_type == "client"] | order(order asc){ name, "logo": logo.asset->url },
      "services": *[_type == "service"] | order(order asc){ "id": key, "slug": slug.current, n, name, short, desc, line, tags, includes, deliverables, process, "faqs": faqs[]{q, a} },
      "plans": *[_type == "plan"] | order(order asc){ name, price, blurb, featured, includes },
      "faqs": *[_type == "faq"] | order(order asc){ q, a },
      "products": *[_type == "product"] | order(order asc){ name, kind, line }
    }`);
    const s = (d as { settings?: Partial<Site> }).settings ?? {};
    const pick = <K extends keyof Site>(k: K): Site[K] => {
      const v = (d as Partial<Site>)[k] ?? (s as Partial<Site>)[k];
      return (Array.isArray(v) ? (v.length ? v : local[k]) : v ?? local[k]) as Site[K];
    };
    // Sanity docs are merged onto local ones by slug, so a half-filled CMS never breaks a page.
    const mergeBy = <T extends { slug: string }>(loc: T[], remote?: Partial<T>[]): T[] =>
      remote?.length ? remote.map((r) => ({ ...(loc.find((l) => l.slug === r.slug) ?? loc[0]), ...Object.fromEntries(Object.entries(r).filter(([, v]) => v != null && !(Array.isArray(v) && !v.length))) }) as T) : loc;
    type RemoteService = Omit<Partial<Site['services'][number]>, 'faqs'> & { faqs?: { q: string; a: string }[] };
    const rs = (d as { services?: RemoteService[] }).services;
    return {
      ...local,
      ...Object.fromEntries(Object.entries(s).filter(([, v]) => v != null)),
      cases: mergeBy(local.cases, (d as Partial<Site>).cases), clients: pick('clients'),
      services: mergeBy(local.services, rs?.map((x) => ({ ...x, faqs: x.faqs?.map((f) => [f.q, f.a] as [string, string]) })) as Partial<Site['services'][number]>[] | undefined),
      plans: pick('plans'), faqs: pick('faqs'), products: pick('products'),
    } as Site;
  } catch (e) {
    console.warn('[content] Sanity fetch failed, using local content:', (e as Error).message);
    return local;
  }
}

/** Media path helper: absolute URLs (Sanity CDN) pass through, file names map to /media/. */
export const media = (f?: string) => (!f ? '' : /^https?:\/\//.test(f) ? f : `/media/${f}`);
