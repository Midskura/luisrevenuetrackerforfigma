import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Building2,
  CreditCard,
  Users,
  Bell,
  Settings as SettingsIcon,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Clock,
  DollarSign,
  Percent,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "../data/mockData";

type SettingsViewProps = {
  currentRole: UserRole;
};

export function SettingsView({ currentRole }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<string>('company');
  const [isSaving, setIsSaving] = useState(false);

  // Company Settings State
  const [companyName, setCompanyName] = useState('EL Construction & Development Corp.');
  const [companyEmail, setCompanyEmail] = useState('info@elconstruction.ph');
  const [companyPhone, setCompanyPhone] = useState('+63 2 8123 4567');
  const [companyAddress, setCompanyAddress] = useState('123 Business Ave, Makati City, Metro Manila');
  const [companyWebsite, setCompanyWebsite] = useState('www.elconstruction.ph');

  // Payment Terms State
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [installmentMonths, setInstallmentMonths] = useState('36');
  const [interestRate, setInterestRate] = useState('0');
  const [lateFeePercent, setLateFeePercent] = useState('2');
  const [gracePeriodDays, setGracePeriodDays] = useState('5');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);

  // System Preferences State
  const [currency, setCurrency] = useState('PHP');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timezone, setTimezone] = useState('Asia/Manila');
  const [fiscalYearStart, setFiscalYearStart] = useState('January');

  const isReadOnly = currentRole === 'Encoder';

  const handleSave = (section: string) => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot modify settings'
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${section} settings saved successfully`, {
        description: 'Changes will take effect immediately'
      });
    }, 1000);
  };

  const handleUploadLogo = () => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot modify settings'
      });
      return;
    }

    toast.success('Logo upload initiated', {
      description: 'This feature will be available in the full system'
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure platform settings and preferences
          </p>
        </div>
        
        {isReadOnly && (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Read-Only Access
          </Badge>
        )}
      </div>

      {/* Permission Notice for Encoder */}
      {isReadOnly && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Limited Access
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Your role (Encoder) has view-only access to settings. Contact an Executive or Manager to make changes.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Terms
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Company Information</h3>
                <p className="text-sm text-gray-600">Basic company details and contact information</p>
              </div>
            </div>

            {/* Company Logo */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Company Logo
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">EL</span>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUploadLogo}
                    disabled={isReadOnly}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload New Logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 400x400px, PNG or JPG, max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName" className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <Label htmlFor="companyEmail" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <Label htmlFor="companyPhone" className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number
                </Label>
                <Input
                  id="companyPhone"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="+63 2 8XXX XXXX"
                />
              </div>

              <div>
                <Label htmlFor="companyWebsite" className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  Website
                </Label>
                <Input
                  id="companyWebsite"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="www.company.com"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="companyAddress" className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Business Address
                </Label>
                <Input
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Street, City, Province"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => handleSave('Company')}
                disabled={isSaving || isReadOnly}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Terms Tab */}
        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Default Payment Terms</h3>
                <p className="text-sm text-gray-600">Configure standard payment terms for new units</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="downPayment" className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Down Payment (%)
                </Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage of total price required upfront
                </p>
              </div>

              <div>
                <Label htmlFor="installmentMonths" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Installment Period (Months)
                </Label>
                <Input
                  id="installmentMonths"
                  type="number"
                  value={installmentMonths}
                  onChange={(e) => setInstallmentMonths(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="36"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Standard payment plan duration
                </p>
              </div>

              <div>
                <Label htmlFor="interestRate" className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4 text-gray-500" />
                  Interest Rate (% per annum)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Annual interest rate (0 for no interest)
                </p>
              </div>

              <div>
                <Label htmlFor="lateFee" className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  Late Payment Fee (%)
                </Label>
                <Input
                  id="lateFee"
                  type="number"
                  value={lateFeePercent}
                  onChange={(e) => setLateFeePercent(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage penalty for late payments
                </p>
              </div>

              <div>
                <Label htmlFor="gracePeriod" className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Grace Period (Days)
                </Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  value={gracePeriodDays}
                  onChange={(e) => setGracePeriodDays(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Days before late fee is applied
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Payment Terms Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Example Calculation (₱1,000,000 unit)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Down Payment</p>
                  <p className="font-semibold text-blue-900">
                    ₱{(1000000 * (parseInt(downPaymentPercent) / 100)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Balance</p>
                  <p className="font-semibold text-blue-900">
                    ₱{(1000000 * (1 - parseInt(downPaymentPercent) / 100)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Monthly Payment</p>
                  <p className="font-semibold text-blue-900">
                    ₱{Math.round((1000000 * (1 - parseInt(downPaymentPercent) / 100)) / parseInt(installmentMonths)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Total Duration</p>
                  <p className="font-semibold text-blue-900">
                    {installmentMonths} months ({Math.round(parseInt(installmentMonths) / 12)} years)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => handleSave('Payment Terms')}
                disabled={isSaving || isReadOnly}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600">View and manage system users (Read-only in prototype)</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Add User', { description: 'Available in full system' })}
                disabled={isReadOnly}
              >
                Add User
              </Button>
            </div>

            {/* Users List */}
            <div className="space-y-3">
              {[
                { name: 'Ricardo Santos', email: 'ricardo.santos@elconstruction.ph', role: 'Executive', status: 'Active' },
                { name: 'Ana Martinez', email: 'ana.martinez@elconstruction.ph', role: 'Manager', status: 'Active' },
                { name: 'Juan Reyes', email: 'juan.reyes@elconstruction.ph', role: 'Encoder', status: 'Active' }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      user.role === 'Executive' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                      user.role === 'Manager' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                      'bg-gray-100 text-gray-700 border-gray-300'
                    }>
                      {user.role}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {user.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Edit User', { description: 'Available in full system' })}
                      disabled={isReadOnly}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Full user management including invitations, role assignments, and permissions will be available in the production system.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-600">Configure how and when you receive notifications</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Communication Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive alerts via text message</p>
                      </div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Alert Types */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Alert Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Payment Reminders</p>
                        <p className="text-sm text-gray-600">Notify customers before payment due dates</p>
                      </div>
                    </div>
                    <Switch
                      checked={paymentReminders}
                      onCheckedChange={setPaymentReminders}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Overdue Alerts</p>
                        <p className="text-sm text-gray-600">Alert on missed or late payments</p>
                      </div>
                    </div>
                    <Switch
                      checked={overdueAlerts}
                      onCheckedChange={setOverdueAlerts}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reports */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Scheduled Reports</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Weekly Summary</p>
                        <p className="text-sm text-gray-600">Receive weekly performance reports</p>
                      </div>
                    </div>
                    <Switch
                      checked={weeklyReports}
                      onCheckedChange={setWeeklyReports}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Monthly Reports</p>
                        <p className="text-sm text-gray-600">Detailed monthly analytics and insights</p>
                      </div>
                    </div>
                    <Switch
                      checked={monthlyReports}
                      onCheckedChange={setMonthlyReports}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => handleSave('Notification')}
                disabled={isSaving || isReadOnly}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Preferences</h3>
                <p className="text-sm text-gray-600">Configure regional and display settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currency" className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  Currency
                </Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="PHP">Philippine Peso (₱)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="dateFormat" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Date Format
                </Label>
                <select
                  id="dateFormat"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <Label htmlFor="timezone" className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  Timezone
                </Label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  <option value="Asia/Hong_Kong">Asia/Hong Kong (GMT+8)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="fiscalYear" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Fiscal Year Start
                </Label>
                <select
                  id="fiscalYear"
                  value={fiscalYearStart}
                  onChange={(e) => setFiscalYearStart(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="January">January</option>
                  <option value="April">April</option>
                  <option value="July">July</option>
                  <option value="October">October</option>
                </select>
              </div>
            </div>

            <Separator className="my-6" />

            {/* System Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">System Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Version</p>
                  <p className="font-semibold text-gray-900">Prototype v2.0</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-semibold text-gray-900">Dec 27, 2024</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Database</p>
                  <p className="font-semibold text-gray-900">Mock Data (No DB)</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Environment</p>
                  <p className="font-semibold text-gray-900">Prototype/Demo</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => handleSave('System')}
                disabled={isSaving || isReadOnly}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
