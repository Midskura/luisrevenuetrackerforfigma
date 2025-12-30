import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Search, 
  Building2, 
  Filter, 
  Grid3x3, 
  List, 
  ArrowUpDown,
  Home,
  MapPin,
  User,
  DollarSign
} from "lucide-react";
import { Unit, mockUnits } from "../data/mockData";

type UnitsViewProps = {
  onViewUnit: (unit: Unit) => void;
  selectedProject: string;
};

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'Available' | 'Reserved' | 'In Payment Cycle' | 'Overdue' | 'Fully Paid';

export function UnitsView({ onViewUnit, selectedProject }: UnitsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter units
  const filteredUnits = mockUnits
    .filter(u => selectedProject === 'All Projects' || u.project === selectedProject)
    .filter(u => filterStatus === 'all' || u.status === filterStatus)
    .filter(u => 
      searchQuery === '' || 
      u.blockLot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.project.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Reserved': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'In Payment Cycle': return 'bg-green-100 text-green-700 border-green-300';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-300';
      case 'At Risk': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-400';
      case 'Fully Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
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
          Units Inventory
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: '#6B7280',
          lineHeight: '20px'
        }}>
          Manage all property units and their current status
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
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Total Units</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#FEF2F2', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={18} style={{ color: '#EF4444' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {mockUnits.length}
            </p>
            <p style={{ fontSize: '13px', color: '#10B981' }}>
              Across {selectedProject === 'All Projects' ? '3 projects' : '1 project'}
            </p>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Available</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#EFF6FF', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Home size={18} style={{ color: '#3B82F6' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {filteredUnits.filter(u => u.status === 'Available').length}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Ready for sale
            </p>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Sold</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#F0FDF4', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={18} style={{ color: '#10B981' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {filteredUnits.filter(u => u.buyer !== null).length}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              With buyers
            </p>
          </Card>

          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>Total Value</span>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#FEF3C7', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={18} style={{ color: '#F59E0B' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {formatCurrency(filteredUnits.reduce((sum, u) => sum + u.sellingPrice, 0))}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Inventory value
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
              placeholder="Search units, buyers, or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'Available', 'In Payment Cycle', 'Overdue', 'Fully Paid'].map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status as FilterStatus)}
                style={{
                  background: filterStatus === status ? '#EF4444' : 'transparent',
                  color: filterStatus === status ? '#FFFFFF' : '#6B7280',
                  borderColor: filterStatus === status ? '#EF4444' : '#E5E7EB'
                }}
              >
                {status === 'all' ? 'All' : status}
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
            Showing <strong>{filteredUnits.length}</strong> unit{filteredUnits.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Units Display */}
        {viewMode === 'grid' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px'
          }}>
            {filteredUnits.map(unit => (
              <Card 
                key={unit.id}
                data-tour-target="unit-card"
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
                onClick={() => onViewUnit(unit)}
              >
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                      {unit.blockLot}
                    </h3>
                    <Badge className={getStatusColor(unit.status)}>
                      {unit.status}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {unit.project} • {unit.phase}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6B7280' }}>
                    {unit.unitType}
                  </p>
                </div>

                {unit.buyer && (
                  <div style={{ 
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                      {unit.buyer.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280' }}>
                      {unit.buyer.contact}
                    </p>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #E5E7EB'
                }}>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Selling Price</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#EF4444' }}>
                    {formatCurrency(unit.sellingPrice)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Unit</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Project</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Buyer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map(unit => (
                  <tr 
                    key={unit.id}
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
                    onClick={() => onViewUnit(unit)}
                  >
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                      {unit.blockLot}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                      {unit.project}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                      {unit.unitType}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                      {unit.buyer?.name || '—'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                      {formatCurrency(unit.sellingPrice)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <Button size="sm" variant="ghost" style={{ color: '#EF4444' }}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredUnits.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB'
          }}>
            <Building2 size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              No units found
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