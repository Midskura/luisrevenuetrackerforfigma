import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DollarSign, CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";
import { Unit, CURRENT_DATE } from "../../data/mockData";

type PaymentScheduleProps = {
  unit: Unit;
  onRecordPayment: (monthNumber: number) => void;
};

type ScheduleEntry = {
  month: number;
  dueDate: Date;
  amountDue: number;
  amountPaid: number;
  paymentDate: Date | null;
  balanceAfter: number;
  status: 'paid' | 'due-today' | 'overdue' | 'upcoming';
  daysLate?: number;
};

export function PaymentSchedule({ unit, onRecordPayment }: PaymentScheduleProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  if (!unit.paymentTerms) {
    return null;
  }

  // Generate payment schedule
  const generateSchedule = (): ScheduleEntry[] => {
    const schedule: ScheduleEntry[] = [];
    const { totalMonths, monthsPaid, monthlyAmount, arrears, daysLate } = unit.paymentTerms!;
    
    // Use global CURRENT_DATE for consistency
    const today = new Date(CURRENT_DATE);
    today.setHours(0, 0, 0, 0);

    // Use the actual move-in date from the unit
    if (!unit.moveInDate) return [];
    const startDate = new Date(unit.moveInDate);
    startDate.setHours(0, 0, 0, 0);
    
    let runningBalance = totalMonths * monthlyAmount;

    for (let month = 1; month <= totalMonths; month++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + (month - 1));
      dueDate.setHours(0, 0, 0, 0);

      let amountPaid = 0;
      let paymentDate: Date | null = null;
      let status: ScheduleEntry['status'] = 'upcoming';
      let lateDays: number | undefined;

      if (month <= monthsPaid) {
        // Already paid
        amountPaid = monthlyAmount;
        status = 'paid';
        
        // Payment was made on or around the due date
        paymentDate = new Date(dueDate);
        
        // Randomly some payments were a few days late (realistic variance)
        if (month % 5 === 2 || month % 7 === 3) {
          const randomLateDays = Math.floor(Math.random() * 8) + 2; // 2-10 days late
          paymentDate.setDate(paymentDate.getDate() + randomLateDays);
          lateDays = randomLateDays;
        } else {
          // Paid on time or slightly early
          const earlyDays = Math.floor(Math.random() * 3); // 0-2 days early
          paymentDate.setDate(paymentDate.getDate() - earlyDays);
        }
      } else {
        // Not yet paid - check if it's overdue, due today, or upcoming
        const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 0) {
          status = 'overdue';
          lateDays = daysDiff;
        } else if (daysDiff === 0) {
          status = 'due-today';
        } else {
          status = 'upcoming';
        }
      }

      const balanceAfter = runningBalance - amountPaid;
      runningBalance = balanceAfter;

      schedule.push({
        month,
        dueDate,
        amountDue: monthlyAmount,
        amountPaid,
        paymentDate,
        balanceAfter,
        status,
        daysLate: lateDays
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();

  // Calculate totals
  const totalDue = schedule.reduce((sum, entry) => sum + entry.amountDue, 0);
  const totalPaid = schedule.reduce((sum, entry) => sum + entry.amountPaid, 0);
  const totalRemaining = totalDue - totalPaid;

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

  const getStatusBadge = (entry: ScheduleEntry) => {
    switch (entry.status) {
      case 'paid':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {entry.daysLate ? `Paid (${entry.daysLate}d late)` : 'Paid'}
          </Badge>
        );
      case 'due-today':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
            <Clock className="w-3 h-3 mr-1" />
            Due Today
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
            <AlertCircle className="w-3 h-3 mr-1" />
            {entry.daysLate} days overdue
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            <Calendar className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        );
    }
  };

  const getRowClassName = (entry: ScheduleEntry, index: number) => {
    const baseClasses = "cursor-pointer transition-colors";
    const hoverClass = "hover:bg-gray-50";
    const selectedClass = selectedRow === index ? "bg-blue-50" : "";
    
    let statusClass = "";
    switch (entry.status) {
      case 'paid':
        statusClass = entry.daysLate ? "bg-green-50/30" : "bg-green-50/50";
        break;
      case 'due-today':
        statusClass = "bg-yellow-50/50";
        break;
      case 'overdue':
        statusClass = "bg-red-50/50";
        break;
      default:
        statusClass = "";
    }

    return `${baseClasses} ${hoverClass} ${selectedClass || statusClass}`;
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-gray-900">Payment Schedule</h2>
          </div>
          <p className="text-sm text-gray-600">
            {unit.paymentTerms.totalMonths} months • {formatCurrency(unit.paymentTerms.monthlyAmount)}/month
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Payment Progress</p>
          <p className="font-semibold text-gray-900">
            {unit.paymentTerms.monthsPaid} / {unit.paymentTerms.totalMonths} months
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-16 font-semibold text-gray-700">Month</TableHead>
                <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Amount Due</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Amount Paid</TableHead>
                <TableHead className="font-semibold text-gray-700">Payment Date</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Balance After</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="w-32 font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((entry, index) => (
                <TableRow
                  key={entry.month}
                  className={getRowClassName(entry, index)}
                  onClick={() => setSelectedRow(index === selectedRow ? null : index)}
                >
                  <TableCell className="font-medium text-gray-900">#{entry.month}</TableCell>
                  <TableCell className="text-gray-700">{formatDate(entry.dueDate)}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {formatCurrency(entry.amountDue)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.amountPaid > 0 ? (
                      <span className="text-green-600">{formatCurrency(entry.amountPaid)}</span>
                    ) : (
                      <span className="text-gray-400">₱0.00</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {entry.paymentDate ? formatDate(entry.paymentDate) : '—'}
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {formatCurrency(entry.balanceAfter)}
                  </TableCell>
                  <TableCell>{getStatusBadge(entry)}</TableCell>
                  <TableCell>
                    {(entry.status === 'due-today' || entry.status === 'overdue' || entry.status === 'upcoming') && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordPayment(entry.month);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white h-8 text-xs"
                      >
                        Record
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-gray-600 mb-1 font-semibold">Total Due</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalDue)}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-green-700 mb-1 font-semibold">Total Paid</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-red-700 mb-1 font-semibold">Remaining</p>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(totalRemaining)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}