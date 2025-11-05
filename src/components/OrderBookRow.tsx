import React, { memo } from 'react';

interface OrderBookRowProps {
  price: number;
  quantity: number;
  total: number;
  maxTotal: number;
  isBid: boolean;
}

export const OrderBookRow = memo<OrderBookRowProps>(({ 
  price, 
  quantity, 
  total, 
  maxTotal, 
  isBid 
}) => {
  const percentage = (total / maxTotal) * 100;

  return (
    <div className="relative h-6 flex items-center text-xs font-mono">
      <div
        className={`absolute inset-0 ${isBid ? 'bg-green-500/20' : 'bg-red-500/20'}`}
        style={{ 
          width: `${percentage}%`, 
          right: isBid ? 0 : 'auto', 
          left: isBid ? 'auto' : 0 
        }}
      />
      <div className="relative z-10 w-full flex justify-between px-2">
        <span className={isBid ? 'text-green-400' : 'text-red-400'}>
          {price.toFixed(2)}
        </span>
        <span className="text-gray-300">{quantity.toFixed(6)}</span>
        <span className="text-gray-400">{total.toFixed(6)}</span>
      </div>
    </div>
  );
});

OrderBookRow.displayName = 'OrderBookRow';