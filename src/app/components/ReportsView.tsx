import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  FileText,
  PieChart as PieChartIcon,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { mockUnits, PROJECTS } from "../data/mockData";

type ReportsViewProps = {
  selectedProject: string;
};

export function ReportsView({ selectedProject }: ReportsViewProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [reportType, setReportType] = useState<'revenue' | 'collections' | 'performance'>('revenue');

  // Filter units by project
  const filteredUnits = selectedProject === 'All Projects' 
    ? mockUnits 
    : mockUnits.filter(u => u.project === selectedProject);

  // Calculate real project performance from mockUnits
  const projectData = PROJECTS.map(projectName => {
    const projectUnits = mockUnits.filter(u => u.project === projectName);
    const totalUnits = projectUnits.length;
    
    // Calculate total collected (all payments made so far)
    const collected = projectUnits.reduce((sum, unit) => {
      if (!unit.paymentTerms) return sum;
      return sum + (unit.paymentTerms.monthsPaid * unit.paymentTerms.monthlyAmount);
    }, 0);
    
    // Calculate target (total selling price of all units with buyers)
    const target = projectUnits
      .filter(u => u.buyer !== null)
      .reduce((sum, unit) => sum + unit.sellingPrice, 0);
    
    // Calculate collection rate
    const rate = target > 0 ? Math.round((collected / target) * 100) : 0;
    
    return {
      project: projectName,
      units: totalUnits,
      collected,
      target,
      rate
    };
  });

  // Mock revenue data - REALISTIC NARRATIVE WITH PROBLEMS THROUGHOUT 2025
  // Shows multiple collection issues across different periods, some resolved, some ongoing
  // Mar: 2 units late (resolved by May) | Jun: 3 units late (resolved by Aug) | Sep-Dec: Current crisis (unresolved)
  const revenueData = [
    { month: 'Feb 25', revenue: 520000, target: 500000, collections: 515000 }, // Healthy start
    { month: 'Mar 25', revenue: 420000, target: 500000, collections: 390000 }, // DIP: 2 units late (-₱80k)
    { month: 'Apr 25', revenue: 480000, target: 550000, collections: 450000 }, // Still affected, partial payments
    { month: 'May 25', revenue: 590000, target: 600000, collections: 580000 }, // RECOVERY: Caught up payments
    { month: 'Jun 25', revenue: 480000, target: 650000, collections: 450000 }, // DIP: 3 different units late (-₱120k)
    { month: 'Jul 25', revenue: 620000, target: 700000, collections: 600000 }, // Partial recovery
    { month: 'Aug 25', revenue: 780000, target: 750000, collections: 770000 }, // RECOVERY: All caught up, strong month
    { month: 'Sep 25', revenue: 650000, target: 750000, collections: 620000 }, // NEW CRISIS: Sandra stops (-₱30k)
    { month: 'Oct 25', revenue: 580000, target: 700000, collections: 540000 }, // Deteriorating (-₱60k)
    { month: 'Nov 25', revenue: 480000, target: 700000, collections: 420000 }, // 3 overdue units miss (-₱135k)
    { month: 'Dec 25', revenue: 380000, target: 650000, collections: 340000 }, // 5 at-risk units miss (-₱180k)
    { month: 'Jan 26', revenue: 420000, target: 650000, collections: 380000 }  // Current: Still struggling
  ];

  // Mock payment method breakdown
  const paymentMethodData = [
    { name: 'Bank Transfer', value: 45, amount: 3200000, color: '#EF4444' },
    { name: 'GCash', value: 25, amount: 1780000, color: '#F59E0B' },
    { name: 'Cash', value: 15, amount: 1070000, color: '#10B981' },
    { name: 'Check', value: 10, amount: 710000, color: '#3B82F6' },
    { name: 'Credit Card', value: 5, amount: 355000, color: '#8B5CF6' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exporting report as ${format.toUpperCase()}`, {
      description: `Report_${reportType}_${dateRange}.${format}`
    });
  };

  // Calculate summary metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTarget = revenueData.reduce((sum, item) => sum + item.target, 0);
  const achievementRate = ((totalRevenue / totalTarget) * 100).toFixed(1);
  const totalCollections = revenueData.reduce((sum, item) => sum + item.collections, 0);
  const collectionRate = ((totalCollections / totalRevenue) * 100).toFixed(1);

  // Calculate portfolio average collection rate from real data
  const portfolioAverageRate = projectData.length > 0
    ? (projectData.reduce((sum, p) => sum + p.rate, 0) / projectData.length).toFixed(1)
    : '0.0';

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedProject === 'All Projects' 
              ? 'Portfolio-wide performance metrics' 
              : `${selectedProject} performance`}
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            <div className="flex gap-1 ml-2">
              {(['7d', '30d', '90d', '12m'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range === '7d' ? 'Last 7 Days' :
                   range === '30d' ? 'Last 30 Days' :
                   range === '90d' ? 'Last 90 Days' :
                   'Last 12 Months'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Report Type:</span>
            <div className="flex gap-1 ml-2">
              {(['revenue', 'collections', 'performance'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    reportType === type
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xs text-gray-500">Last 12 Months</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">-35% recent decline</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achievement Rate</p>
              <p className="text-xs text-gray-500">vs Annual Target</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{achievementRate}%</p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-600 font-medium">Below target (Q4)</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Collections</p>
              <p className="text-xs text-gray-500">Actual received</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCollections)}</p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm text-orange-600 font-medium">{collectionRate}% collection rate</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jan 26 Revenue</p>
              <p className="text-xs text-gray-500">Current month</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(420000)}</p>
          <div className="mt-2 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">-35% vs target</span>
          </div>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Revenue & Collections Trend</h3>
            <p className="text-sm text-gray-600 mt-1">Monthly performance over the last 12 months</p>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            12 Month View
          </Badge>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₱${(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#EF4444" 
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#EF4444', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#9CA3AF" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
              dot={{ fill: '#9CA3AF', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="collections" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Collections"
              dot={{ fill: '#10B981', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-red-600" />
                Payment Method Distribution
              </h3>
              <p className="text-sm text-gray-600 mt-1">Total: {formatCurrency(7115000)}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}% (${formatCurrency(props.payload.amount)})`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {paymentMethodData.map((method) => (
              <div key={method.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: method.color }}
                  />
                  <span className="text-gray-700">{method.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{method.value}%</span>
                  <span className="font-medium text-gray-900">{formatCurrency(method.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Project Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-600" />
                Project Performance
              </h3>
              <p className="text-sm text-gray-600 mt-1">Collection rates by project</p>
            </div>
          </div>

          <div className="space-y-5">
            {projectData.map((project) => (
              <div key={project.project}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{project.project}</p>
                    <p className="text-xs text-gray-600">{project.units} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(project.collected)}</p>
                    <p className="text-xs text-gray-600">of {formatCurrency(project.target)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{ width: `${project.rate}%` }}
                    />
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                    {project.rate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Portfolio Average:</span>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              {portfolioAverageRate}%
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}