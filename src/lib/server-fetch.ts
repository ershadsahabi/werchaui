// F:\Shahrivar1404\Werch_app\werchaui\src\lib\server-fetch.ts

import { cookies } from "next/headers";

export async function serverFetch(input: RequestInfo | URL, init?: RequestInit & { revalidate?: number }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const { revalidate, ...rest } = init || {};
  const res = await fetch(input, {
    // اگر دادهٔ قابل cache است:
    next: (typeof revalidate === "number" ? { revalidate } : undefined),
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(rest.headers || {}),
    },
    // SSR است؛ نیازی به credentials:'include' نیست، ولی اشکالی هم ندارد
    ...rest,
  });

  return res;
}
