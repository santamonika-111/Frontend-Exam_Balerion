import React, { useState, useMemo } from 'react';
import { OrderTable } from './components/OrderTable';
import { AllocationModal } from './components/AllocationModal';
import { FilterPanel } from './components/FilterPanel';
import { StatsPanel } from './components/StatsPanel';
import { useOrderAllocation } from './hooks/useOrderAllocation';
import { generateMockOrders, generateMockPrices, generateMockStocks } from './utils/mockData';
import { Order } from './types';

function App() {
  // Generate mock data
  const orders = useMemo(() => generateMockOrders(5000), []);
  const stocks = useMemo(() => generateMockStocks(), []);
  const prices = useMemo(() => generateMockPrices(), []);

  // Use allocation hook
  const {
    allocatedOrders,
    sortedOrders,
    stats,
    filter,
    setFilter,
    sort,
    setSort,
    updateAllocation,
    autoAllocate,
  } = useOrderAllocation(orders, stocks, prices);

  // UI State
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = allocatedOrders.find((o) => o.orderId === selectedOrderId);

  // Extract unique values for filters
  const uniqueWarehouses = Array.from(
    new Set(orders.map((o) => o.warehouseId))
  ).sort();
  const uniqueSuppliers = Array.from(
    new Set(orders.map((o) => o.supplierId))
  ).sort();
  const uniqueCustomers = Array.from(
    new Set(orders.map((o) => o.customerId))
  ).sort();

  const handleAllocate = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleModalSubmit = (
    quantity: number,
    warehouseId: string,
    supplierId: string
  ) => {
    if (selectedOrderId) {
      updateAllocation(selectedOrderId, quantity, warehouseId, supplierId);
      setSelectedOrderId(null);
    }
  };

  const handleSort = (field: string) => {
    if (sort.field === field) {
      setSort({
        field: field as any,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({ field: field as any, direction: 'asc' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Salmon Allocation System
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and allocate salmon orders efficiently
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Panel */}
        <StatsPanel stats={stats} />

        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Showing {sortedOrders.length} of {allocatedOrders.length} orders
            </h3>
          </div>
          <button
            onClick={autoAllocate}
            className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
          >
            🤖 Auto-Allocate All
          </button>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filter={filter}
          onFilterChange={setFilter}
          warehouses={uniqueWarehouses}
          suppliers={uniqueSuppliers}
          customers={uniqueCustomers}
        />

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <OrderTable
            orders={sortedOrders}
            onAllocate={handleAllocate}
            sortField={sort.field}
            sortDirection={sort.direction}
            onSort={handleSort}
          />
        </div>

        {/* Allocation Modal */}
        {selectedOrder && (
          <AllocationModal
            order={selectedOrder}
            stocks={stocks}
            prices={prices}
            onSubmit={handleModalSubmit}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Salmon Allocation System © 2024</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
