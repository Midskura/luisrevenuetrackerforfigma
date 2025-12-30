import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Unit, mockUnits } from "../data/mockData";
import { CircleAlert, Search, Eye } from "lucide-react";
import { useState } from "react";

type CollectionsViewProps = {
  onViewUnit: (unit: Unit) => void;
  onBack: () => void;
};

export function CollectionsView({ onViewUnit, onBack }: CollectionsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter units with payment issues
  const unitsWithIssues = mockUnits.filter(u => 
    ['Critical', 'Overdue', 'At Risk'].includes(u.status)
  );

  // Apply filters
  const filteredUnits = unitsWithIssues.filter(unit => {
    const matchesSearch = 
      unit.blockLot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      '';
    
    const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort by severity
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    const order = { 'Critical': 0, 'Overdue': 1, 'At Risk': 2 };
    return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#DC2626';
      case 'Overdue': return '#EA580C';
      case 'At Risk': return '#D97706';
      default: return 'var(--neuron-ink-muted)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Critical': return '#FEE2E2';
      case 'Overdue': return '#FED7AA';
      case 'At Risk': return '#FEF3C7';
      default: return 'var(--neuron-state-hover)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical': return '🔴';
      case 'Overdue': return '🟠';
      case 'At Risk': return '🟡';
      default: return '⚪';
    }
  };

  // Calculate summary
  const critical = unitsWithIssues.filter(u => u.status === 'Critical').length;
  const overdue = unitsWithIssues.filter(u => u.status === 'Overdue').length;
  const atRisk = unitsWithIssues.filter(u => u.status === 'At Risk').length;
  const totalArrears = unitsWithIssues.reduce((sum, u) => 
    sum + (u.paymentTerms?.arrears || 0), 0
  );

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <Card style={{ 
          padding: '20px 24px',
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '12px',
                fontWeight: 600,
                color: '#DC2626',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: '18px',
                marginBottom: '12px'
              }}>
                Critical
              </p>
              <p style={{ 
                fontSize: '32px',
                fontWeight: 700,
                color: '#DC2626',
                lineHeight: '40px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {critical}
              </p>
              <p style={{ 
                fontSize: '11px',
                color: '#DC2626',
                marginTop: '8px',
                lineHeight: '16.5px'
              }}>
                Immediate action required
              </p>
            </div>
            <CircleAlert size={20} style={{ color: '#DC2626' }} />
          </div>
        </Card>

        <Card style={{ 
          padding: '20px 24px',
          background: '#FED7AA',
          border: '1px solid #FDBA74',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '12px',
                fontWeight: 600,
                color: '#EA580C',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: '18px',
                marginBottom: '12px'
              }}>
                Overdue
              </p>
              <p style={{ 
                fontSize: '32px',
                fontWeight: 700,
                color: '#EA580C',
                lineHeight: '40px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {overdue}
              </p>
              <p style={{ 
                fontSize: '11px',
                color: '#EA580C',
                marginTop: '8px',
                lineHeight: '16.5px'
              }}>
                30+ days late
              </p>
            </div>
            <CircleAlert size={20} style={{ color: '#EA580C' }} />
          </div>
        </Card>

        <Card style={{ 
          padding: '20px 24px',
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: '12px',
                fontWeight: 600,
                color: '#D97706',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: '18px',
                marginBottom: '12px'
              }}>
                At Risk
              </p>
              <p style={{ 
                fontSize: '32px',
                fontWeight: 700,
                color: '#D97706',
                lineHeight: '40px',
                letterSpacing: '-0.015em',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {atRisk}
              </p>
              <p style={{ 
                fontSize: '11px',
                color: '#D97706',
                marginTop: '8px',
                lineHeight: '16.5px'
              }}>
                Early warning
              </p>
            </div>
            <CircleAlert size={20} style={{ color: '#D97706' }} />
          </div>
        </Card>

        <Card style={{ 
          padding: '20px 24px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-ui-border)',
          borderRadius: '12px'
        }}>
          <div>
            <p style={{ 
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--neuron-ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              lineHeight: '18px',
              marginBottom: '12px'
            }}>
              Total Arrears
            </p>
            <p style={{ 
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--neuron-ink-primary)',
              lineHeight: '36px',
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums'
            }}>
              ₱{totalArrears.toLocaleString('en-PH')}
            </p>
            <p style={{ 
              fontSize: '11px',
              color: 'var(--neuron-ink-muted)',
              marginTop: '8px',
              lineHeight: '16.5px'
            }}>
              Amount at risk
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ 
        padding: '16px',
        background: 'var(--neuron-bg-elevated)',
        border: '1px solid var(--neuron-ui-border)',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ 
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--neuron-ink-muted)',
              pointerEvents: 'none'
            }} />
            <Input
              placeholder="Search by unit or buyer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                paddingLeft: '40px',
                border: '1px solid var(--neuron-ui-border)',
                borderRadius: '8px',
                height: '40px'
              }}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger style={{ 
              width: '200px',
              border: '1px solid var(--neuron-ui-border)',
              borderRadius: '8px',
              height: '40px'
            }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Collections Table */}
      <Card style={{ 
        background: 'var(--neuron-bg-elevated)',
        border: '1px solid var(--neuron-ui-border)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: 'var(--neuron-bg-page)',
                borderBottom: '1px solid var(--neuron-ui-border)'
              }}>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Status
                </th>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Unit
                </th>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Buyer
                </th>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Days Late
                </th>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Arrears
                </th>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Next Due
                </th>
                <th style={{ 
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Last Contact
                </th>
                <th style={{ 
                  textAlign: 'right',
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--neuron-ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: '16.5px'
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUnits.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ 
                    padding: '48px 24px',
                    textAlign: 'center',
                    color: 'var(--neuron-ink-muted)',
                    fontSize: '14px',
                    lineHeight: '21px'
                  }}>
                    No units found matching your filters
                  </td>
                </tr>
              ) : (
                sortedUnits.map((unit) => (
                  <tr 
                    key={unit.id} 
                    onClick={() => onViewUnit(unit)}
                    style={{ 
                      borderBottom: '1px solid var(--neuron-ui-divider)',
                      cursor: 'pointer',
                      transition: 'background 120ms ease-out'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--neuron-state-hover)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <Badge 
                        variant="outline" 
                        style={{ 
                          background: getStatusBg(unit.status),
                          border: 'none',
                          color: getStatusColor(unit.status),
                          borderRadius: '999px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em'
                        }}
                      >
                        {getStatusIcon(unit.status)} {unit.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ 
                          fontWeight: 500,
                          color: 'var(--neuron-ink-primary)',
                          fontSize: '14px',
                          lineHeight: '21px'
                        }}>
                          {unit.blockLot}
                        </p>
                        <p style={{ 
                          fontSize: '13px',
                          color: 'var(--neuron-ink-muted)',
                          lineHeight: '18px',
                          marginTop: '2px'
                        }}>
                          {unit.project}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ 
                          fontWeight: 500,
                          color: 'var(--neuron-ink-primary)',
                          fontSize: '14px',
                          lineHeight: '21px'
                        }}>
                          {unit.buyer?.name}
                        </p>
                        <p style={{ 
                          fontSize: '13px',
                          color: 'var(--neuron-ink-muted)',
                          lineHeight: '18px',
                          marginTop: '2px'
                        }}>
                          {unit.buyer?.contact}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontVariantNumeric: 'tabular-nums',
                        color: (unit.paymentTerms?.daysLate || 0) > 90 
                          ? '#DC2626' 
                          : (unit.paymentTerms?.daysLate || 0) > 30 
                          ? '#EA580C' 
                          : '#D97706'
                      }}>
                        {unit.paymentTerms?.daysLate || 0} days
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontWeight: 600,
                        color: 'var(--neuron-ink-primary)',
                        fontSize: '14px',
                        lineHeight: '21px',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        ₱{(unit.paymentTerms?.arrears || 0).toLocaleString('en-PH')}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '14px',
                        color: 'var(--neuron-ink-secondary)',
                        lineHeight: '21px'
                      }}>
                        {unit.paymentTerms?.nextDueDate 
                          ? new Date(unit.paymentTerms.nextDueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '13px',
                        color: 'var(--neuron-ink-muted)',
                        lineHeight: '18px'
                      }}>
                        {unit.propertyManagement?.lastPaymentDate 
                          ? new Date(unit.propertyManagement.lastPaymentDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })
                          : 'Never'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewUnit(unit);
                        }}
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          color: 'var(--neuron-brand-green)',
                          transition: 'all 120ms ease-out'
                        }}
                      >
                        <Eye size={16} />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <Button style={{
          background: 'var(--neuron-brand-green)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          height: '40px',
          padding: '0 20px',
          transition: 'all 120ms ease-out'
        }}>
          Export Collections Report
        </Button>
        <Button 
          variant="outline" 
          style={{
            background: 'transparent',
            color: 'var(--neuron-brand-green)',
            border: '1px solid var(--neuron-ui-border)',
            borderRadius: '8px',
            height: '40px',
            padding: '0 20px',
            transition: 'all 120ms ease-out'
          }}
        >
          Send Payment Reminders
        </Button>
        <Button 
          variant="outline"
          style={{
            background: 'transparent',
            color: 'var(--neuron-brand-green)',
            border: '1px solid var(--neuron-ui-border)',
            borderRadius: '8px',
            height: '40px',
            padding: '0 20px',
            transition: 'all 120ms ease-out'
          }}
        >
          Schedule Follow-ups
        </Button>
      </div>
    </div>
  );
}