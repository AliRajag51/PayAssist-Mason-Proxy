/* MASON — static-content overlay helpers. The Sona reference uses this file to
   overlay design-time ratings / reviews onto the backend product list (the
   backend has no rating columns yet). Mason has no overlay yet, so both lookups
   return undefined — `catalog-source` falls back to its defaults. */

export function findByName(_name: string): { rating?: number; reviews?: number } | undefined {
  return undefined;
}

export function findItem(_id: string): undefined {
  return undefined;
}
