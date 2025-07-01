import React from 'react';
import { Employee } from '../types/employee';
import { User, Mail, MapPin, Calendar, Briefcase, X } from 'lucide-react';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
  onEdit: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onClose, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPositionBadgeColor = (position: string) => {
    const colors = {
      'HR': 'bg-pink-100 text-pink-800',
      'Software Engineer': 'bg-blue-100 text-blue-800',
      'Data Analyst': 'bg-green-100 text-green-800',
      'Business Analyst': 'bg-yellow-100 text-yellow-800',
      'Project Manager': 'bg-purple-100 text-purple-800',
      'QA Engineer': 'bg-indigo-100 text-indigo-800'
    };
    return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-2" />
            Employee Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {employee.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{employee.fullName}</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPositionBadgeColor(employee.position)}`}>
                  {employee.position}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{formatDate(employee.dateOfBirth)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p className="text-gray-900">{employee.position}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{employee.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;