import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Unit } from "../data/mockData";
import { Building, Users, DollarSign, Clock, CircleAlert } from "lucide-react";
import { RecordPaymentModal, PaymentRecord } from "./payments/RecordPaymentModal";
import { PaymentSchedule } from "./payments/PaymentSchedule";
import { PaymentHistory, PaymentHistoryRecord } from "./payments/PaymentHistory";
import { PaymentDetailModal } from "./payments/PaymentDetailModal";

type UnitDetailProps = {
  unit: Unit;
  onBack: () => void;
  onUpdateUnit?: (unit: Unit) => void;
};

export function UnitDetailView({ unit, onBack, onUpdateUnit }: UnitDetailProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryRecord | null>(null);
  const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);

  const handlePaymentRecorded = (payment: PaymentRecord) => {
    setPayments(prev => [payment, ...prev]);
    setIsPaymentModalOpen(false);
    
    // Update unit payment schedule
    if (unit.paymentTerms && onUpdateUnit) {
      const monthlyAmount = unit.paymentTerms.monthlyAmount;
      const paymentAmount = payment.amount;
      
      // Calculate how many months this payment covers
      let remainingPayment = paymentAmount;
      let monthsPaidCount = 0;
      
      // Start from the first unpaid month
      const schedule = unit.paymentTerms.schedule || [];
      let updatedSchedule = [...schedule];
      
      for (let i = 0; i < updatedSchedule.length; i++) {
        if (updatedSchedule[i].status === 'Unpaid' && remainingPayment >= monthlyAmount) {
          updatedSchedule[i] = { ...updatedSchedule[i], status: 'Paid', paidDate: payment.paymentDate };
          remainingPayment -= monthlyAmount;
          monthsPaidCount++;
        } else if (updatedSchedule[i].status === 'Unpaid' && remainingPayment > 0) {
          // Partial payment
          updatedSchedule[i] = { ...updatedSchedule[i], status: 'Partial', partialAmount: remainingPayment };
          remainingPayment = 0;
          break;
        } else if (remainingPayment <= 0) {
          break;
        }
      }
      
      // Update the unit
      const updatedUnit: Unit = {
        ...unit,
        paymentTerms: {
          ...unit.paymentTerms,
          monthsPaid: unit.paymentTerms.monthsPaid + monthsPaidCount,
          arrears: Math.max(0, unit.paymentTerms.arrears - paymentAmount),
          schedule: updatedSchedule
        }
      };
      
      onUpdateUnit(updatedUnit);
    }
  };

  const handleViewPaymentDetail = (payment: PaymentHistoryRecord) => {
    setSelectedPayment(payment);
    setIsPaymentDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#DC2626';
      case 'Overdue': return '#EA580C';
      case 'At Risk': return '#D97706';
      case 'In Payment Cycle': return 'var(--neuron-brand-green)';
      case 'Fully Paid': return 'var(--neuron-semantic-success)';
      case 'Available': return 'var(--neuron-ink-muted)';
      case 'Reserved': return '#9333ea';
      case 'Move-in Scheduled': return '#6366f1';
      default: return 'var(--neuron-ink-muted)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Critical': return '#FEE2E2';
      case 'Overdue': return '#FED7AA';
      case 'At Risk': return '#FEF3C7';
      case 'In Payment Cycle': return 'var(--neuron-brand-green-100)';
      case 'Fully Paid': return '#E8F2EE';
      case 'Available': return 'var(--neuron-state-hover)';
      case 'Reserved': return '#F3E8FF';
      case 'Move-in Scheduled': return '#E0E7FF';
      default: return 'var(--neuron-state-hover)';
    }
  };

  const paymentProgress = unit.paymentTerms 
    ? (unit.paymentTerms.monthsPaid / unit.paymentTerms.totalMonths) * 100 
    : 0;

  const totalPropertyDues = unit.propertyManagement 
    ? unit.propertyManagement.electricityDue + 
      unit.propertyManagement.waterDue + 
      unit.propertyManagement.garbageDue + 
      unit.propertyManagement.maintenanceDue
    : 0;

  return (
    <div style={{ padding: '32px 48px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <Button 
            variant="ghost" 
            onClick={onBack} 
            style={{ 
              marginBottom: '8px',
              marginLeft: '-16px',
              color: 'var(--neuron-brand-green)',
              transition: 'all 120ms ease-out'
            }}
          >
            ← Back to Dashboard
          </Button>
          <h1 style={{ 
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--neuron-ink-primary)',
            letterSpacing: '-0.01em',
            lineHeight: '36px',
            marginBottom: '6px'
          }}>
            Unit {unit.blockLot}
          </h1>
          <p style={{ 
            fontSize: '14px',
            color: 'var(--neuron-ink-muted)',
            lineHeight: '21px'
          }}>
            {unit.project} • {unit.phase}
          </p>
        </div>
        <Badge 
          variant="outline" 
          style={{ 
            background: getStatusBg(unit.status),
            border: 'none',
            color: getStatusColor(unit.status),
            borderRadius: '999px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
          }}
        >
          {unit.status}
        </Badge>
      </div>

      {/* Unit Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '8px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Unit Type
              </p>
              <p style={{ 
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                fontSize: '16px',
                lineHeight: '24px'
              }}>
                {unit.unitType}
              </p>
            </div>
            <Building size={20} style={{ color: 'var(--neuron-ink-muted)', marginTop: '4px' }} />
          </div>
        </Card>

        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '8px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Selling Price
              </p>
              <p style={{ 
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                fontSize: '16px',
                lineHeight: '24px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{unit.sellingPrice.toLocaleString('en-PH')}
              </p>
            </div>
            <DollarSign size={20} style={{ color: 'var(--neuron-ink-muted)', marginTop: '4px' }} />
          </div>
        </Card>

        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '8px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Move-in Date
              </p>
              <p style={{ 
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                fontSize: '16px',
                lineHeight: '24px'
              }}>
                {unit.moveInDate ? new Date(unit.moveInDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
            <Clock size={20} style={{ color: 'var(--neuron-ink-muted)', marginTop: '4px' }} />
          </div>
        </Card>
      </div>

      {/* Buyer Information */}
      {unit.buyer && (
        <Card style={{ 
          padding: '24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Users size={20} style={{ color: 'var(--neuron-brand-green)' }} />
            <h2 style={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--neuron-ink-primary)',
              lineHeight: '24px'
            }}>
              Buyer Information
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em',
                marginBottom: '6px'
              }}>
                Name
              </p>
              <p style={{ 
                fontWeight: 500,
                color: 'var(--neuron-ink-primary)',
                fontSize: '15px',
                lineHeight: '22.5px'
              }}>
                {unit.buyer.name}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em',
                marginBottom: '6px'
              }}>
                Contact
              </p>
              <p style={{ 
                fontWeight: 500,
                color: 'var(--neuron-ink-primary)',
                fontSize: '15px',
                lineHeight: '22.5px',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {unit.buyer.contact}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Payment Schedule - Detailed Month by Month */}
      {unit.paymentTerms && (
        <div style={{ marginBottom: '24px' }}>
          <PaymentSchedule 
            unit={unit} 
            onRecordPayment={(monthNumber) => {
              setIsPaymentModalOpen(true);
            }} 
          />
        </div>
      )}

      {/* Payment History */}
      {unit.paymentTerms && (
        <div style={{ marginBottom: '24px' }}>
          <PaymentHistory 
            unitId={unit.id}
            onViewDetail={handleViewPaymentDetail}
          />
        </div>
      )}

      {/* Property Management Dues */}
      {unit.propertyManagement && (
        <Card style={{ 
          padding: '24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Building size={20} style={{ color: 'var(--neuron-brand-green)' }} />
            <h2 style={{ 
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--neuron-ink-primary)',
              lineHeight: '24px'
            }}>
              Property Management
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div style={{ 
              padding: '16px',
              background: 'var(--neuron-state-hover)',
              border: '1px solid var(--neuron-ui-border)',
              borderRadius: '8px'
            }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '6px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Electricity Due
              </p>
              <p style={{ 
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '27px',
                letterSpacing: '-0.005em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{unit.propertyManagement.electricityDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div style={{ 
              padding: '16px',
              background: 'var(--neuron-state-hover)',
              border: '1px solid var(--neuron-ui-border)',
              borderRadius: '8px'
            }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '6px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Water Due
              </p>
              <p style={{ 
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '27px',
                letterSpacing: '-0.005em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{unit.propertyManagement.waterDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div style={{ 
              padding: '16px',
              background: 'var(--neuron-state-hover)',
              border: '1px solid var(--neuron-ui-border)',
              borderRadius: '8px'
            }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '6px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Garbage Due
              </p>
              <p style={{ 
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '27px',
                letterSpacing: '-0.005em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{unit.propertyManagement.garbageDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div style={{ 
              padding: '16px',
              background: 'var(--neuron-state-hover)',
              border: '1px solid var(--neuron-ui-border)',
              borderRadius: '8px'
            }}>
              <p style={{ 
                fontSize: '12px',
                color: 'var(--neuron-ink-muted)',
                marginBottom: '6px',
                lineHeight: '18px',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                Maintenance Due
              </p>
              <p style={{ 
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '27px',
                letterSpacing: '-0.005em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{unit.propertyManagement.maintenanceDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {totalPropertyDues > 0 && (
            <div style={{ 
              padding: '16px',
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CircleAlert size={16} style={{ color: '#D97706' }} />
                <p style={{ 
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#D97706',
                  lineHeight: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  Total Outstanding Dues
                </p>
              </div>
              <p style={{ 
                fontSize: '24px',
                fontWeight: 700,
                color: '#D97706',
                lineHeight: '32px',
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                ₱{totalPropertyDues.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          {unit.propertyManagement.lastPaymentDate && (
            <p style={{ 
              fontSize: '13px',
              color: 'var(--neuron-ink-muted)',
              marginTop: '12px',
              lineHeight: '18px'
            }}>
              Last Payment: {new Date(unit.propertyManagement.lastPaymentDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          )}
        </Card>
      )}

      {/* Notes & Flags */}
      {unit.notes.length > 0 && (
        <Card style={{ 
          padding: '24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--neuron-ink-primary)',
            marginBottom: '16px',
            lineHeight: '24px'
          }}>
            Notes & Flags
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unit.notes.map((note, index) => (
              <div key={index} style={{ 
                display: 'flex',
                alignItems: 'start',
                gap: '8px',
                padding: '12px',
                background: 'var(--neuron-state-hover)',
                border: '1px solid var(--neuron-ui-border)',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  width: '6px',
                  height: '6px',
                  background: 'var(--neuron-ink-muted)',
                  borderRadius: '50%',
                  marginTop: '8px',
                  flexShrink: 0
                }}></div>
                <p style={{ 
                  fontSize: '14px',
                  color: 'var(--neuron-ink-secondary)',
                  flex: 1,
                  lineHeight: '21px'
                }}>
                  {note}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button 
          data-tour-target="log-payment-button"
          style={{ 
            flex: 1,
            background: 'var(--neuron-brand-green)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            height: '40px',
            transition: 'all 120ms ease-out'
          }}
          onClick={() => setIsPaymentModalOpen(true)}
        >
          Log Payment
        </Button>
        <Button 
          variant="outline" 
          style={{ 
            flex: 1,
            background: 'transparent',
            color: 'var(--neuron-brand-green)',
            border: '1px solid var(--neuron-ui-border)',
            borderRadius: '8px',
            height: '40px',
            transition: 'all 120ms ease-out'
          }}
        >
          Contact Buyer
        </Button>
        <Button 
          variant="outline" 
          style={{ 
            flex: 1,
            background: 'transparent',
            color: 'var(--neuron-brand-green)',
            border: '1px solid var(--neuron-ui-border)',
            borderRadius: '8px',
            height: '40px',
            transition: 'all 120ms ease-out'
          }}
        >
          Add Note
        </Button>
      </div>

      {/* Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentRecorded={handlePaymentRecorded}
        unit={unit}
      />

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={isPaymentDetailOpen}
        onClose={() => setIsPaymentDetailOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
}