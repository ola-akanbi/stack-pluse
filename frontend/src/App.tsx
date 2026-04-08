import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/lib/wallet-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import SendPulse from "./pages/SendPulse.tsx";
import ActivityPage from "./pages/ActivityPage.tsx";
import AddressPage from "./pages/AddressPage.tsx";
import PulseLookup from "./pages/PulseLookup.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <WalletProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/send" element={<SendPulse />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/address" element={<AddressPage />} />
                <Route path="/pulse" element={<PulseLookup />} />
                <Route path="/pulse/:id" element={<PulseLookup />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
