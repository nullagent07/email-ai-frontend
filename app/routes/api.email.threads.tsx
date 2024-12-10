import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { listThreads } from "~/services/gmail.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const threads = await listThreads(request);
  return json(threads);
}

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method === "POST") {
    // Note: createDraft functionality needs to be implemented in gmail.server.ts
    if (request.url.endsWith("/draft")) {
      throw new Error("Draft functionality not implemented");
    }
  }

  throw new Error(`Method ${request.method} not allowed`);
}
