import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const { signature } = router.query;
  const [tipData, setTipData] = useState<any>(null);

  useEffect(() => {
    if (!signature) return;

    fetch(`http://127.0.0.1:3000/tips/signature/${signature}`)
      .then((res) => res.json())
      .then((data) => setTipData(data.data))
      .catch(console.error);
  }, [signature]);

  if (!tipData) return <p>Loading your transaction...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-4xl font-bold text-black mb-4">🎉 Tip Successful!</h1>
      <p className="text-gray-700 mb-2">You tipped <b>{tipData.tip_amount} SOL</b></p>
      <p className="text-gray-500 mb-4">{tipData.message || "No message left"}</p>

      <div className="mt-6 flex gap-4">
        <a
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          View on Solana Explorer
        </a>
        <button
          className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
          onClick={() => {
            const url = `https://tipfinity.xyz/success/${signature}`;
            navigator.share
              ? navigator.share({
                  title: "I just tipped on Tipfinity!",
                  url,
                })
              : alert("Sharing not supported on this device");
          }}
        >
          Share on Socials 🚀
        </button>
      </div>
    </div>
  );
}
