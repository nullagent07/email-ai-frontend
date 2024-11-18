import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getGmailService } from "../services/gmail.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const gmailService = await getGmailService();
  const threads = await gmailService.listThreads();
  return json(threads);
}

export async function action({ request }: LoaderFunctionArgs) {
  const gmailService = await getGmailService();
  
  if (request.method === "POST") {
    const formData = await request.formData();
    const threadId = formData.get("threadId") as string;
    const content = formData.get("content") as string;
    const assistantProfileId = formData.get("assistantProfileId") as string;

    if (request.url.endsWith("/reply")) {
      const response = await gmailService.sendReply(threadId, content, assistantProfileId);
      return json(response);
    }

    if (request.url.endsWith("/draft")) {
      const draft = await gmailService.createDraft(threadId, content, assistantProfileId);
      return json(draft);
    }
  }

  throw new Error(`Method ${request.method} not allowed`);
}
