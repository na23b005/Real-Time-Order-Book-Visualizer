import React, { memo } from 'react';
import { OrderBookRow } from './OrderBookRow';
import { OrderBookRowData } from '../types';

interface OrderBookSideProps {
  data: OrderBookRowData[];
  maxTotal: number;
  isBid: boolean;
  title: string;
}

export const OrderBookSide = memo<OrderBookSideProps>(({ 
  data, 
  maxTotal, 
  isBid, 
  title 
}) => {
  return (
    <div>
      <div className="flex justify-between px-2 mb-2 text-xs font-semibold text-gray-400">
        <span>Price (USDT)</span>
        <span>Amount (BTC)</span>
        <span>Total</span>
      </div>
      <div className="space-y-0.5">
        {data.map((level) => (
          <OrderBookRow
            key={level.price}
            price={level.price}
            quantity={level.quantity}
            total={level.total}
            maxTotal={maxTotal}
            isBid={isBid}
          />
        ))}
      </div>
    </div>
  );
});

OrderBookSide.displayName = 'OrderBookSide';