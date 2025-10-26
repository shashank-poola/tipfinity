import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toast } from "sonner";
import { useLinkWallet } from "@/hooks/use-api";
import { useUser } from "@/contexts/UserContext";
import logo from "@/assets/tipfinity-logo-white.png";

const ConnectWallet = () => {
  const { connected, connecting, publicKey, signMessage } = useWallet();
  const navigate = useNavigate();
  const { currentCreator, setCurrentCreator } = useUser();
  const linkWalletMutation = useLinkWallet();
  const [isLinking, setIsLinking] = useState(false);

  // Navigate to signup when wallet is connected and creator exists
  useEffect(() => {
    if (connected && publicKey && currentCreator) {
      navigate("/signup?step=3");
    }
  }, [connected, publicKey, currentCreator, navigate]);

  const handleWalletLink = async () => {
    if (!publicKey || !currentCreator || !signMessage) {
      toast.error("Wallet not connected or creator not found");
      return;
    }

    try {
      setIsLinking(true);
      
      // Create a message to sign
      const message = `Link wallet to Tipfinity account: ${currentCreator.username}`;
      
      // Sign the message
      const signature = await signMessage(new TextEncoder().encode(message));
      
      // Link the wallet
      const result = await linkWalletMutation.mutateAsync({
        public_key: publicKey.toString(),
        message,
        signature: Buffer.from(signature).toString('base64'),
        creator_id: currentCreator.id,
      });

      if (result.success && result.data?.verified) {
        // Update the creator with wallet address
        const updatedCreator = {
          ...currentCreator,
          wallet_address: publicKey.toString(),
        };
        setCurrentCreator(updatedCreator);
        toast.success("Wallet linked successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Failed to link wallet");
      }
    } catch (error) {
      console.error("Failed to link wallet:", error);
      toast.error("Failed to link wallet. Please try again.");
    } finally {
      setIsLinking(false);
    }
  };

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

          {connected && publicKey && currentCreator && (
            <div className="w-full">
              <button
                onClick={handleWalletLink}
                disabled={isLinking || linkWalletMutation.isPending}
                className="w-full bg-green-600 text-white hover:bg-green-700 px-4 py-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                {isLinking || linkWalletMutation.isPending ? "Linking..." : "Link Wallet to Account"}
              </button>
            </div>
          )}

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
