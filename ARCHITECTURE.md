# Architecture Documentation

## System Overview

The Salmon Allocation System is built on a modern React architecture with TypeScript for type safety. It manages the allocation of salmon supplies to customer orders efficiently and fairly.

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Stats   │ │ OrderTbl │ │  Filter  │ │ Modal  │ │
│  │ Panel    │ │          │ │ Panel    │ │        │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│           State Management Layer (Hooks)            │
│  ┌──────────────────────────────────────────────┐  │
│  │    useOrderAllocation (Main Hook)            │  │
│  │  - Manages allocation state                  │  │
│  │  - Handles filtering & sorting               │  │
│  │  - Coordinates with service layer            │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │    useVirtualScroll (Performance Hook)       │  │
│  │  - Optimizes rendering of large lists        │  │
│  │  - Only renders visible items                │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│          Business Logic Layer (Services)            │
│  ┌──────────────────────────────────────────────┐  │
│  │     AllocationService                        │  │
│  │  - FIFO + Priority sorting                   │  │
│  │  - Price optimization                        │  │
│  │  - Stock validation                          │  │
│  │  - Manual allocation validation              │  │
│  │  - Statistics calculation                    │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│            Data & Type Layer                        │
│  ┌──────────────────────────────────────────────┐  │
│  │    Type Definitions                          │  │
│  │  - Order, OrderWithAllocation, Allocation    │  │
│  │  - Stock, Price interfaces                   │  │
│  │  - Filter & Sort states                      │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │    Mock Data Generators                      │  │
│  │  - generateMockOrders()                      │  │
│  │  - generateMockPrices()                      │  │
│  │  - generateMockStocks()                      │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Component Architecture

### Top-Level Components

#### App.tsx
- **Purpose**: Main application container
- **Responsibilities**:
  - Initializes mock data
  - Manages modal state for order selection
  - Coordinates between all sub-components
  - Handles user interactions (allocate clicks, sort)
  - Renders header, footer, and main layout

**Key State**:
```typescript
- orders: Order[]  // All 5000 orders
- stocks: Stock[]  // Warehouse inventory
- prices: Price[]  // Supplier pricing
- selectedOrderId: string | null  // Currently editing order
```

### Feature Components

#### 1. **StatsPanel.tsx**
- **Purpose**: Display allocation statistics
- **Displays**:
  - Total orders count
  - Total requested quantity
  - Total allocated quantity
  - Overall allocation rate (%)
  - Breakdown by order type (CRITICAL, HIGH, STANDARD, LOW)

**Props**:
```typescript
interface StatsPanelProps {
  stats: AllocationStats;
}
```

#### 2. **FilterPanel.tsx**
- **Purpose**: Advanced filtering interface
- **Filters Available**:
  - Search term (Order ID, Customer ID, Item ID)
  - Order Type dropdown
  - Customer dropdown
  - Warehouse dropdown
  - Supplier dropdown
  - Allocation status (All, Allocated, Not Allocated)

**Features**:
- Real-time filtering
- Reset button to clear filters
- Multi-select capability

#### 3. **OrderTable.tsx**
- **Purpose**: Display orders in a sortable table
- **Columns**:
  - Order ID
  - Created date
  - Shipment date
  - Item ID
  - Order type (with color badge)
  - Requested quantity
  - Allocated quantity
  - Remaining quantity
  - Action button (Allocate/Allocated)

**Interactive Features**:
- Click headers to sort
- Sort indicators (↑↓)
- Color-coded allocation status
- Action button to open allocation modal

#### 4. **AllocationModal.tsx**
- **Purpose**: Manual allocation form
- **Functionality**:
  - Display order details
  - Warehouse selection dropdown
  - Supplier selection dropdown
  - Real-time stock availability display
  - Unit price calculation
  - Quantity input with validation
  - Cancel/Allocate buttons

**Validation**:
- Quantity must be ≤ requested amount
- Must select both warehouse and supplier
- Cannot exceed available stock
- Real-time error messages

## Hook Architecture

### useOrderAllocation.ts
**Main state management hook**

**State Variables**:
```typescript
- allocatedOrders: OrderWithAllocation[]  // All orders with allocation data
- filter: FilterState  // Current filter settings
- sort: SortState  // Current sort settings
```

**Computed Values** (useMemo):
```typescript
- filteredOrders  // Apply current filters
- sortedOrders    // Apply current sort
- stats           // Calculate statistics
```

**Key Functions**:
```typescript
- updateAllocation()  // Manual allocation
- autoAllocate()      // Auto-allocation
- setFilter()         // Update filters
- setSort()           // Update sort
```

