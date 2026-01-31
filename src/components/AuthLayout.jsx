import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Apple-style ambient blur */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft gradient wash */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.14),transparent_55%)]" />

        {/* blurred blobs */}
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/25 blur-[90px]" />
        <div className="absolute -bottom-32 right-[-40px] h-[460px] w-[460px] rounded-full bg-indigo-500/20 blur-[120px]" />

        {/* very subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22200%22%20height=%22200%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.7%22%20numOctaves=%223%22/%3E%3C/filter%3E%3Crect%20width=%22200%22%20height=%22200%22%20filter=%22url(%23n)%22%20opacity=%220.25%22/%3E%3C/svg%3E')]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-[430px]">
          {/* Brand */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
              <span className="text-lg font-semibold tracking-tight">A</span>
            </div>

            <h2 className="text-lg font-semibold tracking-tight">
              AdminAI
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              AI executive assistant
            </p>
          </div>

          {/* Card */}
          <Card className="rounded-3xl border border-border/60 bg-background/70 shadow-xl backdrop-blur-xl">
            <CardContent className="px-8 py-9 sm:px-10 sm:py-10">
              <div className="mb-7">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {subtitle}
                </p>
              </div>

              {children}
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} AdminAI • Built for productivity
          </p>
        </div>
      </div>
    </div>
  );
}
