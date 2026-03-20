import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaCloudUploadAlt } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { 
  PROVIDER_ENDPOINTS, 
  MAX_FILE_SIZE, 
  ALLOWED_FILE_TYPES,
  HTTP_STATUS,
  PROVIDER_ERRORS,
  PROVIDER_SUCCESS 
} from "../../config/provider";
import { CATEGORY_ENDPOINTS } from "../../config/category";

interface Category {
  _id: string;
  service_name: string;
}

interface UserData {
  user_id?: string;
  name?: string;
  email?: string;
  address?: string;
  phone_no?: string;
  role?: string;
}

export function ProviderRegister() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    service_category_id: '',
    location: '',
    experience: '',
    price: '',
    description: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Check if user is authenticated and fetch user details
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      setServerError('You must be logged in to register as a provider. Redirecting to login...');
      setTimeout(() => navigate('/auth/signin'), 2000);
      setAuthChecking(false);
      return;
    }

    // Get user data from localStorage
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
        
        // Pre-fill location if address is available
        if (user.address) {
          setFormData(prev => ({
            ...prev,
            location: user.address
          }));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    setAuthChecking(false);
  }, [navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORY_ENDPOINTS.fetchAll);
        const data = await response.json();
        if (response.ok && data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        delete prev[name];
        return { ...prev };
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      if (formErrors.file) {
        setFormErrors(prev => {
          delete prev.file;
          return { ...prev };
        });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.service_category_id) errors.service_category_id = 'Service category is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.experience.trim()) errors.experience = 'Experience is required';
    if (!formData.price.trim()) errors.price = 'Price is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!file) errors.file = 'Upload a document';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const userDataStr = localStorage.getItem('user');
      
      console.log('═══════════════════════════════════════════');
      console.log('🔐 TOKEN & AUTH DEBUG');
      console.log('═══════════════════════════════════════════');
      console.log('✓ Token present:', !!token);
      if (token) {
        console.log('  - Token length:', token.length);
        console.log('  - First 50 chars:', token.substring(0, 50));
        console.log('  - Token starts with:', token.substring(0, 10));
      }
      console.log('✓ User data present:', !!userDataStr);
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          console.log('  - User ID:', userData.user_id);
          console.log('  - User email:', userData.email);
          console.log('  - User role:', userData.role);
        } catch (e) {
          console.error('  - Error parsing user data:', e);
        }
      }
      
      if (!token) {
        setServerError(PROVIDER_ERRORS.MISSING_TOKEN);
        setLoading(false);
        return;
      }
      if (!userData?.user_id) {
        setServerError('User ID missing. Please login again.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('service_category_id', formData.service_category_id);
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('experience', formData.experience.trim());
      formDataToSend.append('price', formData.price.trim());
      formDataToSend.append('description', formData.description.trim());
      if (file) formDataToSend.append('file', file);

      console.log('═══════════════════════════════════════════');
      console.log('🚀 REQUEST DETAILS');
      console.log('═══════════════════════════════════════════');
      console.log('Endpoint:', PROVIDER_ENDPOINTS.create);
      console.log('Method: POST');
      console.log('Authorization:', `Bearer ${token.substring(0, 20)}...`);
      console.log('Form fields:', {
        service_category_id: formData.service_category_id,
        location: formData.location,
        hasFile: !!file
      });

      const response = await fetch(PROVIDER_ENDPOINTS.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('═══════════════════════════════════════════');
      console.log('📊 RESPONSE DETAILS');
      console.log('═══════════════════════════════════════════');
      console.log('Status:', response.status, response.statusText);
      console.log('Headers:', {
        'content-type': response.headers.get('content-type'),
        'server': response.headers.get('server')
      });

      const data = await response.json();
      console.log('Response body:', data);

      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        console.error('❌ AUTHORIZATION FAILED');
        console.error('Error detail:', data.detail);
        console.warn('⚠️ Possible causes:');
        console.warn('  1. Token expired (created before session started)');
        console.warn('  2. Backend JWT_SECRET_KEY not set correctly');
        console.warn('  3. Token corrupted during storage/retrieval');
        console.warn('  4. Backend and frontend using different secrets');
        
        setServerError(`${PROVIDER_ERRORS.SESSION_EXPIRED}\n\nDEBUG: ${data.detail}`);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth/signin'), 3000);
        setLoading(false);
        return;
      }

      if (response.status === HTTP_STATUS.NOT_FOUND) {
        setServerError(PROVIDER_ERRORS.CATEGORY_NOT_FOUND);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorMsg = data.message || data.detail || PROVIDER_ERRORS.REGISTRATION_FAILED;
        setServerError(errorMsg);
        console.error('❌ Request failed:', errorMsg);
        setLoading(false);
        return;
      }

      if (userData) {
        const updatedUser = { ...userData, role: 'provider' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        console.log('✅ User role updated to provider');
      }

      setSuccessMessage(`${PROVIDER_SUCCESS.REGISTERED} ${PROVIDER_SUCCESS.REDIRECTING}`);
      setFormData({ service_category_id: '', location: '', experience: '', price: '', description: '' });
      setFile(null);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : PROVIDER_ERRORS.CONNECTION_ERROR;
      setServerError(errorMessage);
      console.error('💥 Catch error:', error);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#111111' : '#f5f5f5',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    borderColor: '#0891b2'
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
    backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
    fontFamily: 'var(--font-worksans)'
  };

  const successStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
    color: '#10b981',
    fontFamily: 'var(--font-worksans)'
  };

  if (authChecking || categoriesLoading) {
    return (
      <div style={containerBg} className="min-h-screen flex items-center justify-center">
        <p style={labelStyle}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={containerBg} className="min-h-screen flex flex-col">
      {/* Back Button */}
      <Link
        to="/"
        style={{ color: '#0891b2' }}
        className="p-4 inline-flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
      >
        <FaArrowLeft size={18} />
        <span style={{ fontFamily: 'var(--font-worksans)' }} className="font-medium">Back to Home</span>
      </Link>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 style={{ fontFamily: 'var(--font-outfit)', color: theme === 'dark' ? '#ffffff' : '#000000' }} className="text-4xl font-black mb-2">
              Register as Provider
            </h1>
            {/* <p style={{ fontFamily: 'var(--font-worksans)', color: theme === 'dark' ? '#aaaaaa' : '#666666' }} className="text-sm">
              Get provider authority and start offering services
            </p> */}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div style={successStyle} className="p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
              <FaCheck className="mt-0.5 shrink-0" size={18} />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Server Error */}
          {serverError && (
            <div style={errorStyle} className="p-4 rounded-lg mb-6 text-sm">
              {serverError}
            </div>
          )}


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div style={{ borderBottom: '1px solid #0891b2', paddingBottom: '12px', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '13px', color: '#0891b2', opacity: 0.8 }}>
                ℹ️ Fields with <span style={{ color: '#ef4444' }}>*</span> are required. Other details are pre-filled from your profile.
              </p>
            </div>
            {/* Service Category */}
            <div>
              <label style={labelStyle} className="block text-sm font-semibold mb-2">
                Service Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="service_category_id"
                value={formData.service_category_id}
                onChange={handleInputChange}
                disabled={categoriesLoading}
                style={inputStyle}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all ${
                  categoriesLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select a service category'}
                </option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.service_name}
                  </option>
                ))}
              </select>
              {formErrors.service_category_id && (
                <p style={errorStyle} className="mt-2 text-sm">{formErrors.service_category_id}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle} className="block text-sm font-semibold mb-2">
                Location/Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location or address"
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all"
              />
              {formErrors.location && (
                <p style={errorStyle} className="mt-2 text-sm">{formErrors.location}</p>
              )}
            </div>

            {/* Experience & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle} className="block text-sm font-semibold mb-2">
                  Experience <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years, Certified Professional"
                  style={inputStyle}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all"
                />
                {formErrors.experience && (
                  <p style={errorStyle} className="mt-2 text-sm">{formErrors.experience}</p>
                )}
              </div>

              <div>
                <label style={labelStyle} className="block text-sm font-semibold mb-2">
                  Service Price <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter service price"
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all"
                />
                {formErrors.price && (
                  <p style={errorStyle} className="mt-2 text-sm">{formErrors.price}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle} className="block text-sm font-semibold mb-2">
                Description/Bio <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe yourself and your services..."
                rows={4}
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-100 transition-all resize-none"
              />
              {formErrors.description && (
                <p style={errorStyle} className="mt-2 text-sm">{formErrors.description}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label style={labelStyle} className="block text-sm font-semibold mb-2">
                Proof Document (ID/Certification) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div
                style={{
                  borderColor: formErrors.file ? '#ef4444' : file ? '#10b981' : '#0891b2',
                  backgroundColor: formErrors.file 
                    ? (theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')
                    : file
                    ? (theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)')
                    : (theme === 'dark' ? '#111111' : '#f5f5f5')
                }}
                className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  className="hidden"
                  id="proof-document"
                />
                <label htmlFor="proof-document" className="cursor-pointer">
                  <FaCloudUploadAlt
                    size={32}
                    style={{
                      color: file ? '#10b981' : '#0891b2',
                      margin: '0 auto 8px'
                    }}
                  />
                  <p style={labelStyle} className="font-medium">
                    {file ? `✓ ${file.name}` : 'Click to upload or drag and drop'}
                  </p>
                  <p style={{ color: theme === 'dark' ? '#aaaaaa' : '#666666', fontFamily: 'var(--font-worksans)' }} className="text-sm">
                    PDF, Images or Documents (Max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                  </p>
                </label>
              </div>
              {formErrors.file && (
                <p style={errorStyle} className="mt-2 text-sm">{formErrors.file}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#0891b2',
                color: '#ffffff',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-worksans)'
              }}
              className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            >
              {loading ? 'Registering...' : 'Register as Provider'}
            </button>
          </form>

          {/* Info Box */}
          <div
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(8, 145, 178, 0.1)' : 'rgba(8, 145, 178, 0.05)',
              borderLeft: '4px solid #0891b2',
              color: theme === 'dark' ? '#aaaaaa' : '#666666'
            }}
            className="mt-6 p-4 rounded-lg text-sm space-y-2"
          >
            <p style={{ fontFamily: 'var(--font-worksans)' }}>
              <span style={{ fontWeight: 'bold' }}>📋 What Happens Next:</span>
            </p>
            <ul style={{ fontSize: '13px', marginLeft: '16px', listStyle: 'disc', fontFamily: 'var(--font-worksans)' }}>
              <li>Your application will be reviewed by our admin team</li>
              <li>Your account role will be updated to "provider"</li>
              <li>Once approved, you can start offering services</li>
              <li>You'll receive a notification when your status changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
