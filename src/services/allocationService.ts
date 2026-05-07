import {
  Order,
  OrderWithAllocation,
  Allocation,
  Stock,
  Price,
  OrderType,
  ORDER_TYPE_PRIORITY,
} from '../types';

/**
 * Auto-Allocation Service
 * Handles automatic allocation based on FIFO, priority, and pricing rules
 */
export class AllocationService {
  /**
   * Auto-allocate orders using FIFO and priority rules
   */
  static autoAllocate(
    orders: Order[],
    stocks: Stock[],
    prices: Price[]
  ): OrderWithAllocation[] {
    // Sort orders by FIFO rules (shipment date, then creation date)
    const sortedOrders = this.sortByFIFO(orders);

    // Initialize allocation tracking
    const allocations: Map<string, Allocation> = new Map();
    const stockTracking = new Map<string, number>();

    // Initialize stock tracking
    stocks.forEach((stock) => {
      const key = `${stock.warehouseId}:${stock.supplierId}:${stock.itemId}`;
      stockTracking.set(key, stock.availableQuantity);
    });

    // Process each order
    sortedOrders.forEach((order) => {
      const remainingQuantity = order.requestedQuantity;

      if (remainingQuantity <= 0) {
        return;
      }

      // Find the best source (cheapest price, respecting warehouse/supplier rules)
      const bestSource = this.findBestAllocationSource(
        order,
        stocks,
        prices,
        stockTracking
      );

      if (bestSource) {
        const { warehouseId, supplierId, quantity, unitPrice } = bestSource;

        // Record allocation
        const allocation: Allocation = {
          orderId: order.orderId,
          allocatedQuantity: quantity,
          sourceWarehouseId: warehouseId,
          sourceSupplerId: supplierId,
          allocationDate: new Date(),
          unitPrice,
        };

        allocations.set(order.orderId, allocation);

        // Update stock tracking
        const stockKey = `${warehouseId}:${supplierId}:${order.itemId}`;
        const currentStock = stockTracking.get(stockKey) || 0;
        stockTracking.set(stockKey, Math.max(0, currentStock - quantity));
      }
    });

    // Convert to OrderWithAllocation
    return orders.map((order) => ({
      ...order,
      allocatedQuantity: allocations.get(order.orderId)?.allocatedQuantity || 0,
      allocation: allocations.get(order.orderId),
      isAllocated: allocations.has(order.orderId),
      remainingQuantity:
        order.requestedQuantity -
        (allocations.get(order.orderId)?.allocatedQuantity || 0),
      unitPrice: allocations.get(order.orderId)?.unitPrice,
    }));
  }

