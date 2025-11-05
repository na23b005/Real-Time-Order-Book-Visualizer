import React, { memo, useMemo } from 'react';
import { OrderBookData } from '../types';
import { OrderBookSide } from './OrderBookSide';
import { Spread } from './Spread';

interface OrderBookProps {
  orderBook: OrderBookData;
}

export const OrderBook = memo<OrderBookProps>(({ orderBook }) => {
  const sortedBids = useMemo(() => {
    return Array.from(orderBook.bids.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 20);
  }, [orderBook.bids]);

  const sortedAsks = useMemo(() => {
    return Array.from(orderBook.asks.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 20);
  }, [orderBook.asks]);

  const bidsWithTotal = useMemo(() => {
    let cumulative = 0;
    return sortedBids.map(([price, qty]) => {
      cumulative += qty;
      return { price, quantity: qty, total: cumulative };
    });
  }, [sortedBids]);

  const asksWithTotal = useMemo(() => {
    let cumulative = 0;
    return sortedAsks.map(([price, qty]) => {
      cumulative += qty;
      return { price, quantity: qty, total: cumulative };
    });
  }, [sortedAsks]);

  const maxBidTotal = useMemo(() => 
    Math.max(...bidsWithTotal.map(b => b.total), 1),
    [bidsWithTotal]
  );

  const maxAskTotal = useMemo(() => 
    Math.max(...asksWithTotal.map(a => a.total), 1),
    [asksWithTotal]
  );

  const spread = useMemo(() => {
    const lowestAsk = sortedAsks[0]?.[0];
    const highestBid = sortedBids[0]?.[0];
    if (lowestAsk && highestBid) {
      return lowestAsk - highestBid;
    }
    return 0;
  }, [sortedAsks, sortedBids]);

  const spreadPercentage = useMemo(() => {
    const highestBid = sortedBids[0]?.[0];
    if (highestBid && spread) {
      return (spread / highestBid) * 100;
    }
    return 0;
  }, [spread, sortedBids]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Order Book</h2>
      <div className="grid grid-cols-2 gap-4">
        <OrderBookSide
          data={bidsWithTotal}
          maxTotal={maxBidTotal}
          isBid={true}
          title="Bids"
        />
        <OrderBookSide
          data={asksWithTotal}
          maxTotal={maxAskTotal}
          isBid={false}
          title="Asks"
        />
      </div>
      <Spread spread={spread} spreadPercentage={spreadPercentage} />
    </div>
  );
});

OrderBook.displayName = 'OrderBook';