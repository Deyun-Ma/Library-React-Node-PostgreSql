import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  BookOpen, 
  Users, 
  Repeat, 
  Settings,
  LayoutDashboard
} from "lucide-react";

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Books",
      href: "/admin/books",
      icon: BookOpen,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: Repeat,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className={cn("w-64 bg-white border-r border-neutral-200 flex-shrink-0 h-[calc(100vh-64px)]", className)}>
      <nav className="px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary-light bg-opacity-10 text-primary"
                        : "text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
