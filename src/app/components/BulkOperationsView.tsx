import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import {
  Send,
  FileText,
  Download,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  Calendar,
  DollarSign,
  Building2,
  Play,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "../data/mockData";

type BulkOperationsViewProps = {
  currentRole: UserRole;
};

type OperationType = 
  | 'send_reminders'
  | 'generate_statements'
  | 'send_receipts'
  | 'export_data'
  | 'bulk_email'
  | 'bulk_sms';

type SelectionCriteria = {
  project: string[];
  paymentStatus: string[];
  riskLevel: string[];
  dateRange: string;
};

type BulkTask = {
  id: string;
  name: string;
  type: OperationType;
  targetCount: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  successCount?: number;
  failureCount?: number;
};

export function BulkOperationsView({ currentRole }: BulkOperationsViewProps) {
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectionCriteria, setSelectionCriteria] = useState<SelectionCriteria>({
    project: [],
    paymentStatus: [],
    riskLevel: [],
    dateRange: 'all'
  });

  const isReadOnly = currentRole === 'Encoder';

  // Mock units for selection
  const mockUnits = [
    { id: 'u1', unitNumber: 'B1-L05', buyer: 'Maria Santos', project: 'Sunrise Villas', status: 'active', risk: 'low', balance: 125000 },
    { id: 'u2', unitNumber: 'B2-L12', buyer: 'Juan Reyes', project: 'Palm Heights', status: 'active', risk: 'medium', balance: 890000 },
    { id: 'u3', unitNumber: 'B3-L08', buyer: 'Ana Garcia', project: 'Sunrise Villas', status: 'active', risk: 'low', balance: 340000 },
    { id: 'u4', unitNumber: 'B1-L15', buyer: 'Carlos Mendoza', project: 'Bayview Residences', status: 'overdue', risk: 'high', balance: 45000 },
    { id: 'u5', unitNumber: 'B2-L03', buyer: 'Rosa Cruz', project: 'Palm Heights', status: 'active', risk: 'low', balance: 280000 },
    { id: 'u6', unitNumber: 'B4-L20', buyer: 'Pedro Alvarez', project: 'Sunset Gardens', status: 'overdue', risk: 'high', balance: 67000 },
    { id: 'u7', unitNumber: 'B3-L11', buyer: 'Linda Ramos', project: 'Sunrise Villas', status: 'active', risk: 'medium', balance: 450000 },
    { id: 'u8', unitNumber: 'B5-L07', buyer: 'Miguel Torres', project: 'Bayview Residences', status: 'active', risk: 'low', balance: 190000 }
  ];

  // Mock bulk tasks
  const mockTasks: BulkTask[] = [
    {
      id: 'task_001',
      name: 'December Payment Reminders',
      type: 'send_reminders',
      targetCount: 156,
      status: 'completed',
      progress: 100,
      createdAt: '2024-12-27T08:00:00',
      createdBy: 'Ana Martinez',
      completedAt: '2024-12-27T08:15:00',
      successCount: 154,
      failureCount: 2
    },
    {
      id: 'task_002',
      name: 'Q4 2024 Statement Generation',
      type: 'generate_statements',
      targetCount: 289,
      status: 'completed',
      progress: 100,
      createdAt: '2024-12-01T09:00:00',
      createdBy: 'Ricardo Santos',
      completedAt: '2024-12-01T09:45:00',
      successCount: 289,
      failureCount: 0
    },
    {
      id: 'task_003',
      name: 'Export All Units Data',
      type: 'export_data',
      targetCount: 342,
      status: 'running',
      progress: 67,
      createdAt: '2024-12-27T14:30:00',
      createdBy: 'Ana Martinez'
    },
    {
      id: 'task_004',
      name: 'Overdue Account Alerts',
      type: 'bulk_sms',
      targetCount: 23,
      status: 'pending',
      progress: 0,
      createdAt: '2024-12-27T15:00:00',
      createdBy: 'Ana Martinez'
    }
  ];

  const operations = [
    {
      type: 'send_reminders' as OperationType,
      name: 'Send Payment Reminders',
      description: 'Send SMS/email reminders to customers with upcoming payments',
      icon: Calendar,
      color: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' }
    },
    {
      type: 'generate_statements' as OperationType,
      name: 'Generate Statements',
      description: 'Create and send monthly statements to selected customers',
      icon: FileText,
      color: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' }
    },
    {
      type: 'send_receipts' as OperationType,
      name: 'Send Payment Receipts',
      description: 'Email official receipts for recent payments',
      icon: Mail,
      color: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
    },
    {
      type: 'export_data' as OperationType,
      name: 'Export Customer Data',
      description: 'Download selected units and payment data as CSV/Excel',
      icon: Download,
      color: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' }
    },
    {
      type: 'bulk_email' as OperationType,
      name: 'Send Bulk Email',
      description: 'Send custom email to multiple customers at once',
      icon: Mail,
      color: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' }
    },
    {
      type: 'bulk_sms' as OperationType,
      name: 'Send Bulk SMS',
      description: 'Send custom SMS message to selected customers',
      icon: MessageSquare,
      color: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' }
    }
  ];

  const handleSelectAll = () => {
    if (selectedUnits.length === mockUnits.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(mockUnits.map(u => u.id));
    }
  };

  const handleSelectUnit = (unitId: string) => {
    if (selectedUnits.includes(unitId)) {
      setSelectedUnits(selectedUnits.filter(id => id !== unitId));
    } else {
      setSelectedUnits([...selectedUnits, unitId]);
    }
  };

  const handleExecute = () => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot execute bulk operations'
      });
      return;
    }

    if (selectedUnits.length === 0) {
      toast.error('No units selected', {
        description: 'Please select at least one unit to proceed'
      });
      return;
    }

    if (!selectedOperation) {
      toast.error('No operation selected', {
        description: 'Please select an operation type'
      });
      return;
    }

    const operation = operations.find(op => op.type === selectedOperation);
    
    toast.success('Bulk operation started', {
      description: `${operation?.name} for ${selectedUnits.length} units`
    });

    // Reset selections
    setSelectedUnits([]);
    setSelectedOperation(null);
  };

  const handleCancelTask = (task: BulkTask) => {
    if (currentRole !== 'Executive' && currentRole !== 'Manager') {
      toast.error('Permission Denied', {
        description: 'Only Executives and Managers can cancel tasks'
      });
      return;
    }

    toast.success('Task cancelled', {
      description: task.name
    });
  };

  const getStatusColor = (status: BulkTask['status']) => {
    switch (status) {
      case 'pending': return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
      case 'running': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'completed': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'failed': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    }
  };

  const getStatusIcon = (status: BulkTask['status']) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'running': return Play;
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bulk Operations</h2>
          <p className="text-sm text-gray-600 mt-1">
            Execute batch operations on multiple units simultaneously
          </p>
        </div>
        
        {isReadOnly && (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Read-Only Access
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Operation Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Select Operation</h3>
            <div className="space-y-2">
              {operations.map((op) => {
                const Icon = op.icon;
                const isSelected = selectedOperation === op.type;
                
                return (
                  <button
                    key={op.type}
                    onClick={() => setSelectedOperation(op.type)}
                    disabled={isReadOnly}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? `${op.color.bg} ${op.color.border}`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${op.color.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${op.color.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold mb-1 ${isSelected ? op.color.text : 'text-gray-900'}`}>
                          {op.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {op.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Selection Summary */}
          {selectedOperation && (
            <Card className="p-5 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Selection Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Selected Units:</span>
                  <span className="font-semibold text-blue-900">{selectedUnits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Operation:</span>
                  <span className="font-semibold text-blue-900">
                    {operations.find(op => op.type === selectedOperation)?.name}
                  </span>
                </div>
              </div>
              
              <Separator className="my-4 bg-blue-200" />
              
              <Button
                onClick={handleExecute}
                disabled={selectedUnits.length === 0 || isReadOnly}
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Execute Operation
              </Button>
            </Card>
          )}
        </div>

        {/* Right: Unit Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Select Units</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isReadOnly}
              >
                {selectedUnits.length === mockUnits.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <Filter className="w-4 h-4 text-gray-500" />
              <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                All Projects
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                Active Only
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                Overdue
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                High Risk
              </button>
            </div>

            {/* Units List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mockUnits.map((unit) => {
                const isSelected = selectedUnits.includes(unit.id);
                const riskColor = unit.risk === 'high' ? 'text-red-600' : unit.risk === 'medium' ? 'text-amber-600' : 'text-green-600';
                
                return (
                  <div
                    key={unit.id}
                    onClick={() => !isReadOnly && handleSelectUnit(unit.id)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => !isReadOnly && handleSelectUnit(unit.id)}
                        disabled={isReadOnly}
                        className="flex-shrink-0"
                      />
                      
                      <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{unit.unitNumber}</p>
                          <p className="text-xs text-gray-600">{unit.buyer}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-700">{unit.project}</p>
                        </div>
                        
                        <div>
                          <Badge className={unit.status === 'active' ? 'bg-green-100 text-green-700 border-green-300 text-xs' : 'bg-red-100 text-red-700 border-red-300 text-xs'}>
                            {unit.status}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className={`text-sm font-medium ${riskColor}`}>
                            {unit.risk.charAt(0).toUpperCase() + unit.risk.slice(1)} Risk
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(unit.balance)}
                          </p>
                          <p className="text-xs text-gray-600">Balance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Tasks */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Bulk Operations</h3>
        <div className="space-y-3">
          {mockTasks.map((task) => {
            const statusColors = getStatusColor(task.status);
            const StatusIcon = getStatusIcon(task.status);
            
            return (
              <div key={task.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${statusColors.bg} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className={`w-6 h-6 ${statusColors.text}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{task.name}</h4>
                        <p className="text-sm text-gray-600">
                          {task.targetCount} units • Created by {task.createdBy} on {formatTimestamp(task.createdAt)}
                        </p>
                      </div>
                      
                      <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Progress Bar */}
                    {task.status === 'running' && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{task.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Results */}
                    {task.status === 'completed' && task.successCount !== undefined && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>{task.successCount} successful</span>
                        </div>
                        {task.failureCount! > 0 && (
                          <div className="flex items-center gap-1 text-red-700">
                            <XCircle className="w-4 h-4" />
                            <span>{task.failureCount} failed</span>
                          </div>
                        )}
                        <span className="text-gray-600">
                          Completed at {formatTimestamp(task.completedAt!)}
                        </span>
                      </div>
                    )}
                    
                    {/* Cancel Button */}
                    {task.status === 'running' && (currentRole === 'Executive' || currentRole === 'Manager') && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelTask(task)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancel Task
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
