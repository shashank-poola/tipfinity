import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Heart, Zap, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { useCreateTip } from "@/hooks/use-api";
import { useUser } from "@/contexts/UserContext";

const Tip = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const presetAmounts = [5, 10, 25, 50];
  
  const { connected, publicKey } = useWallet();
  const { currentCreator } = useUser();
  const createTipMutation = useCreateTip();

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    setSelectedPreset(preset);
  };

  const handleCustomAmount = (value: string) => {
    setAmount(value);
    setSelectedPreset(null);
  };

  const handleTipSubmit = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!currentCreator) {
      toast.error("Creator not found");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid tip amount");
      return;
    }

    try {
      // Generate a mock transaction signature for now
      // In a real implementation, this would be the actual Solana transaction signature
      const mockTransactionSignature = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await createTipMutation.mutateAsync({
        creator_id: currentCreator.id,
        tipper_wallet: publicKey.toString(),
        tip_amount: parseFloat(amount),
        message: message || undefined,
        transaction_signature: mockTransactionSignature,
      });

      if (result.success) {
        toast.success("Tip sent successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Failed to send tip");
      }
    } catch (error) {
      console.error("Failed to send tip:", error);
      toast.error("Failed to send tip. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-background/95 backdrop-blur-lg border border-border rounded-3xl p-6 md:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Tip {currentCreator?.display_name || 'Creator'}</h2>
              <p className="text-sm text-muted-foreground">Support with crypto</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">Tip Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-muted-foreground">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-muted border-2 border-border focus:border-primary outline-none rounded-2xl pl-12 pr-4 py-6 text-4xl font-bold transition-colors"
            />
          </div>
          {amount && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              ≈ {(parseFloat(amount) / 150).toFixed(4)} SOL
            </p>
          )}
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`py-4 rounded-xl font-semibold transition-all ${
                selectedPreset === preset
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm font-medium mb-3">
            <Star className="w-4 h-4" />
            Add a message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something nice..."
            rows={3}
            className="w-full bg-muted border-2 border-border focus:border-primary outline-none rounded-2xl px-4 py-3 resize-none transition-colors"
          />
        </div>

        {/* Connect Wallet Button */}
        <Button 
          disabled={!amount || parseFloat(amount) <= 0 || createTipMutation.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-full text-lg font-bold mb-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          onClick={handleTipSubmit}
        >
          <Wallet className="w-5 h-5" />
          {createTipMutation.isPending ? "Sending Tip..." : connected ? "Send Tip" : "Connect Wallet & Tip"}
        </Button>

        {/* Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          <span>Instant transfer via Solana blockchain</span>
        </div>

        {/* Powered by */}
        <div className="text-center text-muted-foreground text-xs mt-6 pt-6 border-t border-border">
          Powered by MoonPay Rails
        </div>
      </div>
    </div>
  );
};

export default Tip;
