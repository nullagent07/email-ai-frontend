interface Employee {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class EmployeeService {
  private employees: Employee[] = [];

  async listEmployees(): Promise<Employee[]> {
    // TODO: Implement actual employee listing
    return this.employees;
  }

  async createEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
    // TODO: Implement actual employee creation
    const newEmployee = {
      ...employee,
      id: Math.random().toString(36).substring(7),
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async updateEmployee(employee: Employee): Promise<Employee> {
    // TODO: Implement actual employee update
    const index = this.employees.findIndex(e => e.id === employee.id);
    if (index === -1) {
      throw new Error("Employee not found");
    }
    this.employees[index] = employee;
    return employee;
  }

  async deleteEmployee(id: string): Promise<void> {
    // TODO: Implement actual employee deletion
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error("Employee not found");
    }
    this.employees.splice(index, 1);
  }
}

let employeeService: EmployeeService | null = null;

export async function getEmployeeService(): Promise<EmployeeService> {
  if (!employeeService) {
    employeeService = new EmployeeService();
  }
  return employeeService;
}
