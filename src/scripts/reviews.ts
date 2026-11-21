/**
 * Live Google reviews (Places API New): when keys are set, real reviews are added into both sliding rows
 * and the rating/count update. Without keys the server-rendered cards stay.
 */
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
interface Places {
  rating?: number; userRatingCount?: number;
  reviews?: { rating: number; relativePublishTimeDescription?: string; text?: { text: string }; authorAttribution?: { displayName?: string; photoUri?: string } }[];
}

export async function initReviews(): Promise<() => void> {
  const rows = [...document.querySelectorAll<HTMLElement>('[data-rx-row] .rx-track')];
  const placeId = import.meta.env.PUBLIC_GOOGLE_PLACE_ID as string | undefined, key = import.meta.env.PUBLIC_GOOGLE_PLACES_KEY as string | undefined;
  if (!rows.length || !placeId || !key) return () => {};
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, { headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,reviews' } });
    if (!r.ok) return () => {};
    const d = (await r.json()) as Places;
    if (d.rating) {
      document.getElementById('rv-rating')!.textContent = d.rating.toFixed(1);
      document.getElementById('rv-count')!.textContent = `Google rating from ${d.userRatingCount ?? 0} reviews`;
    }
    const items = (d.reviews ?? []).filter((x) => x.text?.text && x.rating >= 4);
    const card = (x: NonNullable<Places['reviews']>[number], hidden: boolean) => {
      const t = x.text!.text, name = x.authorAttribution?.displayName ?? 'Google user';
      const av = x.authorAttribution?.photoUri ? `<img class="t-av" src="${esc(x.authorAttribution.photoUri)}" alt="" referrerpolicy="no-referrer">` : `<span class="t-av">${esc(name.slice(0, 2).toUpperCase())}</span>`;
      return `<figure class="rx-card rx-google"${hidden ? ' aria-hidden="true"' : ''}><span class="rx-cardstars">${'★'.repeat(x.rating)}</span><blockquote>“${esc(t.length > 260 ? t.slice(0, 257) + '…' : t)}”</blockquote><figcaption>${av}<span><b>${esc(name)}</b><small>Google review · ${esc(x.relativePublishTimeDescription ?? '')}</small></span></figcaption></figure>`;
    };
    items.forEach((x, i) => {
      const track = rows[i % rows.length];
      const half = track.children.length / 2;
      track.children[half - 1].insertAdjacentHTML('afterend', card(x, false));
      track.insertAdjacentHTML('beforeend', card(x, true));
    });
  } catch { /* keep server cards */ }
  return () => {};
}
