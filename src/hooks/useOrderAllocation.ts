import { useState, useCallback, useMemo } from 'react';
import {
  Order,
  OrderWithAllocation,
  FilterState,
  SortState,
  OrderType,
  Stock,
  Price,
  AllocationStats,
} from '../types';
import { AllocationService } from '../services/allocationService';

export function useOrderAllocation(
  orders: Order[],
  stocks: Stock[],
  prices: Price[]
) {
  const [allocatedOrders, setAllocatedOrders] = useState<OrderWithAllocation[]>(
    orders.map((o) => ({
      ...o,
      allocatedQuantity: 0,
      isAllocated: false,
      remainingQuantity: o.requestedQuantity,
    }))
  );

  const [filter, setFilter] = useState<FilterState>({
    searchTerm: '',
    orderType: 'ALL',
    customerId: '',
    warehouseId: '',
    supplierId: '',
    isAllocated: null,
  });

  const [sort, setSort] = useState<SortState>({
    field: 'shipmentDate',
    direction: 'asc',
  });

  // Filter orders
  const filteredOrders = useMemo(() => {
    return allocatedOrders.filter((order) => {
      // Search term
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        if (
          !order.orderId.toLowerCase().includes(searchLower) &&
          !order.customerId.toLowerCase().includes(searchLower) &&
          !order.itemId.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Order type
      if (
        filter.orderType !== 'ALL' &&
        order.type !== filter.orderType
      ) {
        return false;
      }

      // Customer ID
      if (
        filter.customerId &&
        order.customerId !== filter.customerId
      ) {
        return false;
      }

      // Warehouse
      if (
        filter.warehouseId &&
        order.warehouseId !== filter.warehouseId
      ) {
        return false;
      }

      // Supplier
      if (
        filter.supplierId &&
        order.supplierId !== filter.supplierId
      ) {
        return false;
      }

      // Allocation status
      if (filter.isAllocated !== null && order.isAllocated !== filter.isAllocated) {
        return false;
      }

      return true;
    });
  }, [allocatedOrders, filter]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders].sort((a, b) => {
      let aVal: any = a[sort.field];
      let bVal: any = b[sort.field];

      if (aVal instanceof Date) {
        aVal = aVal.getTime();
        bVal = bVal.getTime();
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredOrders, sort]);

  // Stats
  const stats: AllocationStats = useMemo(() => {
    return AllocationService.getStats(allocatedOrders);
  }, [allocatedOrders]);

  // Manual allocation
  const updateAllocation = useCallback(
    (orderId: string, quantity: number, warehouseId: string, supplierId: string) => {
      const order = allocatedOrders.find((o) => o.orderId === orderId);
      if (!order) return;

      // Validate
      const validation = AllocationService.validateManualAllocation(
        orderId,
        quantity,
        10000, // This should come from stock calculation
        order.requestedQuantity,
        orders.filter((o) => o.customerId === order.customerId)
      );

      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Find price
      const price = prices.find(
        (p) =>
          p.itemId === order.itemId &&
          p.supplierId === supplierId &&
          p.orderType === order.type
      );

      const unitPrice = price
        ? price.price * (1 + price.adjustment / 100)
        : 0;

      setAllocatedOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId
            ? {
                ...o,
                allocatedQuantity: quantity,
                isAllocated: quantity > 0,
                remainingQuantity: o.requestedQuantity - quantity,
                allocation: quantity > 0 ? {
                  orderId,
                  allocatedQuantity: quantity,
                  sourceWarehouseId: warehouseId,
                  sourceSupplerId: supplierId,
                  allocationDate: new Date(),
                  unitPrice,
                } : undefined,
                unitPrice,
              }
            : o
        )
      );
    },
    [allocatedOrders, orders, prices]
  );

  // Auto allocate
  const autoAllocate = useCallback(() => {
    const result = AllocationService.autoAllocate(orders, stocks, prices);
    setAllocatedOrders(result);
  }, [orders, stocks, prices]);

  return {
    allocatedOrders,
    filteredOrders,
    sortedOrders,
    stats,
    filter,
    setFilter,
    sort,
    setSort,
    updateAllocation,
    autoAllocate,
  };
}
