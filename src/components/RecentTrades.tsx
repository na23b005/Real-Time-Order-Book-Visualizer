import React, { memo, useState, useEffect } from 'react';
import { Trade } from '../types';
import { TradeRow } from './TradeRow';

interface RecentTradesProps {
  trades: Trade[];
}

export const RecentTrades = memo<RecentTradesProps>(({ trades }) => {
  const [flashingTrades, setFlashingTrades] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (trades.length > 0) {
      const latestTrade = trades[0];
      setFlashingTrades(new Set([latestTrade.id]));
      const timeout = setTimeout(() => {
        setFlashingTrades(new Set());
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [trades]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
      <div className="flex justify-between px-2 mb-2 text-xs font-semibold text-gray-400">
        <span>Price (USDT)</span>
        <span>Amount (BTC)</span>
        <span>Time</span>
      </div>
      <div className="space-y-0.5 max-h-[600px] overflow-y-auto">
        {trades.map((trade) => {
          const isFlashing = flashingTrades.has(trade.id);
          const isBuy = !trade.isBuyerMaker;
          const time = new Date(trade.time).toLocaleTimeString();

          return (
            <TradeRow
              key={trade.id}
              price={trade.price}
              quantity={trade.quantity}
              time={time}
              isBuy={isBuy}
              isFlashing={isFlashing}
            />
          );
        })}
      </div>
    </div>
  );
});

RecentTrades.displayName = 'RecentTrades';