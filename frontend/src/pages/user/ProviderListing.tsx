import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaTimes, FaPhone, FaMapMarkerAlt, FaStar, FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

interface Provider {
  _id: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  location: string;
  phone: string;
  experience: number;
  bio: string;
  responseTime: string;
}

const PRIMARY_COLOR = '#0891b2';

// Mock provider data for demo
const MOCK_PROVIDERS: Provider[] = [
  {
    _id: '1',
    name: 'John Smith',
    rating: 4.8,
    reviews: 156,
    price: 85,
    location: 'Downtown',
    phone: '+1 (555) 123-4567',
    experience: 8,
    bio: 'Experienced professional with 8+ years in the industry. Reliable and punctual.',
    responseTime: '< 1 hour'
  },
  {
    _id: '2',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 203,
    price: 95,
    location: 'Midtown',
    phone: '+1 (555) 234-5678',
    experience: 12,
    bio: 'Expert provider with excellent customer feedback. Premium quality guaranteed.',
    responseTime: '< 30 mins'
  },
  {
    _id: '3',
    name: 'Mike Davis',
    rating: 4.6,
    reviews: 89,
    price: 65,
    location: 'Suburbs',
    phone: '+1 (555) 345-6789',
    experience: 5,
    bio: 'Affordable rates with quality service. Perfect for startups and small projects.',
    responseTime: '2-3 hours'
  },
  {
    _id: '4',
    name: 'Emily Chen',
    rating: 4.7,
    reviews: 127,
    price: 75,
    location: 'Tech Park',
    phone: '+1 (555) 456-7890',
    experience: 6,
    bio: 'Creative and flexible professional. Great for custom requirements.',
    responseTime: '< 2 hours'
  }
];

export function ProviderListing() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [providers] = useState<Provider[]>(MOCK_PROVIDERS);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const serviceName = searchParams.get('service') || 'Service';

  // Apply filters and sorting
  useEffect(() => {
    let filtered = providers.filter(provider =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case 'rating':
      default:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProviders(filtered);
  }, [searchTerm, sortBy, providers]);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProvider(null);
  };

  const handleContactProvider = (provider: Provider) => {
    alert(`Contacting ${provider.name}\nPhone: ${provider.phone}\n\nThis feature will be implemented soon!`);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        size={14}
        style={{ color: i < Math.floor(rating) ? '#fbbf24' : theme === 'dark' ? '#333333' : '#e5e7eb' }}
      />
    ));
  };

  // Theme styles
  const containerBg = {
    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000'
  };

  const headerStyle = {
    backgroundColor: theme === 'dark' ? '#111111' : '#f9fafb',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    borderBottom: `1px solid ${theme === 'dark' ? '#333333' : '#e5e7eb'}`
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#111111' : '#f9fafb',
    borderColor: theme === 'dark' ? '#333333' : '#e5e7eb'
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    borderColor: theme === 'dark' ? '#444444' : '#d1d5db'
  };

  const modalBg = {
    backgroundColor: theme === 'dark' ? '#111111' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000'
  };

  return (
    <div style={containerBg} className="page-container">
      {/* Header */}
      <div style={headerStyle} className="page-header sticky top-0 z-40">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="text-2xl hover:opacity-70 transition-opacity"
              title="Go back"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                {serviceName} Providers
              </h1>
              <p className="text-sm mt-1" style={{ color: theme === 'dark' ? '#aaaaaa' : '#666666', fontFamily: 'var(--font-worksans)' }}>
                Browse and connect with verified professionals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Filters Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search providers by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
            className="px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'experience')}
            style={inputStyle}
            className="px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price (Low to High)</option>
            <option value="experience">Sort by Experience</option>
          </select>
        </div>

        {/* Results Count */}
        <p style={{ fontFamily: 'var(--font-worksans)', opacity: 0.7, marginBottom: '1.5rem' }}>
          Showing {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'}
        </p>

        {/* Providers List */}
        <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                style={cardStyle}
                className="p-6 rounded-lg border-2 transition-all hover:shadow-lg hover:border-cyan-500 cursor-pointer animate-fadeIn flex items-center justify-between"
                onClick={() => handleProviderClick(provider)}
              >
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          {renderStars(provider.rating)}
                          <span style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7, marginLeft: '0.25rem' }}>
                            {provider.rating.toFixed(1)} ({provider.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '20px', fontWeight: 'bold', color: PRIMARY_COLOR }}>
                        ${provider.price}/hr
                      </p>
                      <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }}>
                        {provider.experience}+ years
                      </p>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="flex items-center gap-2" style={{ fontFamily: 'var(--font-worksans)' }}>
                      <FaMapMarkerAlt size={14} style={{ opacity: 0.6 }} />
                      <span style={{ fontSize: '14px' }}>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ fontFamily: 'var(--font-worksans)' }}>
                      <FaPhone size={14} style={{ opacity: 0.6 }} />
                      <span style={{ fontSize: '14px' }}>{provider.responseTime} response</span>
                    </div>
                  </div>

                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '13px', opacity: 0.7 }}>
                    {provider.bio}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContactProvider(provider);
                  }}
                  className="ml-4 px-6 py-3 rounded-lg font-bold transition-all hover:shadow-md active:scale-95 whitespace-nowrap"
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    color: 'white',
                    fontFamily: 'var(--font-worksans)'
                  }}
                >
                  Contact
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedProvider && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div style={modalBg} className="modal-content rounded-lg shadow-xl max-w-2xl w-full animate-scaleIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: theme === 'dark' ? '#333333' : '#e5e7eb' }}>
              <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {selectedProvider.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(selectedProvider.rating)}
                  <span style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }}>
                    {selectedProvider.rating.toFixed(1)} ({selectedProvider.reviews} reviews)
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-2xl hover:opacity-70 transition-opacity"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>About</h3>
                <p style={{ fontFamily: 'var(--font-worksans)', opacity: 0.8 }}>
                  {selectedProvider.bio}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Hourly Rate</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold', color: PRIMARY_COLOR }}>
                    ${selectedProvider.price}
                  </p>
                </div>
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Experience</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold' }}>
                    {selectedProvider.experience}+ yrs
                  </p>
                </div>
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Response Time</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {selectedProvider.responseTime}
                  </p>
                </div>
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Reviews</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold' }}>
                    {selectedProvider.reviews}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Contact Information</h3>
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <FaPhone size={16} style={{ color: PRIMARY_COLOR }} />
                    <span style={{ fontFamily: 'var(--font-worksans)' }}>{selectedProvider.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt size={16} style={{ color: PRIMARY_COLOR }} />
                    <span style={{ fontFamily: 'var(--font-worksans)' }}>{selectedProvider.location}</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    handleContactProvider(selectedProvider);
                    handleCloseDetail();
                  }}
                  className="px-6 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    color: 'white',
                    fontFamily: 'var(--font-worksans)'
                  }}
                >
                  Contact Provider
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="px-6 py-3 rounded-lg font-bold transition-all"
                  style={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    fontFamily: 'var(--font-worksans)',
                    border: `1px solid ${theme === 'dark' ? '#333333' : '#e5e7eb'}`
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderListing;
