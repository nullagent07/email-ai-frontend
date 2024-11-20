import { LoaderFunction } from "@remix-run/node";
import LoginPage from "../components/LoginPage";

export const loader: LoaderFunction = async () => {
  return null;
};

export default function LoginRoute() {
  return <LoginPage />;
}