# 📋 Feature Documentation

## Feature Overview

This document provides detailed documentation for all features in the Salmon Allocation System.

---

## 1. 📊 Statistics Dashboard

### Overview
Real-time allocation metrics displayed at the top of the interface.

### Metrics Displayed

#### Summary Cards
| Metric | Description | Formula |
|--------|-------------|---------|
| Total Orders | Number of orders in system | Count of all orders |
| Total Requested | Total salmon quantity requested | Sum of all requestedQuantity |
| Total Allocated | Total salmon allocated so far | Sum of allocatedQuantity |
| Allocation Rate | Percentage of demand fulfilled | (Allocated / Requested) × 100 |

#### By Order Type Breakdown
Shows detailed metrics for each order type:
- **CRITICAL**: Red indicator
- **HIGH**: Orange indicator
- **STANDARD**: Blue indicator  
- **LOW**: Gray indicator

For each type:
- Requested quantity
- Allocated quantity
- Allocation percentage

### Update Behavior
- Updates automatically when allocations change
- Recalculates in real-time during manual allocation
- Refreshes when auto-allocation completes

---

## 2. 🔍 Advanced Filtering

### Search Box
**Field**: Searches across multiple fields simultaneously

**Searches In**:
- Order ID (e.g., "ORD-00123")
- Customer ID (e.g., "CUST-042")
- Item ID (e.g., "ITEM-A")

**Behavior**: Case-insensitive, partial match enabled

**Example**:
- Search "ORD" → shows all orders starting with ORD
- Search "CUST-05" → shows all orders from that customer
- Search "ITEM-B" → shows all ITEM-B orders

### Order Type Filter
**Options**:
- All Types (default)
- CRITICAL
- HIGH
- STANDARD
- LOW

**Effect**: Shows only orders of selected type

### Customer Filter
**Options**:
- All Customers (default)
- CUST-001 through CUST-050

**Effect**: Shows orders from selected customer only

### Warehouse Filter
**Options**:
- All Warehouses (default)
- WH-001
- WH-002
- WH-003
- WH-0000 (any warehouse)

**Effect**: Shows orders requesting from selected warehouse

### Supplier Filter
**Options**:
- All Suppliers (default)
- SP-001
- SP-002
- SP-003
- SP-0000 (any supplier)

**Effect**: Shows orders from selected supplier

### Allocation Status Filter
**Options**:
- All (default) - shows both allocated and unallocated
- Allocated - shows only orders with allocation
- Not Allocated - shows only orders without allocation

**Effect**: Filters orders by their allocation state

### Reset Button
- Clears all filters to default state
- Returns to showing all 5,000 orders

### Filter Combination
- Multiple filters work together (AND logic)
- All selected filters must match for order to display
- Counts shown: "Showing X of Y orders"

---

## 3. 📈 Sortable Table

### Column Headers (Clickable)
All column headers are sortable. Click to sort, click again to reverse direction.

#### Sortable Columns
| Column | Data Type | Default | Notes |
|--------|-----------|---------|-------|
| Order ID | String | - | Alphabetical sort |
| Created | Date | ↑ (ascending) | Earlier dates first |
| Shipment | Date | - | Earlier dates first |
| Item | String | - | Alphabetical sort |
| Type | Enum | - | Priority order |
| Requested | Number | - | Low to high |
| Allocated | Number | - | Low to high |
| Remaining | Number | - | Low to high |

#### Sort Indicators
- ↑ = Ascending sort active
- ↓ = Descending sort active
- ⇅ = No sort on this column

### Color Coding
- **Green Row Background**: Order is allocated
- **Type Badge Colors**:
  - Red: CRITICAL
  - Orange: HIGH
  - Blue: STANDARD
  - Gray: LOW

### Action Column
- **Allocate Button**: Click to open allocation modal for this order
- **Allocated Badge**: Shows when order already has allocation

### Pagination Info
Shows "Showing X of Y orders" with current filter/sort applied

---

## 4. 🎯 Manual Allocation

### How to Allocate an Order

1. **Click Allocate Button**
   - Click the "Allocate" button on any unallocated order
   - Modal dialog appears

