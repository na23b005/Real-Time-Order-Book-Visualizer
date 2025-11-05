import React, { memo } from 'react';

interface HeaderProps {
  symbol: string;
  isConnected: boolean;
}

export const Header = memo<HeaderProps>(({ symbol, isConnected }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          {symbol.toUpperCase().replace('USDT', '/USDT')} Order Book Visualizer
        </h1>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      <p className="text-gray-400 mt-2">
        Real-time market data from Binance WebSocket API
      </p>
    </div>
  );
});

Header.displayName = 'Header';