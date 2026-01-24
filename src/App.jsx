import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIWriter from "./pages/AIWriter";
import GmailInbox from "./pages/GmailInbox";
import Pricing from "./pages/Pricing";
import BillingSuccess from "./pages/BillingSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ai-writer" element={<AIWriter />} />
      <Route path="/gmail" element={<GmailInbox />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/billing/success" element={<BillingSuccess />} />
    </Routes>
  );
}

export default App;
