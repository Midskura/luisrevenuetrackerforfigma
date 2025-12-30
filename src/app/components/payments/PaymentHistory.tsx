import { useState, useMemo } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Search, Download, Eye, ArrowUpDown, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { toast } from "sonner";

type PaymentStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';
type PaymentMethod = 'Cash' | 'Check' | 'Bank Transfer' | 'GCash' | 'PayMaya' | 'Credit Card';

export type PaymentHistoryRecord = {
  id: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  referenceNumber: string;
  processedBy: string;
  status: PaymentStatus;
  unitId: string;
  unitName: string;
  customerName: string;
  notes?: string;
};

type PaymentHistoryProps = {
  unitId?: string; // If provided, filter to this unit only
  onViewDetail: (payment: PaymentHistoryRecord) => void;
};

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export function PaymentHistory({ unitId, onViewDetail }: PaymentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Generate mock payment data
  const generateMockPayments = (): PaymentHistoryRecord[] => {
    const payments: PaymentHistoryRecord[] = [];
    const methods: PaymentMethod[] = ['Cash', 'Check', 'Bank Transfer', 'GCash', 'PayMaya', 'Credit Card'];
    const processors = ['Ana Marie Reyes', 'Roberto Cruz', 'Maria Elena Santos'];
    const units = [
      { id: 'U001', name: 'B1-L05', customer: 'Maria Santos' },
      { id: 'U002', name: 'B2-L12', customer: 'Juan Dela Cruz' },
      { id: 'U003', name: 'B3-L08', customer: 'Pedro Gonzales' },
      { id: 'U004', name: 'B1-L15', customer: 'Ana Reyes' },
      { id: 'U005', name: 'B2-L03', customer: 'Jose Martinez' }
    ];

    // Generate 20-25 payments over the past 6 months
    const today = new Date();
    
    for (let i = 0; i < 22; i++) {
      const unit = units[i % units.length];
      const method = methods[Math.floor(Math.random() * methods.length)];
      const processor = processors[Math.floor(Math.random() * processors.length)];
      
      // Generate dates going backwards from today
      const daysAgo = i * 8 + Math.floor(Math.random() * 7); // Roughly every 8-15 days
      const paymentDate = new Date(today);
      paymentDate.setDate(paymentDate.getDate() - daysAgo);
      
      // Most payments are completed, but add some variety
      let status: PaymentStatus = 'Completed';
      if (i === 2) status = 'Pending';
      if (i === 7) status = 'Failed';
      
      // Generate reference numbers based on method
      let refNumber = '';
      if (method === 'Cash') {
        refNumber = `CASH-${paymentDate.getFullYear()}${String(paymentDate.getMonth() + 1).padStart(2, '0')}${String(i).padStart(3, '0')}`;
      } else if (method === 'Check') {
        refNumber = `CHK-${Math.floor(Math.random() * 900000 + 100000)}`;
      } else if (method === 'Bank Transfer') {
        refNumber = `BDO-${paymentDate.getFullYear()}-${String(Math.floor(Math.random() * 900000 + 100000))}`;
      } else if (method === 'GCash') {
        refNumber = `GCash-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      } else if (method === 'PayMaya') {
        refNumber = `PM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      } else {
        refNumber = `CC-${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
      }
      
      // Amounts are typically monthly payments or partial payments
      const baseAmounts = [12500, 25000, 32000, 45000, 50000, 15000, 20000];
      const amount = baseAmounts[Math.floor(Math.random() * baseAmounts.length)];
      
      payments.push({
        id: `PAY-${String(i + 1).padStart(4, '0')}`,
        date: paymentDate,
        amount,
        method,
        referenceNumber: refNumber,
        processedBy: processor,
        status,
        unitId: unit.id,
        unitName: unit.name,
        customerName: unit.customer,
        notes: i === 5 ? 'Partial payment - customer requested split' : undefined
      });
    }
    
    return payments;
  };

  const allPayments = useMemo(() => generateMockPayments(), []);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let result = allPayments;

    // Filter by unit if specified
    if (unitId) {
      result = result.filter(p => p.unitId === unitId);
    }

    // Filter by search query (reference number, customer name, unit name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.referenceNumber.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.unitName.toLowerCase().includes(query)
      );
    }

    // Filter by payment method
    if (methodFilter !== 'all') {
      result = result.filter(p => p.method === methodFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | Date;
      let bVal: number | Date;

      if (sortField === 'date') {
        aVal = a.date;
        bVal = b.date;
      } else {
        aVal = a.amount;
        bVal = b.amount;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [allPayments, unitId, searchQuery, methodFilter, statusFilter, sortField, sortDirection]);

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    toast.success('Export successful!', {
      description: `${filteredPayments.length} payment records exported to Excel`
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            ✓ Completed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
            ⏱ Pending
          </Badge>
        );
      case 'Failed':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
            ✗ Failed
          </Badge>
        );
      case 'Refunded':
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50">
            ↩ Refunded
          </Badge>
        );
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-red-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-red-600" />
    );
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-gray-900">Payment History</h2>
          </div>
          <p className="text-sm text-gray-600">
            {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} • {formatCurrency(totalAmount)} total
          </p>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by reference, customer, or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Payment Method Filter */}
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Check">Check</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="GCash">GCash</SelectItem>
            <SelectItem value="PayMaya">PayMaya</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center hover:text-gray-900 transition-colors"
                  >
                    Date
                    {getSortIcon('date')}
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center hover:text-gray-900 transition-colors"
                  >
                    Amount
                    {getSortIcon('amount')}
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Method</TableHead>
                <TableHead className="font-semibold text-gray-700">Reference #</TableHead>
                {!unitId && <TableHead className="font-semibold text-gray-700">Unit</TableHead>}
                {!unitId && <TableHead className="font-semibold text-gray-700">Customer</TableHead>}
                <TableHead className="font-semibold text-gray-700">Processed By</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="w-24 font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={unitId ? 7 : 9} className="text-center py-8 text-gray-500">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onViewDetail(payment)}
                  >
                    <TableCell className="text-gray-700">
                      {formatDate(payment.date)}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-gray-700">{payment.method}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {payment.referenceNumber}
                    </TableCell>
                    {!unitId && (
                      <TableCell className="text-gray-700">{payment.unitName}</TableCell>
                    )}
                    {!unitId && (
                      <TableCell className="text-gray-700">{payment.customerName}</TableCell>
                    )}
                    <TableCell className="text-gray-700">{payment.processedBy}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetail(payment);
                        }}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
