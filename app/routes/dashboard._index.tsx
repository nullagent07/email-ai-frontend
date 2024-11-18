import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { InteractionTable } from "../components/InteractionTable";
import { usersApiServer } from "../utils/api.server";

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
  },
  {
    id: "3",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "4",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },
  {
    id: "5",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "6",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },
  {
    id: "7",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "8",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },
  {
    id: "9",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "10",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },
  {
    id: "11",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "12",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },
  {
    id: "13",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "14",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },
  {
    id: "15",
    email: "user1@example.com",
    name: "Иван Петров",
    description: "Менеджер проекта",
    status: "active"
  },
  {
    id: "16",
    email: "user2@example.com",
    name: "Анна Сидорова",
    description: "Разработчик",
    status: "stopped"
  },

];

export const loader: LoaderFunction = async () => {
  return json({ users: mockUsers });
  // try {
  //   const response = await usersApiServer.getAll();
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
