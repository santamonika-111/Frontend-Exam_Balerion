import React from 'react';
import { FilterState, OrderType } from '../../types';

interface FilterPanelProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  warehouses: string[];
  suppliers: string[];
  customers: string[];
}

export function FilterPanel({
  filter,
  onFilterChange,
  warehouses,
  suppliers,
  customers,
}: FilterPanelProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filter, searchTerm: value });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({
      ...filter,
      orderType: value as 'ALL' | OrderType,
    });
  };

  const handleCustomerChange = (value: string) => {
    onFilterChange({ ...filter, customerId: value });
  };

  const handleWarehouseChange = (value: string) => {
    onFilterChange({ ...filter, warehouseId: value });
  };

  const handleSupplierChange = (value: string) => {
    onFilterChange({ ...filter, supplierId: value });
  };

  const handleAllocatedChange = (value: string) => {
    onFilterChange({
      ...filter,
      isAllocated: value === '' ? null : value === 'true',
    });
  };

  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      orderType: 'ALL',
      customerId: '',
      warehouseId: '',
      supplierId: '',
      isAllocated: null,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Order ID, Customer, Item..."
            value={filter.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Type
          </label>
          <select
            value={filter.orderType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            {Object.values(OrderType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Customer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer
          </label>
          <select
            value={filter.customerId}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Customers</option>
            {customers.map((cust) => (
              <option key={cust} value={cust}>
                {cust}
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warehouse
          </label>
          <select
            value={filter.warehouseId}
            onChange={(e) => handleWarehouseChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh} value={wh}>
                {wh}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={filter.supplierId}
            onChange={(e) => handleSupplierChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        {/* Allocation Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allocation Status
          </label>
          <select
            value={filter.isAllocated === null ? '' : filter.isAllocated ? 'true' : 'false'}
            onChange={(e) => handleAllocatedChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Allocated</option>
            <option value="false">Not Allocated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
