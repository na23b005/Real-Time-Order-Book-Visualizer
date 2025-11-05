import React, { memo } from 'react';

interface SpreadProps {
  spread: number;
  spreadPercentage: number;
}

export const Spread = memo<SpreadProps>(({ spread, spreadPercentage }) => {
  return (
    <div className="mt-4 p-3 bg-gray-800 rounded text-center">
      <div className="text-gray-400 text-xs mb-1">Spread</div>
      <div className="text-yellow-400 font-mono text-lg font-bold">
        {spread.toFixed(2)} USDT ({spreadPercentage.toFixed(3)}%)
      </div>
    </div>
  );
});

Spread.displayName = 'Spread';