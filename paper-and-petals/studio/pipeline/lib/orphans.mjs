// Which items no collection points at.
//
// Shared so `check-types` (which reports them) and `prune-orphans` (which
// deletes them) can never disagree — the count you are shown is the count that
// goes.

/** A draft and its published document are the same item for reference purposes. */
const published = (id) => String(id ?? '').replace(/^drafts\./, '')

/**
 * Items that no collection references.
 *
 * Collections store the PUBLISHED id of each member, so a draft item counts as
 * referenced whenever its published twin is — otherwise unpublished edits would
 * read as rubbish and be swept away.
 *
 * `free` is carried through rather than filtered here: a loose piece under
 * `_free/` is legitimately unreferenced (it is sold on its own, not as part of
 * a collection), so whether that counts as an orphan is the caller's call.
 */
export function findOrphans(items, collections) {
  const referenced = new Set()
  for (const c of collections ?? []) {
    for (const ref of c.itemRefs ?? []) if (ref) referenced.add(published(ref))
  }
  return (items ?? []).filter((it) => it && !referenced.has(published(it._id)))
}

/** GROQ for the two queries both callers need, kept together so they match. */
export const ITEMS_QUERY = `*[_type == "item"]{_id, name, free, category}`
export const COLLECTION_REFS_QUERY = `*[_type == "collection"]{_id, name, "itemRefs": items[]._ref}`
