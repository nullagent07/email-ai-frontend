import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export async function loader() {
  return json({
    emailAddress: "user@example.com",
    notificationsEnabled: true,
    theme: "light",
  });
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  const [formData, setFormData] = useState({
    emailAddress: data.emailAddress,
    notificationsEnabled: data.notificationsEnabled,
    theme: data.theme,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement settings update
    console.log("Saving settings:", formData);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                value={formData.emailAddress} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, emailAddress: e.target.value }))}
                readOnly 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notifications">Notifications</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={formData.notificationsEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="notifications">Enable email notifications</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                value={formData.theme}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <Button type="submit" className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
