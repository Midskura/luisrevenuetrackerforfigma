import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Unit } from "../../data/mockData";
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  FileText, 
  CreditCard, 
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

type CustomerDashboardProps = {
  unit: Unit;
  onLogout: () => void;
};

export function CustomerDashboard({ unit, onLogout }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'documents'>('overview');

  if (!unit.buyer || !unit.paymentTerms) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unit not found</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const paymentProgress = (unit.paymentTerms.monthsPaid / unit.paymentTerms.totalMonths) * 100;
  const remainingBalance = (unit.paymentTerms.totalMonths - unit.paymentTerms.monthsPaid) * unit.paymentTerms.monthlyAmount;

  const getStatusInfo = () => {
    if (unit.status === 'Fully Paid') {
      return {
        icon: <CheckCircle2 className="w-5 h-5" />,
        text: 'Account in Good Standing',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (unit.paymentTerms.arrears > 0) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        text: `Overdue: ${formatCurrency(unit.paymentTerms.arrears)}`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    } else {
      return {
        icon: <CheckCircle2 className="w-5 h-5" />,
        text: 'Account in Good Standing',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
  };

  const statusInfo = getStatusInfo();

  const handleMakePayment = () => {
    toast.info("Payment feature", {
      description: "Online payment gateway will be available in the full system"
    });
  };

  const handleDownloadStatement = () => {
    toast.success("Statement downloaded", {
      description: `${unit.blockLot}_Statement_${new Date().getFullYear()}.pdf`
    });
  };

  const handleDownloadContract = () => {
    toast.success("Contract downloaded", {
      description: `${unit.blockLot}_Contract.pdf`
    });
  };

  // Generate recent payments (mock)
  const recentPayments = [
    {
      id: 1,
      date: '2024-12-15',
      amount: unit.paymentTerms.monthlyAmount,
      method: 'Bank Transfer',
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-11-15',
      amount: unit.paymentTerms.monthlyAmount,
      method: 'GCash',
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-10-15',
      amount: unit.paymentTerms.monthlyAmount,
      method: 'Bank Transfer',
      status: 'Completed'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Customer Portal</h1>
                <p className="text-xs text-gray-600">{unit.project}</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{unit.buyer.name}</p>
                <p className="text-xs text-gray-600">{unit.blockLot}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Alert */}
        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
          <div className={statusInfo.color}>
            {statusInfo.icon}
          </div>
          <p className={`font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Next Payment Due */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Payment Due</p>
                <p className="font-semibold text-gray-900">
                  {unit.paymentTerms.nextDueDate ? formatDate(unit.paymentTerms.nextDueDate) : 'N/A'}
                </p>
              </div>
            </div>
            <Separator className="mb-4" />
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(unit.paymentTerms.monthlyAmount)}
            </p>
            <Button
              onClick={handleMakePayment}
              className="w-full mt-4 bg-red-600 hover:bg-red-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          </Card>

          {/* Payment Progress */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Progress</p>
                <p className="font-semibold text-gray-900">
                  {unit.paymentTerms.monthsPaid} of {unit.paymentTerms.totalMonths} months
                </p>
              </div>
            </div>
            <Separator className="mb-4" />
            <Progress value={paymentProgress} className="mb-2" />
            <p className="text-sm text-gray-600">
              {paymentProgress.toFixed(0)}% Complete
            </p>
          </Card>

          {/* Remaining Balance */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Balance</p>
                <p className="text-xs text-gray-500">
                  {unit.paymentTerms.totalMonths - unit.paymentTerms.monthsPaid} months left
                </p>
              </div>
            </div>
            <Separator className="mb-4" />
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(remainingBalance)}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'payments'
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'documents'
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Documents
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Details */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                Unit Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unit Number</span>
                  <span className="text-sm font-medium text-gray-900">{unit.blockLot}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unit Type</span>
                  <span className="text-sm font-medium text-gray-900">{unit.unitType}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Project</span>
                  <span className="text-sm font-medium text-gray-900">{unit.project}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phase</span>
                  <span className="text-sm font-medium text-gray-900">{unit.phase}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Selling Price</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(unit.sellingPrice)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Move-in Date</span>
                  <span className="text-sm font-medium text-gray-900">
                    {unit.moveInDate ? formatDate(unit.moveInDate) : 'Not set'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Payment Terms */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                Payment Terms
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Amount</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(unit.paymentTerms.monthlyAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Term</span>
                  <span className="text-sm font-medium text-gray-900">
                    {unit.paymentTerms.totalMonths} months
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Months Paid</span>
                  <span className="text-sm font-medium text-green-600">
                    {unit.paymentTerms.monthsPaid} months
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining Months</span>
                  <span className="text-sm font-medium text-gray-900">
                    {unit.paymentTerms.totalMonths - unit.paymentTerms.monthsPaid} months
                  </span>
                </div>
                <Separator />
                {unit.paymentTerms.arrears > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Arrears</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatCurrency(unit.paymentTerms.arrears)}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Due Date</span>
                  <span className="text-sm font-medium text-gray-900">
                    {unit.paymentTerms.nextDueDate ? formatDate(unit.paymentTerms.nextDueDate) : 'N/A'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'payments' && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Recent Payments
            </h3>
            <div className="space-y-3">
              {recentPayments.map((payment, index) => (
                <div key={payment.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-600">{formatDate(payment.date)} • {payment.method}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {payment.status}
                    </Badge>
                  </div>
                  {index < recentPayments.length - 1 && <Separator />}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleDownloadStatement}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Full Statement
            </Button>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Your Documents
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleDownloadContract}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Purchase Contract</p>
                    <p className="text-sm text-gray-600">PDF • Last updated Dec 2024</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={handleDownloadStatement}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Statement of Account</p>
                    <p className="text-sm text-gray-600">PDF • Updated monthly</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => toast.info("Feature coming soon")}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Official Receipts</p>
                    <p className="text-sm text-gray-600">ZIP • All payment receipts</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
