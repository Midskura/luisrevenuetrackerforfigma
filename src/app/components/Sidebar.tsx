import { useState } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  AlertCircle, 
  Users,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
  BarChart3,
  Settings,
  FileText,
  Activity,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown
} from "lucide-react";
import { PROJECTS, UserRole } from "../data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

type SidebarProps = {
  currentView: 'dashboard' | 'unit' | 'collections' | 'reports' | 'settings' | 'documents' | 'activity' | 'communications' | 'bulk' | 'units' | 'customers';
  onNavigate: (view: 'dashboard' | 'collections' | 'reports' | 'settings' | 'documents' | 'activity' | 'communications' | 'bulk' | 'units' | 'customers') => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSwitchToCustomer?: () => void;
};

export function Sidebar({ 
  currentView, 
  onNavigate, 
  selectedProject, 
  onProjectChange,
  currentRole,
  onRoleChange,
  onSwitchToCustomer
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    overview: true,
    portfolio: true,
    operations: true,
    analytics: false,
    system: false
  });

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Executive': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Manager': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Encoder': return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      view: 'dashboard' as const,
      category: 'overview'
    },
    { 
      id: 'units', 
      icon: Building2, 
      label: 'Units', 
      view: 'units' as const,
      category: 'portfolio'
    },
    { 
      id: 'customers', 
      icon: Users, 
      label: 'Customers', 
      view: 'customers' as const,
      category: 'portfolio'
    },
    { 
      id: 'collections', 
      icon: AlertCircle, 
      label: 'Collections', 
      view: 'collections' as const,
      category: 'operations'
    },
    { 
      id: 'communications', 
      icon: Mail, 
      label: 'Communications', 
      view: 'communications' as const,
      category: 'operations'
    },
    { 
      id: 'bulk', 
      icon: Zap, 
      label: 'Bulk Operations', 
      view: 'bulk' as const,
      category: 'operations'
    },
    { 
      id: 'reports', 
      icon: BarChart3, 
      label: 'Reports', 
      view: 'reports' as const,
      category: 'analytics'
    },
    { 
      id: 'documents', 
      icon: FileText, 
      label: 'Documents', 
      view: 'documents' as const,
      category: 'analytics'
    },
    { 
      id: 'activity', 
      icon: Activity, 
      label: 'Activity Log', 
      view: 'activity' as const,
      category: 'system'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings', 
      view: 'settings' as const,
      category: 'system'
    },
  ];

  const categories = {
    overview: { 
      label: 'Overview', 
      icon: LayoutDashboard,
      items: menuItems.filter(i => i.category === 'overview') 
    },
    portfolio: { 
      label: 'Portfolio', 
      icon: Building2,
      items: menuItems.filter(i => i.category === 'portfolio') 
    },
    operations: { 
      label: 'Operations', 
      icon: Zap,
      items: menuItems.filter(i => i.category === 'operations') 
    },
    analytics: { 
      label: 'Analytics & Docs', 
      icon: BarChart3,
      items: menuItems.filter(i => i.category === 'analytics') 
    },
    system: { 
      label: 'System', 
      icon: Settings,
      items: menuItems.filter(i => i.category === 'system') 
    },
  };

  return (
    <div style={{
      width: isCollapsed ? '72px' : '280px',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 10,
      boxShadow: '2px 0 12px rgba(0, 0, 0, 0.04)',
      cursor: isCollapsed ? 'pointer' : 'default'
    }}
    onClick={() => {
      if (isCollapsed) {
        setIsCollapsed(false);
      }
    }}
    >
      {/* Logo/Brand */}
      <div style={{
        padding: isCollapsed ? '24px 12px' : '24px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '88px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={32} style={{ color: '#EF4444', strokeWidth: 2.5, fill: '#EF4444' }} />
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#1F2937',
                lineHeight: '24px',
                marginBottom: '2px',
                letterSpacing: '0.03em',
                WebkitTextStroke: '0.5px #1F2937'
              }}>
                NEXSYS
              </p>
              <p style={{
                fontSize: '13px',
                color: '#9CA3AF',
                lineHeight: '18px',
                fontWeight: 400
              }}>
                Revenue Lifecycle
              </p>
            </div>
          )}
        </div>
        
        {/* Collapse Button - Only visible when expanded */}
        {!isCollapsed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(true);
            }}
            style={{
              width: '32px',
              height: '32px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#F9FAFB';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <PanelLeftClose size={16} style={{ color: '#6B7280' }} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        flex: 1,
        padding: isCollapsed ? '20px 10px' : '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      >
        {!isCollapsed && (
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#9A9FA5',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 12px',
            marginBottom: '6px',
            lineHeight: '16px'
          }}>
            Menu
          </p>
        )}

        {Object.keys(categories).map(categoryKey => {
          const category = categories[categoryKey];
          const CategoryIcon = category.icon;
          
          return (
            <div key={categoryKey} style={{ marginBottom: '4px' }}>
              {/* Category Header Button */}
              <button
                onClick={() => toggleCategory(categoryKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '14px 12px' : '12px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  width: '100%',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CategoryIcon 
                    size={20} 
                    style={{ 
                      color: '#9CA3AF',
                      flexShrink: 0,
                      strokeWidth: 2
                    }} 
                  />
                  {!isCollapsed && (
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#6B7280',
                      lineHeight: '20px',
                      whiteSpace: 'nowrap'
                    }}>
                      {category.label}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      color: '#9CA3AF',
                      transform: expandedCategories[categoryKey] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0
                    }} 
                  />
                )}
              </button>

              {/* Sub-items (indented) */}
              {expandedCategories[categoryKey] && category.items.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.view;
                
                return (
                  <button
                    key={item.id}
                    data-tour-id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.view)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: isCollapsed ? '12px 12px' : '10px 14px',
                      paddingLeft: isCollapsed ? '12px' : '40px', // Indent sub-items
                      background: isActive ? '#FEF2F2' : 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      width: '100%',
                      position: 'relative',
                      marginTop: '2px'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#F9FAFB';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '20px',
                        background: '#EF4444',
                        borderRadius: '0 2px 2px 0'
                      }}></div>
                    )}
                    <Icon 
                      size={18} 
                      style={{ 
                        color: isActive ? '#EF4444' : '#9CA3AF',
                        flexShrink: 0,
                        strokeWidth: isActive ? 2.5 : 2
                      }} 
                    />
                    {!isCollapsed && (
                      <span style={{
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#111827' : '#6B7280',
                        lineHeight: '20px',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Project Filter */}
        {!isCollapsed && (
          <>
            <div style={{
              height: '1px',
              background: '#EFEFEF',
              margin: '16px 0'
            }}></div>

            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#9A9FA5',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 12px',
              marginBottom: '6px',
              lineHeight: '16px'
            }}>
              Projects
            </p>

            <button
              onClick={() => onProjectChange('All Projects')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                background: selectedProject === 'All Projects' ? '#FEE2E2' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                justifyContent: 'flex-start',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (selectedProject !== 'All Projects') {
                  e.currentTarget.style.background = '#F5F6F7';
                }
              }}
              onMouseOut={(e) => {
                if (selectedProject !== 'All Projects') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {selectedProject === 'All Projects' && (
                <div style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  background: '#EF4444',
                  borderRadius: '0 2px 2px 0'
                }}></div>
              )}
              <Building2 
                size={18} 
                style={{ 
                  color: selectedProject === 'All Projects' ? '#EF4444' : '#6F767E',
                  flexShrink: 0
                }} 
              />
              <span style={{
                fontSize: '14px',
                fontWeight: selectedProject === 'All Projects' ? 600 : 500,
                color: selectedProject === 'All Projects' ? '#1A1D1F' : '#6F767E',
                lineHeight: '20px',
                whiteSpace: 'nowrap'
              }}>
                All Projects
              </span>
            </button>

            {PROJECTS.map(project => (
              <button
                key={project}
                onClick={() => onProjectChange(project)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: selectedProject === project ? '#FEE2E2' : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%',
                  justifyContent: 'flex-start',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (selectedProject !== project) {
                    e.currentTarget.style.background = '#F5F6F7';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedProject !== project) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {selectedProject === project && (
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '20px',
                    background: '#EF4444',
                    borderRadius: '0 2px 2px 0'
                  }}></div>
                )}
                <Building2 
                  size={18} 
                  style={{ 
                    color: selectedProject === project ? '#EF4444' : '#6F767E',
                    flexShrink: 0
                  }} 
                />
                <span style={{
                  fontSize: '14px',
                  fontWeight: selectedProject === project ? 600 : 500,
                  color: selectedProject === project ? '#1A1D1F' : '#6F767E',
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {project}
                </span>
              </button>
            ))}
          </>
        )}

        {/* Role Switcher */}
        {!isCollapsed && (
          <>
            <div style={{
              height: '1px',
              background: '#EFEFEF',
              margin: '16px 0'
            }}></div>

            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#9A9FA5',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 12px',
              marginBottom: '6px',
              lineHeight: '16px'
            }}>
              View As
            </p>

            <div style={{
              background: '#F5F6F7',
              borderRadius: '12px',
              padding: '6px'
            }}>
              <Select value={currentRole} onValueChange={onRoleChange}>
                <SelectTrigger style={{
                  width: '100%',
                  borderColor: 'transparent',
                  background: 'transparent',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '14px',
                  color: '#1A1D1F',
                  fontWeight: 500
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#9333ea', 
                        borderRadius: '50%' 
                      }}></div>
                      <span>Executive</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Manager">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#18AB5C', 
                        borderRadius: '50%' 
                      }}></div>
                      <span>Manager</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Encoder">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#6F767E', 
                        borderRadius: '50%' 
                      }}></div>
                      <span>Encoder/Staff</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Switch to Customer */}
        {!isCollapsed && onSwitchToCustomer && (
          <>
            <div style={{
              height: '1px',
              background: '#EFEFEF',
              margin: '16px 0'
            }}></div>

            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#9A9FA5',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 12px',
              marginBottom: '6px',
              lineHeight: '16px'
            }}>
              Switch To
            </p>

            <button
              onClick={onSwitchToCustomer}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                justifyContent: 'flex-start',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#F5F6F7';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <User 
                size={18} 
                style={{ 
                  color: '#6F767E',
                  flexShrink: 0
                }} 
              />
              <span style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#6F767E',
                lineHeight: '20px',
                whiteSpace: 'nowrap'
              }}>
                Customer
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}