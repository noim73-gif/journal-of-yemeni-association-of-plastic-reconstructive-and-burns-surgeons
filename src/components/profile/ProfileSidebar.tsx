import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  ClipboardCheck,
  Settings,
  Activity,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";

interface ProfileSidebarProps {
  userRoles: string[];
}

export function ProfileSidebar({ userRoles }: ProfileSidebarProps) {
  const isDoctor = userRoles.includes("doctor");
  const isReviewer = userRoles.includes("reviewer");
  const isEditor = userRoles.includes("editor");

  const menuItems = [
    {
      title: "Overview",
      href: "/profile",
      icon: LayoutDashboard,
      show: true,
    },
    {
      title: "Personal Information",
      href: "/profile/personal",
      icon: User,
      show: true,
    },
    {
      title: "Professional Profile",
      href: "/profile/professional",
      icon: Briefcase,
      show: isDoctor || userRoles.length === 0, // Show for doctors or allow anyone to fill
    },
    {
      title: "My Submissions",
      href: "/profile/submissions",
      icon: FileText,
      show: true,
    },
    {
      title: "My Reviews",
      href: "/profile/reviews",
      icon: ClipboardCheck,
      show: isReviewer || isEditor,
    },
    {
      title: "Activity Log",
      href: "/profile/activity",
      icon: Activity,
      show: true,
    },
    {
      title: "Settings",
      href: "/profile/settings",
      icon: Settings,
      show: true,
    },
  ];

  return (
    <nav className="space-y-1">
      {menuItems
        .filter((item) => item.show)
        .map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/profile"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
    </nav>
  );
}
