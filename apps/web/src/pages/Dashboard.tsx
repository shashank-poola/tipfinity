import { LayoutDashboard, Wallet, BarChart3, User, HelpCircle, LogOut, Youtube, MessageCircle, Twitch, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTipsForCreator, useRecentTips } from "@/hooks/use-api";
import { useUser } from "@/contexts/UserContext";
import logo from "@/assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentCreator } = useUser();
  
  // Fetch tips data
  const { data: creatorTips, isLoading: loadingCreatorTips } = useTipsForCreator(currentCreator?.id || 0);
  const { data: recentTipsData, isLoading: loadingRecentTips } = useRecentTips();

  // Calculate total tips
  const totalTips = creatorTips?.data?.reduce((sum, tip) => sum + tip.tip_amount, 0) || 0;
  
  // Use real tips data or fallback to empty array
  const recentTips = creatorTips?.data?.slice(0, 5) || [];

  const socialLinks = [
    { icon: Youtube, color: "bg-red-500" },
    { icon: MessageCircle, color: "bg-blue-500" },
    { icon: Twitch, color: "bg-purple-500" },
    { icon: Share2, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 p-6 hidden lg:flex flex-col">
        <div className="mb-8">
          <img src={logo} alt="Tipfinity" className="h-8" />
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-muted text-foreground font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <Wallet className="w-5 h-5" />
            Wallet
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <BarChart3 className="w-5 h-5" />
            Tips Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <User className="w-5 h-5" />
            Profile
          </button>
        </nav>

        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <HelpCircle className="w-5 h-5" />
            Help Center
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#FF6B35] flex-shrink-0 overflow-hidden">
                {currentCreator?.profile_image ? (
                  <img 
                    src={currentCreator.profile_image} 
                    alt={currentCreator.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
                    {currentCreator?.display_name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {currentCreator?.display_name || 'User'}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {currentCreator?.bio || 'excited to be tipped by fans.'}
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <button key={index} className={`${social.color} p-2 rounded-lg`}>
                      <social.icon className="w-5 h-5 text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/tip")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-full font-semibold text-lg"
            >
              Tip creator
            </Button>
          </div>

          {/* Total Tips */}
          <div className="mb-8">
            <p className="text-4xl font-bold">${totalTips.toFixed(2)}</p>
          </div>

          {/* Recent Tips Section */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Recent tips</h2>
            <div className="flex-1 max-w-2xl">
              <div className="h-px bg-border" />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr,auto] gap-8">
            {/* Tips List */}
            <div className="space-y-4">
              {loadingCreatorTips ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading tips...</p>
                </div>
              ) : recentTips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tips yet. Share your profile to start receiving tips!</p>
                </div>
              ) : (
                recentTips.map((tip) => (
                  <div key={tip.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0" />
                      <div>
                        <p className="font-mono font-medium text-sm">
                          {tip.tipper_wallet.slice(0, 6)}...{tip.tipper_wallet.slice(-4)}
                        </p>
                        {tip.message && (
                          <p className="text-muted-foreground text-xs mt-1">{tip.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-bold text-lg">${tip.tip_amount.toFixed(2)}</p>
                      <p className="text-muted-foreground min-w-[100px] text-sm">
                        {new Date(tip.created_at).toLocaleDateString()}
                      </p>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-lg border border-border">
              <div className="w-48 h-48 bg-foreground rounded-lg flex items-center justify-center">
                <div className="w-44 h-44 bg-background p-2">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect x='10' y='10' width='15' height='15' fill='%23fff'/%3E%3Crect x='75' y='10' width='15' height='15' fill='%23fff'/%3E%3Crect x='10' y='75' width='15' height='15' fill='%23fff'/%3E%3C/svg%3E")`,
                    backgroundSize: 'cover'
                  }} />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share QR
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Share2 className="w-4 h-4 mr-2" />
                Share link
              </Button>
            </div>
          </div>

          {/* Total Tips Footer */}
          <div className="mt-12">
            <p className="text-xl font-semibold">total tips</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
