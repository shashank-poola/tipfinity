import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import logo from "@/assets/tipfinity-logo-white.png";

const ConnectWallet = () => {
  const { connected, connecting, publicKey } = useWallet();
  const navigate = useNavigate();

  // Navigate to signup when wallet is connected
  if (connected && publicKey) {
    navigate("/signup?step=3");
  }

  const handleSkip = () => {
    navigate("/signup?step=3");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        <div className="flex justify-center mb-6 md:mb-8">
          <img src={logo} alt="Tipfinity" className="h-10 md:h-12" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-xl md:text-2xl font-bold">connect your wallet</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Connect your Web3 wallet to receive tips
          </p>
        </div>

        <div className="space-y-4">
          <div className="w-full">
            <WalletMultiButton className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50" />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Connect later? <span className="underline">Skip for now</span>
            </button>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Supported wallets: Phantom, Solflare, Torus, and more Solana wallets
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
