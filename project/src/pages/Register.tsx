import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { School, Eye, EyeOff, CheckCircle, User, Users, Building, GraduationCap } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'parent' | 'teacher' | 'student' | 'guest'>('parent');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Additional teacher fields
  const [teacherInfo, setTeacherInfo] = useState({
    schoolName: '',
    teacherId: '',
    department: '',
    district: '',
    subjects: '',
    gradeLevels: '',
    yearsExperience: '',
    certifications: '',
  });

  // Additional student fields
  const [nisn, setNisn] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleTeacherInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeacherInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || (role !== 'student' && (!email || !password || !confirmPassword))) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (role === 'student' && !nisn) {
      setError('Please provide your NISN');
      return;
    }
    
    if (role !== 'student' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (role === 'teacher') {
      const requiredTeacherFields = ['schoolName', 'teacherId', 'department', 'subjects', 'gradeLevels'];
      const missingFields = requiredTeacherFields.filter(field => !teacherInfo[field as keyof typeof teacherInfo]);
      
      if (missingFields.length > 0) {
        setError('Please complete all required teacher information');
        return;
      }
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await register(name, email, password, role, nisn);
      navigate('/');
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="bg-blue-100 rounded-full p-3">
              <School className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Join BOS Monitor to review and track school fund transparency
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
                    role === 'parent'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>Parent</span>
                  {role === 'parent' && <CheckCircle className="h-5 w-5 ml-2 text-blue-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
                    role === 'teacher'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mr-2" />
                  <span>Teacher</span>
                  {role === 'teacher' && <CheckCircle className="h-5 w-5 ml-2 text-blue-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 ${
                    role === 'student'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  <span>Student</span>
                  {role === 'student' && <CheckCircle className="h-5 w-5 ml-2 text-blue-500" />}
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {role !== 'student' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Student-specific Fields */}
            {role === 'student' && (
              <div>
                <label htmlFor="nisn" className="block text-sm font-medium text-gray-700">
                  NISN (Number) <span className="text-red-500">*</span>
                </label>
                <input
                  id="nisn"
                  type="text"
                  required
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Password Fields */}
            {role !== 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Teacher-specific Fields */}
            {role === 'teacher' && (
              <div className="space-y-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Teacher Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
                      School/Institution Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="schoolName"
                      name="schoolName"
                      type="text"
                      value={teacherInfo.schoolName}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
                      Teacher ID/Employee Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="teacherId"
                      name="teacherId"
                      type="text"
                      value={teacherInfo.teacherId}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department/Faculty <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      value={teacherInfo.department}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      School District/Region
                    </label>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      value={teacherInfo.district}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
                      Subject(s) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subjects"
                      name="subjects"
                      type="text"
                      placeholder="e.g., Mathematics, Science"
                      value={teacherInfo.subjects}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gradeLevels" className="block text-sm font-medium text-gray-700">
                      Grade Level(s) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="gradeLevels"
                      name="gradeLevels"
                      type="text"
                      placeholder="e.g., 9, 10, 11"
                      value={teacherInfo.gradeLevels}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
                      Years of Teaching Experience
                    </label>
                    <input
                      id="yearsExperience"
                      name="yearsExperience"
                      type="number"
                      min="0"
                      value={teacherInfo.yearsExperience}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
                      Certifications/Credentials
                    </label>
                    <input
                      id="certifications"
                      name="certifications"
                      type="text"
                      placeholder="e.g., Teaching License, Subject Certifications"
                      value={teacherInfo.certifications}
                      onChange={handleTeacherInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Already have an account? Login
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-xs text-center text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;