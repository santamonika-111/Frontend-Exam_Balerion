// Order Type Priority
export enum OrderType {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  STANDARD = 'STANDARD',
  LOW = 'LOW',
}

export const ORDER_TYPE_PRIORITY: Record<OrderType, number> = {
  [OrderType.CRITICAL]: 4,
  [OrderType.HIGH]: 3,
  [OrderType.STANDARD]: 2,
  [OrderType.LOW]: 1,
};

// Order Interface
export interface Order {
  orderId: string;
  salesOrder: string;
  itemId: string;
  warehouseId: string;
  supplierId: string;
  shipmentDate: Date;
  type: OrderType;
  createdDate: Date;
  customerId: string;
  requestedQuantity: number;
  remark?: string;
}

// Price Interface
export interface Price {
  itemId: string;
  supplierId: string;
  price: number;
  orderType: OrderType;
  adjustment: number; // percentage adjustment
}

// Stock/Warehouse Interface
export interface Stock {
  warehouseId: string;
  itemId: string;
  availableQuantity: number;
  supplierId: string;
}

// Allocation Result
export interface Allocation {
  orderId: string;
  allocatedQuantity: number;
  sourceWarehouseId: string;
  sourceSupplerId: string;
  allocationDate: Date;
  unitPrice: number;
}

// Customer Order Summary
export interface OrderAllocationSummary {
  customerId: string;
  totalOrders: number;
  totalRequested: number;
  totalAllocated: number;
  orders: OrderWithAllocation[];
}

// Order with Allocation Info
export interface OrderWithAllocation extends Order {
  allocatedQuantity: number;
  allocation?: Allocation;
  isAllocated: boolean;
  remainingQuantity: number;
  unitPrice?: number;
}

// Filter & Sort State
export interface FilterState {
  searchTerm: string;
  orderType: OrderType | 'ALL';
  customerId: string;
  warehouseId: string;
  supplierId: string;
  isAllocated: boolean | null;
}

export interface SortState {
  field: 'shipmentDate' | 'createdDate' | 'requestedQuantity' | 'type';
  direction: 'asc' | 'desc';
}

// Allocation Stats
export interface AllocationStats {
  totalOrders: number;
  totalAllocated: number;
  totalRequested: number;
  allocationRate: number; // percentage
  byType: Record<OrderType, { total: number; allocated: number }>;
}

// Virtual Scroll Props
export interface VirtualScrollProps {
  items: OrderWithAllocation[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: OrderWithAllocation, index: number) => React.ReactNode;
}
