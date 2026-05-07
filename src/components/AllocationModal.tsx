import React, { useState } from 'react';
import { OrderWithAllocation, Stock, Price, OrderType } from '../../types';

interface AllocationModalProps {
  order: OrderWithAllocation;
  stocks: Stock[];
  prices: Price[];
  onSubmit: (quantity: number, warehouseId: string, supplierId: string) => void;
  onClose: () => void;
}

export function AllocationModal({
  order,
  stocks,
  prices,
  onSubmit,
  onClose,
}: AllocationModalProps) {
  const [quantity, setQuantity] = useState(order.allocatedQuantity || 0);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [error, setError] = useState('');

  // Get available stocks for this item
  const availableStocks = stocks.filter((s) => s.itemId === order.itemId);
  const warehouses = Array.from(new Set(availableStocks.map((s) => s.warehouseId)));
  const suppliers = Array.from(new Set(availableStocks.map((s) => s.supplierId)));

  // Get available quantity from selected source
  const selectedStock = availableStocks.find(
    (s) => s.warehouseId === selectedWarehouse && s.supplierId === selectedSupplier
  );
  const maxAvailable = selectedStock?.availableQuantity || 0;

  // Get price
  const selectedPrice = prices.find(
    (p) =>
      p.itemId === order.itemId &&
      p.supplierId === selectedSupplier &&
      (p.orderType === order.type || p.orderType === OrderType.STANDARD)
  );

  const unitPrice = selectedPrice
    ? selectedPrice.price * (1 + selectedPrice.adjustment / 100)
    : 0;

  const handleSubmit = () => {
    setError('');

    if (!selectedWarehouse || !selectedSupplier) {
      setError('Please select warehouse and supplier');
      return;
    }

    if (quantity <= 0 || quantity > order.requestedQuantity) {
      setError(
        `Quantity must be between 0 and ${order.requestedQuantity}`
      );
      return;
    }

    if (quantity > maxAvailable) {
      setError(
        `Quantity exceeds available stock (${maxAvailable})`
      );
      return;
    }

    onSubmit(quantity, selectedWarehouse, selectedSupplier);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Allocate Order</h2>

        {/* Order Info */}
        <div className="bg-gray-50 p-4 rounded mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Order ID</p>
              <p className="font-semibold">{order.orderId}</p>
            </div>
            <div>
              <p className="text-gray-600">Item</p>
              <p className="font-semibold">{order.itemId}</p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-semibold">{order.type}</p>
            </div>
            <div>
              <p className="text-gray-600">Requested</p>
              <p className="font-semibold">{order.requestedQuantity}</p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Warehouse Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((wh) => (
              <option key={wh} value={wh}>
                {wh}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Supplier
          </label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        {/* Available Stock & Price */}
        {selectedWarehouse && selectedSupplier && (
          <div className="bg-blue-50 p-3 rounded mb-4 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Available Stock:</span>
              <span className="font-semibold text-gray-900">{maxAvailable}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unit Price:</span>
              <span className="font-semibold text-gray-900">${unitPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantity to Allocate
          </label>
          <input
            type="number"
            min="0"
            max={order.requestedQuantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max: {order.requestedQuantity}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
          >
            Allocate
          </button>
        </div>
      </div>
    </div>
  );
}
