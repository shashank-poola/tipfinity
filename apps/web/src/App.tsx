import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import Index from "./pages/Index.js";
import Signup from "./pages/Signup.js";
import ConnectWallet from "./pages/ConnectWallet.js";
import Dashboard from "./pages/Dashboard.js";
import Tip from "./pages/Tip.js";
import NotFound from "./pages/NotFound.js";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient();

// Configure supported wallets
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new TorusWalletAdapter(),
];

// Configure network (using devnet for development)
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* @ts-ignore */}
    <ConnectionProvider endpoint={endpoint}>
      {/* @ts-ignore */}
      <WalletProvider wallets={wallets} autoConnect>
        {/* @ts-ignore */}
        <WalletModalProvider>
          {/* @ts-ignore */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                      {/* @ts-ignore */}
              <Routes>
          {/* @ts-ignore */}
                <Route path="/" element={<Index />} />
                          {/* @ts-ignore */}
                <Route path="/signup" element={<Signup />} />
                          {/* @ts-ignore */}
                <Route path="/connect-wallet" element={<ConnectWallet />} />
                          {/* @ts-ignore */}
                <Route path="/dashboard" element={<Dashboard />} />          {/* @ts-ignore */}

                <Route path="/tip" element={<Tip />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          {/* @ts-ignore */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </QueryClientProvider>
);

export default App;
