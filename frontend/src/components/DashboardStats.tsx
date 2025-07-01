import React from 'react';
import { Users, TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface StatsData {
  totalEmployees: number;
  positionStats: Array<{
    _id: string;
    count: number;
  }>;
}

interface DashboardStatsProps {
  stats: StatsData;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const getPositionColor = (position: string) => {
    const colors = {
      'HR': '#ec4899',
      'Software Engineer': '#3b82f6',
      'Data Analyst': '#10b981',
      'Business Analyst': '#f59e0b',
      'Project Manager': '#8b5cf6',
      'QA Engineer': '#6366f1'
    };
    return colors[position as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Employees */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          </div>
        </div>
      </div>

      {/* Position Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
        <div className="flex items-center mb-4">
          <PieChart className="h-6 w-6 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Employees by Position</h3>
        </div>
        <div className="space-y-3">
          {stats.positionStats.map((stat) => (
            <div key={stat._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: getPositionColor(stat._id) }}
                />
                <span className="text-sm text-gray-700">{stat._id}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;