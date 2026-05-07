import React, { useMemo } from 'react';
import { OrderWithAllocation, OrderType } from '../../types';

interface OrderTableProps {
  orders: OrderWithAllocation[];
  onAllocate: (orderId: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const getTypeColor = (type: OrderType): string => {
  switch (type) {
    case OrderType.CRITICAL:
      return 'bg-red-100 text-red-800';
    case OrderType.HIGH:
      return 'bg-orange-100 text-orange-800';
    case OrderType.STANDARD:
      return 'bg-blue-100 text-blue-800';
    case OrderType.LOW:
      return 'bg-gray-100 text-gray-800';
  }
};

const SortIcon = ({ field, current, direction }: { field: string; current: string; direction: string }) => {
  if (field !== current) return <span className="text-gray-300">⇅</span>;
  return direction === 'asc' ? <span>↑</span> : <span>↓</span>;
};

export function OrderTable({
  orders,
  onAllocate,
  sortField,
  sortDirection,
  onSort,
}: OrderTableProps) {
  const displayOrders = useMemo(() => {
    return orders;
  }, [orders]);

  if (displayOrders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort('orderId')}>
              Order ID <SortIcon field="orderId" current={sortField} direction={sortDirection} />
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort('createdDate')}>
              Created <SortIcon field="createdDate" current={sortField} direction={sortDirection} />
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort('shipmentDate')}>
              Shipment <SortIcon field="shipmentDate" current={sortField} direction={sortDirection} />
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Requested</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Allocated</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Remaining</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayOrders.map((order) => (
            <tr
              key={order.orderId}
              className={`border-b border-gray-200 hover:bg-gray-50 ${
                order.isAllocated ? 'bg-green-50' : ''
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {order.orderId}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(order.createdDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(order.shipmentDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{order.itemId}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(order.type)}`}>
                  {order.type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                {order.requestedQuantity}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                {order.allocatedQuantity}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                {order.remainingQuantity}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onAllocate(order.orderId)}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    order.isAllocated
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {order.isAllocated ? '✓ Allocated' : 'Allocate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
