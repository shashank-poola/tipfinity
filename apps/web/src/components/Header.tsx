import logo from "@/assets/tipfinity-logo-white.png";
import { Button } from "@/components/ui/button";
import { Search, WalletCards, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ backgroundColor: "#9146FF" }}>
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Tipfinity" className="h-40 pl-20" />
          </Link>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <button className="text-lg font-bold text-white hover:text-black transition-colors">
              About
            </button>
            <a
              href="https://x.com/tipfinity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-white hover:text-black transition-colors"
            >
              X (twitter)
            </a>
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder="Search Creators"
                className="pl-10 pr-4 py-2 bg-white/10 rounded-lg text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 w-48"
              />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 pr-20">
            <Link to="/signup" className="">
              <Button className=" hover:text-black text-lg font-bold text-white">
                <ArrowUpRight className="w-15 h-15" />
                Get Started
              </Button>
            </Link>
            <Button className="text-white hover:text-black font-bold text-lg md:text-lg px-3 md:px-4">
            <WalletCards className="w-12 h-12" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
