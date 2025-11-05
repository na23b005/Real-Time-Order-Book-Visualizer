# 📊 Real-Time Order Book Visualizer

A high-performance, real-time stock order book visualizer built with Next.js, TypeScript, and the Binance WebSocket API. This application demonstrates advanced state management, WebSocket handling, and UI optimization techniques essential for financial technology applications.

## 🚀 Live Demo

**[View Live Application →](https://live-orderbook.netlify.app/)**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css)
![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=flat&logo=netlify)

---

## 🎯 Features

### Core Functionality
- **Real-Time Order Book**: Live bid/ask prices with depth visualization
- **Recent Trades Stream**: 50 most recent trades with buy/sell indicators
- **Spread Calculation**: Real-time spread display with percentage
- **Depth Chart Visualization**: Background bars showing cumulative volume
- **Auto-Reconnection**: Robust WebSocket connection with automatic retry
- **Flash Animations**: Visual feedback for new trades

### Technical Highlights
- **High-Performance State Management**: Efficient Map-based data structures for O(1) updates
- **Optimized Rendering**: Strategic use of React.memo, useMemo, and useCallback
- **Type-Safe**: Full TypeScript implementation with comprehensive interfaces
- **Component Architecture**: Modular, reusable, and maintainable code structure
- **Real-Time Data Processing**: Handles high-frequency market data without lag

---

## 🏗️ Architecture & Design Decisions

### 1. WebSocket Management (`useBinanceSocket`)

**Decision**: Custom hook for WebSocket connection management

**Rationale**:
- Encapsulates all WebSocket logic in a single, reusable hook
- Provides clean separation between data fetching and UI components
- Handles connection lifecycle, reconnection, and cleanup automatically

**Implementation Details**:
- Connects to Binance's combined WebSocket stream for efficiency
- Subscribes to both aggregate trades (`@aggTrade`) and depth updates (`@depth@100ms`)
- Automatic reconnection with 3-second delay on disconnect
- Message routing based on event type

### 2. State Management

**Decision**: React hooks (useState, useCallback, useMemo) instead of external libraries

**Rationale**:
- Keeps dependencies minimal and bundle size small
- Built-in hooks are sufficient for this use case
- Easier to understand and maintain for future developers

**Data Structures**:
- **Map for Order Book**: Provides O(1) insertion, deletion, and lookup
- **Array for Trades**: Simple append-only structure with slice for size limit

### 3. Performance Optimizations

#### Component Memoization
```typescript
export const OrderBookRow = memo<OrderBookRowProps>(({ ... }) => {
  // Only re-renders when props change
});
```

**Why**: Prevents unnecessary re-renders of individual rows when other parts of the order book update.

#### Computed Values Memoization
```typescript
const sortedBids = useMemo(() => {
  return Array.from(orderBook.bids.entries())
    .sort((a, b) => b[0] - a[0])
    .slice(0, 20);
}, [orderBook.bids]);
```

**Why**: Expensive sorting operations only run when the underlying data changes.

#### Callback Stabilization
```typescript
const handleTradeMessage = useCallback((data: any) => {
  // Stable reference across renders
}, []);
```

**Why**: Prevents child components from re-rendering due to function reference changes.

### 4. Order Book Delta Processing

**Challenge**: Binance sends incremental updates (deltas), not full snapshots

**Solution**:
- Maintain full order book state in Map
- Process each delta: update if quantity > 0, delete if quantity = 0
- Compute sorted views and cumulative totals on-demand

```typescript
data.b?.forEach(([price, qty]: [string, string]) => {
  const priceNum = parseFloat(price);
  const qtyNum = parseFloat(qty);
  if (qtyNum === 0) {
    newBids.delete(priceNum);  // Remove price level
  } else {
    newBids.set(priceNum, qtyNum);  // Update price level
  }
});
```

### 5. UI/UX Design

**Dark Theme**: Financial traders prefer dark themes for extended screen time

**Color Coding**:
- Green = Bids (buyers) / Buy trades
- Red = Asks (sellers) / Sell trades
- Yellow = Spread (neutral indicator)

**Depth Visualization**: Background bars show relative volume at each price level
- Bar width proportional to cumulative total
- Helps identify significant support/resistance levels

**Flash Animation**: New trades flash briefly to draw attention
- 500ms flash duration
- Color-coded by trade direction

---

## 📁 Project Structure

```
src/
├── app/
│   └── page.tsx                 # Main application page (App Router)
│
├── components/
│   ├── Header.tsx               # App header with connection status
│   ├── OrderBook.tsx            # Order book container with logic
│   ├── OrderBookSide.tsx        # Bids/Asks side component
│   ├── OrderBookRow.tsx         # Individual price level row
│   ├── Spread.tsx               # Spread display component
│   ├── RecentTrades.tsx         # Trades list container
│   └── TradeRow.tsx             # Individual trade row
│
├── hooks/
│   └── useBinanceSocket.ts      # WebSocket connection hook
│
└── types/
    └── index.ts                 # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd orderbook-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🔧 Technical Specifications

### API Integration

**Binance WebSocket Endpoints**:
```
wss://stream.binance.com:9443/ws/{symbol}@aggTrade/{symbol}@depth@100ms
```

**Aggregate Trade Stream** (`@aggTrade`):
- Event type: `aggTrade`
- Fields: price (p), quantity (q), time (T), buyer maker (m)
- Frequency: Real-time on each trade

**Depth Update Stream** (`@depth@100ms`):
- Event type: `depthUpdate`
- Fields: bids (b), asks (a), update ID (u)
- Frequency: 100ms snapshots
- Format: `[[price, quantity], ...]`

### Performance Metrics

**Target Performance**:
- 60 FPS UI rendering
- < 100ms WebSocket message processing
- < 50ms state update propagation
- Handles 100+ updates per second

**Achieved Through**:
- Memoization preventing unnecessary recalculations
- Map data structure for O(1) operations
- Minimal re-renders with React.memo
- Efficient sorting (only top 20 levels)

---

## 🎨 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useReducer, useCallback, useMemo)
- **Data Source**: Binance WebSocket API
- **Deployment**: Netlify
- **Performance**: React.memo, useMemo, useCallback

---

## 📊 Key Components

### OrderBook Component
Manages the complete order book visualization:
- Sorts bids (descending) and asks (ascending)
- Calculates cumulative totals for depth visualization
- Computes spread between best bid and ask
- Renders two-column layout with depth bars

### RecentTrades Component
Displays the 50 most recent trades:
- Flash animation for new trades
- Color-coded buy/sell indicators
- Scrollable trade history
- Real-time timestamp display

### useBinanceSocket Hook
Custom hook managing WebSocket connection:
- Automatic connection establishment
- Message parsing and routing
- State updates for trades and order book
- Reconnection logic on disconnect
- Cleanup on unmount

---

## 🐛 Known Limitations

1. **Initial Load Delay**: Order book may take 1-2 seconds to populate initially
   - **Reason**: Waiting for sufficient depth updates
   - **Potential Solution**: Implement REST API snapshot on mount

2. **Regional Restrictions**: Binance may be restricted in some countries
   - **Solution**: Use VPN or configure alternative exchange APIs

3. **Browser Compatibility**: Requires modern browser with WebSocket support
   - **Minimum**: Chrome 16+, Firefox 11+, Safari 7+

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Multiple trading pair support with selector dropdown
- [ ] Configurable order book depth levels (10, 20, 50, 100)
- [ ] Trade history chart/graph visualization
- [ ] Price alert notifications
- [ ] Export data to CSV functionality
- [ ] Dark/Light theme toggle
- [ ] Mobile-responsive optimizations
- [ ] Keyboard shortcuts for power users
- [ ] Volume-weighted average price (VWAP) indicator
- [ ] Historical data playback mode

### Technical Improvements
- [ ] Comprehensive test suite (Jest, React Testing Library)
- [ ] Error boundaries for graceful error handling
- [ ] Analytics tracking integration
- [ ] Service Worker for offline capability
- [ ] WebWorker for heavy data processing
- [ ] IndexedDB for trade history persistence
- [ ] Real-time performance monitoring
- [ ] Accessibility (WCAG 2.1 AA compliance)

---

## 🧪 Testing

### Manual Testing Checklist

- [x] Order book updates in real-time
- [x] Bids sorted descending (highest first)
- [x] Asks sorted ascending (lowest first)
- [x] Cumulative totals calculated correctly
- [x] Spread displays accurately
- [x] Depth bars scale proportionally
- [x] New trades flash appropriately
- [x] Connection status indicator works
- [x] Auto-reconnection on disconnect
- [x] No UI lag or jank during high-frequency updates
- [x] Responsive design on mobile devices
- [x] WebSocket handles network interruptions

---

## 🚢 Deployment

This application is deployed on Netlify with automatic deployments enabled.

### Deployment Configuration

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20.11.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Automatic Deployments

Every push to the `main` branch triggers an automatic deployment to:
**https://live-orderbook.netlify.app/**

---

## 📚 Learning Resources

- [Binance WebSocket Documentation](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Created as a technical assignment to demonstrate:
- Real-time data handling and WebSocket integration
- High-performance React applications
- Advanced state management techniques
- Financial data visualization
- TypeScript proficiency
- Clean code architecture and component design
- Production deployment and optimization

---

## 🙏 Acknowledgments

- Binance for providing free WebSocket API access
- Next.js team for an excellent React framework
- React community for performance optimization insights
- Netlify for seamless deployment experience

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/orderbook-visualizer/issues) page
2. Open a new issue with detailed description
3. Check browser console for error messages
4. Verify internet connection and Binance API accessibility

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

**Live Demo**: [https://live-orderbook.netlify.app/](https://live-orderbook.netlify.app/)

**Last Updated**: November 2025