**Performance Optimizations**:
- Filter computation only recalculates when dependencies change
- Sort computation only recalculates when filter/sort changes
- Stats calculation memoized to prevent recalculation

### useVirtualScroll.ts
**Performance optimization for large lists**

**Purpose**: Render only visible rows to improve performance

**How it Works**:
1. Calculate visible range based on scroll position
2. Only render items within range + overscan
3. Return offsetY to position rendered items correctly
4. Show total height for scrollbar

**Parameters**:
```typescript
- itemHeight: number  // Height of each row
- containerHeight: number  // Height of viewport
- items: any[]  // All items
- overscan: number  // Buffer above/below visible area (default: 5)
```

**Returns**:
```typescript
- containerRef: RefObject<HTMLDivElement>
- visibleItems: any[]  // Only visible items
- visibleRange: { start, end }
- offsetY: number  // CSS transform offset
- totalHeight: number  // For scrollbar
```

## Service Architecture

### AllocationService.ts
**Core business logic**

#### 1. **autoAllocate()**
Implements FIFO + Priority allocation algorithm

**Algorithm**:
```
1. Sort orders by FIFO rules
2. Initialize stock tracking map
3. For each order:
   a. Find best allocation source (cheapest price)
   b. Allocate quantity up to available stock
   c. Update stock tracking
   d. Record allocation
4. Return orders with allocation data
```

**FIFO Sort Order**:
1. Shipment date (ascending - earlier first)
2. Creation date (ascending - earlier first)
3. Order type priority (descending - CRITICAL first)

#### 2. **sortByFIFO()**
Private helper method for FIFO sorting

**Criteria** (in order):
- Shipment date: earlier dates get priority
- Creation date: earlier dates get priority
- Order type: CRITICAL (4) > HIGH (3) > STANDARD (2) > LOW (1)

#### 3. **findBestAllocationSource()**
Private method to find optimal source for allocation

**Selection Logic**:
1. Filter stocks matching item and constraints
2. Check warehouse/supplier compatibility:
   - WH-0000 = any warehouse
   - SP-0000 = any supplier
3. For each available stock:
   - Get adjusted price based on order type
   - Calculate quantity to allocate
   - Track as best option if price is lowest
4. Return best option or null

#### 4. **getAdjustedPrice()**
Calculate final price with adjustments

**Priority Order**:
1. Find exact supplier + order type match
2. Fall back to supplier + STANDARD type
3. Fall back to any supplier with same order type
4. Apply percentage adjustment: `price × (1 + adjustment%)`

#### 5. **validateManualAllocation()**
Validate manual allocation request

**Checks**:
1. Quantity ≤ requested quantity
2. Quantity ≤ available stock
3. Customer total allocation ≤ customer total orders

**Returns**:
```typescript
{
  valid: boolean;
  error?: string;  // Error message if invalid
}
```

#### 6. **getStats()**
Calculate allocation statistics

**Metrics Calculated**:
- Total orders
- Total requested quantity
- Total allocated quantity
- Allocation rate (%)
- Breakdown by order type:
  - Total requested per type
  - Total allocated per type
  - Rate per type

## Type System

### Core Types

```typescript
// Order Type Enum
enum OrderType {
  CRITICAL = 'CRITICAL',  // Priority 4
  HIGH = 'HIGH',          // Priority 3
  STANDARD = 'STANDARD',  // Priority 2
  LOW = 'LOW'             // Priority 1
}

// Base Order
interface Order {
  orderId: string;        // Unique identifier
  salesOrder: string;     // Sales order reference
  itemId: string;         // Product ID
  warehouseId: string;    // Warehouse location (or WH-0000)
  supplierId: string;     // Supplier (or SP-0000)
  shipmentDate: Date;     // When order ships
  type: OrderType;        // Priority type
  createdDate: Date;      // When order created
  customerId: string;     // Customer reference
  requestedQuantity: number;  // Requested salmon quantity
  remark?: string;        // Optional notes
}

// Order with allocation info
interface OrderWithAllocation extends Order {
  allocatedQuantity: number;     // Quantity allocated
  allocation?: Allocation;        // Allocation details
  isAllocated: boolean;          // Has been allocated
  remainingQuantity: number;     // Not yet allocated
  unitPrice?: number;            // Price paid per unit
}

// Allocation record
interface Allocation {
  orderId: string;
  allocatedQuantity: number;
  sourceWarehouseId: string;
  sourceSupplerId: string;
  allocationDate: Date;
  unitPrice: number;
}

// Stock information
interface Stock {
  warehouseId: string;
  itemId: string;
  availableQuantity: number;
  supplierId: string;
}

// Pricing information
interface Price {
  itemId: string;
  supplierId: string;
  price: number;           // Base price per unit
  orderType: OrderType;    // Applicable order type
  adjustment: number;      // Percentage adjustment
}
```

