import { normalizeURL } from '@/lib/util/normalize-url';
import { pipe } from '@/lib/util/pipe';
import { requireNotNull } from '@/lib/util/require-not-null';

export const GARAGE_ADMIN_API_URL = pipe(
  import.meta.env.VITE_GARAGE_ADMIN_API_URL,
  (it) => requireNotNull(it, `Misisng "VITE_GARAGE_ADMIN_API_URL". Check your .env`),
  normalizeURL,
);
