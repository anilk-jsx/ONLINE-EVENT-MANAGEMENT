import React, { useState, useRef, useEffect } from 'react';
import './SwipeToPay.css';

const SwipeToPay = ({ onPaymentComplete, disabled, amount }) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [leftPosition, setLeftPosition] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const handleDragStart = (e) => {
    if (disabled || isSuccess) return;
    setIsSwiping(true);
  };

  const handleDrag = (e) => {
    if (!isSwiping || disabled || isSuccess) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    
    const maxLeft = trackRect.width - thumbRect.width - 6; // Adjust for padding
    
    let newLeft = clientX - trackRect.left - (thumbRect.width / 2);
    
    if (newLeft < 0) newLeft = 0;
    
    if (newLeft >= maxLeft) {
      newLeft = maxLeft;
      setIsSuccess(true);
      setIsSwiping(false);
      onPaymentComplete();
    }
    
    setLeftPosition(newLeft);
  };

  const handleDragEnd = () => {
    if (isSuccess) return;
    setIsSwiping(false);
    setLeftPosition(0);
  };

  useEffect(() => {
    const handleMouseUp = () => handleDragEnd();
    const handleMouseMove = (e) => handleDrag(e);
    
    if (isSwiping) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isSwiping, isSuccess]);

  return (
    <div 
      className={`swipe-container ${disabled ? 'disabled' : ''} ${isSuccess ? 'success' : ''}`}
      ref={trackRef}
    >
      <div className="swipe-progress" style={{ width: `${leftPosition + 30}px` }}></div>
      <div 
        className="swipe-thumb"
        ref={thumbRef}
        style={{ left: `${leftPosition}px` }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {isSuccess ? '✓' : '>>'}
      </div>
      <div className="swipe-text" style={{ opacity: isSwiping ? 0.3 : 1 }}>
        {isSuccess ? 'Payment Successful' : `Swipe to pay ₹${amount.toLocaleString('en-IN')}`}
      </div>
    </div>
  );
};

export default SwipeToPay;