### State Types

```typescript
// Filter state
interface FilterState {
  searchTerm: string;           // Search across multiple fields
  orderType: OrderType | 'ALL'; // Filter by type
  customerId: string;           // Filter by customer
  warehouseId: string;          // Filter by warehouse
  supplierId: string;           // Filter by supplier
  isAllocated: boolean | null;  // Allocation status filter
}

// Sort state
interface SortState {
  field: 'shipmentDate' | 'createdDate' | 'requestedQuantity' | 'type';
  direction: 'asc' | 'desc';
}

// Statistics
interface AllocationStats {
  totalOrders: number;
  totalAllocated: number;
  totalRequested: number;
  allocationRate: number;  // Percentage
  byType: Record<OrderType, {
    total: number;
    allocated: number;
  }>;
}
```

## Data Flow

### Initial Load
```
1. App renders
2. useMemo generates 5000 mock orders
3. useMemo generates mock stocks
4. useMemo generates mock prices
5. useOrderAllocation hook initialized
6. Filter & sort default states set
7. Components rendered with initial data
```

### User Filters Orders
```
1. User types in search box
2. FilterPanel calls onFilterChange()
3. App.tsx calls setFilter()
4. useOrderAllocation recalculates filteredOrders
5. sortedOrders recalculated based on new filter + sort
6. OrderTable re-renders with filtered data
7. StatsPanel recalculates statistics
```

### User Clicks Sort Header
```
1. User clicks column header
2. OrderTable calls onSort(field)
3. App.tsx calls setSort()
4. useOrderAllocation recalculates sortedOrders
5. OrderTable re-renders in new order
```

### Manual Allocation
```
1. User clicks "Allocate" button on order
2. App.tsx sets selectedOrderId
3. AllocationModal renders with order details
4. User selects warehouse, supplier, quantity
5. User clicks "Allocate" button
6. AllocationModal calls onSubmit()
7. App.tsx calls updateAllocation()
8. useOrderAllocation updates allocatedOrders state
9. AllocationModal closes
10. OrderTable reflects updated allocation
11. Stats recalculated automatically
```

### Auto-Allocate
```
1. User clicks "🤖 Auto-Allocate All"
2. App.tsx calls autoAllocate()
3. useOrderAllocation calls AllocationService.autoAllocate()
4. Service implements FIFO + priority algorithm
5. Returns new OrderWithAllocation array
6. setAllocatedOrders updates state
7. All components re-render with new allocation
8. Stats updated automatically
```

## Performance Considerations

### Optimization Strategies

1. **Memoization** (useMemo, useCallback)
   - Prevents unnecessary recalculations
   - Dependencies carefully managed
   - Critical for 5000 items

2. **Virtual Scrolling** (useVirtualScroll)
   - Only renders visible rows
   - Dramatically reduces DOM nodes
   - Maintains smooth scrolling

3. **Lazy Evaluation**
   - Filters only computed when needed
   - Sorts only computed when filter/sort changes
   - Stats only recalculated when data changes

4. **Efficient State Updates**
   - Only affected state updates on changes
   - Prevents cascade re-renders
   - Uses functional setState pattern

### Scalability

**Current Capacity**: 5,000 orders
- Table rows: Only ~20 visible at once (virtual scroll)
- Memory: ~50MB for data + React tree
- Load time: < 2 seconds with mocks

**Scaling to 50,000+ orders**:
- Keep virtual scrolling strategy
- Implement pagination for filtering operations
- Consider server-side filtering for large datasets
- Use React.memo() for row components
- Consider web workers for sorting/filtering

## Integration Points

### To Connect to Backend

Replace mock data generators with API calls:

```typescript
// Current (mock)
const orders = useMemo(() => generateMockOrders(5000), []);

// Future (API)
const [orders, setOrders] = useState<Order[]>([]);
useEffect(() => {
  const fetchOrders = async () => {
    const response = await fetch('/api/orders');
    setOrders(await response.json());
  };
  fetchOrders();
}, []);
```

Update allocation to persist:

```typescript
// Current (local state only)
updateAllocation(orderId, quantity, warehouseId, supplierId);

// Future (with backend)
const response = await fetch('/api/allocations', {
  method: 'POST',
  body: JSON.stringify({ orderId, quantity, warehouseId, supplierId })
});
updateAllocation(...);  // Update local state after API success
```

---

**Last Updated**: May 2026
**Architecture Version**: 1.0
