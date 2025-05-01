import React, { useReducer } from 'react';
import FundAllocationChart from '../components/dashboard/FundAllocationChart';
import FundUsageDonut from '../components/dashboard/FundUsageDonut';
import SchoolsTable from '../components/dashboard/SchoolsTable';
import { BarChart3, Search, Bell, PieChart, Filter, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const { user } = useAuth();

const Dashboard: React.FC = () => {
  // Mock data for the charts and tables
  const allocationData = [
    { name: 'SD Negeri 1', allocated: 350000000, used: 280000000, remaining: 70000000 },
    { name: 'SMP Negeri 3', allocated: 420000000, used: 310000000, remaining: 110000000 },
    { name: 'SMA Negeri 2', allocated: 580000000, used: 420000000, remaining: 160000000 },
    { name: 'SD Negeri 5', allocated: 330000000, used: 290000000, remaining: 40000000 },
    { name: 'SMK Negeri 1', allocated: 610000000, used: 520000000, remaining: 90000000 },
  ];

  const usageData = [
    { name: 'Teacher Salaries', value: 420000000, color: '#0052CC' },
    { name: 'Teaching Materials', value: 150000000, color: '#00B8D9' },
    { name: 'Infrastructure', value: 220000000, color: '#36B37E' },
    { name: 'Student Activities', value: 80000000, color: '#FF8B00' },
    { name: 'Administrative', value: 70000000, color: '#6554C0' },
  ];

  const schoolsData = [
    {
      id: '1',
      name: 'SD Negeri 1 Jakarta',
      level: 'Elementary',
      location: 'Jakarta Pusat',
      rating: 4.2,
      fundAllocation: 350000000,
      fundUsagePercentage: 80,
    },
    {
      id: '2',
      name: 'SMP Negeri 3 Surabaya',
      level: 'Junior High',
      location: 'Surabaya',
      rating: 4.5,
      fundAllocation: 420000000,
      fundUsagePercentage: 73,
    },
    {
      id: '3',
      name: 'SMA Negeri 2 Bandung',
      level: 'Senior High',
      location: 'Bandung',
      rating: 4.8,
      fundAllocation: 580000000,
      fundUsagePercentage: 72,
    },
    {
      id: '4',
      name: 'SD Negeri 5 Semarang',
      level: 'Elementary',
      location: 'Semarang',
      rating: 3.9,
      fundAllocation: 330000000,
      fundUsagePercentage: 88,
    },
    {
      id: '5',
      name: 'SMK Negeri 1 Yogyakarta',
      level: 'Vocational High',
      location: 'Yogyakarta',
      rating: 4.7,
      fundAllocation: 610000000,
      fundUsagePercentage: 85,
    },
    {
      id: '6',
      name: 'SD Negeri 2 Medan',
      level: 'Elementary',
      location: 'Medan',
      rating: 4.0,
      fundAllocation: 340000000,
      fundUsagePercentage: 91,
    },
    {
      id: '7',
      name: 'SMP Negeri 1 Makassar',
      level: 'Junior High',
      location: 'Makassar',
      rating: 4.3,
      fundAllocation: 410000000,
      fundUsagePercentage: 78,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">BOS Fund Dashboard</h1>
        <p className="text-gray-600">
          Overview of School Operational Assistance Fund allocation and utilization
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            <BarChart3 className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">2023/2024 Academic Year</span>
          </div>
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <span className="text-sm font-medium">Updated: May 15, 2025</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-1" />
            Filters
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FundAllocationChart data={allocationData} />
        <FundUsageDonut data={usageData} />
      </div>
      
      <div className="mb-8">
        <SchoolsTable schools={schoolsData} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Updates</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <p className="text-sm text-gray-600">Fund disbursement for Quarter 2 completed</p>
            <p className="text-xs text-gray-400">May 10, 2025</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-1">
            <p className="text-sm text-gray-600">New transparency guidelines published</p>
            <p className="text-xs text-gray-400">May 5, 2025</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4 py-1">
            <p className="text-sm text-gray-600">Annual audit for all schools scheduled for June</p>
            <p className="text-xs text-gray-400">April 28, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;