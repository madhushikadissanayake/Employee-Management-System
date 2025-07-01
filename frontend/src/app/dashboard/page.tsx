'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import EmployeeForm from '../../components/EmployeeForm';
import EmployeeTable from '../../components/EmployeeTable';
import EmployeeDetails from '../../components/EmployeeDetails';
import SearchAndFilter from '../../components/SearchAndFilter';
import Pagination from '../../components/Pagination';
import DashboardStats from '../../components/DashboardStats';
import { Employee, EmployeeFormData, PaginationInfo } from '../../types/employee';
import { employeeAPI } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { Plus, List, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({ totalEmployees: 0, positionStats: [] });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalEmployees: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll({
        search: searchTerm,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 5
      });
      setEmployees(response.data.employees);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await employeeAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [searchTerm, sortBy, sortOrder, currentPage, user]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [employees, user]);

  const handleFormSubmit = async (formData: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee._id!, formData);
        toast.success('Employee updated successfully');
        setEditingEmployee(null);
      } else {
        await employeeAPI.create(formData);
        toast.success('Employee added successfully');
      }
      
      setShowForm(false);
      setActiveTab('list');
      fetchEmployees();
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
    setActiveTab('add');
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toaster position="top-right" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management Dashboard</h1>
          <p className="text-gray-600">Manage your workforce efficiently</p>
        </div>

        <DashboardStats stats={stats} />

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => {
                  setActiveTab('list');
                  setShowForm(false);
                  setEditingEmployee(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <List className="h-5 w-5 mr-2" />
                  Employee List
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('add');
                  setShowForm(true);
                  setEditingEmployee(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Employee
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-6">
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading employees...</p>
              </div>
            ) : employees.length > 0 ? (
              <>
                <EmployeeTable
                  employees={employees}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <Pagination
                  pagination={pagination}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'No employees match your search criteria.' : 'Get started by adding your first employee.'}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('add');
                    setShowForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add First Employee
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmployeeForm
            employee={editingEmployee || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEmployee(null);
              setActiveTab('list');
            }}
            isEdit={!!editingEmployee}
          />
        )}

        {selectedEmployee && (
          <EmployeeDetails
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onEdit={() => {
              handleEdit(selectedEmployee);
              setSelectedEmployee(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}
