import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Mail,
  MessageSquare,
  Send,
  Edit,
  Copy,
  Trash2,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Filter,
  Search,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "../data/mockData";

type CommunicationsViewProps = {
  currentRole: UserRole;
};

type TemplateType = 'sms' | 'email';
type TemplateTrigger = 'payment_reminder' | 'payment_received' | 'overdue_alert' | 'welcome' | 'statement' | 'custom';

type Template = {
  id: string;
  name: string;
  type: TemplateType;
  trigger: TemplateTrigger;
  subject?: string;
  content: string;
  isActive: boolean;
  lastModified: string;
  modifiedBy: string;
  usageCount: number;
};

type CampaignStatus = 'draft' | 'scheduled' | 'sent';

type Campaign = {
  id: string;
  name: string;
  type: TemplateType;
  template: string;
  recipients: number;
  scheduledFor?: string;
  status: CampaignStatus;
  sentAt?: string;
  deliveryRate?: number;
};

export function CommunicationsView({ currentRole }: CommunicationsViewProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns'>('templates');
  const [filterType, setFilterType] = useState<'all' | TemplateType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const isReadOnly = currentRole === 'Encoder';

  // Mock templates
  const mockTemplates: Template[] = [
    {
      id: 'tpl_001',
      name: 'Payment Reminder - 3 Days Before',
      type: 'sms',
      trigger: 'payment_reminder',
      content: 'Hi {customer_name}! This is a friendly reminder that your payment of {amount} for Unit {unit_number} is due on {due_date}. Thank you! - EL Construction',
      isActive: true,
      lastModified: '2024-12-20T10:30:00',
      modifiedBy: 'Ana Martinez',
      usageCount: 245
    },
    {
      id: 'tpl_002',
      name: 'Payment Received Confirmation',
      type: 'email',
      trigger: 'payment_received',
      subject: 'Payment Received - Unit {unit_number}',
      content: 'Dear {customer_name},\n\nThank you for your payment of {amount} received on {payment_date}.\n\nUnit: {unit_number}\nOR Number: {or_number}\nPayment Method: {payment_method}\n\nYour updated balance is {remaining_balance}.\n\nBest regards,\nEL Construction Team',
      isActive: true,
      lastModified: '2024-12-18T14:20:00',
      modifiedBy: 'Ricardo Santos',
      usageCount: 892
    },
    {
      id: 'tpl_003',
      name: 'Overdue Payment Alert',
      type: 'sms',
      trigger: 'overdue_alert',
      content: 'URGENT: Your payment for Unit {unit_number} is now {days_overdue} days overdue. Amount due: {amount}. Please settle immediately to avoid penalties. Call us at 8123-4567.',
      isActive: true,
      lastModified: '2024-12-15T09:45:00',
      modifiedBy: 'Ana Martinez',
      usageCount: 127
    },
    {
      id: 'tpl_004',
      name: 'Welcome New Buyer',
      type: 'email',
      trigger: 'welcome',
      subject: 'Welcome to EL Construction - Unit {unit_number}',
      content: 'Dear {customer_name},\n\nCongratulations on your purchase of Unit {unit_number}!\n\nWe are excited to have you as part of the EL Construction family. Your customer portal is now active at portal.elconstruction.ph\n\nLogin credentials:\nUsername: {email}\nPassword: {temp_password}\n\nPlease change your password upon first login.\n\nWarm regards,\nEL Construction Team',
      isActive: true,
      lastModified: '2024-12-10T16:00:00',
      modifiedBy: 'Ricardo Santos',
      usageCount: 43
    },
    {
      id: 'tpl_005',
      name: 'Monthly Statement Available',
      type: 'email',
      trigger: 'statement',
      subject: 'Your Monthly Statement - {month} {year}',
      content: 'Dear {customer_name},\n\nYour monthly statement for {month} {year} is now available.\n\nUnit: {unit_number}\nTotal Paid This Month: {monthly_paid}\nRemaining Balance: {remaining_balance}\nNext Payment Due: {next_due_date}\n\nView your full statement in the customer portal.\n\nThank you,\nEL Construction Team',
      isActive: true,
      lastModified: '2024-12-05T11:30:00',
      modifiedBy: 'Ana Martinez',
      usageCount: 324
    },
    {
      id: 'tpl_006',
      name: 'Payment Reminder - Day Before',
      type: 'sms',
      trigger: 'payment_reminder',
      content: 'Reminder: Your payment of {amount} for Unit {unit_number} is due TOMORROW {due_date}. Pay online or visit our office. Thank you! - EL Construction',
      isActive: true,
      lastModified: '2024-11-28T13:15:00',
      modifiedBy: 'Ana Martinez',
      usageCount: 198
    },
    {
      id: 'tpl_007',
      name: 'Holiday Greeting',
      type: 'sms',
      trigger: 'custom',
      content: 'Season\'s Greetings from EL Construction! Wishing you and your family a blessed Christmas and prosperous New Year. Thank you for your trust in us.',
      isActive: false,
      lastModified: '2024-11-20T10:00:00',
      modifiedBy: 'Ricardo Santos',
      usageCount: 15
    }
  ];

  // Mock campaigns
  const mockCampaigns: Campaign[] = [
    {
      id: 'cmp_001',
      name: 'December Payment Reminders',
      type: 'sms',
      template: 'Payment Reminder - 3 Days Before',
      recipients: 156,
      scheduledFor: '2024-12-28T08:00:00',
      status: 'scheduled',
      deliveryRate: 0
    },
    {
      id: 'cmp_002',
      name: 'Q4 2024 Statements',
      type: 'email',
      template: 'Monthly Statement Available',
      recipients: 289,
      status: 'sent',
      sentAt: '2024-12-01T09:00:00',
      deliveryRate: 97.2
    },
    {
      id: 'cmp_003',
      name: 'Overdue Accounts Follow-up',
      type: 'sms',
      template: 'Overdue Payment Alert',
      recipients: 23,
      status: 'sent',
      sentAt: '2024-12-15T10:00:00',
      deliveryRate: 100
    },
    {
      id: 'cmp_004',
      name: 'New Year Greetings 2025',
      type: 'sms',
      template: 'Holiday Greeting',
      recipients: 342,
      status: 'draft',
      scheduledFor: '2024-12-31T00:00:00'
    }
  ];

  const getTriggerLabel = (trigger: TemplateTrigger) => {
    switch (trigger) {
      case 'payment_reminder': return 'Payment Reminder';
      case 'payment_received': return 'Payment Received';
      case 'overdue_alert': return 'Overdue Alert';
      case 'welcome': return 'Welcome';
      case 'statement': return 'Statement';
      case 'custom': return 'Custom';
    }
  };

  const getTriggerColor = (trigger: TemplateTrigger) => {
    switch (trigger) {
      case 'payment_reminder': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'payment_received': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'overdue_alert': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'welcome': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      case 'statement': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'custom': return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'draft': return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
      case 'scheduled': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'sent': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateTemplate = () => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot create templates'
      });
      return;
    }

    toast.success('Template editor opened', {
      description: 'This feature will be available in the full system'
    });
  };

  const handleEditTemplate = (template: Template) => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot edit templates'
      });
      return;
    }

    setSelectedTemplate(template);
    toast.info(`Editing: ${template.name}`, {
      description: 'Template editor will be available in full system'
    });
  };

  const handleDuplicateTemplate = (template: Template) => {
    toast.success('Template duplicated', {
      description: `Created copy of "${template.name}"`
    });
  };

  const handleDeleteTemplate = (template: Template) => {
    if (currentRole !== 'Executive') {
      toast.error('Permission Denied', {
        description: 'Only Executives can delete templates'
      });
      return;
    }

    toast.success('Template deleted', {
      description: `"${template.name}" has been removed`
    });
  };

  const handleToggleTemplate = (template: Template) => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot modify templates'
      });
      return;
    }

    toast.success(template.isActive ? 'Template deactivated' : 'Template activated', {
      description: template.name
    });
  };

  const handleCreateCampaign = () => {
    if (isReadOnly) {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot create campaigns'
      });
      return;
    }

    toast.success('Campaign wizard opened', {
      description: 'Configure recipients, schedule, and template'
    });
  };

  const handleSendCampaign = (campaign: Campaign) => {
    if (currentRole === 'Encoder') {
      toast.error('Permission Denied', {
        description: 'Encoder role cannot send campaigns'
      });
      return;
    }

    toast.success('Campaign sent', {
      description: `${campaign.recipients} messages queued for delivery`
    });
  };

  // Filter templates
  const filteredTemplates = mockTemplates.filter(template => {
    if (filterType !== 'all' && template.type !== filterType) return false;
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !template.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage SMS and email templates for automated customer communications
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === 'templates' && (
            <Button
              onClick={handleCreateTemplate}
              disabled={isReadOnly}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          )}
          {activeTab === 'campaigns' && (
            <Button
              onClick={handleCreateCampaign}
              disabled={isReadOnly}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Send className="w-4 h-4" />
              New Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockTemplates.filter(t => t.type === 'sms').length}
              </p>
              <p className="text-sm text-gray-600">SMS Templates</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockTemplates.filter(t => t.type === 'email').length}
              </p>
              <p className="text-sm text-gray-600">Email Templates</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockTemplates.filter(t => t.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Send className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCampaigns.filter(c => c.status === 'sent').length}
              </p>
              <p className="text-sm text-gray-600">Sent Campaigns</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates ({mockTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Campaigns ({mockCampaigns.length})
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <div className="flex gap-1">
                  {(['all', 'sms', 'email'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterType === type
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'sms' ? 'SMS' : 'Email'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> templates
              </div>
            </div>
          </Card>

          {/* Templates List */}
          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              const triggerColors = getTriggerColor(template.trigger);
              
              return (
                <Card key={template.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${template.type === 'sms' ? 'bg-blue-50' : 'bg-purple-50'} flex items-center justify-center flex-shrink-0`}>
                      {template.type === 'sms' ? (
                        <MessageSquare className={`w-6 h-6 ${template.type === 'sms' ? 'text-blue-600' : 'text-purple-600'}`} />
                      ) : (
                        <Mail className="w-6 h-6 text-purple-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {template.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${triggerColors.bg} ${triggerColors.text} ${triggerColors.border} text-xs`}>
                              {getTriggerLabel(template.trigger)}
                            </Badge>
                            <Badge className={template.isActive ? 'bg-green-100 text-green-700 border-green-300 text-xs' : 'bg-gray-100 text-gray-700 border-gray-300 text-xs'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {template.subject && (
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Subject: {template.subject}
                        </p>
                      )}

                      <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                        <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                          {template.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{template.usageCount} sent</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Modified {formatTimestamp(template.lastModified)}</span>
                          </div>
                          <span>by {template.modifiedBy}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleTemplate(template)}
                            disabled={isReadOnly}
                          >
                            {template.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                            disabled={isReadOnly}
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          {currentRole === 'Executive' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6 mt-6">
          <div className="space-y-3">
            {mockCampaigns.map((campaign) => {
              const statusColors = getStatusColor(campaign.status);
              
              return (
                <Card key={campaign.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${campaign.type === 'sms' ? 'bg-blue-50' : 'bg-purple-50'} flex items-center justify-center flex-shrink-0`}>
                      <Send className={`w-6 h-6 ${campaign.type === 'sms' ? 'text-blue-600' : 'text-purple-600'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {campaign.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} text-xs`}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {campaign.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendCampaign(campaign)}
                            disabled={currentRole === 'Encoder'}
                            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send Now
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Template</p>
                          <p className="text-sm font-medium text-gray-900">{campaign.template}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Recipients</p>
                          <p className="text-sm font-medium text-gray-900">{campaign.recipients} customers</p>
                        </div>
                        {campaign.status === 'scheduled' && campaign.scheduledFor && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Scheduled For</p>
                            <p className="text-sm font-medium text-gray-900">{formatTimestamp(campaign.scheduledFor)}</p>
                          </div>
                        )}
                        {campaign.status === 'sent' && campaign.sentAt && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Sent At</p>
                            <p className="text-sm font-medium text-gray-900">{formatTimestamp(campaign.sentAt)}</p>
                          </div>
                        )}
                        {campaign.deliveryRate !== undefined && campaign.deliveryRate > 0 && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Delivery Rate</p>
                            <p className="text-sm font-medium text-green-700">{campaign.deliveryRate}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}