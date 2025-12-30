import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  FileText,
  User,
  Settings,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2,
  Edit,
  LogIn,
  LogOut,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "../data/mockData";

type ActivityLogViewProps = {
  currentRole: UserRole;
};

type ActivityType = 
  | 'payment_recorded'
  | 'payment_edited'
  | 'payment_voided'
  | 'unit_added'
  | 'unit_updated'
  | 'document_uploaded'
  | 'document_deleted'
  | 'user_login'
  | 'user_logout'
  | 'settings_changed'
  | 'report_exported';

type Activity = {
  id: string;
  type: ActivityType;
  description: string;
  user: string;
  userRole: UserRole;
  timestamp: string;
  details?: string;
  amount?: number;
  unitNumber?: string;
  status?: 'success' | 'warning' | 'error';
};

export function ActivityLogView({ currentRole }: ActivityLogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | ActivityType>('all');
  const [filterUser, setFilterUser] = useState<'all' | UserRole>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Mock activity data
  const mockActivities: Activity[] = [
    {
      id: 'act_001',
      type: 'payment_recorded',
      description: 'Recorded payment for Unit B1-L05',
      user: 'Ana Martinez',
      userRole: 'Manager',
      timestamp: '2024-12-27T14:30:00',
      details: 'Monthly installment payment',
      amount: 25000,
      unitNumber: 'B1-L05',
      status: 'success'
    },
    {
      id: 'act_002',
      type: 'unit_added',
      description: 'Added new unit to inventory',
      user: 'Ricardo Santos',
      userRole: 'Executive',
      timestamp: '2024-12-27T13:15:00',
      details: 'Sunrise Villas - Building 3, Lot 20',
      unitNumber: 'B3-L20',
      status: 'success'
    },
    {
      id: 'act_003',
      type: 'document_uploaded',
      description: 'Uploaded contract document',
      user: 'Juan Reyes',
      userRole: 'Encoder',
      timestamp: '2024-12-27T12:45:00',
      details: 'Contract_B2-L12_Final.pdf',
      unitNumber: 'B2-L12',
      status: 'success'
    },
    {
      id: 'act_004',
      type: 'payment_recorded',
      description: 'Recorded payment for Unit B2-L12',
      user: 'Ana Martinez',
      userRole: 'Manager',
      timestamp: '2024-12-27T11:20:00',
      details: 'Down payment - Bank Transfer',
      amount: 120000,
      unitNumber: 'B2-L12',
      status: 'success'
    },
    {
      id: 'act_005',
      type: 'settings_changed',
      description: 'Updated payment terms settings',
      user: 'Ricardo Santos',
      userRole: 'Executive',
      timestamp: '2024-12-27T10:05:00',
      details: 'Changed grace period to 5 days',
      status: 'success'
    },
    {
      id: 'act_006',
      type: 'report_exported',
      description: 'Exported revenue report',
      user: 'Ana Martinez',
      userRole: 'Manager',
      timestamp: '2024-12-27T09:30:00',
      details: 'Monthly_Revenue_Report_Dec2024.pdf',
      status: 'success'
    },
    {
      id: 'act_007',
      type: 'payment_edited',
      description: 'Updated payment details',
      user: 'Ana Martinez',
      userRole: 'Manager',
      timestamp: '2024-12-26T16:45:00',
      details: 'Corrected reference number for Unit B1-L15',
      unitNumber: 'B1-L15',
      status: 'warning'
    },
    {
      id: 'act_008',
      type: 'user_login',
      description: 'User logged into system',
      user: 'Juan Reyes',
      userRole: 'Encoder',
      timestamp: '2024-12-26T08:00:00',
      details: 'Login from 192.168.1.45',
      status: 'success'
    },
    {
      id: 'act_009',
      type: 'payment_recorded',
      description: 'Recorded payment for Unit B3-L08',
      user: 'Juan Reyes',
      userRole: 'Encoder',
      timestamp: '2024-12-25T15:20:00',
      details: 'Monthly installment - GCash',
      amount: 18500,
      unitNumber: 'B3-L08',
      status: 'success'
    },
    {
      id: 'act_010',
      type: 'document_deleted',
      description: 'Deleted outdated document',
      user: 'Ricardo Santos',
      userRole: 'Executive',
      timestamp: '2024-12-25T14:10:00',
      details: 'Old_Contract_Draft_B1-L05.pdf',
      unitNumber: 'B1-L05',
      status: 'error'
    },
    {
      id: 'act_011',
      type: 'unit_updated',
      description: 'Updated unit information',
      user: 'Ana Martinez',
      userRole: 'Manager',
      timestamp: '2024-12-24T11:30:00',
      details: 'Updated customer contact details for B2-L03',
      unitNumber: 'B2-L03',
      status: 'success'
    },
    {
      id: 'act_012',
      type: 'payment_voided',
      description: 'Voided payment transaction',
      user: 'Ricardo Santos',
      userRole: 'Executive',
      timestamp: '2024-12-24T10:15:00',
      details: 'Duplicate payment entry for Unit B1-L15',
      amount: 25000,
      unitNumber: 'B1-L15',
      status: 'error'
    },
    {
      id: 'act_013',
      type: 'payment_recorded',
      description: 'Recorded payment for Unit B2-L03',
      user: 'Juan Reyes',
      userRole: 'Encoder',
      timestamp: '2024-12-23T13:40:00',
      details: 'Monthly installment - Cash',
      amount: 22000,
      unitNumber: 'B2-L03',
      status: 'success'
    },
    {
      id: 'act_014',
      type: 'document_uploaded',
      description: 'Uploaded payment receipt',
      user: 'Juan Reyes',
      userRole: 'Encoder',
      timestamp: '2024-12-23T13:35:00',
      details: 'Receipt_B2-L03_Dec2024.pdf',
      unitNumber: 'B2-L03',
      status: 'success'
    },
    {
      id: 'act_015',
      type: 'user_logout',
      description: 'User logged out',
      user: 'Ana Martinez',
      userRole: 'Manager',
      timestamp: '2024-12-22T18:00:00',
      details: 'Session ended normally',
      status: 'success'
    }
  ];

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'payment_recorded':
      case 'payment_edited':
      case 'payment_voided':
        return DollarSign;
      case 'unit_added':
      case 'unit_updated':
        return FileText;
      case 'document_uploaded':
      case 'document_deleted':
        return Upload;
      case 'user_login':
        return LogIn;
      case 'user_logout':
        return LogOut;
      case 'settings_changed':
        return Settings;
      case 'report_exported':
        return Download;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'payment_recorded':
        return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
      case 'payment_edited':
        return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
      case 'payment_voided':
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
      case 'unit_added':
      case 'unit_updated':
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      case 'document_uploaded':
        return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
      case 'document_deleted':
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
      case 'settings_changed':
        return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
      case 'report_exported':
        return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const getStatusIcon = (status?: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = () => {
    toast.success('Exporting activity log', {
      description: `Activity_Log_${dateRange}.csv`
    });
  };

  // Filter activities
  const filteredActivities = mockActivities.filter(activity => {
    // Search filter
    if (searchQuery && !activity.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.details?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.unitNumber?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType !== 'all' && activity.type !== filterType) {
      return false;
    }

    // User filter
    if (filterUser !== 'all' && activity.userRole !== filterUser) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete audit trail of all system activities
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search activities, units, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex gap-1">
                {(['today', 'week', 'month', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateRange === range
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {range === 'today' ? 'Today' :
                     range === 'week' ? 'This Week' :
                     range === 'month' ? 'This Month' :
                     'All Time'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Type & User Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Activity Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Types</option>
                <option value="payment_recorded">Payment Recorded</option>
                <option value="payment_edited">Payment Edited</option>
                <option value="payment_voided">Payment Voided</option>
                <option value="unit_added">Unit Added</option>
                <option value="unit_updated">Unit Updated</option>
                <option value="document_uploaded">Document Uploaded</option>
                <option value="document_deleted">Document Deleted</option>
                <option value="settings_changed">Settings Changed</option>
                <option value="report_exported">Report Exported</option>
                <option value="user_login">User Login</option>
                <option value="user_logout">User Logout</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">User Role:</span>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Users</option>
                <option value="Executive">Executive</option>
                <option value="Manager">Manager</option>
                <option value="Encoder">Encoder</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredActivities.length}</span> activities
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {filteredActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colors = getActivityColor(activity.type);
          
          return (
            <Card key={activity.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {activity.description}
                        </h3>
                        {activity.status && getStatusIcon(activity.status)}
                      </div>
                      
                      {activity.details && (
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.details}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* User */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-semibold">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-700">{activity.user}</span>
                          <Badge className={
                            activity.userRole === 'Executive' ? 'bg-purple-100 text-purple-700 border-purple-300 text-xs' :
                            activity.userRole === 'Manager' ? 'bg-blue-100 text-blue-700 border-blue-300 text-xs' :
                            'bg-gray-100 text-gray-700 border-gray-300 text-xs'
                          }>
                            {activity.userRole}
                          </Badge>
                        </div>

                        {/* Unit Number */}
                        {activity.unitNumber && (
                          <Badge variant="outline" className="text-xs">
                            {activity.unitNumber}
                          </Badge>
                        )}

                        {/* Amount */}
                        {activity.amount && (
                          <span className="text-sm font-semibold text-green-700">
                            {formatCurrency(activity.amount)}
                          </span>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">
                          <Clock className="w-4 h-4" />
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No activities found</h3>
          <p className="text-sm text-gray-600">
            Try adjusting your filters or search query
          </p>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">
              {mockActivities.filter(a => a.type === 'payment_recorded').length}
            </p>
            <p className="text-sm text-green-600 mt-1">Payments Recorded</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">
              {mockActivities.filter(a => a.type === 'unit_added' || a.type === 'unit_updated').length}
            </p>
            <p className="text-sm text-blue-600 mt-1">Unit Updates</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-700">
              {mockActivities.filter(a => a.type === 'document_uploaded').length}
            </p>
            <p className="text-sm text-purple-600 mt-1">Documents Uploaded</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-700">
              {mockActivities.filter(a => a.type === 'user_login').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">User Sessions</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
