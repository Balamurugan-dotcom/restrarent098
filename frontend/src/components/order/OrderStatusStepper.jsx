import React from 'react';
import { CheckCircle2, UtensilsCrossed, Bike, Check, XCircle } from 'lucide-react';

const steps = [
  { key: 'Order Placed', label: 'Order Placed', icon: CheckCircle2, desc: 'Received & verified by kitchen' },
  { key: 'Preparing', label: 'Preparing', icon: UtensilsCrossed, desc: 'Fresh ingredients being cooked' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, desc: 'Delivery partner on the way' },
  { key: 'Delivered', label: 'Delivered', icon: Check, desc: 'Enjoy your meal in Bangalore!' },
];

const OrderStatusStepper = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div
        style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          margin: '2rem 0',
        }}
      >
        <XCircle size={44} color="#EF4444" style={{ margin: '0 auto 0.5rem auto' }} />
        <h3 style={{ color: '#991B1B', fontSize: '1.25rem' }}>Order Cancelled</h3>
        <p style={{ color: '#B91C1C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          This order has been cancelled and will not be prepared or delivered.
        </p>
      </div>
    );
  }

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="tracking-stepper">
      {steps.map((step, idx) => {
        const IconComponent = step.icon;
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div
            key={step.key}
            className={`tracking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="step-icon-bubble">
              {isCompleted ? <Check size={22} /> : <IconComponent size={22} />}
            </div>
            <div>
              <div className="step-title">{step.label}</div>
              <div className="step-time">{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;
