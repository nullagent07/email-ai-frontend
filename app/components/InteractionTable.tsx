import { useState } from "react";
import { Link, useFetcher } from "@remix-run/react";
import type { FetcherWithComponents } from "@remix-run/react";
// import { threadsApi } from "~/utils/api.client";

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
  const fetcher: FetcherWithComponents<any> = useFetcher();
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

  // const handleStatusToggle = async (threadId: string) => {
  //   try {
  //     const currentThread = thread.find(t => t.id === threadId);
  //     if (!currentThread) return;

  //     const newStatus = currentThread.status === 'active' ? 'stopped' : 'active';
  //     await threadsApi.updateThreadStatus(threadId, newStatus);
      
  //     setThreads(thread.map(t => 
  //       t.id === threadId 
  //         ? { ...t, status: newStatus }
  //         : t
  //     ));
  //   } catch (error) {
  //     console.error('Ошибка при обновлении статуса:', error);
  //   }
  // };

  // const handleDelete = async (threadId: string) => {
  //   try {
  //     await threadsApi.deleteThread(threadId);
  //     setThreads(thread.filter(t => t.id !== threadId));
  //   } catch (error) {
  //     console.error('Ошибка при удалении потока:', error);
  //   }
  // };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newThread.email) newErrors.email = "Email required";
    if (!newThread.name) newErrors.name = "Name required";
    if (!newThread.description) newErrors.description = "Assistant Description required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setnewThread(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  if (fetcher.data?.success && fetcher.state === "idle") {
    setThreads(prev => [...prev, fetcher.data.thread]);
    setIsModalOpen(false);
    setnewThread({ id: '', email: '', name: '', description: '', status: 'active' });
    setErrors({});
    fetcher.data = null;
  }

  if (fetcher.data?.error && fetcher.state === "idle") {
    setErrors({ submit: fetcher.data.error });
    fetcher.data = null;
  }

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="relative">
        <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-50 after:absolute after:inset-x-0 after:top-full after:h-2 after:bg-gradient-to-b after:from-gray-50/50 after:to-transparent">
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
                      // onClick={() => handleDelete(thread.id)}
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
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Добавить
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <fetcher.Form 
            method="post"
            action="/api/employees"
            onSubmit={(e) => {
              if (!validateFields()) {
                e.preventDefault();
                return;
              }
            }}
            className="bg-white p-4 rounded relative"
          >
            <input type="hidden" name="intent" value="create" />
            <h2 id="modal-title" className="text-lg font-bold mb-4">Добавить нового пользователя</h2>
            <div className="space-y-4">
              <div className="h-10">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newThread.email}
                  onChange={handleChange}
                  className={`mb-1 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <p id="email-error" className="text-red-500 text-xs">{errors.email}</p>}
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
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              {fetcher.state !== "idle" ? "Добавление..." : "Добавить"}
            </button>
          </fetcher.Form>
        </div>
      )}
    </div>
  );
}
