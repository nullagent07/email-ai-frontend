import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { InteractionTable } from "~/components/InteractionTable";
import { usersApi } from "~/utils/api.server";

export const loader: LoaderFunction = async () => {
  try {
    const response = await usersApi.getAll();
    return json(response.data);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return json({ error: "Ошибка при загрузке данных" });
  }
};

export default function DashboardIndex() {
  const data = useLoaderData();
  return <InteractionTable/>;
} 