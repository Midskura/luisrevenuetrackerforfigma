import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type CustomerLoginProps = {
  onLogin: (unitId: string) => void;
  onBackToAdmin: () => void;
};

export function CustomerLogin({ onLogin, onBackToAdmin }: CustomerLoginProps) {
  const [unitNumber, setUnitNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!unitNumber.trim()) {
      toast.error("Unit number is required");
      return;
    }
    
    if (!pin.trim()) {
      toast.error("PIN is required");
      return;
    }

    // Mock authentication
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if unit exists (mock)
      const validUnits = ['B1-L05', 'B2-L12', 'B3-L08', 'B1-L15', 'B2-L03'];
      const normalizedUnit = unitNumber.toUpperCase().trim();
      
      if (validUnits.includes(normalizedUnit)) {
        toast.success("Login successful!", {
          description: `Welcome back! Loading your account...`
        });
        
        // Map unit number to unit ID
        const unitMap: Record<string, string> = {
          'B1-L05': 'U001',
          'B2-L12': 'U002',
          'B3-L08': 'U003',
          'B1-L15': 'U004',
          'B2-L03': 'U005'
        };
        
        setTimeout(() => {
          onLogin(unitMap[normalizedUnit]);
        }, 500);
      } else {
        toast.error("Invalid credentials", {
          description: "Unit number or PIN is incorrect"
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F9FAFB' }}>
      {/* Back to Admin Link */}
      <button
        onClick={onBackToAdmin}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Admin Panel</span>
      </button>

      {/* Login Card */}
      <Card className="w-full max-w-md p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Customer Portal
          </h1>
          <p className="text-sm text-gray-600">
            Log in to view your unit details and make payments
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="unitNumber">Unit Number</Label>
            <Input
              id="unitNumber"
              type="text"
              placeholder="e.g., B1-L05"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pin">PIN / Password</Label>
              <button
                type="button"
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Forgot PIN?
              </button>
            </div>
            <Input
              id="pin"
              type="password"
              placeholder="Enter your 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={isLoading}
              className="h-11"
              maxLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        {/* Demo Helper */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">
            🧪 Demo Mode - Try these credentials:
          </p>
          <div className="space-y-1">
            <p className="text-xs text-blue-700">
              <span className="font-mono font-semibold">B1-L05</span> • PIN: <span className="font-mono">123456</span>
            </p>
            <p className="text-xs text-blue-700">
              <span className="font-mono font-semibold">B2-L12</span> • PIN: <span className="font-mono">123456</span>
            </p>
            <p className="text-xs text-blue-700 mt-2">
              (Any PIN works in demo mode)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact your property manager
          </p>
        </div>
      </Card>
    </div>
  );
}
