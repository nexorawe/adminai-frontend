import { NavLink } from "react-router-dom";
import { LayoutDashboard, Mail, PenLine, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai-writer", label: "AI Writer", icon: PenLine },
  { to: "/gmail", label: "Gmail Inbox", icon: Mail },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r">
      <div className="h-16 flex items-center px-6 font-bold text-lg">
        AdminAI
        <span className="ml-2 text-xs opacity-60 font-normal">v1</span>
      </div>

      <Separator />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} AdminAI
      </div>
    </aside>
  );
}
