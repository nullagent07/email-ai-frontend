import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { PlusCircle } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  lastInteraction: string;
}

export function InteractionTable() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Developer",
      lastInteraction: "2024-03-20",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Designer",
      lastInteraction: "2024-03-19",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    email: '',
    role: '',
    lastInteraction: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployees([...employees, newEmployee]);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Employee Interactions</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="col-span-3 p-2 border rounded"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="col-span-3 p-2 border rounded"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right">
                    Role
                  </label>
                  <input
                    id="role"
                    name="role"
                    className="col-span-3 p-2 border rounded"
                    value={newEmployee.role}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="lastInteraction" className="text-right">
                    Last Interaction
                  </label>
                  <input
                    id="lastInteraction"
                    name="lastInteraction"
                    type="date"
                    className="col-span-3 p-2 border rounded"
                    value={newEmployee.lastInteraction}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Interaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.lastInteraction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
