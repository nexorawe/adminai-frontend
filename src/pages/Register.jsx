import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "@/services/api";
import AuthLayout from "@/components/AuthLayout";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start using AdminAI in minutes">
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm">Name</Label>
          <Input
            className="h-11"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Email</Label>
          <Input
            className="h-11"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Password</Label>
          <Input
            className="h-11"
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="new-password"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
