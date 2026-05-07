import React from 'react';
import { AllocationStats, OrderType } from '../../types';

interface StatsPanelProps {
  stats: AllocationStats;
}

const getTypeColor = (type: OrderType): string => {
  switch (type) {
    case OrderType.CRITICAL:
      return 'text-red-600 bg-red-50';
    case OrderType.HIGH:
      return 'text-orange-600 bg-orange-50';
    case OrderType.STANDARD:
      return 'text-blue-600 bg-blue-50';
    case OrderType.LOW:
      return 'text-gray-600 bg-gray-50';
  }
};

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="font-semibold text-gray-900 mb-4">Allocation Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>

        {/* Total Requested */}
        <div className="bg-purple-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-1">Total Requested</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalRequested.toLocaleString()}</p>
        </div>

        {/* Total Allocated */}
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalAllocated.toLocaleString()}</p>
        </div>

        {/* Allocation Rate */}
        <div className="bg-indigo-50 p-4 rounded">
          <p className="text-sm text-gray-600 mb-1">Allocation Rate</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.allocationRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* By Order Type */}
      <div>
        <h4 className="font-semibold text-gray-900 text-sm mb-3">By Order Type</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.byType).map(([type, data]) => (
            <div key={type} className={`p-4 rounded ${getTypeColor(type as OrderType)}`}>
              <p className="text-sm font-medium mb-2">{type}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Requested:</span>
                  <span className="font-semibold">{data.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allocated:</span>
                  <span className="font-semibold">{data.allocated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-semibold">
                    {data.total > 0 ? ((data.allocated / data.total) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
