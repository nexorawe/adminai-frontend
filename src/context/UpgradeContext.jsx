import { createContext, useContext, useState } from "react";
import UpgradeModal from "../components/UpgradeModal";

const UpgradeContext = createContext(null);

export const useUpgrade = () => useContext(UpgradeContext);

export function UpgradeProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showUpgrade = (msg) => {
    setMessage(msg || "Daily limit reached. Upgrade to Pro to continue.");
    setOpen(true);
  };

  const hideUpgrade = () => setOpen(false);

  return (
    <UpgradeContext.Provider value={{ showUpgrade, hideUpgrade }}>
      {children}

      <UpgradeModal open={open} message={message} onClose={hideUpgrade} />
    </UpgradeContext.Provider>
  );
}
