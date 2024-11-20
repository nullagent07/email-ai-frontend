import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { listThreads, sendReply } from "~/services/gmail.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const threads = await listThreads(request);
  return json(threads);
}

export async function action({ request }: LoaderFunctionArgs) {
  if (request.method === "POST") {
    const formData = await request.formData();
    const threadId = formData.get("threadId") as string;
    const content = formData.get("content") as string;
    const assistantProfileId = formData.get("assistantProfileId") as string;

    if (request.url.endsWith("/reply")) {
      const response = await sendReply(threadId, content, assistantProfileId, request);
      return json(response);
    }

    // Note: createDraft functionality needs to be implemented in gmail.server.ts
    if (request.url.endsWith("/draft")) {
      throw new Error("Draft functionality not implemented");
    }
  }

  throw new Error(`Method ${request.method} not allowed`);
}
