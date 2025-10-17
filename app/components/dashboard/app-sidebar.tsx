import { Home, BookOpen, BarChart3, HelpCircle, Settings, Star, Award } from "lucide-react";
import { Link } from "react-router";
import { BrandIcon } from "./brand-icon";
import { WorkspaceIcon } from "./workspace-icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Separator } from "~/components/ui/separator";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Quiz Library",
      url: "/quiz",
      icon: BookOpen,
    },
    {
      title: "My Results",
      url: "/results",
      icon: BarChart3,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: Award,
    },
  ],
  tajweedRules: [
    {
      title: "Idgham Rules",
      url: "/quiz/idgham",
      intent: "primary" as const,
    },
    {
      title: "Ikhfa Rules",
      url: "/quiz/ikhfa",
      intent: "secondary" as const,
    },
    {
      title: "Qalqalah Rules",
      url: "/quiz/qalqalah",
      intent: "accent" as const,
    },
    {
      title: "Ghunna Rules",
      url: "/quiz/ghunna",
      intent: "warning" as const,
    },
  ],
  navSecondary: [
    {
      title: "Help & Guide",
      url: "/dashboard/help",
      icon: HelpCircle,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({
  variant,
  user,
}: {
  variant: "sidebar" | "floating" | "inset";
  user: any;
}) {
  return (
    <Sidebar collapsible="offcanvas" variant={variant} style={{ backgroundColor: '#1a1a1a' }} className="border-r border-neutral-700/50">
      <SidebarHeader className="border-b border-neutral-700/50 p-4" style={{ backgroundColor: '#1a1a1a' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" prefetch="viewport" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <BrandIcon className="size-8 text-white" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Tajweed Master</span>
                <span className="text-xs text-neutral-400">Assessment Platform</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6" style={{ backgroundColor: '#1a1a1a' }}>
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Navigation</h3>
          <div className="space-y-1">
            {data.navMain.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition-colors"
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Tajweed Rules Section */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Tajweed Rules</h3>
          <div className="space-y-2">
            {data.tajweedRules.map((rule) => (
              <Link
                key={rule.title}
                to={rule.url}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition-colors group"
              >
                <WorkspaceIcon intent={rule.intent} />
                <span className="flex-1">{rule.title}</span>
                <Star className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-neutral-800/30 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold text-white">Progress Overview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Quizzes Completed</span>
              <span className="font-medium text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Average Score</span>
              <span className="font-medium text-green-400">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Current Streak</span>
              <span className="font-medium text-orange-400">5 days</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-auto space-y-1">
          <Separator className="my-4 bg-neutral-700/50" />
          {data.navSecondary.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-800/60 hover:text-white transition-colors"
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-700/50 p-4" style={{ backgroundColor: '#1a1a1a' }}>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}