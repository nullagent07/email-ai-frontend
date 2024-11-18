import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getEmployeeService } from "../services/employee.server";

export async function action({ request }: ActionFunctionArgs) {
  const employeeService = await getEmployeeService();
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const employee = {
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        role: formData.get("description") as string,
      };
      const newEmployee = await employeeService.createEmployee(employee);
      return json(newEmployee);
    }

    case "update": {
      const employee = {
        id: formData.get("id") as string,
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        role: formData.get("description") as string,
      };
      const updatedEmployee = await employeeService.updateEmployee(employee);
      return json(updatedEmployee);
    }

    case "delete": {
      const id = formData.get("id") as string;
      await employeeService.deleteEmployee(id);
      return json({ success: true });
    }

    default:
      throw new Error(`Invalid intent: ${intent}`);
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const employeeService = await getEmployeeService();
  const employees = await employeeService.listEmployees();
  return json(employees);
}