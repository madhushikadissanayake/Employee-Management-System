export interface Employee {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  position: 'HR' | 'Software Engineer' | 'Data Analyst' | 'Business Analyst' | 'Project Manager' | 'QA Engineer';
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  position: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  hasNext: boolean;
  hasPrev: boolean;
}