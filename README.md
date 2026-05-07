# Salmon Allocation System

An interactive React-based allocation interface for managing large volumes of salmon customer orders with sophisticated allocation algorithms.

## Features

### 1. **Manual Allocation**
- Manually assign salmon quantities to individual orders
- Real-time validation of stock availability
- Price calculations based on supplier and order type
- Support for 5,000+ orders efficiently

### 2. **Automatic Allocation (FIFO + Priority)**
- **FIFO (First-In-First-Out)** sorting:
  - Primary: Shipment date (earliest first)
  - Secondary: Order creation date (earliest first)
  - Tertiary: Order type priority (CRITICAL → HIGH → STANDARD → LOW)

### 3. **Smart Pricing**
- Cheapest unit price selection based on supplier
- Order type-based pricing adjustments

### 4. **Flexible Warehouse & Supplier**
- Supports dynamic warehouse/supplier assignments
- Special handling for WH-0000 and SP-0000

### 5. **Advanced Filtering & Sorting**
- Search by Order ID, Customer ID, or Item ID
- Filter by type, customer, warehouse, supplier, status
- Sort by shipment date, creation date, quantity, type

### 6. **Real-time Statistics**
- Total orders and allocation metrics
- Allocation rate percentage
- Breakdown by order type

## Project Structure

```
src/
├── components/
│   ├── OrderTable.tsx
│   ├── AllocationModal.tsx
│   ├── FilterPanel.tsx
│   └── StatsPanel.tsx
├── hooks/
│   ├── useOrderAllocation.ts
│   └── useVirtualScroll.ts
├── services/
│   └── allocationService.ts
├── types/
│   └── index.ts
├── utils/
│   └── mockData.ts
├── App.tsx
├── index.tsx
└── index.css
```

## Tech Stack

- **React** 18 - UI Framework
- **TypeScript** 5 - Type Safety
- **Vite** 5 - Build Tool  
- **Tailwind CSS** 3 - Styling

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production
npm run preview
```

## Usage Guide

### View & Filter Orders
- Browse all 5,000+ orders in interactive table
- Search and filter by various criteria
- Sort by clicking column headers

### Manual Allocation
1. Click "Allocate" button on any order
2. Select warehouse and supplier
3. Enter quantity (validates against stock)
4. View pricing and confirm

### Auto-Allocate
1. Click "Auto-Allocate All"
2. System allocates following FIFO & priority rules
3. Respects stock constraints

### Monitor Statistics
- View allocation dashboard
- Track allocation rates
- Monitor by order type

## Algorithm Details

### FIFO + Priority
Orders sorted by:
1. Shipment date (earliest first)
2. Creation date (earliest first)  
3. Order type priority (CRITICAL > HIGH > STANDARD > LOW)

### Price Optimization
Finds cheapest price:
1. By supplier + order type match
2. Applied percentage adjustment
3. Formula: `price × (1 + adjustment%)`

### Stock Management
- Prevents over-allocation
- Validates constraints
- Tracks inventory across warehouses
- Supports flexible mappings

## Performance

- Virtual scrolling for 5,000+ items
- Memoized computations
- Optimized filtering
- Minimal re-renders

## Key Types

```typescript
interface Order {
  orderId: string;
  requestedQuantity: number;
  type: OrderType;
  warehouseId: string;
  supplierId: string;
  customerId: string;
  shipmentDate: Date;
  createdDate: Date;
  // ...
}

interface OrderWithAllocation extends Order {
  allocatedQuantity: number;
  isAllocated: boolean;
  remainingQuantity: number;
  unitPrice?: number;
}
```

## Future Enhancements

- Backend API integration
- Real-time updates
- Authentication
- CSV/PDF export
- Audit trail
- Analytics dashboard

## License

MIT License
