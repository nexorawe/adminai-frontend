import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/services/api";
import AppLayout from "@/components/AppLayout";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Mail, PenLine, CreditCard, Sparkles } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("free");

  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {
      setUser(null);
    }

    try {
      const billingRes = await api.get("/billing/me");
      setPlan(billingRes.data?.plan || "free");
    } catch {
      setPlan("free");
    }

    try {
      const usageRes = await api.get("/usage/me");
      setUsage(usageRes.data || null);
    } catch {
      setUsage(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate]);

  const openBillingPortal = async () => {
    setError("");
    try {
      const res = await api.post("/billing/create-portal-session");
      const url = res.data?.portal_url;
      if (!url) {
        setError("Portal URL not returned");
        return;
      }
      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to open billing portal");
    }
  };

  const usageRow = (label, used = 0, limit = 0) => {
    const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0;
    const remaining = Math.max(limit - used, 0);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="font-medium">{label}</div>
          <div className="text-muted-foreground">
            {used}/{limit} • {remaining} left
          </div>
        </div>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full ${
              pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back {user?.name ? `, ${user.name}` : ""} 👋
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Badge variant={plan === "pro" ? "default" : "secondary"}>
                {plan.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {user?.email || ""}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {plan === "pro" ? (
              <Button variant="outline" onClick={openBillingPortal}>
                <CreditCard className="mr-2" size={16} />
                Manage Billing
              </Button>
            ) : (
              <Button onClick={() => navigate("/pricing")}>
                <Sparkles className="mr-2" size={16} />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="border-red-200">
            <CardContent className="p-4 text-red-600 text-sm">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Usage */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold">Daily Usage</h2>
                <p className="text-sm text-muted-foreground">
                  Your daily quota resets every 24 hours (UTC).
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={loadData}>
                Refresh
              </Button>
            </div>

            <Separator className="my-5" />

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading usage...</p>
            ) : !usage ? (
              <p className="text-sm text-muted-foreground">
                Usage data is not available.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PenLine size={18} />
                        <div className="font-semibold">AI Writer</div>
                      </div>
                      <Badge variant="secondary">Today</Badge>
                    </div>

                    {usageRow(
                      "AI Generations",
                      usage.used?.ai_generate ?? 0,
                      usage.limits?.ai_generate ?? 0
                    )}

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate("/ai-writer")}
                    >
                      Open AI Writer
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail size={18} />
                        <div className="font-semibold">Gmail AI Replies</div>
                      </div>
                      <Badge variant="secondary">Today</Badge>
                    </div>

                    {usageRow(
                      "Replies Generated",
                      usage.used?.gmail_generate_reply ?? 0,
                      usage.limits?.gmail_generate_reply ?? 0
                    )}

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate("/gmail")}
                    >
                      Open Gmail Inbox
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border cursor-pointer hover:shadow-sm transition" onClick={() => navigate("/ai-writer")}>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <PenLine size={18} /> AI Writer
              </div>
              <p className="text-sm text-muted-foreground">
                Create business emails, proposals, announcements instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border cursor-pointer hover:shadow-sm transition" onClick={() => navigate("/gmail")}>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Mail size={18} /> Gmail Inbox
              </div>
              <p className="text-sm text-muted-foreground">
                Read your inbox and generate replies in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="border cursor-pointer hover:shadow-sm transition" onClick={() => navigate("/pricing")}>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CreditCard size={18} /> Pricing
              </div>
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro for higher limits and full productivity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