  /**
   * Sort orders by FIFO (First-In-First-Out)
   * Priority: shipment date -> creation date -> order type priority
   */
  private static sortByFIFO(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => {
      // First by shipment date (earlier first)
      if (a.shipmentDate.getTime() !== b.shipmentDate.getTime()) {
        return a.shipmentDate.getTime() - b.shipmentDate.getTime();
      }

      // Then by creation date (earlier first)
      if (a.createdDate.getTime() !== b.createdDate.getTime()) {
        return a.createdDate.getTime() - b.createdDate.getTime();
      }

      // Then by priority type (higher priority first)
      return (
        ORDER_TYPE_PRIORITY[b.type] - ORDER_TYPE_PRIORITY[a.type]
      );
    });
  }

  /**
   * Find the best allocation source considering:
   * - Available quantity
   * - Cheapest price
   * - Warehouse/Supplier flexibility (WH-0000, SP-0000 = any)
   */
  private static findBestAllocationSource(
    order: Order,
    stocks: Stock[],
    prices: Price[],
    stockTracking: Map<string, number>
  ): {
    warehouseId: string;
    supplierId: string;
    quantity: number;
    unitPrice: number;
  } | null {
    let bestOption: {
      warehouseId: string;
      supplierId: string;
      quantity: number;
      unitPrice: number;
      price: number;
    } | null = null;

    // Get applicable prices for this order
    const applicablePrices = prices.filter(
      (p) =>
        p.itemId === order.itemId &&
        (p.orderType === order.type || p.orderType === OrderType.STANDARD)
    );

    // Filter available stocks
    const availableStocks = stocks.filter((stock) => {
      const stockKey = `${stock.warehouseId}:${stock.supplierId}:${stock.itemId}`;
      const trackedQuantity = stockTracking.get(stockKey) || 0;
      return trackedQuantity > 0 && stock.itemId === order.itemId;
    });

    // Iterate through available stocks and find best price
    availableStocks.forEach((stock) => {
      const stockKey = `${stock.warehouseId}:${stock.supplierId}:${stock.itemId}`;
      const availableQty = stockTracking.get(stockKey) || 0;

      if (availableQty <= 0) {
        return;
      }

      // Check if warehouse/supplier matches order requirements
      const warehouseMatch =
        order.warehouseId === 'WH-0000' ||
        stock.warehouseId === 'WH-0000' ||
        stock.warehouseId === order.warehouseId;

      const supplierMatch =
        order.supplierId === 'SP-0000' ||
        stock.supplierId === 'SP-0000' ||
        stock.supplierId === order.supplierId;

      if (!warehouseMatch || !supplierMatch) {
        return;
      }

      // Find price for this supplier and order type
      const price = this.getAdjustedPrice(
        applicablePrices,
        stock.supplierId,
        order.type
      );

      if (price === null) {
        return;
      }

      // Calculate quantity to allocate (minimum of requested and available)
      const quantityToAllocate = Math.min(
        order.requestedQuantity,
        availableQty
      );

      // Compare with best option (prefer lower price)
      if (!bestOption || price < bestOption.price) {
        bestOption = {
          warehouseId: stock.warehouseId,
          supplierId: stock.supplierId,
          quantity: quantityToAllocate,
          unitPrice: price,
          price,
        };
      }
    });

    return bestOption
      ? {
          warehouseId: bestOption.warehouseId,
          supplierId: bestOption.supplierId,
          quantity: bestOption.quantity,
          unitPrice: bestOption.unitPrice,
        }
      : null;
  }

  /**
   * Get adjusted price based on supplier and order type
   */
  private static getAdjustedPrice(
    prices: Price[],
    supplierId: string,
    orderType: OrderType
  ): number | null {
    // First try to find exact match
    let price = prices.find(
      (p) => p.supplierId === supplierId && p.orderType === orderType
    );

    // Fall back to standard type
    if (!price) {
      price = prices.find(
        (p) => p.supplierId === supplierId && p.orderType === OrderType.STANDARD
      );
    }

    // Fall back to any supplier with same type
    if (!price) {
      price = prices.find((p) => p.orderType === orderType);
    }

    if (!price) {
      return null;
    }

    // Apply adjustment
    return price.price * (1 + price.adjustment / 100);
  }

  /**
   * Validate manual allocation against constraints
   */
  static validateManualAllocation(
    orderId: string,
    allocateQuantity: number,
    availableStock: number,
    requestedQuantity: number,
    customerOrders: Order[]
  ): { valid: boolean; error?: string } {
    // Check 1: Not exceeding requested quantity
    if (allocateQuantity > requestedQuantity) {
      return {
        valid: false,
        error: `Cannot allocate more than requested quantity (${requestedQuantity})`,
      };
    }

    // Check 2: Not exceeding available stock
    if (allocateQuantity > availableStock) {
      return {
        valid: false,
        error: `Insufficient stock. Available: ${availableStock}`,
      };
    }

    // Check 3: Customer shouldn't receive more than their total orders allow
    const totalCustomerRequested = customerOrders.reduce(
      (sum, o) => sum + o.requestedQuantity,
      0
    );
    const currentlyAllocated = customerOrders.reduce((sum, o) => {
      // This would be tracked elsewhere
      return sum;
    }, 0);

    if (currentlyAllocated + allocateQuantity > totalCustomerRequested) {
      return {
        valid: false,
        error: `Allocation would exceed customer total order quantity`,
      };
    }

    return { valid: true };
  }

  /**
   * Calculate allocation statistics
   */
  static getStats(allocatedOrders: OrderWithAllocation[]) {
    const stats = {
      totalOrders: allocatedOrders.length,
      totalAllocated: 0,
      totalRequested: 0,
      allocationRate: 0,
      byType: {} as Record<OrderType, { total: number; allocated: number }>,
    };

    // Initialize by type
    Object.values(OrderType).forEach((type) => {
      stats.byType[type as OrderType] = { total: 0, allocated: 0 };
    });

    // Aggregate stats
    allocatedOrders.forEach((order) => {
      stats.totalAllocated += order.allocatedQuantity;
      stats.totalRequested += order.requestedQuantity;
      stats.byType[order.type].total += order.requestedQuantity;
      stats.byType[order.type].allocated += order.allocatedQuantity;
    });

    stats.allocationRate =
      stats.totalRequested > 0
        ? (stats.totalAllocated / stats.totalRequested) * 100
        : 0;

    return stats;
  }
}
