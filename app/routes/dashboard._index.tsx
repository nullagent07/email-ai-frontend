import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { InteractionTable } from "~/components/InteractionTable";
import { usersApi } from "~/utils/api.server";

const mockUsers = [
  {
    id: "1",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "2",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  }
];

export const loader: LoaderFunction = async () => {
  return json({ users: mockUsers });
  // try {
  //   const response = await usersApi.getAll();
  //   return json({ users: response.data });
  // } catch (error: any) {
  //   if (error.response?.status === 404) {
  //     return json({ users: mockUsers });
  //   }
  //   throw error;
  // }
};

export default function DashboardIndex() {
  const { users } = useLoaderData<typeof loader>();
  return <InteractionTable data={users} />;
} 


