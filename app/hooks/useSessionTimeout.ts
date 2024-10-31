import { useEffect } from "react";
import { useSubmit, useNavigation } from "@remix-run/react";

export function useSessionTimeout() {
  const submit = useSubmit();
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      submit(null, { method: "post", action: "/logout" });
    }, 30 * 60_000); // 30 минут

    return () => clearTimeout(timer);
  }, [submit, navigation]);
} 