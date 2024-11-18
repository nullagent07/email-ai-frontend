import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { threadsApiServer } from "~/utils/api.server";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      try {
        const threadData = {
          recipient_email: formData.get("email") as string,
          recipient_name: formData.get("name") as string,
          assistant: formData.get("description") as string,
        };
        console.log(threadData);
        const response = await threadsApiServer.createThread(threadData, cookieHeader);
        console.log(response);
        if (!response?.data) {
          throw new Error('Не удалось получить данные от сервера');
        }

        return json({ 
          success: true, 
          thread: {
            id: response.data.id,
            email: threadData.recipient_email,
            name: threadData.recipient_name,
            description: threadData.assistant,
            status: response.data.status
          }
        });
      } catch (error) {
        return json({ 
          error: error instanceof Error ? error.message : 'Ошибка при создании потока' 
        }, { status: 400 });
      }
    
    case "delete":
      const id = formData.get("id");
      // Здесь должна быть логика удаления сотрудника из БД
      return json({ success: true });
    
    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export async function loader() {
  // Здесь должна быть логика загрузки сотрудников из БД
  return json({
    employees: [
      {
        id: 1,
        email: "user1@example.com",
        name: "Иван Петров",
        description: "Менеджер проекта",
        status: "active",
      },
      {
        id: 2,
        email: "user2@example.com",
        name: "Анна Сидорова", 
        description: "Разработчик",
        status: "stopped",
      },
    ],
  });
} 