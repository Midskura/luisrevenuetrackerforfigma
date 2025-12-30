import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

type TourStep = {
  id: number;
  title: string;
  instruction: string;
  targetSelector?: string;
  navigateTo?: string; // Auto-navigate when clicking Next
  waitForView?: string;
  waitForAction?: 'unit-selected' | 'payment-modal-opened' | 'payment-recorded';
  position: 'bottom-right' | 'top-left' | 'center';
  preferredPosition?: 'bottom-right' | 'top-left'; // Preferred position (will auto-adjust if blocking)
};

const tourSteps: TourStep[] = [
  {
    id: 0,
    title: "Let's Process a Real Payment! 💰",
    instruction: "We'll walk through handling an overdue account: Find at-risk units, review details, log payment, and track the impact.",
    position: 'center'
  },
  {
    id: 1,
    title: "Step 1: Go to Collections",
    instruction: "Click 'Next' to view all at-risk accounts that need attention.",
    targetSelector: '[data-tour-id="nav-collections"]',
    navigateTo: 'collections',
    waitForView: 'collections',
    position: 'bottom-right',
    preferredPosition: 'bottom-right'
  },
  {
    id: 2,
    title: "Step 2: Find Irene Villanueva",
    instruction: "Look for Irene Villanueva (Unit B4-L08) - she's 45 days overdue. Click her card to see details.",
    targetSelector: '[data-tour-target="collections-list"]',
    waitForView: 'unitDetail',
    position: 'top-left',
    preferredPosition: 'top-left'
  },
  {
    id: 3,
    title: "Step 3: Review Payment Schedule",
    instruction: "Scroll down to see the payment schedule with overdue months in red. Notice she owes ₱35,000. Click 'Got it' when ready.",
    targetSelector: '[data-tour-target="payment-schedule"]',
    position: 'bottom-right',
    preferredPosition: 'bottom-right'
  },
  {
    id: 4,
    title: "Step 4: Record Payment",
    instruction: "Now click 'Log Payment' button, enter:\n• Amount: 35000\n• Method: GCash\n• Reference: GCash-123\n\nThen click 'Record Payment'. Click 'Got it' after recording.",
    targetSelector: '[data-tour-target="log-payment-button"]',
    position: 'bottom-right',
    preferredPosition: 'bottom-right'
  },
  {
    id: 5,
    title: "Step 5: Check Updated Balance",
    instruction: "Payment recorded! The balance should have decreased. Click 'Next' to see portfolio impact.",
    navigateTo: 'dashboard',
    waitForView: 'dashboard',
    position: 'bottom-right',
    preferredPosition: 'bottom-right'
  },
  {
    id: 6,
    title: "Step 6: Dashboard Impact",
    instruction: "Check the metrics - total receivables decreased and collection rate improved!",
    targetSelector: '[data-tour-target="dashboard-metrics"]',
    position: 'top-left',
    preferredPosition: 'top-left'
  },
  {
    id: 7,
    title: "Workflow Complete! 🎊",
    instruction: "You just completed a full revenue cycle:\n✓ Identified at-risk account\n✓ Reviewed payment history\n✓ Logged payment\n✓ Tracked portfolio impact\n\nExplore more on your own!",
    position: 'center'
  }
];

type DemoTourProps = {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: any) => void;
  onActionCompleted?: (action: string) => void;
};

