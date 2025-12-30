import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Download, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { PaymentHistoryRecord } from "./PaymentHistory";

type PaymentDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentHistoryRecord | null;
  userRole?: 'Executive' | 'Manager' | 'Encoder';
};

export function PaymentDetailModal({ 
  isOpen, 
  onClose, 
  payment,
  userRole = 'Encoder'
}: PaymentDetailModalProps) {
  if (!payment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 text-base px-3 py-1">
            ✓ Completed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-base px-3 py-1">
            ⏱ Pending
          </Badge>
        );
      case 'Failed':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 text-base px-3 py-1">
            ✗ Failed
          </Badge>
        );
      case 'Refunded':
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-base px-3 py-1">
            ↩ Refunded
          </Badge>
        );
    }
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded', {
      description: `${payment.id}_Receipt.pdf`
    });
  };

  const handleEditPayment = () => {
    toast.info('Edit payment feature', {
      description: 'This feature will be available in the full system'
    });
    onClose();
  };

  const handleVoidPayment = () => {
    toast.warning('Void payment confirmation', {
      description: 'This action would require manager approval'
    });
  };

  // Check permissions
  const canEdit = userRole === 'Manager' || userRole === 'Executive';
  const canVoid = userRole === 'Executive';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Payment Details
            </DialogTitle>
            {getStatusBadge(payment.status)}
          </div>
          <DialogDescription>
            View complete transaction details and receipt information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Transaction ID & Amount - Featured */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900 mb-4">
              {payment.id}
            </p>
            <p className="text-sm text-gray-600 mb-1">Amount</p>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(payment.amount)}
            </p>
          </div>

          <Separator />

          {/* Payment Information - Two Columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Payment Date
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDateTime(payment.date)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Payment Method
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {payment.method}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Reference Number
                </p>
                <p className="text-sm text-gray-900 font-mono font-medium">
                  {payment.referenceNumber}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Status
                </p>
                <div className="mt-1">
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Unit
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {payment.unitName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Customer
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {payment.customerName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Processed By
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {payment.processedBy}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">
                  Processed At
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDateTime(payment.date)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes (if any) */}
          {payment.notes && (
            <>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2">
                  Notes
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    {payment.notes}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>

            {canEdit && payment.status === 'Completed' && (
              <Button
                onClick={handleEditPayment}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Payment
              </Button>
            )}

            {canVoid && payment.status === 'Completed' && (
              <Button
                onClick={handleVoidPayment}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Void Payment
              </Button>
            )}
          </div>

          {/* Permission Notice */}
          {!canEdit && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                ℹ️ You can view payment details but cannot edit or void payments. 
                Contact your manager if changes are needed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}