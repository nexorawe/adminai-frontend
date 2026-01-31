import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";

import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", null, {
        params: { email, password },
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="to get started">
      <form onSubmit={submit} className="mt-6">
        {/* Email */}
        <div className="mb-5">
          <Label className="block mb-2 text-sm font-medium text-foreground/80">
            Email
          </Label>
          <Input
            className="h-12 rounded-xl px-4 text-[15px]
              bg-background border-border/70
              focus-visible:ring-2 focus-visible:ring-blue-500/50
              focus-visible:ring-offset-0"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <Label className="block mb-2 text-sm font-medium text-foreground/80">
            Password
          </Label>
          <Input
            className="h-12 rounded-xl px-4 text-[15px]
              bg-background border-border/70
              focus-visible:ring-2 focus-visible:ring-blue-500/50
              focus-visible:ring-offset-0"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl text-[15px] font-semibold"
        >
          {loading ? "Logging in..." : "Continue"}
        </Button>

        {/* Register */}
        <div className="mt-5 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