export function DemoTour({ isOpen, onClose, currentView, onNavigate, onActionCompleted }: DemoTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [cardPosition, setCardPosition] = useState<'bottom-right' | 'top-left' | 'center'>('bottom-right');

  const currentStep = tourSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / tourSteps.length) * 100;
  const isComplete = currentStepIndex === tourSteps.length - 1;
  const isWelcome = currentStepIndex === 0;

  // Track element position
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Update target element and check if card blocks it
  useEffect(() => {
    if (!isOpen || !currentStep.targetSelector) {
      setTargetElement(null);
      setTargetRect(null);
      setCardPosition(currentStep.position);
      return;
    }

    const updateTarget = () => {
      const element = document.querySelector(currentStep.targetSelector!);
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);

        // Auto-scroll the element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Check if card would block the target element
        if (currentStep.preferredPosition) {
          const cardHeight = 280; // Approximate card height
          const cardWidth = 420;

          let usePosition = currentStep.preferredPosition;

          if (currentStep.preferredPosition === 'bottom-right') {
            // Check if card in bottom-right would overlap target
            const cardTop = window.innerHeight - cardHeight - 32;
            const cardLeft = window.innerWidth - cardWidth - 32;
            
            if (
              rect.bottom > cardTop &&
              rect.right > cardLeft
            ) {
              // Would block, move to top-left
              usePosition = 'top-left';
            }
          } else if (currentStep.preferredPosition === 'top-left') {
            // Check if card in top-left would overlap target
            const cardBottom = 100 + cardHeight;
            const cardRight = 320 + cardWidth;
            
            if (
              rect.top < cardBottom &&
              rect.left < cardRight
            ) {
              // Would block, move to bottom-right
              usePosition = 'bottom-right';
            }
          }

          setCardPosition(usePosition);
        } else {
          setCardPosition(currentStep.position);
        }
      }
    };

    // Initial update with delay to allow DOM to settle
    const initialTimeout = setTimeout(updateTarget, 300);

    // Update on scroll and resize
    const handleUpdate = () => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    
    const interval = setInterval(updateTarget, 150);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      clearInterval(interval);
    };
  }, [isOpen, currentStep.targetSelector, currentStep.position, currentStep.preferredPosition, targetElement]);

  // Auto-advance when user navigates to correct view
  useEffect(() => {
    if (!isOpen || !currentStep.waitForView) return;

    if (currentView === currentStep.waitForView) {
      const timer = setTimeout(() => {
        if (currentStepIndex < tourSteps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentView, currentStep.waitForView, currentStepIndex, isOpen]);

  // Auto-advance when user completes action
  useEffect(() => {
    if (!isOpen || !currentStep.waitForAction) return;

    if (completedActions.has(currentStep.waitForAction)) {
      const timer = setTimeout(() => {
        if (currentStepIndex < tourSteps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [completedActions, currentStep.waitForAction, currentStepIndex, isOpen]);

  const handleStartTour = () => {
    setCurrentStepIndex(1);
  };

  const handleCloseTour = () => {
    setCurrentStepIndex(0);
    setCompletedActions(new Set());
    setTargetRect(null);
    setTargetElement(null);
    onClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setCompletedActions(new Set());
    setTargetRect(null);
    setTargetElement(null);
    onNavigate('dashboard');
  };

  const handleNext = () => {
    // If step has navigateTo, navigate first
    if (currentStep.navigateTo) {
      onNavigate(currentStep.navigateTo);
    }
    
    // If not waiting for action/view, advance immediately
    if (!currentStep.waitForView && !currentStep.waitForAction) {
      if (currentStepIndex < tourSteps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
    // Otherwise, wait for the view/action to complete (handled by useEffect)
  };

  if (!isOpen) return null;

  // Calculate card position based on current position state
  const getCardStyle = () => {
    if (cardPosition === 'center') {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001
      };
    }

    if (cardPosition === 'bottom-right') {
      return {
        position: 'fixed' as const,
        bottom: '32px',
        right: '32px',
        zIndex: 10001
      };
    }

    // top-left
    return {
      position: 'fixed' as const,
      top: '100px',
      left: '320px',
      zIndex: 10001
    };
  };

  const showWaitingIndicator = (currentStep.waitForView || currentStep.waitForAction) && 
                                !isComplete && 
                                !isWelcome &&
                                !currentStep.navigateTo; // Don't show if we have a Next button that navigates

  return (
    <>
      {/* Highlight target element - no overlay, just border */}
      {!isWelcome && !isComplete && targetRect && (
        <>
          {/* Spotlight border that follows the element */}
          <div style={{
            position: 'fixed',
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            borderRadius: '12px',
            zIndex: 10000,
            pointerEvents: 'none',
            border: '3px solid #EF4444',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
            transition: 'all 300ms ease',
            animation: 'tourPulse 2s ease-in-out infinite'
          }} />
          
          {/* Arrow pointing to target */}
          <div style={{
            position: 'fixed',
            top: cardPosition === 'top-left' ? `${targetRect.bottom + 12}px` : `${targetRect.top - 44}px`,
            left: `${targetRect.left + targetRect.width / 2}px`,
            transform: 'translateX(-50%)',
            fontSize: '32px',
            zIndex: 10000,
            animation: 'bounce 1.5s ease-in-out infinite',
            filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.5))',
            pointerEvents: 'none'
          }}>
            {cardPosition === 'top-left' ? '☝️' : '👇'}
          </div>
        </>
      )}

      {/* Tour Card - Smaller and elevated */}
      <div style={{
        ...getCardStyle(),
        maxWidth: cardPosition === 'center' ? '520px' : '420px',
        width: cardPosition === 'center' ? '90%' : 'auto',
        transition: 'all 400ms ease'
      }}>
        <Card style={{
          background: '#FFFFFF',
          border: '2px solid #EF4444',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Compact Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isComplete ? (
                    <CheckCircle size={18} style={{ color: '#FFFFFF' }} />
                  ) : (
                    <Sparkles size={18} style={{ color: '#FFFFFF' }} />
                  )}
                </div>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '2px'
                  }}>
                    Guided Tour
                  </p>
                  <p style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontWeight: 500
                  }}>
                    Step {currentStepIndex + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseTour}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={16} style={{ color: '#FFFFFF' }} />
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{
              marginTop: '12px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: '#FFFFFF',
                transition: 'width 400ms ease',
                borderRadius: '3px',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
              }} />
            </div>
          </div>

          {/* Compact Content */}
          <div style={{ padding: '20px' }}>
            <h3 style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '8px',
              lineHeight: '24px'
            }}>
              {currentStep.title}
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#4B5563',
              lineHeight: '21px',
              marginBottom: showWaitingIndicator ? '14px' : '16px',
              whiteSpace: 'pre-line'
            }}>
              {currentStep.instruction}
            </p>

            {/* Compact Waiting indicator */}
            {showWaitingIndicator && (
              <div style={{
                padding: '10px 14px',
                background: '#FEF2F2',
                border: '1.5px solid #EF4444',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  animation: 'blink 1.5s ease-in-out infinite',
                  flexShrink: 0
                }} />
                <p style={{
                  fontSize: '12px',
                  color: '#991B1B',
                  fontWeight: 600,
                  margin: 0,
                  flex: 1
                }}>
                  Waiting for you...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {isWelcome && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCloseTour}
                    style={{ color: '#6B7280', fontSize: '13px', height: '36px' }}
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleStartTour}
                    style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      height: '36px'
                    }}
                  >
                    Start
                    <ArrowRight size={14} />
                  </Button>
                </>
              )}

              {!isWelcome && !isComplete && (
                <Button
                  onClick={handleNext}
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    height: '36px'
                  }}
                >
                  {currentStep.navigateTo ? 'Next' : 'Got it'}
                  <ArrowRight size={14} />
                </Button>
              )}

              {isComplete && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleRestart}
                    style={{ color: '#6B7280', fontSize: '13px', height: '36px' }}
                  >
                    Restart
                  </Button>
                  <Button
                    onClick={handleCloseTour}
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      height: '36px'
                    }}
                  >
                    <CheckCircle size={14} />
                    Done
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes tourPulse {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(239, 68, 68, 1);
            transform: scale(1.01);
          }
        }
        @keyframes bounce {
          0%, 100% { 
            transform: translateX(-50%) translateY(0);
          }
          50% { 
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}