import { useState, useEffect, useCallback, useRef } from 'react';
import { Trade, OrderBookData } from '../types';

export const useBinanceSocket = (symbol: string = 'btcusdt') => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: new Map(),
    asks: new Map(),
    lastUpdateId: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTradeMessage = useCallback((data: any) => {
    const trade: Trade = {
      id: data.a.toString(),
      price: parseFloat(data.p),
      quantity: parseFloat(data.q),
      time: data.T,
      isBuyerMaker: data.m
    };

    setTrades(prev => [trade, ...prev.slice(0, 49)]);
  }, []);

  const handleDepthMessage = useCallback((data: any) => {
    setOrderBook(prev => {
      const newBids = new Map(prev.bids);
      const newAsks = new Map(prev.asks);

      data.b?.forEach(([price, qty]: [string, string]) => {
        const priceNum = parseFloat(price);
        const qtyNum = parseFloat(qty);
        if (qtyNum === 0) {
          newBids.delete(priceNum);
        } else {
          newBids.set(priceNum, qtyNum);
        }
      });

      data.a?.forEach(([price, qty]: [string, string]) => {
        const priceNum = parseFloat(price);
        const qtyNum = parseFloat(qty);
        if (qtyNum === 0) {
          newAsks.delete(priceNum);
        } else {
          newAsks.set(priceNum, qtyNum);
        }
      });

      return {
        bids: newBids,
        asks: newAsks,
        lastUpdateId: data.u
      };
    });
  }, []);

  const connect = useCallback(() => {
    try {
      const tradesStream = `${symbol.toLowerCase()}@aggTrade`;
      const depthStream = `${symbol.toLowerCase()}@depth@100ms`;
      const wsUrl = `wss://stream.binance.com:9443/ws/${tradesStream}/${depthStream}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.stream) {
          if (data.stream.includes('@aggTrade')) {
            handleTradeMessage(data.data);
          } else if (data.stream.includes('@depth')) {
            handleDepthMessage(data.data);
          }
        } else {
          if (data.e === 'aggTrade') {
            handleTradeMessage(data);
          } else if (data.e === 'depthUpdate') {
            handleDepthMessage(data);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [symbol, handleTradeMessage, handleDepthMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { trades, orderBook, isConnected };
};