2. **Select Warehouse**
   - Choose from available warehouses for this item
   - Displays warehouse ID (e.g., WH-001)
   - WH-0000 allows any warehouse

3. **Select Supplier**
   - Choose from available suppliers for this item
   - Displays supplier ID (e.g., SP-001)
   - SP-0000 allows any supplier

4. **Review Stock & Price**
   - After selecting warehouse and supplier:
     - Available Stock: Shows remaining inventory
     - Unit Price: Calculated price per unit
     - Formula: `base_price × (1 + adjustment%)`

5. **Enter Quantity**
   - Input the quantity to allocate
   - Must be > 0
   - Cannot exceed requested quantity
   - Cannot exceed available stock
   - Validation errors show in red

6. **Allocate or Cancel**
   - Click "Allocate" to save
   - Click "Cancel" to close without saving

### Allocation Modal Details

**Order Information Section**:
- Shows order ID
- Shows item ID
- Shows order type
- Shows requested quantity

**Validation Rules**:
1. Warehouse must be selected
2. Supplier must be selected
3. Quantity must be between 1 and requested amount
4. Quantity cannot exceed available stock

**Error Messages**:
- "Please select warehouse and supplier"
- "Quantity must be between 0 and X"
- "Quantity exceeds available stock (X)"

**After Allocation**:
- Modal closes automatically
- Table row updates to show green background
- Allocation quantities update
- Statistics refresh
- Order shows "✓ Allocated" status

### Price Calculation System

**Price Lookup Priority**:
1. Supplier + Exact Order Type match
2. Supplier + STANDARD type (fallback)
3. Any Supplier + Order Type (last resort)

**Adjustment Application**:
```
Final Price = Base Price × (1 + Adjustment%)

Example:
- Base Price: $15.00
- Adjustment: -5% (for HIGH priority)
- Final Price: $15.00 × 0.95 = $14.25
```

---

## 5. 🤖 Auto-Allocation

### Overview
One-click automatic allocation of all orders using sophisticated algorithms.

### How to Use
1. Click the "🤖 Auto-Allocate All" button in the actions bar
2. System processes all orders automatically
3. Wait for completion (typically < 1 second for 5000 orders)
4. View results in table and statistics

### Algorithm Details

#### Step 1: Sort Orders (FIFO + Priority)
Orders processed in this priority:
```
1. Shipment Date (earliest first)
2. Creation Date (earliest first)
3. Order Type Priority:
   - CRITICAL (priority 4)
   - HIGH (priority 3)
   - STANDARD (priority 2)
   - LOW (priority 1)
```

#### Step 2: Find Best Source
For each order, system finds:
- Cheapest available price
- Respecting warehouse/supplier constraints
- With sufficient stock

#### Step 3: Allocate
- Allocate maximum possible quantity
- Update stock tracking
- Record allocation details
- Move to next order

#### Step 4: Complete
- All orders processed
- Statistics calculated
- UI updated automatically

### Results
After auto-allocation:
- All orders have allocation (if stock available)
- Table updated with green backgrounds
- Statistics reflect new allocation
- Total allocated increases
- Allocation rate updates

### Stock Constraints

**During Auto-Allocation**:
- Never exceeds available stock
- Tracks inventory across multiple allocations
- Stock decreases as allocations made
- Later orders may receive partial allocation

**Example**:
```
Available Stock: 1000 units
Order 1: Requests 600 → Allocated 600 (400 remaining)
Order 2: Requests 500 → Allocated 400 (stock exhausted)
Order 3: Requests 300 → Allocated 0 (no stock)
```

### Performance
- Processes 5,000 orders in < 1 second
- Optimized algorithm with O(n log n) complexity
- All operations in-memory

---

## 6. 📅 Order Information

### Order Details Displayed

| Field | Example | Notes |
|-------|---------|-------|
| Order ID | ORD-00001 | Unique identifier |
| Sales Order | SO-00001 | Reference number |
| Item ID | ITEM-A | Product identifier |
| Warehouse | WH-001 | Requested warehouse |
| Supplier | SP-001 | Supplier source |
| Type | CRITICAL | Order priority type |
| Created | 05/01/2026 | Order creation date |
| Shipment | 05/15/2026 | Scheduled shipment date |
| Customer | CUST-042 | Customer identifier |
| Requested | 500 | Quantity requested (units) |
| Allocated | 400 | Quantity allocated (units) |
| Remaining | 100 | Quantity not yet allocated |
| Unit Price | $14.50 | Price per unit (after allocation) |

