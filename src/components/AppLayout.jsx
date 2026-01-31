import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />

      <main className="md:ml-64 px-4 md:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
