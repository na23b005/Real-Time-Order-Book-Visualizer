'use client';

import React, { useState } from 'react';
import { useBinanceSocket } from '../src/hooks/useBinanceSocket';
import { Header } from '../src/components/Header';
import { OrderBook } from '../src/components/OrderBook';
import { RecentTrades } from '../src/components/RecentTrades';

export default function Home() {
  const [symbol] = useState('btcusdt');
  const { trades, orderBook, isConnected } = useBinanceSocket(symbol);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <Header symbol={symbol} isConnected={isConnected} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrderBook orderBook={orderBook} />
          </div>
          <div>
            <RecentTrades trades={trades} />
          </div>
        </div>
      </div>
    </div>
  );
}