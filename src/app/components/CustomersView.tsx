import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  Home,
  AlertTriangle,
  CheckCircle,
  Grid3x3,
  List
} from "lucide-react";
import { Unit, mockUnits } from "../data/mockData";

type CustomersViewProps = {
  onViewUnit: (unit: Unit) => void;
  selectedProject: string;
};

type ViewMode = 'grid' | 'list';

export function CustomersView({ onViewUnit, selectedProject }: CustomersViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'overdue' | 'paid'>('all');

  // Get unique customers (buyers)
  const customers = mockUnits
    .filter(u => u.buyer !== null)
    .filter(u => selectedProject === 'All Projects' || u.project === selectedProject)
    .map(unit => ({
      name: unit.buyer!.name,
      contact: unit.buyer!.contact,
      units: mockUnits.filter(u => u.buyer?.name === unit.buyer!.name),
      totalValue: mockUnits
        .filter(u => u.buyer?.name === unit.buyer!.name)
        .reduce((sum, u) => sum + u.sellingPrice, 0),
      totalPaid: mockUnits
        .filter(u => u.buyer?.name === unit.buyer!.name)
        .reduce((sum, u) => {
          if (!u.paymentTerms) return sum;
          return sum + (u.paymentTerms.monthsPaid * u.paymentTerms.monthlyAmount);
        }, 0),
      hasOverdue: mockUnits
        .filter(u => u.buyer?.name === unit.buyer!.name)
        .some(u => u.status === 'Overdue' || u.status === 'At Risk' || u.status === 'Critical')
    }))
    .filter((customer, index, self) => 
      index === self.findIndex(c => c.name === customer.name)
    )
    .filter(c => 
      searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(c => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') return !c.hasOverdue && c.totalPaid < c.totalValue;
      if (filterStatus === 'overdue') return c.hasOverdue;
      if (filterStatus === 'paid') return c.totalPaid >= c.totalValue;
      return true;
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentProgress = (paid: number, total: number) => {
    return Math.min(100, Math.round((paid / total) * 100));
  };

  return (
    <>
      {/* Header */}
      <div style={{ 
        padding: '24px 32px 20px 32px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <h1 style={{ 
          fontSize: '24px',
          fontWeight: 600,
          color: '#111827',
          letterSpacing: '-0.01em',
          lineHeight: '32px',
          marginBottom: '4px'
        }}>
          Customers & Contacts
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: '#6B7280',
          lineHeight: '20px'
        }}>
          Directory of all buyers and their payment status
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '24px'
        }}>
          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Total Customers</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#FEF2F2', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={18} style={{ color: '#EF4444' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {customers.length}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Active buyers
            </p>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Good Standing</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#F0FDF4', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={18} style={{ color: '#10B981' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {customers.filter(c => !c.hasOverdue).length}
            </p>
            <p style={{ fontSize: '13px', color: '#10B981' }}>
              No payment issues
            </p>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Overdue</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#FEF3C7', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {customers.filter(c => c.hasOverdue).length}
            </p>
            <p style={{ fontSize: '13px', color: '#F59E0B' }}>
              Needs follow-up
            </p>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Total Revenue</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#EFF6FF', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={18} style={{ color: '#3B82F6' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {formatCurrency(customers.reduce((sum, c) => sum + c.totalValue, 0))}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              From all customers
            </p>
          </Card>
        </div>

        {/* Filters & Search */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '20px',
          padding: '20px',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9CA3AF' 
            }} />
            <Input
              placeholder="Search customers by name or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'paid', label: 'Fully Paid' }
            ].map(filter => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(filter.value as any)}
                style={{
                  background: filterStatus === filter.value ? '#EF4444' : 'transparent',
                  color: filterStatus === filter.value ? '#FFFFFF' : '#6B7280',
                  borderColor: filterStatus === filter.value ? '#EF4444' : '#E5E7EB'
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            gap: '4px',
            padding: '4px',
            background: '#F3F4F6',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Grid3x3 size={16} style={{ color: viewMode === 'grid' ? '#EF4444' : '#6B7280' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <List size={16} style={{ color: viewMode === 'list' ? '#EF4444' : '#6B7280' }} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Showing <strong>{customers.length}</strong> customer{customers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Customers Display */}
        {viewMode === 'grid' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '20px'
          }}>
            {customers.map(customer => {
              const progress = getPaymentProgress(customer.totalPaid, customer.totalValue);
              
              return (
                <Card 
                  key={customer.name}
                  style={{ 
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    border: '1px solid #E5E7EB'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#EF4444';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                  onClick={() => customer.units.length > 0 && onViewUnit(customer.units[0])}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      {customer.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                        {customer.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '2px' }}>
                        <Phone size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {customer.contact}
                      </p>
                      {customer.hasOverdue && (
                        <Badge className="bg-red-100 text-red-700 border-red-300" style={{ marginTop: '4px' }}>
                          Payment Overdue
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div style={{ 
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>Units Owned</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {customer.units.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>Total Value</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {formatCurrency(customer.totalValue)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>Payment Progress</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                        {progress}%
                      </span>
                    </div>
                    <div style={{ 
                      height: '6px', 
                      background: '#E5E7EB', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        background: customer.hasOverdue ? '#F59E0B' : '#10B981',
                        transition: 'width 300ms ease'
                      }} />
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginTop: '6px'
                    }}>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                        Paid: {formatCurrency(customer.totalPaid)}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                        Balance: {formatCurrency(customer.totalValue - customer.totalPaid)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Contact</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Units</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Total Value</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Paid</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Progress</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => {
                  const progress = getPaymentProgress(customer.totalPaid, customer.totalValue);
                  
                  return (
                    <tr 
                      key={customer.name}
                      style={{ 
                        borderBottom: '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'background 150ms ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => customer.units.length > 0 && onViewUnit(customer.units[0])}
                    >
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {customer.name}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                        {customer.contact}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'center' }}>
                        {customer.units.length}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                        {formatCurrency(customer.totalValue)}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280', textAlign: 'right' }}>
                        {formatCurrency(customer.totalPaid)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ width: '80px', margin: '0 auto' }}>
                          <div style={{ 
                            height: '6px', 
                            background: '#E5E7EB', 
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${progress}%`, 
                              height: '100%', 
                              background: customer.hasOverdue ? '#F59E0B' : '#10B981'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {customer.hasOverdue ? (
                          <Badge className="bg-red-100 text-red-700 border-red-300">
                            Overdue
                          </Badge>
                        ) : progress >= 100 ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            Active
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {customers.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB'
          }}>
            <User size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              No customers found
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </>
  );
}
