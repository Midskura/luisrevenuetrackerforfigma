import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Home, CheckCircle2 } from "lucide-react";
import { Unit } from "../data/mockData";

type AddUnitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUnitAdded: (unit: Unit) => void;
  selectedProject: string;
};

type FlowStep = 'entry' | 'success';

export function AddUnitModal({ isOpen, onClose, onUnitAdded, selectedProject }: AddUnitModalProps) {
  const [step, setStep] = useState<FlowStep>('entry');
  const [unitCode, setUnitCode] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [contractPrice, setContractPrice] = useState('');
  const [monthlyDue, setMonthlyDue] = useState('');
  const [paymentStartDate, setPaymentStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newUnit, setNewUnit] = useState<Unit | null>(null);

  const handleSubmit = () => {
    if (!unitCode || !buyerName || !contractPrice || !monthlyDue || !paymentStartDate) return;

    // Create a new unit object
    const unit: Unit = {
      id: `U${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      blockLot: unitCode,
      unitType: 'Townhouse', // Default for simplicity
      project: selectedProject === 'All Projects' ? 'Vista Verde' : selectedProject,
      phase: 'Phase 1',
      sellingPrice: parseFloat(contractPrice),
      buyer: {
        name: buyerName,
        contact: '+63 9XX XXX XXXX'
      },
      status: 'In Payment Cycle',
      moveInDate: new Date().toISOString().split('T')[0],
      paymentTerms: {
        totalMonths: 24,
        monthsPaid: 0,
        monthlyAmount: parseFloat(monthlyDue),
        nextDueDate: paymentStartDate,
        arrears: 0,
        daysLate: 0
      },
      propertyManagement: {
        electricityDue: 0,
        waterDue: 0,
        garbageDue: 0,
        maintenanceDue: 0,
        lastPaymentDate: null
      },
      notes: ['Unit added via Add Unit flow']
    };

    setNewUnit(unit);
    setStep('success');
  };

  const handleLogFirstPayment = () => {
    if (newUnit) {
      onUnitAdded(newUnit);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('entry');
    setUnitCode('');
    setBuyerName('');
    setContractPrice('');
    setMonthlyDue('');
    setPaymentStartDate(new Date().toISOString().split('T')[0]);
    setNewUnit(null);
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = unitCode && buyerName && contractPrice && monthlyDue && paymentStartDate;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div style={{
        background: 'var(--neuron-bg-elevated)',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: 'var(--elevation-2)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--neuron-ui-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              background: 'var(--neuron-brand-green-100)',
              borderRadius: '8px'
            }}>
              <Home size={20} style={{ color: 'var(--neuron-brand-green)' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '27px',
                letterSpacing: '-0.005em'
              }}>
                {step === 'entry' ? 'Add Unit' : 'Unit Added Successfully'}
              </h2>
              <p style={{
                fontSize: '13px',
                color: 'var(--neuron-ink-muted)',
                lineHeight: '18px',
                marginTop: '2px'
              }}>
                {step === 'entry' 
                  ? `Adding to ${selectedProject === 'All Projects' ? 'Vista Verde' : selectedProject}` 
                  : 'Ready to track payments'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 120ms ease-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--neuron-state-hover)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} style={{ color: 'var(--neuron-ink-muted)' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {/* Entry Step */}
          {step === 'entry' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Helper Text */}
              <div style={{
                padding: '14px 16px',
                background: 'var(--neuron-bg-page)',
                border: '1px solid var(--neuron-ui-border)',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--neuron-ink-secondary)',
                  lineHeight: '18px'
                }}>
                  One-time setup per unit. All fields required for payment tracking.
                </p>
              </div>

              {/* Unit Code */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Unit Code *
                </label>
                <Input
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  placeholder="e.g. B1-L06"
                  autoFocus
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: 'var(--neuron-ink-muted)',
                  lineHeight: '18px',
                  marginTop: '6px'
                }}>
                  Block and lot number
                </p>
              </div>

              {/* Buyer Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Buyer Name *
                </label>
                <Input
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Full name"
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px'
                  }}
                />
              </div>

              {/* Contract Price */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Contract Price *
                </label>
                <Input
                  type="number"
                  value={contractPrice}
                  onChange={(e) => setContractPrice(e.target.value)}
                  placeholder="0.00"
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                />
              </div>

              {/* Monthly Due */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Monthly Due *
                </label>
                <Input
                  type="number"
                  value={monthlyDue}
                  onChange={(e) => setMonthlyDue(e.target.value)}
                  placeholder="0.00"
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: 'var(--neuron-ink-muted)',
                  lineHeight: '18px',
                  marginTop: '6px'
                }}>
                  Regular monthly amortization amount
                </p>
              </div>

              {/* Payment Start Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Payment Start Date *
                </label>
                <Input
                  type="date"
                  value={paymentStartDate}
                  onChange={(e) => setPaymentStartDate(e.target.value)}
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: 'var(--neuron-ink-muted)',
                  lineHeight: '18px',
                  marginTop: '6px'
                }}>
                  First payment due date
                </p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && newUnit && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{
                padding: '48px 24px 32px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#E8F2EE',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--neuron-semantic-success)' }} />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-primary)',
                  lineHeight: '30px',
                  letterSpacing: '-0.005em',
                  marginBottom: '8px'
                }}>
                  Unit added successfully
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--neuron-ink-muted)',
                  lineHeight: '21px',
                  marginBottom: '24px'
                }}>
                  This unit will now appear in dashboards and payment tracking.
                </p>

                {/* Unit Summary Card */}
                <div style={{
                  padding: '16px',
                  background: 'var(--neuron-bg-page)',
                  border: '1px solid var(--neuron-ui-border)',
                  borderRadius: '8px',
                  textAlign: 'left',
                  marginTop: '24px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Unit</span>
                      <span style={{ 
                        fontSize: '15px', 
                        fontWeight: 600, 
                        color: 'var(--neuron-ink-primary)', 
                        lineHeight: '22.5px' 
                      }}>
                        {newUnit.blockLot}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Buyer</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neuron-ink-primary)', lineHeight: '21px' }}>
                        {newUnit.buyer?.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Monthly Due</span>
                      <span style={{ 
                        fontSize: '15px', 
                        fontWeight: 600, 
                        color: 'var(--neuron-brand-green)', 
                        lineHeight: '22.5px',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        ₱{newUnit.paymentTerms?.monthlyAmount.toLocaleString('en-PH')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Helper Note */}
              <div style={{
                padding: '14px 16px',
                background: 'var(--neuron-brand-green-100)',
                border: '1px solid var(--neuron-brand-green)',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--neuron-ink-secondary)',
                  lineHeight: '18px',
                  textAlign: 'center'
                }}>
                  <strong>2–3 clicks</strong> to log payment, updates all reports automatically
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--neuron-ui-border)',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          {step === 'entry' && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  color: 'var(--neuron-ink-muted)',
                  border: '1px solid var(--neuron-ui-border)',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                style={{
                  background: !isFormValid 
                    ? 'var(--neuron-ink-muted)' 
                    : 'var(--neuron-brand-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px',
                  cursor: !isFormValid ? 'not-allowed' : 'pointer',
                  opacity: !isFormValid ? 0.5 : 1
                }}
              >
                Add Unit
              </Button>
            </>
          )}
          {step === 'success' && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  color: 'var(--neuron-ink-muted)',
                  border: '1px solid var(--neuron-ui-border)',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Done
              </Button>
              <Button
                onClick={handleLogFirstPayment}
                style={{
                  background: 'var(--neuron-brand-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Log first payment
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
