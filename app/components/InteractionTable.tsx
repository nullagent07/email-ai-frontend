import { useState } from "react";
import { Link } from "@remix-run/react";

type Thread = {
  id: string;
  email: string;
  name: string;
  description: string;
  status: "active" | "stopped";
};

interface Props {
  data: Thread[];
}

export function InteractionTable({ data }: Props) {
  const [thread, setThreads] = useState<Thread[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newThread, setnewThread] = useState<Thread>({
    id: '',
    email: '',
    name: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleStatusToggle = async (threadId: string) => {
    setThreads(thread.map(thread => 
      thread.id === threadId 
        ? { ...thread, status: thread.status === "active" ? "stopped" : "active" }
        : thread
    ));
  };

  const handleDelete = async (threadId: string) => {
    setThreads(thread.filter(thread => thread.id !== threadId));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newThread.email) newErrors.email = "Email required";
    if (!newThread.name) newErrors.name = "Name required";
    if (!newThread.description) newErrors.description = "Assistant Description required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddThread = () => {
    if (!validateFields()) return;
    setThreads([...thread, { ...newThread, id: String(thread.length + 1) }]);
    setIsModalOpen(false);
    setnewThread({ id: '', email: '', name: '', description: '', status: 'active' });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setnewThread({ ...newThread, [name]: value });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex-grow overflow-y-auto">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assistant Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {thread.map((thread) => (
                    <tr key={thread.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{thread.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{thread.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{thread.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${thread.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {thread.status === "active" ? "Активен" : "Остановлен"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to="#" className="text-indigo-600 hover:text-indigo-900">История</Link>
                        <button
                          onClick={() => handleDelete(thread.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Добавить
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={handleCloseModal}>
          <div className="bg-white p-4 rounded relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-500" onClick={handleCloseModal}>×</button>
            <h2 className="text-lg font-bold mb-4">Добавить нового пользователя</h2>
            <div className="space-y-4">
              <div className="h-10">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={newThread.email}
                  onChange={handleChange}
                  className={`mb-1 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="h-10">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newThread.name}
                  onChange={handleChange}
                  className={`mb-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div className="h-10">
                <input
                  type="text"
                  name="description"
                  placeholder="Assistant Description"
                  value={newThread.description}
                  onChange={handleChange}
                  className={`mb-1 p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>
            </div>
            <button
              onClick={handleAddThread}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Добавить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
