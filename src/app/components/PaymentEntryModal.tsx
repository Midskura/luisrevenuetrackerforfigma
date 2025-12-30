import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Search, CheckCircle2, DollarSign } from "lucide-react";
import { Unit, mockUnits } from "../data/mockData";

type PaymentEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPaymentLogged: (unitId: string, amount: number) => void;
};

type FlowStep = 'search' | 'entry' | 'confirm' | 'success';

export function PaymentEntryModal({ isOpen, onClose, onPaymentLogged }: PaymentEntryModalProps) {
  const [step, setStep] = useState<FlowStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter units with payment terms
  const searchResults = mockUnits
    .filter(u => u.paymentTerms)
    .filter(u => 
      u.blockLot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setAmount(unit.paymentTerms?.monthlyAmount.toString() || '');
    setStep('entry');
  };

  const handleSubmit = () => {
    if (!selectedUnit || !amount) return;
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!selectedUnit || !amount) return;
    setStep('success');
    setTimeout(() => {
      onPaymentLogged(selectedUnit.id, parseFloat(amount));
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setStep('search');
    setSearchQuery('');
    setSelectedUnit(null);
    setAmount('');
    setPaymentMethod('Cash');
    setReferenceNumber('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen) return null;

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
        maxWidth: '560px',
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
              <DollarSign size={20} style={{ color: 'var(--neuron-brand-green)' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--neuron-ink-primary)',
                lineHeight: '27px',
                letterSpacing: '-0.005em'
              }}>
                Log Payment
              </h2>
              <p style={{
                fontSize: '13px',
                color: 'var(--neuron-ink-muted)',
                lineHeight: '18px',
                marginTop: '2px'
              }}>
                {step === 'search' && 'Search for unit'}
                {step === 'entry' && 'Enter payment details'}
                {step === 'confirm' && 'Review and confirm'}
                {step === 'success' && 'Payment logged successfully'}
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

        {/* Progress Steps */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--neuron-bg-page)',
          borderBottom: '1px solid var(--neuron-ui-border)'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {['search', 'entry', 'confirm', 'success'].map((s, index) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: step === s || ['entry', 'confirm', 'success'].includes(step) && index < ['search', 'entry', 'confirm', 'success'].indexOf(step) + 1
                    ? 'var(--neuron-brand-green)'
                    : 'var(--neuron-ui-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: step === s || ['entry', 'confirm', 'success'].includes(step) && index < ['search', 'entry', 'confirm', 'success'].indexOf(step) + 1
                    ? 'white'
                    : 'var(--neuron-ink-muted)',
                  transition: 'all 200ms ease-out'
                }}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: ['entry', 'confirm', 'success'].includes(step) && index < ['search', 'entry', 'confirm', 'success'].indexOf(step)
                      ? 'var(--neuron-brand-green)'
                      : 'var(--neuron-ui-border)',
                    marginLeft: '8px',
                    transition: 'all 200ms ease-out'
                  }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {/* Step 1: Search */}
          {step === 'search' && (
            <div>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--neuron-ink-muted)',
                  pointerEvents: 'none'
                }} />
                <Input
                  placeholder="Search by unit number or buyer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    paddingLeft: '40px',
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px'
                  }}
                />
              </div>

              {searchQuery.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResults.length === 0 ? (
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--neuron-ink-muted)',
                      textAlign: 'center',
                      padding: '32px 16px',
                      lineHeight: '21px'
                    }}>
                      No units found
                    </p>
                  ) : (
                    searchResults.map(unit => (
                      <div
                        key={unit.id}
                        onClick={() => handleUnitSelect(unit)}
                        style={{
                          padding: '16px',
                          background: 'var(--neuron-bg-page)',
                          border: '1px solid var(--neuron-ui-border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 120ms ease-out'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'var(--neuron-brand-green)';
                          e.currentTarget.style.background = 'var(--neuron-state-selected)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'var(--neuron-ui-border)';
                          e.currentTarget.style.background = 'var(--neuron-bg-page)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{
                              fontWeight: 600,
                              color: 'var(--neuron-ink-primary)',
                              fontSize: '15px',
                              lineHeight: '22.5px',
                              marginBottom: '4px'
                            }}>
                              {unit.blockLot}
                            </p>
                            <p style={{
                              fontSize: '14px',
                              color: 'var(--neuron-ink-secondary)',
                              lineHeight: '21px'
                            }}>
                              {unit.buyer?.name}
                            </p>
                            <p style={{
                              fontSize: '13px',
                              color: 'var(--neuron-ink-muted)',
                              lineHeight: '18px',
                              marginTop: '4px'
                            }}>
                              {unit.project}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{
                              fontSize: '12px',
                              color: 'var(--neuron-ink-muted)',
                              lineHeight: '18px',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: '0.02em',
                              marginBottom: '4px'
                            }}>
                              Monthly Due
                            </p>
                            <p style={{
                              fontWeight: 600,
                              color: 'var(--neuron-brand-green)',
                              fontSize: '15px',
                              lineHeight: '22.5px',
                              fontVariantNumeric: 'tabular-nums'
                            }}>
                              ₱{unit.paymentTerms?.monthlyAmount.toLocaleString('en-PH')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {searchQuery.length === 0 && (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center'
                }}>
                  <Search size={48} style={{ color: 'var(--neuron-ink-muted)', opacity: 0.3, marginBottom: '16px' }} />
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--neuron-ink-muted)',
                    lineHeight: '21px'
                  }}>
                    Start typing to search for a unit
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Entry */}
          {step === 'entry' && selectedUnit && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Selected Unit Summary */}
              <div style={{
                padding: '16px',
                background: 'var(--neuron-brand-green-100)',
                border: '1px solid var(--neuron-brand-green)',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--neuron-brand-green)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: '18px',
                  marginBottom: '6px'
                }}>
                  Selected Unit
                </p>
                <p style={{
                  fontWeight: 600,
                  color: 'var(--neuron-ink-primary)',
                  fontSize: '16px',
                  lineHeight: '24px',
                  marginBottom: '2px'
                }}>
                  {selectedUnit.blockLot} • {selectedUnit.buyer?.name}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--neuron-ink-muted)',
                  lineHeight: '18px'
                }}>
                  Monthly Due: ₱{selectedUnit.paymentTerms?.monthlyAmount.toLocaleString('en-PH')}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Amount Received *
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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

              {/* Payment Date */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Payment Date *
                </label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px'
                  }}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Payment Method *
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px'
                  }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="GCash">GCash</SelectItem>
                    <SelectItem value="PayMaya">PayMaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reference Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--neuron-ink-primary)',
                  marginBottom: '8px',
                  lineHeight: '21px'
                }}>
                  Reference Number <span style={{ color: 'var(--neuron-ink-muted)' }}>(Optional)</span>
                </label>
                <Input
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Transaction ID, Check #, etc."
                  style={{
                    border: '1px solid var(--neuron-ui-border)',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedUnit && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                padding: '20px',
                background: 'var(--neuron-bg-page)',
                border: '1px solid var(--neuron-ui-border)',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: '18px',
                  marginBottom: '16px'
                }}>
                  Review Payment Details
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Unit</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neuron-ink-primary)', lineHeight: '21px' }}>
                      {selectedUnit.blockLot}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Buyer</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neuron-ink-primary)', lineHeight: '21px' }}>
                      {selectedUnit.buyer?.name}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--neuron-ui-divider)', margin: '4px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Amount</span>
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: 'var(--neuron-brand-green)', 
                      lineHeight: '27px',
                      letterSpacing: '-0.005em',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      ₱{parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Date</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neuron-ink-primary)', lineHeight: '21px' }}>
                      {new Date(paymentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Method</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neuron-ink-primary)', lineHeight: '21px' }}>
                      {paymentMethod}
                    </span>
                  </div>
                  {referenceNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: 'var(--neuron-ink-muted)', lineHeight: '21px' }}>Reference</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--neuron-ink-primary)', lineHeight: '21px', fontVariantNumeric: 'tabular-nums' }}>
                        {referenceNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#E8F2EE',
                border: '1px solid var(--neuron-brand-green)',
                borderRadius: '8px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--neuron-ink-secondary)',
                  lineHeight: '18px'
                }}>
                  This payment will be recorded and the unit's payment timeline will be automatically updated.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div style={{
              padding: '48px 24px',
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
                Payment Logged Successfully
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--neuron-ink-muted)',
                lineHeight: '21px'
              }}>
                Dashboard will update automatically
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 'success' && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--neuron-ui-border)',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            {step === 'entry' && (
              <Button
                variant="outline"
                onClick={() => setStep('search')}
                style={{
                  background: 'transparent',
                  color: 'var(--neuron-ink-muted)',
                  border: '1px solid var(--neuron-ui-border)',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Back
              </Button>
            )}
            {step === 'confirm' && (
              <Button
                variant="outline"
                onClick={() => setStep('entry')}
                style={{
                  background: 'transparent',
                  color: 'var(--neuron-ink-muted)',
                  border: '1px solid var(--neuron-ui-border)',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Back
              </Button>
            )}
            {step === 'entry' && (
              <Button
                onClick={handleSubmit}
                disabled={!amount || parseFloat(amount) <= 0}
                style={{
                  background: !amount || parseFloat(amount) <= 0 
                    ? 'var(--neuron-ink-muted)' 
                    : 'var(--neuron-brand-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px',
                  cursor: !amount || parseFloat(amount) <= 0 ? 'not-allowed' : 'pointer',
                  opacity: !amount || parseFloat(amount) <= 0 ? 0.5 : 1
                }}
              >
                Continue
              </Button>
            )}
            {step === 'confirm' && (
              <Button
                onClick={handleConfirm}
                style={{
                  background: 'var(--neuron-brand-green)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                  padding: '0 20px'
                }}
              >
                Confirm Payment
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
