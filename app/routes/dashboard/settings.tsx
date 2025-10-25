import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { User } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-neutral-400">Manage your account preferences and app settings</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Account Status</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Completion</span>
                      <span className="text-sm text-neutral-400">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
