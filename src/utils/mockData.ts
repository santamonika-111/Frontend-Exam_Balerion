import {
  Order,
  Price,
  Stock,
  OrderType,
} from '../types';

/**
 * Generate mock data for demonstration
 */
export function generateMockOrders(count: number = 100): Order[] {
  const orders: Order[] = [];
  const warehouses = ['WH-001', 'WH-002', 'WH-003', 'WH-0000'];
  const suppliers = ['SP-001', 'SP-002', 'SP-003', 'SP-0000'];
  const types = Object.values(OrderType);
  const itemIds = ['ITEM-A', 'ITEM-B', 'ITEM-C', 'ITEM-D'];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const shipmentDate = new Date();
    shipmentDate.setDate(shipmentDate.getDate() + Math.floor(Math.random() * 60) + 1);

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);

    orders.push({
      orderId: `ORD-${String(i + 1).padStart(5, '0')}`,
      salesOrder: `SO-${String(i + 1).padStart(5, '0')}`,
      itemId: itemIds[Math.floor(Math.random() * itemIds.length)],
      warehouseId: warehouses[Math.floor(Math.random() * warehouses.length)],
      supplierId: suppliers[Math.floor(Math.random() * suppliers.length)],
      shipmentDate,
      type: types[Math.floor(Math.random() * types.length)] as OrderType,
      createdDate,
      customerId: `CUST-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`,
      requestedQuantity: Math.floor(Math.random() * 500) + 100,
      remark: Math.random() > 0.8 ? 'Rush Order' : undefined,
    });
  }

  return orders;
}

export function generateMockPrices(): Price[] {
  const prices: Price[] = [
    // ITEM-A prices
    { itemId: 'ITEM-A', supplierId: 'SP-001', price: 15.5, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-A', supplierId: 'SP-001', price: 14.5, orderType: OrderType.HIGH, adjustment: -5 },
    { itemId: 'ITEM-A', supplierId: 'SP-001', price: 13.5, orderType: OrderType.CRITICAL, adjustment: -10 },
    { itemId: 'ITEM-A', supplierId: 'SP-002', price: 16.0, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-A', supplierId: 'SP-002', price: 15.0, orderType: OrderType.HIGH, adjustment: -5 },
    { itemId: 'ITEM-A', supplierId: 'SP-003', price: 14.8, orderType: OrderType.STANDARD, adjustment: 0 },

    // ITEM-B prices
    { itemId: 'ITEM-B', supplierId: 'SP-001', price: 18.0, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-B', supplierId: 'SP-001', price: 17.0, orderType: OrderType.CRITICAL, adjustment: -5 },
    { itemId: 'ITEM-B', supplierId: 'SP-002', price: 17.5, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-B', supplierId: 'SP-003', price: 19.0, orderType: OrderType.STANDARD, adjustment: 0 },

    // ITEM-C prices
    { itemId: 'ITEM-C', supplierId: 'SP-001', price: 12.0, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-C', supplierId: 'SP-002', price: 11.5, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-C', supplierId: 'SP-003', price: 13.0, orderType: OrderType.STANDARD, adjustment: 0 },

    // ITEM-D prices
    { itemId: 'ITEM-D', supplierId: 'SP-001', price: 20.0, orderType: OrderType.STANDARD, adjustment: 0 },
    { itemId: 'ITEM-D', supplierId: 'SP-002', price: 21.0, orderType: OrderType.STANDARD, adjustment: 0 },
  ];

  return prices;
}

export function generateMockStocks(): Stock[] {
  const stocks: Stock[] = [
    // Warehouse 1
    { warehouseId: 'WH-001', itemId: 'ITEM-A', availableQuantity: 5000, supplierId: 'SP-001' },
    { warehouseId: 'WH-001', itemId: 'ITEM-B', availableQuantity: 3500, supplierId: 'SP-001' },
    { warehouseId: 'WH-001', itemId: 'ITEM-C', availableQuantity: 4500, supplierId: 'SP-002' },
    { warehouseId: 'WH-001', itemId: 'ITEM-D', availableQuantity: 2000, supplierId: 'SP-003' },

    // Warehouse 2
    { warehouseId: 'WH-002', itemId: 'ITEM-A', availableQuantity: 3000, supplierId: 'SP-002' },
    { warehouseId: 'WH-002', itemId: 'ITEM-B', availableQuantity: 2500, supplierId: 'SP-002' },
    { warehouseId: 'WH-002', itemId: 'ITEM-C', availableQuantity: 3800, supplierId: 'SP-001' },
    { warehouseId: 'WH-002', itemId: 'ITEM-D', availableQuantity: 1500, supplierId: 'SP-001' },

    // Warehouse 3
    { warehouseId: 'WH-003', itemId: 'ITEM-A', availableQuantity: 4200, supplierId: 'SP-003' },
    { warehouseId: 'WH-003', itemId: 'ITEM-B', availableQuantity: 2800, supplierId: 'SP-003' },
    { warehouseId: 'WH-003', itemId: 'ITEM-C', availableQuantity: 3200, supplierId: 'SP-003' },
    { warehouseId: 'WH-003', itemId: 'ITEM-D', availableQuantity: 1800, supplierId: 'SP-002' },
  ];

  return stocks;
}
