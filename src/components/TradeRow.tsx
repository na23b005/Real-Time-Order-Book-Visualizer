import React, { memo } from 'react';

interface TradeRowProps {
  price: number;
  quantity: number;
  time: string;
  isBuy: boolean;
  isFlashing: boolean;
}

export const TradeRow = memo<TradeRowProps>(({ 
  price, 
  quantity, 
  time, 
  isBuy, 
  isFlashing 
}) => {
  return (
    <div
      className={`flex justify-between px-2 py-1 text-xs font-mono transition-colors ${
        isFlashing
          ? isBuy
            ? 'bg-green-500/30'
            : 'bg-red-500/30'
          : 'bg-transparent'
      }`}
    >
      <span className={isBuy ? 'text-green-400' : 'text-red-400'}>
        {price.toFixed(2)}
      </span>
      <span className="text-gray-300">{quantity.toFixed(6)}</span>
      <span className="text-gray-500 text-[10px]">{time}</span>
    </div>
  );
});

TradeRow.displayName = 'TradeRow';