---

## 7. 📊 Real-time Updates

### What Updates Automatically

✅ Table rows update instantly
✅ Statistics refresh in real-time
✅ Remaining quantities recalculate
✅ Allocation rate updates
✅ Color indicators change
✅ Filter counts update

### When Updates Occur

- **Manual Allocation**: Immediately after saving
- **Auto-Allocation**: After all orders processed
- **Filter Change**: Instantly as filter applied
- **Sort Change**: Instantly as sort applied

---

## 8. ⚙️ Performance Features

### Virtual Scrolling
- Only visible rows rendered to DOM
- Smooth scrolling with 5000+ items
- Automatic overscan for seamless experience

### Optimization Techniques
- Memoized computations
- Lazy filter/sort evaluation
- Efficient state updates
- Minimal re-renders

### Scalability
- Handles 5,000+ orders efficiently
- Responsive UI even during auto-allocation
- < 100ms for filter/sort operations
- < 1 second for auto-allocation

---

## 9. 🎨 User Interface

### Color Scheme

**Order Type Badges**:
- 🔴 CRITICAL: Red (#dc2626)
- 🟠 HIGH: Orange (#f97316)
- 🔵 STANDARD: Blue (#2563eb)
- ⚫ LOW: Gray (#6b7280)

**Status Colors**:
- ✅ Green: Allocated orders
- ⚪ White: Not allocated
- 🔵 Blue: Buttons/links

**Card Colors**:
- Stats cards: Color-coded by metric type
- Inputs: Blue outline on focus
- Errors: Red background

### Layout

**Header**:
- Title: "Salmon Allocation System"
- Subtitle: "Manage and allocate salmon orders efficiently"
- Fixed at top

**Main Content**:
- Statistics dashboard (full width)
- Actions bar (with auto-allocate button)
- Filters panel (collapsible options)
- Orders table (scrollable)

**Footer**:
- Copyright notice
- Fixed at bottom

---

## 10. 🔗 Integration Points

### Future Backend Integration

The system is designed for easy backend integration:

```typescript
// Replace mock data with API calls
const [orders, setOrders] = useState([]);

useEffect(() => {
  fetch('/api/orders')
    .then(r => r.json())
    .then(data => setOrders(data));
}, []);
```

### API Endpoints Needed

```
GET  /api/orders           - Fetch all orders
GET  /api/stocks           - Fetch warehouse inventory
GET  /api/prices           - Fetch supplier pricing
POST /api/allocations      - Save allocation
GET  /api/allocations/:id  - Get allocation history
```

---

## 📚 Usage Examples

### Example 1: Find Critical Orders from CUST-042
1. Use Search box → search "CUST-042"
2. Use Order Type filter → select "CRITICAL"
3. View filtered results

### Example 2: Allocate All from WH-001
1. Use Warehouse filter → select "WH-001"
2. Click "🤖 Auto-Allocate All"
3. All filtered orders allocated

### Example 3: Find Unallocated Orders by Shipment Date
1. Use Allocation Status → select "Not Allocated"
2. Click "Shipment" column header to sort
3. See unallocated orders sorted by shipment date

### Example 4: Manually Allocate with Price Check
1. Search for specific order
2. Click "Allocate"
3. Select warehouse and supplier
4. Review "Unit Price" shown
5. Enter quantity and confirm

---

## 🚀 Best Practices

### For Managers
- Use Auto-Allocate for bulk processing
- Use Filters to find specific problem orders
- Monitor Statistics for allocation rate
- Use manual allocation for exceptions

### For Operators
- Start with filter to narrow down orders
- Use sort by shipment date for urgency
- Monitor remaining quantities
- Note any allocation failures

### For Developers
- Check ARCHITECTURE.md for technical details
- Review AllocationService for algorithm
- Use TypeScript types for safety
- Test with different filter combinations

---

**Last Updated**: May 2026
**Documentation Version**: 1.0
