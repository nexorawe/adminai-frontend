import { useEffect, useState } from "react";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    // user from localStorage
    const u = localStorage.getItem("user");
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }

    // plan from API
    api
      .get("/billing/me")
      .then((res) => setPlan(res.data?.plan || "free"))
      .catch(() => setPlan("free"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-8 md:ml-64">
      <div className="flex items-center gap-2">
        <Badge variant={plan === "pro" ? "default" : "secondary"}>
          {plan.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground hidden sm:block">
          {user?.email || ""}
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
