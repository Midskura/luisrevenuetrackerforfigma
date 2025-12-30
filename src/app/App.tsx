import { useState, useRef, useEffect } from "react";
import { ExecutiveDashboard } from "./components/ExecutiveDashboard";
import { UnitDetailView } from "./components/UnitDetailView";
import { CollectionsView } from "./components/CollectionsView";
import { ReportsView } from "./components/ReportsView";
import { SettingsView } from "./components/SettingsView";
import { DocumentsView } from "./components/DocumentsView";
import { ActivityLogView } from "./components/ActivityLogView";
import { CommunicationsView } from "./components/CommunicationsView";
import { BulkOperationsView } from "./components/BulkOperationsView";
import { UnitsView } from "./components/UnitsView";
import { CustomersView } from "./components/CustomersView";
import { DemoTour } from "./components/DemoTour";
import { Sidebar } from "./components/Sidebar";
import { CustomerLogin } from "./components/customer/CustomerLogin";
import { CustomerDashboard } from "./components/customer/CustomerDashboard";
import { Unit, UserRole, ROLE_PERMISSIONS, mockUnits, USER_PROFILES, UserProfile } from "./data/mockData";
import { Search, Bell, ChevronDown, Check, Play } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type View = 'dashboard' | 'unitDetail' | 'collections' | 'reports' | 'settings' | 'documents' | 'activity' | 'communications' | 'bulk' | 'units' | 'customers';
type AppMode = 'admin' | 'customer';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [customerUnitId, setCustomerUnitId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('Executive');
  const [selectedProject, setSelectedProject] = useState<string>('All Projects');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleChangeNotice, setShowRoleChangeNotice] = useState(false);
  const [roleChangeMessage, setRoleChangeMessage] = useState('');
  const [showDemoTour, setShowDemoTour] = useState(false);

  const currentUser = USER_PROFILES[currentRole];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever view changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentView]);

  const handleViewUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setCurrentView('unitDetail');
  };

  const handleUpdateUnit = (updatedUnit: Unit) => {
    // Update the unit in mockUnits array
    const index = mockUnits.findIndex(u => u.id === updatedUnit.id);
    if (index !== -1) {
      mockUnits[index] = updatedUnit;
    }
    // Update selectedUnit state
    setSelectedUnit(updatedUnit);
  };

  const handleViewCollections = () => {
    setCurrentView('collections');
  };

  const handleViewReports = () => {
    setCurrentView('reports');
  };

  const handleViewSettings = () => {
    setCurrentView('settings');
  };

  const handleViewDocuments = () => {
    setCurrentView('documents');
  };

  const handleViewActivity = () => {
    setCurrentView('activity');
  };

  const handleViewCommunications = () => {
    setCurrentView('communications');
  };

  const handleViewBulkOperations = () => {
    setCurrentView('bulk');
  };

  const handleBack = () => {
    setCurrentView('dashboard');
    setSelectedUnit(null);
  };

  const handleNavigate = (view: 'dashboard' | 'collections' | 'reports' | 'settings' | 'documents' | 'activity' | 'communications' | 'bulk' | 'units' | 'customers') => {
    if (view === 'dashboard') {
      setCurrentView('dashboard');
      setSelectedUnit(null);
    } else {
      setCurrentView(view);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    
    // Get permissions for new role
    const newPermissions = ROLE_PERMISSIONS[newRole];
    
    // If current view is dashboard but new role can't view it, redirect to collections
    if (currentView === 'dashboard' && !newPermissions.canViewDashboard) {
      setCurrentView('collections');
      setSelectedUnit(null);
    }
    
    // Close the dropdown
    setShowUserDropdown(false);
    
    // Show role change notice
    setRoleChangeMessage(`Switched to ${newRole} role`);
    setShowRoleChangeNotice(true);
    
    // Hide notice after 3 seconds
    setTimeout(() => {
      setShowRoleChangeNotice(false);
    }, 3000);
  };

  const handleUnitAdded = (unit: Unit) => {
    // Add unit to mock data
    mockUnits.push(unit);
    
    // Show success toast
    setShowSuccessToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleCustomerLogin = (unitId: string) => {
    setCustomerUnitId(unitId);
    setAppMode('customer');
  };

  const handleCustomerLogout = () => {
    setAppMode('admin');
    setCustomerUnitId(null);
  };

  const handleSwitchToCustomerMode = () => {
    setAppMode('customer');
  };

  const handleSwitchToAdminMode = () => {
    setAppMode('admin');
    setCustomerUnitId(null);
  };

  const permissions = ROLE_PERMISSIONS[currentRole];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Executive': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Manager': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Encoder': return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Render Customer Portal
  if (appMode === 'customer') {
    if (!customerUnitId) {
      return (
        <>
          <CustomerLogin 
            onLogin={handleCustomerLogin}
            onBackToAdmin={handleSwitchToAdminMode}
          />
          <Toaster position="top-right" richColors />
        </>
      );
    }

    const unit = mockUnits.find(u => u.id === customerUnitId);
    if (!unit) {
      return <div>Unit not found</div>;
    }

    return (
      <>
        <CustomerDashboard 
          unit={unit}
          onLogout={handleCustomerLogout}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Render Admin Portal
  return (
    <div className="flex h-screen" style={{ background: '#F9FAFB' }}>
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView === 'unitDetail' ? 'dashboard' : currentView}
        onNavigate={handleNavigate}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onSwitchToCustomer={handleSwitchToCustomerMode}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header Bar */}
        <div style={{
          height: '72px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0
        }}>
          {/* Left: Search */}
          <div style={{ flex: '0 0 320px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '14px',
                color: '#9CA3AF',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                placeholder="Search units, buyers, projects..."
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '42px',
                  paddingRight: '14px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#111827',
                  background: '#F9FAFB',
                  outline: 'none',
                  transition: 'all 150ms ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#EF4444';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.background = '#F9FAFB';
                }}
              />
            </div>
          </div>

          {/* Center: Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Demo Tour Button */}
            <button
              onClick={() => setShowDemoTour(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.25)';
              }}
            >
              <Play size={16} style={{ color: '#FFFFFF' }} />
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF'
              }}>
                Start Demo Tour
              </span>
            </button>

            <div style={{
              width: '1px',
              height: '20px',
              background: '#E5E7EB',
              margin: '0 4px'
            }} />

            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#111827'
            }}>
              All Systems Operational
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#10B981',
              borderRadius: '50%',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
            }} />
          </div>

          {/* Right: Notifications & User */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Notifications */}
            <button style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#F9FAFB';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}>
              <Bell size={18} style={{ color: '#6B7280' }} />
              {/* Notification badge */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                background: '#EF4444',
                borderRadius: '50%',
                border: '2px solid #FFFFFF'
              }} />
            </button>

            {/* User Profile */}
            <div style={{ position: 'relative' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px 6px 6px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#F9FAFB';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  {currentUser.initials}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#111827',
                    lineHeight: '18px'
                  }}>
                    {currentUser.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    lineHeight: '16px'
                  }}>
                    {currentUser.department}
                  </p>
                </div>
                <ChevronDown size={16} style={{ color: '#9CA3AF', marginLeft: '4px' }} />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 9998
                    }}
                    onClick={() => setShowUserDropdown(false)}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: '0',
                    width: '280px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    overflow: 'hidden'
                  }}>
                    {/* Current User Info */}
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid #E5E7EB',
                      background: '#F9FAFB'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '15px',
                          fontWeight: 600
                        }}>
                          {currentUser.initials}
                        </div>
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#111827',
                            lineHeight: '20px'
                          }}>
                            {currentUser.name}
                          </p>
                          <p style={{
                            fontSize: '13px',
                            color: '#6B7280',
                            lineHeight: '18px'
                          }}>
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Switch User Section */}
                    <div style={{ padding: '8px 0' }}>
                      <p style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CA3AF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '8px 16px 4px',
                        lineHeight: '16px'
                      }}>
                        Switch User (Demo)
                      </p>
                      
                      {(Object.keys(USER_PROFILES) as UserRole[]).map((role) => {
                        const user = USER_PROFILES[role];
                        const isActive = currentRole === role;
                        
                        return (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 16px',
                              background: isActive ? '#FEF2F2' : 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background 150ms ease',
                              textAlign: 'left'
                            }}
                            onMouseOver={(e) => {
                              if (!isActive) e.currentTarget.style.background = '#F9FAFB';
                            }}
                            onMouseOut={(e) => {
                              if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: isActive 
                                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                                : '#F3F4F6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isActive ? '#FFFFFF' : '#6B7280',
                              fontSize: '13px',
                              fontWeight: 600,
                              flexShrink: 0
                            }}>
                              {user.initials}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: isActive ? '#EF4444' : '#111827',
                                lineHeight: '18px',
                                marginBottom: '2px'
                              }}>
                                {user.name}
                              </p>
                              <p style={{
                                fontSize: '12px',
                                color: '#6B7280',
                                lineHeight: '16px'
                              }}>
                                {user.role} • {user.department}
                              </p>
                            </div>
                            {isActive && (
                              <Check size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto' }}>
          {/* Role Access Notice */}
          {!permissions.canViewDashboard && currentView === 'dashboard' && (
            <div style={{ padding: '24px 32px' }}>
              <div style={{ 
                padding: '16px', 
                background: '#FFF3E0', 
                border: '1px solid var(--neuron-semantic-warn)',
                borderRadius: '12px'
              }}>
                <p style={{ 
                  fontSize: '14px',
                  color: 'var(--neuron-semantic-warn)',
                  lineHeight: '21px'
                }}>
                  <strong>{currentRole}</strong> role does not have access to the Executive Dashboard. 
                  Switch to Executive or Manager role to view dashboard metrics.
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          {permissions.canViewDashboard && currentView === 'dashboard' && (
            <>
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
                  Executive Dashboard
                </h1>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '20px'
                }}>
                  Real-time portfolio overview and daily operations
                </p>
              </div>
              <ExecutiveDashboard 
                onViewUnit={handleViewUnit}
                onViewCollections={handleViewCollections}
                selectedProject={selectedProject}
                onUnitAdded={handleUnitAdded}
              />
            </>
          )}

          {currentView === 'unitDetail' && selectedUnit && (
            <UnitDetailView 
              unit={selectedUnit}
              onBack={handleBack}
              onUpdateUnit={handleUpdateUnit}
            />
          )}

          {currentView === 'collections' && (
            <>
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
                  Collections & Risk Management
                </h1>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '20px'
                }}>
                  Track overdue accounts and manage payment collections
                </p>
              </div>
              <CollectionsView
                onViewUnit={handleViewUnit}
                onBack={handleBack}
              />
            </>
          )}

          {currentView === 'reports' && (
            <>
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
                  Reports & Analytics
                </h1>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '20px'
                }}>
                  Performance metrics and exportable reports
                </p>
              </div>
              <ReportsView
                selectedProject={selectedProject}
              />
            </>
          )}

          {currentView === 'settings' && (
            <>
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
                  Settings
                </h1>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '20px'
                }}>
                  Configure application settings and preferences
                </p>
              </div>
              <SettingsView
                currentRole={currentRole}
              />
            </>
          )}

          {currentView === 'documents' && (
            <DocumentsView
              currentRole={currentRole}
            />
          )}

          {currentView === 'activity' && (
            <ActivityLogView
              currentRole={currentRole}
            />
          )}

          {currentView === 'communications' && (
            <CommunicationsView
              currentRole={currentRole}
            />
          )}

          {currentView === 'bulk' && (
            <BulkOperationsView
              currentRole={currentRole}
            />
          )}

          {currentView === 'units' && (
            <UnitsView
              onViewUnit={handleViewUnit}
              selectedProject={selectedProject}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              onViewUnit={handleViewUnit}
              selectedProject={selectedProject}
            />
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-brand-green)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          animation: 'slideIn 200ms ease-out'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--neuron-brand-green-50)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6663 5L7.49967 14.1667L3.33301 10" stroke="var(--neuron-brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--neuron-ink-primary)',
              lineHeight: '20px',
              marginBottom: '2px'
            }}>
              Dashboard updated automatically
            </p>
            <p style={{
              fontSize: '13px',
              color: 'var(--neuron-ink-muted)',
              lineHeight: '18px'
            }}>
              Unit added and metrics recalculated
            </p>
          </div>
        </div>
      )}

      {/* Role Change Notice */}
      {showRoleChangeNotice && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'var(--neuron-bg-elevated)',
          border: '1px solid var(--neuron-brand-green)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          animation: 'slideIn 200ms ease-out'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--neuron-brand-green-50)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6663 5L7.49967 14.1667L3.33301 10" stroke="var(--neuron-brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--neuron-ink-primary)',
              lineHeight: '20px',
              marginBottom: '2px'
            }}>
              {roleChangeMessage}
            </p>
          </div>
        </div>
      )}

      {/* Demo Tour */}
      {showDemoTour && (
        <DemoTour
          isOpen={showDemoTour}
          onClose={() => setShowDemoTour(false)}
          currentView={currentView}
          onNavigate={handleNavigate}
          onUnitSelect={handleViewUnit}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Sonner Toaster for notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}