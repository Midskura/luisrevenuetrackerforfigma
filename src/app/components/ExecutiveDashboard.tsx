import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
  Building, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CircleAlert,
  Clock,
  Eye,
  Plus,
  Bell,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import { Unit, mockUnits, PROJECTS, CURRENT_DATE } from "../data/mockData";
import { useState } from "react";
import { PaymentEntryModal } from "./PaymentEntryModal";
import { AddUnitModal } from "./AddUnitModal";

type DashboardProps = {
  onViewUnit: (unit: Unit) => void;
  onViewCollections: () => void;
  selectedProject: string;
  onUnitAdded: (unit: Unit) => void;
};

export function ExecutiveDashboard({ onViewUnit, onViewCollections, selectedProject, onUnitAdded }: DashboardProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [paymentsLoggedToday, setPaymentsLoggedToday] = useState(0);
  const [totalLoggedToday, setTotalLoggedToday] = useState(0);
  
  // Filter units by project
  const filteredUnits = selectedProject === 'All Projects' 
    ? mockUnits 
    : mockUnits.filter(u => u.project === selectedProject);

  // Calculate metrics
  const totalUnits = filteredUnits.length;
  const occupied = filteredUnits.filter(u => 
    ['In Payment Cycle', 'Overdue', 'At Risk', 'Critical', 'Fully Paid'].includes(u.status)
  ).length;
  const inPaymentCycle = filteredUnits.filter(u => u.status === 'In Payment Cycle').length;
  const fullyPaid = filteredUnits.filter(u => u.status === 'Fully Paid').length;
  
  const overdue = filteredUnits.filter(u => u.status === 'Overdue').length;
  const atRisk = filteredUnits.filter(u => u.status === 'At Risk').length;
  const critical = filteredUnits.filter(u => u.status === 'Critical').length;

  // Today's action items
  const today = new Date(CURRENT_DATE);
  const paymentsDueToday = filteredUnits.filter(u => {
    if (!u.paymentTerms?.nextDueDate) return false;
    const dueDate = new Date(u.paymentTerms.nextDueDate);
    return dueDate.toDateString() === today.toDateString();
  }).length;

  const paymentsDueThisWeek = filteredUnits.filter(u => {
    if (!u.paymentTerms?.nextDueDate) return false;
    const dueDate = new Date(u.paymentTerms.nextDueDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  }).length;

  const needsFollowUp = filteredUnits.filter(u => 
    u.paymentTerms?.daysLate && u.paymentTerms.daysLate >= 15
  ).length;

  const moveInsThisWeek = filteredUnits.filter(u => {
    if (!u.moveInDate) return false;
    const moveInDate = new Date(u.moveInDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return moveInDate >= today && moveInDate <= weekFromNow;
  }).length;

  const handlePaymentLogged = (unitId: string, amount: number) => {
    setPaymentsLoggedToday(prev => prev + 1);
    setTotalLoggedToday(prev => prev + amount);
  };

  // Calculate "What Changed Since Yesterday" metrics (mocked with realistic values)
  const yesterdayChanges = {
    movedToAtRisk: 2,
    recovered: 1,
    collected: 85000,
    newlyOverdue: 120000
  };

  // Calculate projected risk (30-day projection)
  const totalCurrentArrears = filteredUnits.reduce((sum, unit) => {
    return sum + (unit.paymentTerms?.arrears || 0);
  }, 0);
  
  const atRiskMonthlyRevenue = filteredUnits
    .filter(u => ['At Risk', 'Overdue', 'Critical'].includes(u.status))
    .reduce((sum, unit) => sum + (unit.paymentTerms?.monthlyAmount || 0), 0);
  
  const projectedRisk30Days = totalCurrentArrears + atRiskMonthlyRevenue;

  // Calculate cash inflow
  const expectedThisMonth = filteredUnits.reduce((sum, unit) => {
    if (unit.paymentTerms && unit.paymentTerms.nextDueDate) {
      return sum + unit.paymentTerms.monthlyAmount;
    }
    return sum;
  }, 0);

  const actualThisMonth = filteredUnits.reduce((sum, unit) => {
    if (unit.paymentTerms && unit.status === 'In Payment Cycle') {
      return sum + unit.paymentTerms.monthlyAmount;
    }
    return sum;
  }, 0);

  // Helper function to get next best action
  const getNextAction = (unit: Unit) => {
    if (!unit.paymentTerms) return 'Monitor (no action yet)';
    
    const daysLate = unit.paymentTerms.daysLate;
    
    if (daysLate >= 90) return 'Escalate to legal';
    if (daysLate >= 45) return 'Schedule in-person meeting';
    if (daysLate >= 15) return 'Call buyer today';
    return 'Send reminder';
  };

  // Identify "silent risk" units (current but showing behavioral drift)
  const silentRiskUnits = filteredUnits.filter(u => {
    if (u.status !== 'In Payment Cycle' || !u.paymentTerms) return false;
    // Mock logic: units with specific patterns that suggest drift
    // In real system: would analyze payment timing consistency
    return u.id === 'U001' || u.id === 'U008'; // Mock examples
  });

  // Status distribution
  const statusCounts = {
    'Available': filteredUnits.filter(u => u.status === 'Available').length,
    'Reserved': filteredUnits.filter(u => u.status === 'Reserved').length,
    'Move-in Scheduled': filteredUnits.filter(u => u.status === 'Move-in Scheduled').length,
    'In Payment Cycle': inPaymentCycle,
    'Overdue': overdue,
    'At Risk': atRisk,
    'Critical': critical,
    'Fully Paid': fullyPaid,
  };

  // Get units needing attention
  const urgentUnits = filteredUnits
    .filter(u => ['Critical', 'Overdue', 'At Risk'].includes(u.status))
    .sort((a, b) => {
      const order = { 'Critical': 0, 'Overdue': 1, 'At Risk': 2 };
      return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    })
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-50 border-red-300';
      case 'Overdue': return 'bg-orange-50 border-orange-300';
      case 'At Risk': return 'bg-amber-50 border-amber-300';
      case 'In Payment Cycle': return 'border-blue-200';
      case 'Fully Paid': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#C94F3D';
      case 'Overdue': return '#C88A2B';
      case 'At Risk': return '#C88A2B';
      case 'In Payment Cycle': return 'var(--neuron-brand-green)';
      case 'Fully Paid': return 'var(--neuron-semantic-success)';
      default: return 'var(--neuron-ink-secondary)';
    }
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Portfolio at a Glance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <Card style={ 
          {
            padding: '18px 20px',
            background: 'var(--neuron-bg-elevated)',
            border: 'none',
            borderRadius: 'var(--neuron-radius-l)',
            boxShadow: 'var(--elevation-1)',
            transition: 'box-shadow 200ms ease-out'
          }
        }
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--neuron-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: '16px',
                marginBottom: '10px'
              }}>
                Total Units
              </p>
              <p style={{ 
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '34px',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {totalUnits}
              </p>
            </div>
            <div style={{ 
              padding: '10px',
              background: '#F5F6F7',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <Building size={20} style={{ color: 'var(--neuron-ink-secondary)' }} />
            </div>
          </div>
        </Card>

        <Card style={ 
          {
            padding: '18px 20px',
            background: 'var(--neuron-bg-elevated)',
            border: 'none',
            borderRadius: 'var(--neuron-radius-l)',
            boxShadow: 'var(--elevation-1)',
            transition: 'box-shadow 200ms ease-out'
          }
        }
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--neuron-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: '16px',
                marginBottom: '10px'
              }}>
                Occupied
              </p>
              <p style={{ 
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--neuron-brand-green)',
                lineHeight: '34px',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {occupied}
              </p>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginTop: '4px',
                lineHeight: '16px'
              }}>
                {((occupied / totalUnits) * 100).toFixed(1)}% occupancy
              </p>
            </div>
            <div style={{ 
              padding: '10px',
              background: 'var(--neuron-brand-green-50)',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <Users size={20} style={{ color: 'var(--neuron-brand-green)' }} />
            </div>
          </div>
        </Card>

        <Card style={ 
          {
            padding: '18px 20px',
            background: 'var(--neuron-bg-elevated)',
            border: 'none',
            borderRadius: 'var(--neuron-radius-l)',
            boxShadow: 'var(--elevation-1)',
            transition: 'box-shadow 200ms ease-out'
          }
        }
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--neuron-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: '16px',
                marginBottom: '10px'
              }}>
                In Payment Cycle
              </p>
              <p style={{ 
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '34px',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {inPaymentCycle}
              </p>
            </div>
            <div style={{ 
              padding: '10px',
              background: '#FEF3E0',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <Clock size={20} style={{ color: '#F59E0B' }} />
            </div>
          </div>
        </Card>

        <Card style={ 
          {
            padding: '18px 20px',
            background: 'var(--neuron-bg-elevated)',
            border: 'none',
            borderRadius: 'var(--neuron-radius-l)',
            boxShadow: 'var(--elevation-1)',
            transition: 'box-shadow 200ms ease-out'
          }
        }
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--neuron-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: '16px',
                marginBottom: '10px'
              }}>
                Fully Paid
              </p>
              <p style={{ 
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--neuron-semantic-success)',
                lineHeight: '34px',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {fullyPaid}
              </p>
            </div>
            <div style={{ 
              padding: '10px',
              background: 'var(--neuron-brand-green-50)',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <TrendingUp size={20} style={{ color: 'var(--neuron-semantic-success)' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Action Items - MOVED UP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: 'none',
          borderRadius: 'var(--neuron-radius-l)',
          boxShadow: 'var(--elevation-1)',
          transition: 'box-shadow 200ms ease-out'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <h2 style={{ 
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            color: 'var(--neuron-ink-primary)',
            marginBottom: '16px',
            lineHeight: '22px'
          }}>
            Today's Action Items
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#FEF3E0',
                  borderRadius: 'var(--neuron-radius-s)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bell size={16} style={{ color: 'var(--neuron-semantic-warn)' }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Payments Due Today
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-semantic-warn)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {paymentsDueToday}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--neuron-brand-green-50)',
                  borderRadius: 'var(--neuron-radius-s)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={16} style={{ color: 'var(--neuron-brand-green)' }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Payments Due This Week
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-ink-secondary)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {paymentsDueThisWeek}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#FED7AA',
                  borderRadius: 'var(--neuron-radius-s)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Phone size={16} style={{ color: '#EA580C' }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Needs Follow-up
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#EA580C',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {needsFollowUp}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--neuron-brand-green-50)',
                  borderRadius: 'var(--neuron-radius-s)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={16} style={{ color: 'var(--neuron-brand-green)' }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Move-ins This Week
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-ink-secondary)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {moveInsThisWeek}
              </span>
            </div>
          </div>
        </Card>

        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: 'none',
          borderRadius: 'var(--neuron-radius-l)',
          boxShadow: 'var(--elevation-1)',
          transition: 'box-shadow 200ms ease-out'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <h2 style={{ 
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            color: 'var(--neuron-ink-primary)',
            marginBottom: '16px',
            lineHeight: '22px'
          }}>
            Today's Payments
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--neuron-brand-green-50)',
                  borderRadius: 'var(--neuron-radius-s)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={16} style={{ color: 'var(--neuron-semantic-success)' }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Payments Logged Today
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-semantic-success)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {paymentsLoggedToday}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--neuron-brand-green-50)',
                  borderRadius: 'var(--neuron-radius-s)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DollarSign size={16} style={{ color: 'var(--neuron-semantic-success)' }} />
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Total Logged Today
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-semantic-success)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{totalLoggedToday.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              style={{
                width: '100%',
                marginTop: '12px',
                background: 'var(--neuron-brand-green)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--neuron-radius-pill)',
                height: '44px',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 200ms ease-out',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(22, 160, 133, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--neuron-brand-green-600)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(22, 160, 133, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--neuron-brand-green)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(22, 160, 133, 0.2)';
              }}
            >
              Log Payment
            </Button>
          </div>
        </Card>
      </div>

      {/* Since Yesterday Panel */}
      <Card style={{ 
        padding: '20px 24px',
        background: 'var(--neuron-bg-elevated)',
        border: 'none',
        borderRadius: 'var(--neuron-radius-l)',
        boxShadow: 'var(--elevation-1)',
        marginBottom: '20px',
        transition: 'box-shadow 200ms ease-out'
      }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#F5F6F7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={20} style={{ color: 'var(--neuron-ink-secondary)' }} />
            </div>
            <h2 style={{ 
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              color: 'var(--neuron-ink-primary)',
              lineHeight: '24px'
            }}>
              Since Yesterday
            </h2>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--neuron-ink-muted)',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            Daily Briefing
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {/* Moved to At Risk */}
          <div style={{ 
            padding: '14px 16px',
            background: 'white',
            borderRadius: 'var(--neuron-radius-s)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={16} style={{ color: '#D97706' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#D97706', lineHeight: '24px', fontVariantNumeric: 'tabular-nums' }}>
                +{yesterdayChanges.movedToAtRisk}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--neuron-ink-muted)', lineHeight: '16px' }}>
              moved to At Risk
            </p>
          </div>

          {/* Recovered */}
          <div style={{ 
            padding: '14px 16px',
            background: 'white',
            borderRadius: 'var(--neuron-radius-s)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowDownCircle size={16} style={{ color: 'var(--neuron-semantic-success)' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--neuron-semantic-success)', lineHeight: '24px', fontVariantNumeric: 'tabular-nums' }}>
                −{yesterdayChanges.recovered}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--neuron-ink-muted)', lineHeight: '16px' }}>
              recovered
            </p>
          </div>

          {/* Collected */}
          <div style={{ 
            padding: '14px 16px',
            background: 'white',
            borderRadius: 'var(--neuron-radius-s)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={16} style={{ color: 'var(--neuron-semantic-success)' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--neuron-semantic-success)', lineHeight: '24px', fontVariantNumeric: 'tabular-nums' }}>
                +₱{Math.round(yesterdayChanges.collected / 1000)}k
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--neuron-ink-muted)', lineHeight: '16px' }}>
              collected
            </p>
          </div>

          {/* Newly Overdue */}
          <div style={{ 
            padding: '14px 16px',
            background: 'white',
            borderRadius: 'var(--neuron-radius-s)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowUpCircle size={16} style={{ color: '#EA580C' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#EA580C', lineHeight: '24px', fontVariantNumeric: 'tabular-nums' }}>
                +₱{Math.round(yesterdayChanges.newlyOverdue / 1000)}k
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--neuron-ink-muted)', lineHeight: '16px' }}>
              newly overdue
            </p>
          </div>
        </div>
      </Card>

      {/* Risk Radar & Cash Inflow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {/* Risk Radar */}
        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: 'none',
          borderRadius: 'var(--neuron-radius-l)',
          boxShadow: 'var(--elevation-1)',
          transition: 'box-shadow 200ms ease-out'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CircleAlert size={18} style={{ color: 'var(--neuron-semantic-danger)' }} />
            <h2 style={{ 
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              color: 'var(--neuron-ink-primary)',
              lineHeight: '22px'
            }}>
              Risk Radar
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#FEE2E2',
              border: 'none',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: '#DC2626', borderRadius: '50%' }}></div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Critical
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#DC2626',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {critical}
              </span>
            </div>

            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#FED7AA',
              border: 'none',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: '#EA580C', borderRadius: '50%' }}></div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  Overdue
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#EA580C',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {overdue}
              </span>
            </div>

            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#FEF3C7',
              border: 'none',
              borderRadius: 'var(--neuron-radius-s)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: '#D97706', borderRadius: '50%' }}></div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '20px'
                }}>
                  At Risk
                </span>
              </div>
              <span style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#D97706',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {atRisk}
              </span>
            </div>
          </div>

          <Button 
            onClick={onViewCollections}
            style={{
              width: '100%',
              marginTop: '16px',
              background: 'var(--neuron-brand-green)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--neuron-radius-pill)',
              height: '44px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 200ms ease-out',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(22, 160, 133, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--neuron-brand-green-600)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(22, 160, 133, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--neuron-brand-green)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(22, 160, 133, 0.2)';
            }}
          >
            View All Collections
          </Button>

          {/* Projected Risk Indicator */}
          <div style={{
            marginTop: '14px',
            padding: '12px 16px',
            background: '#FEF3E0',
            border: '1px solid #F59E0B',
            borderRadius: 'var(--neuron-radius-s)'
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--neuron-semantic-warn)',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.04em',
              marginBottom: '6px',
              lineHeight: '16px'
            }}>
              Projected Exposure (30 days)
            </p>
            <p style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#EA580C',
              lineHeight: '28px',
              letterSpacing: '-0.015em',
              fontVariantNumeric: 'tabular-nums'
            }}>
              ₱{(projectedRisk30Days / 1000000).toFixed(2)}M
            </p>
            <p style={{
              fontSize: '11px',
              color: 'var(--neuron-ink-muted)',
              marginTop: '4px',
              lineHeight: '16px'
            }}>
              Conservative projection based on delinquency velocity
            </p>
          </div>
        </Card>

        {/* Cash Inflow Snapshot */}
        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: 'none',
          borderRadius: 'var(--neuron-radius-l)',
          boxShadow: 'var(--elevation-1)',
          transition: 'box-shadow 200ms ease-out'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <DollarSign size={18} style={{ color: 'var(--neuron-semantic-success)' }} />
            <h2 style={{ 
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              color: 'var(--neuron-ink-primary)',
              lineHeight: '22px'
            }}>
              Cash Inflow (This Month)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ 
                fontSize: '11px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '6px',
                lineHeight: '16px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.04em'
              }}>
                Expected
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{expectedThisMonth.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div>
              <p style={{ 
                fontSize: '11px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '6px',
                lineHeight: '16px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.04em'
              }}>
                Actual (On-time)
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--neuron-semantic-success)',
                lineHeight: '30px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{actualThisMonth.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--neuron-ui-divider)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '14px',
                  color: 'var(--neuron-ink-muted)',
                  lineHeight: '20px'
                }}>
                  Collection Rate
                </span>
                <span style={{ 
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '24px',
                  letterSpacing: '-0.01em',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {((actualThisMonth / expectedThisMonth) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ 
                width: '100%',
                background: '#E5E7EB',
                borderRadius: 'var(--neuron-radius-pill)',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    background: 'var(--neuron-semantic-success)',
                    height: '8px',
                    borderRadius: 'var(--neuron-radius-pill)',
                    transition: 'width 300ms ease-out',
                    width: `${Math.min((actualThisMonth / expectedThisMonth) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Distribution & Units Needing Attention */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Status Distribution */}
        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: 'none',
          borderRadius: 'var(--neuron-radius-l)',
          boxShadow: 'var(--elevation-1)',
          transition: 'box-shadow 200ms ease-out'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <h2 style={{ 
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'Poppins, sans-serif',
            color: 'var(--neuron-ink-primary)',
            marginBottom: '16px',
            lineHeight: '22px'
          }}>
            Unit Status Distribution
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(status)} border`}
                    style={{ 
                      borderRadius: 'var(--neuron-radius-pill)',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: getStatusTextColor(status)
                    }}
                  >
                    {status}
                  </Badge>
                </div>
                <span style={{ 
                  fontWeight: 600,
                  color: 'var(--neuron-ink-primary)',
                  fontSize: '16px',
                  lineHeight: '22px',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Units Needing Attention */}
        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: 'none',
          borderRadius: 'var(--neuron-radius-l)',
          boxShadow: 'var(--elevation-1)',
          transition: 'box-shadow 200ms ease-out'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-2)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = 'var(--elevation-1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ 
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              color: 'var(--neuron-ink-primary)',
              lineHeight: '22px'
            }}>
              Units Needing Attention
            </h2>
            
            {/* Add Unit Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <Button
                onClick={() => setIsAddUnitModalOpen(true)}
                variant="ghost"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  height: 'auto',
                  background: 'transparent',
                  color: 'var(--neuron-brand-green)',
                  border: '1px solid var(--neuron-brand-green)',
                  borderRadius: 'var(--neuron-radius-s)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 120ms ease-out'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--neuron-brand-green-50)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Plus size={14} />
                Add Unit
              </Button>
              <span style={{
                fontSize: '11px',
                color: 'var(--neuron-ink-muted)',
                lineHeight: '16px'
              }}>
                One-time setup per unit
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {urgentUnits.length === 0 ? (
              <p style={{ 
                fontSize: '14px',
                color: 'var(--neuron-ink-muted)',
                textAlign: 'center',
                padding: '16px 0',
                lineHeight: '20px'
              }}>
                No urgent units
              </p>
            ) : (
              urgentUnits.map(unit => (
                <div 
                  key={unit.id}
                  onClick={() => onViewUnit(unit)}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--neuron-state-hover)',
                    border: 'none',
                    borderRadius: 'var(--neuron-radius-s)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease-out'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--neuron-state-selected)';
                    e.currentTarget.style.boxShadow = 'var(--elevation-1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--neuron-state-hover)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ 
                        fontWeight: 600,
                        color: 'var(--neuron-ink-primary)',
                        fontSize: '14px',
                        lineHeight: '20px'
                      }}>
                        {unit.blockLot}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(unit.status)} border`}
                        style={{ 
                          borderRadius: 'var(--neuron-radius-pill)',
                          padding: '2px 8px',
                          fontSize: '10px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: getStatusTextColor(unit.status)
                        }}
                      >
                        {unit.status}
                      </Badge>
                    </div>
                    <p style={{ 
                      fontSize: '13px',
                      color: 'var(--neuron-ink-secondary)',
                      lineHeight: '18px'
                    }}>
                      {unit.buyer?.name}
                    </p>
                    {unit.paymentTerms && (
                      <p style={{ 
                        fontSize: '12px',
                        color: 'var(--neuron-ink-muted)',
                        marginTop: '3px',
                        lineHeight: '16px'
                      }}>
                        {unit.paymentTerms.daysLate} days late • ₱{unit.paymentTerms.arrears.toLocaleString('en-PH')} arrears
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" style={{ padding: '8px' }}>
                    <Eye size={16} style={{ color: 'var(--neuron-ink-muted)' }} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Payment Entry Modal */}
      <PaymentEntryModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentLogged={handlePaymentLogged}
      />

      {/* Add Unit Modal */}
      <AddUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        onUnitAdded={onUnitAdded}
        selectedProject={selectedProject}
      />
    </div>
  );
}