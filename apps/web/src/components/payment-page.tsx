"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Lock, ShieldCheck, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function PaymentPage({ searchParams }: PaymentPageProps) {
  const pa = searchParams.pa as string;
  const pn = searchParams.pn as string;
  const am = searchParams.am as string;
  const tn = searchParams.tn as string;
  const title = searchParams.title as string;
  const redirect_url = searchParams.redirect_url as string;
  const locked = searchParams.locked === "true";

  const [amount, setAmount] = useState(am || "");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handlePay = () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    const upiUrl = `upi://pay?pa=${pa}&pn=${pn || ""}&am=${amount}&tn=${tn || ""}&cu=INR`;
    window.location.href = upiUrl;

    // Simulate redirect for testing/demo purposes if redirect_url is present
    if (redirect_url) {
      setTimeout(() => {
        toast.success("Payment successful! Redirecting...");
        window.location.href = redirect_url;
      }, 5000); // Wait a bit to simulate payment process or allow user to switch back
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(pa);
    setCopied(true);
    toast.success("UPI ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 dark:bg-black/80 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-600"></div>
        
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {title || "Secure Payment"}
          </CardTitle>
          <CardDescription className="text-base">
            Paying <span className="font-semibold text-foreground">{pn || pa}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="upi-id" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Merchant UPI ID</Label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50 group hover:border-blue-500/50 transition-colors">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <code className="text-sm font-mono flex-1 truncate">{pa}</code>
              <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={copyUpiId}>
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Amount (INR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => !locked && setAmount(e.target.value)}
                readOnly={locked}
                className={`pl-8 text-lg font-bold h-12 border-border/50 bg-background/50 focus:ring-2 ring-blue-500/20 transition-all ${locked ? "cursor-not-allowed opacity-80" : ""}`}
                placeholder="0.00"
              />
              {locked && (
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {tn && (
             <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
               <span className="font-semibold">Note:</span> {tn}
             </div>
          )}

          <div className="pt-2">
            <Button 
              className="w-full h-12 text-lg font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
              onClick={handlePay}
            >
              Pay Now
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center border-t border-border/40 pt-6 pb-6 text-center">
            <div className="text-xs text-muted-foreground flex flex-col items-center gap-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 
                Secured by UPI
              </span>
              {redirect_url && <span className="opacity-70">Requires redirect after payment</span>}
            </div>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-4 text-white/50 text-xs text-center w-full">
        Powered by Pingora
      </div>
    </div>
  );
}
