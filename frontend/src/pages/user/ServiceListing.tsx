import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaTimes, FaArrowRight, FaStar } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { CATEGORY_ENDPOINTS } from "../../config/category";
import { getAuthHeader } from "../../utils/authHelper";
import { fetchWithAuth } from "../../utils/fetch_auth";

interface Service {
  _id: string;
  service_name: string;
}

interface ApiResponse {
  message: string;
  data: Service[] | { id: string };
}

const PRIMARY_COLOR = '#0891b2';

export function ServiceListing() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSearchTerm(category);
    }
    fetchServices();
  }, [searchParams]);

  // Filter services when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = services.filter(service =>
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetchWithAuth(CATEGORY_ENDPOINTS.fetchAll, {
        method: 'GET',
        headers: getAuthHeader()
      });
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch services');
      }

      if (Array.isArray(data.data)) {
        setServices(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedService(null);
  };

  const handleBookService = (service: Service) => {
    navigate(`/user/providers?service_id=${service._id}`);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                Browse Services
              </h1>
              <p className="text-sm mt-1" style={{ color: theme === 'dark' ? '#aaaaaa' : '#666666', fontFamily: 'var(--font-worksans)' }}>
                Find and book professional services from verified providers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error mb-6 flex items-center justify-between p-4 rounded-lg animate-slideInDown" style={{
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            color: '#ef4444',
            borderLeft: '4px solid #ef4444'
          }}>
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-lg hover:opacity-70">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {searchTerm && (
            <p style={{ fontFamily: 'var(--font-worksans)', opacity: 0.7, marginTop: '0.5rem' }}>
              Showing {filteredServices.length} {filteredServices.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-3xl" style={{ color: PRIMARY_COLOR }} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: theme === 'dark' ? '#aaaaaa' : '#999999' }}>
              {searchTerm ? 'No services match your search' : 'No services available'}
            </p>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                style={cardStyle}
                className="p-6 rounded-lg border transition-all hover:shadow-lg hover:-translate-y-1 animate-fadeIn flex flex-col cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {service.service_name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={14}
                        style={{ color: i < 4 ? '#fbbf24' : theme === 'dark' ? '#333333' : '#e5e7eb' }}
                      />
                    ))}
                    <span style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7, marginLeft: '0.5rem' }}>
                      4.0 (125 reviews)
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: theme === 'dark' ? '#aaaaaa' : '#666666', fontFamily: 'var(--font-worksans)' }}>
                    Find verified professionals in {service.service_name.toLowerCase()} services. Browse rates, reviews, and availability.
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookService(service);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all hover:shadow-md active:scale-95"
                  style={{
                    backgroundColor: PRIMARY_COLOR,
                    color: 'white',
                    fontFamily: 'var(--font-worksans)'
                  }}
                >
                  View Providers
                  <FaArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedService && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div style={modalBg} className="modal-content bg-white rounded-lg shadow-xl max-w-2xl w-full animate-scaleIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: theme === 'dark' ? '#333333' : '#e5e7eb' }}>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                {selectedService.service_name}
              </h2>
              <button
                onClick={handleCloseDetail}
                className="text-2xl hover:opacity-70 transition-opacity"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>Rating</h3>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{ color: i < 4 ? '#fbbf24' : theme === 'dark' ? '#333333' : '#e5e7eb' }}
                    />
                  ))}
                  <span style={{ fontFamily: 'var(--font-worksans)' }}>4.0 / 5.0 (125 reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>About This Service</h3>
                <p style={{ fontFamily: 'var(--font-worksans)', opacity: 0.7 }}>
                  Professional {selectedService.service_name.toLowerCase()} services available. 
                  Browse verified providers in your area with competitive pricing and flexible scheduling.
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Providers</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold' }}>12+</p>
                </div>
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Avg Price</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold' }}>$75/hr</p>
                </div>
                <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f5f5f5' }} className="p-4 rounded-lg">
                  <p style={{ fontFamily: 'var(--font-worksans)', fontSize: '12px', opacity: 0.7 }} className="mb-1">Response</p>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '18px', fontWeight: 'bold' }}>2 hrs</p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  navigate(`/user/providers?service_id=${selectedService._id}`);
                  handleCloseDetail();
                }}
                className="w-full px-6 py-3 rounded-lg font-bold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  color: 'white',
                  fontFamily: 'var(--font-worksans)'
                }}
              >
                Browse Providers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceListing;
