import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const PRIMARY_COLOR = '#0891b2';

export function AdminAuth() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.adminId.trim()) {
      newErrors.adminId = 'Admin ID is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate admin authentication
      // In production, this would call your backend admin auth endpoint
      if (formData.adminId === 'admin' && formData.password === 'admin@123') {
        // Store admin token
        localStorage.setItem('admin_token', 'admin_' + Date.now());
        localStorage.setItem('admin_user', JSON.stringify({
          id: formData.adminId,
          role: 'admin',
          email: 'admin@smartlocal.com'
        }));

        navigate('/admin/dashboard');
      } else {
        setServerError('Invalid Admin ID or Password');
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#111111' : '#f5f5f5',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    borderColor: PRIMARY_COLOR
  };

  const labelStyle = {
    color: theme === 'dark' ? '#ffffff' : '#000000',
    fontFamily: 'var(--font-outfit)'
  };

  const containerBg = {
    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000'
  };

  const errorStyle = {
    color: '#ef4444',
    fontFamily: 'var(--font-worksans)'
  };

  return (
    <div style={containerBg} className="min-h-screen flex flex-col">
      {/* Back Button */}
      <Link
        to="/"
        style={{ color: PRIMARY_COLOR }}
        className="p-4 inline-flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
      >
        <FaArrowLeft size={18} />
        <span style={{ fontFamily: 'var(--font-worksans)' }} className="font-medium">Back to Home</span>
      </Link>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 style={{ fontFamily: 'var(--font-outfit)', color: theme === 'dark' ? '#ffffff' : '#000000' }} className="text-4xl font-black mb-2">
              Admin Portal
            </h1>
            <p style={{ fontFamily: 'var(--font-worksans)', color: theme === 'dark' ? '#aaaaaa' : '#666666' }} className="text-sm">
              Manage services and platform
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div style={{ color: '#ef4444', backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }} className="p-3 rounded-lg mb-5 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin ID Field */}
            <div>
              <label style={labelStyle} className="block text-sm font-semibold mb-2">
                Admin ID
              </label>
              <input
                type="text"
                value={formData.adminId}
                onChange={(e) => {
                  setFormData({ ...formData, adminId: e.target.value });
                  if (errors.adminId) setErrors({ ...errors, adminId: '' });
                }}
                placeholder="Enter admin ID"
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all"
              />
              {errors.adminId && <p style={errorStyle} className="mt-2 text-sm">{errors.adminId}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label style={labelStyle} className="block text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter password"
                  style={inputStyle}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: PRIMARY_COLOR }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && <p style={errorStyle} className="mt-2 text-sm">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ fontFamily: 'var(--font-worksans)' }}
              className="w-full bg-linear-to-r from-[#0891b2] to-[#06b6d4] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
            >
              {loading ? 'Signing In...' : 'Admin Sign In'}
            </button>

            {/* Demo Credentials */}
            <div style={{ backgroundColor: theme === 'dark' ? 'rgba(8, 145, 178, 0.1)' : 'rgba(8, 145, 178, 0.05)', borderLeft: '4px solid ' + PRIMARY_COLOR }} className="p-4 rounded-lg mt-6">
              <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }}>
                Admin ID: <code style={{ color: PRIMARY_COLOR, fontWeight: 'bold' }}>admin</code>
              </p>
              <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }}>
                Password: <code style={{ color: PRIMARY_COLOR, fontWeight: 'bold' }}>admin@123</code>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
