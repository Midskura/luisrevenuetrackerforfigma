import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Unit, CURRENT_DATE } from "../../data/mockData";

type RecordPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
  onPaymentRecorded: (payment: PaymentRecord) => void;
};

export type PaymentRecord = {
  id: string;
  unitId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  notes: string;
  processedAt: string;
};

export function RecordPaymentModal({ isOpen, onClose, unit, onPaymentRecorded }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(CURRENT_DATE.toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate remaining balance
  const getRemainingBalance = () => {
    if (!unit.paymentTerms) return 0;
    const { totalMonths, monthsPaid, monthlyAmount, arrears } = unit.paymentTerms;
    const remainingMonths = totalMonths - monthsPaid;
    return (remainingMonths * monthlyAmount) + arrears;
  };

  const remainingBalance = getRemainingBalance();

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Parse amount input
  const parseAmount = (value: string): number => {
    const cleaned = value.replace(/[₱,\s]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Handle amount input with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;
    
    setAmount(cleaned);
    
    // Clear amount error when user types
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  // Format amount for display
  const getDisplayAmount = () => {
    if (!amount) return '';
    const numValue = parseFloat(amount);
    if (isNaN(numValue)) return amount;
    return numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Amount validation
    const amountValue = parseAmount(amount);
    if (!amount || amountValue <= 0) {
      newErrors.amount = "Amount is required and must be greater than 0";
    } else if (amountValue > remainingBalance) {
      newErrors.amount = `Amount cannot exceed remaining balance of ${formatCurrency(remainingBalance)}`;
    }

    // Date validation
    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    } else {
      const selectedDate = new Date(paymentDate);
      const today = new Date(CURRENT_DATE);
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.paymentDate = "Payment date cannot be in the future";
      }
    }

    // Payment method validation
    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    // Reference number validation (required for non-Cash methods)
    if (paymentMethod && paymentMethod !== "Cash" && !referenceNumber.trim()) {
      newErrors.referenceNumber = "Reference number is required for non-cash payments";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const payment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      unitId: unit.id,
      amount: parseAmount(amount),
      paymentDate,
      paymentMethod,
      referenceNumber: referenceNumber || 'N/A',
      notes,
      processedAt: new Date().toISOString()
    };

    // Calculate new balance
    const newBalance = remainingBalance - parseAmount(amount);

    // Show success toast
    toast.success("Payment recorded successfully!", {
      description: `${formatCurrency(parseAmount(amount))} received via ${paymentMethod}. New balance: ${formatCurrency(newBalance)}`
    });

    // Call parent handler
    onPaymentRecorded(payment);

    // Reset form and close
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setAmount("");
    setPaymentDate(CURRENT_DATE.toISOString().split('T')[0]);
    setPaymentMethod("");
    setReferenceNumber("");
    setNotes("");
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Enter the payment details for {unit.blockLot}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Unit Info Display */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unit</span>
              <span className="font-semibold">{unit.blockLot}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Customer</span>
              <span className="font-semibold">{unit.buyer?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Remaining Balance</span>
              <span className="font-semibold text-red-600">{formatCurrency(remainingBalance)}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Payment Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">
                Payment Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => {
                  setPaymentDate(e.target.value);
                  if (errors.paymentDate) {
                    setErrors(prev => ({ ...prev, paymentDate: '' }));
                  }
                }}
                max={CURRENT_DATE.toISOString().split('T')[0]}
                className={errors.paymentDate ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.paymentDate && (
                <p className="text-sm text-red-500">{errors.paymentDate}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">
                Payment Method <span className="text-red-500">*</span>
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => {
                  setPaymentMethod(value);
                  if (errors.paymentMethod) {
                    setErrors(prev => ({ ...prev, paymentMethod: '' }));
                  }
                  // Clear reference number error if switching to Cash
                  if (value === "Cash" && errors.referenceNumber) {
                    setErrors(prev => ({ ...prev, referenceNumber: '' }));
                  }
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="GCash">GCash</SelectItem>
                  <SelectItem value="PayMaya">PayMaya</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-sm text-red-500">{errors.paymentMethod}</p>
              )}
            </div>

            {/* Reference Number */}
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">
                Reference Number {paymentMethod !== "Cash" && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="referenceNumber"
                type="text"
                placeholder="e.g. BDO-12345, GCash Ref#"
                value={referenceNumber}
                onChange={(e) => {
                  setReferenceNumber(e.target.value);
                  if (errors.referenceNumber) {
                    setErrors(prev => ({ ...prev, referenceNumber: '' }));
                  }
                }}
                className={errors.referenceNumber ? 'border-red-500' : ''}
                disabled={isSubmitting || paymentMethod === "Cash"}
              />
              {errors.referenceNumber && (
                <p className="text-sm text-red-500">{errors.referenceNumber}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Processing...</span>
                  <span className="inline-block animate-spin">⏳</span>
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}