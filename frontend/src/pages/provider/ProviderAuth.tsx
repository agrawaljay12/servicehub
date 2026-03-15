import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const PRIMARY_COLOR = '#0891b2';

export function ProviderAuth() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    providerId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.providerId.trim()) {
      setError('Provider ID is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate authentication - in production, this would call a backend API
      // For demo, accept any provider ID / password combination
      if (formData.providerId.length < 3) {
        setError('Invalid provider ID');
        return;
      }

      // Simulate successful authentication
      const provider_token = `provider_token_${Date.now()}`;
      const provider_user = {
        id: formData.providerId,
        name: formData.providerId,
        email: `${formData.providerId}@provider.local`,
        role: 'provider',
        joinDate: new Date().toISOString()
      };

      localStorage.setItem('provider_token', provider_token);
      localStorage.setItem('provider_user', JSON.stringify(provider_user));

      // Success
      navigate('/provider/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Theme styles
  const containerBg = {
    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000'
  };

  const formBg = {
    backgroundColor: theme === 'dark' ? '#111111' : '#f9fafb',
    borderColor: theme === 'dark' ? '#333333' : '#e5e7eb'
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    borderColor: theme === 'dark' ? '#444444' : '#d1d5db'
  };

  return (
    <div style={containerBg} className="min-h-screen flex items-center justify-center px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-70 text-lg"
        style={{ color: PRIMARY_COLOR }}
      >
        <FaHome />
        <span style={{ fontFamily: 'var(--font-worksans)' }}>Home</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Provider Portal
          </h1>
          <p style={{ fontFamily: 'var(--font-worksans)', color: theme === 'dark' ? '#aaaaaa' : '#666666' }}>
            Sign in to manage your services
          </p>
        </div>

        {/* Form Card */}
        <div
          style={formBg}
          className="p-8 rounded-lg border mb-6 animate-slideInDown"
        >
          {/* Error Alert */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center justify-between animate-slideInDown"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                color: '#ef4444',
                borderLeft: '4px solid #ef4444'
              }}
            >
              <span style={{ fontFamily: 'var(--font-worksans)' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Provider ID Field */}
            <div className="mb-4">
              <label
                style={{ fontFamily: 'var(--font-worksans)' }}
                className="block text-sm font-bold mb-2"
              >
                Provider ID
              </label>
              <input
                type="text"
                name="providerId"
                value={formData.providerId}
                onChange={handleChange}
                placeholder="Enter your provider ID"
                style={inputStyle}
                className="w-full px-4 py-3 rounded border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                style={{ fontFamily: 'var(--font-worksans)' }}
                className="block text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={inputStyle}
                className="w-full px-4 py-3 rounded border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 mb-4"
              style={{
                backgroundColor: PRIMARY_COLOR,
                color: 'white',
                fontFamily: 'var(--font-worksans)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In as Provider'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div
            className="p-4 rounded-lg text-sm"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              borderLeft: '4px solid #3b82f6',
              color: theme === 'dark' ? '#93c5fd' : '#3b82f6',
              fontFamily: 'var(--font-worksans)'
            }}
          >
            <p className="font-bold mb-2">Demo Credentials:</p>
            <p>ID: <span style={{ fontWeight: 'bold' }}>provider123</span></p>
            <p>Password: <span style={{ fontWeight: 'bold' }}>provider@123</span></p>
            <p className="mt-2 text-xs opacity-80">
              Use any 3+ character ID and 6+ character password for testing
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div
          className="p-6 rounded-lg text-center"
          style={{
            backgroundColor: theme === 'dark' ? '#111111' : '#f9fafb',
            borderColor: theme === 'dark' ? '#333333' : '#e5e7eb',
            border: '1px solid'
          }}
        >
          <p style={{ fontFamily: 'var(--font-worksans)', color: theme === 'dark' ? '#aaaaaa' : '#666666' }}>
            Don't have a provider account yet?
          </p>
          <button
            onClick={() => navigate('/provider/signup')}
            className="mt-3 w-full py-2 rounded transition-all hover:opacity-70"
            style={{
              backgroundColor: PRIMARY_COLOR,
              color: 'white',
              fontFamily: 'var(--font-worksans)',
              fontWeight: 'bold'
            }}
          >
            Create Provider Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProviderAuth;
