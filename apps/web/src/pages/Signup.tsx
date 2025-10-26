import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Upload } from "lucide-react";
import logo from "@/assets/blacklogo.png";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      setStep(parseInt(stepParam));
    }
  }, [searchParams]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every(digit => digit !== "")) {
      navigate("/connect-wallet");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        <div className="flex justify-center mb-6 md:mb-8">
          <img src={logo} alt="Tipfinity" className="h-10 md:h-12" />
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-xl md:text-2xl font-bold">welcome to tipfinity</h1>
              <p className="text-muted-foreground text-sm md:text-base">Log in or sign up to get started.</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email"
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              
              <p className="text-xs text-muted-foreground text-center">
                We'll create an account if you dont have yet.
              </p>

              <button 
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-xl md:text-2xl font-bold">verify your email</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-semibold bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                ))}
              </div>

              <button 
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Verify
              </button>
            </form>
          </>
        )}

        {/* Step 3: Customize Username */}
        {step === 3 && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-xl md:text-2xl font-bold">customize your username</h1>
              <p className="text-muted-foreground text-sm md:text-base">Give your account an icon and username</p>
            </div>

            <form onSubmit={handleCustomizeSubmit} className="space-y-6">
              <div className="flex justify-center">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-muted rounded-2xl flex items-center justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden group bg-primary"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="set username"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  You dont want to customize <span className="underline">Skip for now</span>
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              >
                Continue
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default Signup;
