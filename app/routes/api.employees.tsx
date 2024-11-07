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
          email: formData.get("email") as string,
          name: formData.get("name") as string,
          assistant_description: formData.get("description") as string,
        };
        
        const response = await threadsApiServer.createThread(threadData, cookieHeader);
        
        return json({ 
          success: true, 
          thread: {
            id: response.data.id,
            email: threadData.email,
            name: threadData.name,
            description: threadData.assistant_description,
            status: 'active'
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