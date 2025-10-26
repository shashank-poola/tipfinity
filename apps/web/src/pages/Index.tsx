import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Purple Background */}
      <section
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#9146FF" }}
      >
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl md:text-5xl lg:text-5xl xl:text-9xl font-bold text-white leading-tight mb-8">
                Instant Tip,
                <br />
                Infinite Support
              </h1>
              <p className="text-white text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">
                Tipfinity is where creators and fans come together to support,
                connect, and grow through blockchain-powered tipping.
              </p>
              <Link to="/signup">
                <Button className="bg-white text-black hover:bg-white/90 px-8 sm:px-12 py-6 sm:py-8 rounded-full font-bold text-lg sm:text-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Find Your Thing */}
      <section
        className="min-h-screen flex items-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col gap-12">
            <div className="w-full md:w-1/2">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary leading-tight">
                Tip, Tap
                <br />
                Thrive
              </h2>
            </div>
            <div className="w-full md:w-1/2 md:ml-auto">
              <p className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-relaxed">
                Unabashed fans, welcome home. Support what you love, connect
                with creators, and join communities 🎯
              </p>
              <Link to="/signup" className="inline-block mt-8">
                <span className="text-black text-xl sm:text-2xl font-semibold hover:opacity-80 transition-opacity">
                  See our lineup <ArrowUpRight className="w-4 h-4"/>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

              {/* Main Tagline */}
              <div className="text-center mb-12"
              style={{ backgroundColor: "#000000" }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            A NEWWAY TO
          </h2>
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold space-y-1">
            <div className="text-primary">TIP</div>
            <div className="text-primary">SEND</div>
            <div className="text-primary">RECIEVE</div>
            <div className="text-primary">CONNECT</div>
            <div className="text-primary">GROW</div>
          </div>
        </div>

      {/* Third Section - Reach Our Crowd */}
      <section className="min-h-screen flex items-center bg-black">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
                style={{ color: "#9146FF" }}
              >
                Reach our
                <br />
                crowd
              </h2>
            </div>
            <div>
              <p className="text-white text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed">
                Ready to build real connections with a huge, engaged audience?
                We've got millions of fans ready to support creators like you.
              </p>
              <Link to="/signup" className="inline-block mt-8">
                <Button className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-full font-semibold text-lg">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
