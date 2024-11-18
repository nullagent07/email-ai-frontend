import { Link, Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useState } from "react";
import { LayoutDashboard, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { User } from "~/types/user";

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out relative h-screen",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-6 h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="p-4">
        <div className={cn(
          "flex items-center space-x-4 mb-6",
          isCollapsed && "justify-center"
        )}>
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            asChild
          >
            <Link to="/dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="h-5 w-5" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            asChild
          >
            <Link to="/settings" className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </Button>

          <Form action="/logout" method="post">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
              type="submit"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Logout</span>}
              </div>
            </Button>
          </Form>
        </nav>
      </div>
    </div>
  );
}
