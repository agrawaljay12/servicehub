import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { PROVIDER_ENDPOINTS } from "../../config/provider";

interface ApiProvider {
  _id: string;
  location: string;
  experience?: string;
  price: string;
  description: string;
  rating?: number;

  name?: string;
  email?: string;
  phone_no?: string;
}

interface Provider {
  _id: string;
  name: string;
  price: number;
  location: string;
  phone: string;
  email: string;
  experience: number;
  bio: string;
  rating?: number;
}



export function ProviderListing() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [sortField, setSortField] = useState<'price' | 'experience' | 'rating'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [, setSelectedProvider] = useState<Provider | null>(null);
  const [, setShowDetail] = useState(false);
  const [, setLoading] = useState(true);
  const [, setServerError] = useState('');

  const serviceName = searchParams.get('service') || 'Service';

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch from backend (pagination + sorting + search)
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setServerError('');

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort_by: sortField,
          sort_order: sortOrder,
          location: debouncedSearch,
          description: debouncedSearch,
          name: debouncedSearch
        });

        const response = await fetch(`${PROVIDER_ENDPOINTS.fetchAll}?${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to fetch providers');
        }

        const list: ApiProvider[] = data?.data?.providers || [];

        const mapped: Provider[] = list.map((provider) => ({
          _id: provider._id,
          name: provider.name || "Unknown Provider",
          email: provider.email || "N/A",
          phone: provider.phone_no || "N/A",
          price: Number(provider.price ?? 0),
          experience: Number(provider.experience ?? 0),
          location: provider.location || "N/A",
          bio: provider.description || "",
          rating: Number(provider.rating ?? 0)
        }));

        setProviders(mapped);
        setFilteredProviders(mapped);
        setTotal(data?.data?.total || 0);

      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Connection error';

        setServerError(errorMessage);
        setProviders([]);
        setFilteredProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [page, sortField, sortOrder, debouncedSearch]);

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowDetail(true);
  };

 

  const totalPages = Math.ceil(total / limit);

  // Theme styles (UNCHANGED)
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

  
  return (
    <div style={containerBg} className="page-container">

      {/* HEADER (UNCHANGED) */}
      <div style={headerStyle} className="page-header sticky top-0 z-40">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => navigate(-1)} className="text-2xl">
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold">{serviceName} Providers</h1>
              <p className="text-sm mt-1">Browse and connect with verified professionals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-5xl mx-auto w-full">

        {/* FILTERS (UNCHANGED UI) */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
            className="px-4 py-3 rounded-lg border"
          />

          <select
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value as any);
              setPage(1);
            }}
            style={inputStyle}
            className="px-4 py-3 rounded-lg border"
          >
            <option value="price">Price</option>
            <option value="experience">Experience</option>
            <option value="rating">Rating</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as any);
              setPage(1);
            }}
            style={inputStyle}
            className="px-4 py-3 rounded-lg border"
          >
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div
              key={provider._id}
              style={cardStyle}
              className="p-6 rounded-lg border-2 cursor-pointer flex justify-between"
              onClick={() => handleProviderClick(provider)}
            >
              <div>
                <h3 className="text-xl font-bold">{provider.name}</h3>
                <p>{provider.location}</p>
                <p>{provider.bio}</p>
              </div>

              <div>
                <p>${provider.price}/hr</p>
                <p>{provider.experience}+ yrs</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ PAGINATION (NEW) */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>

          <span>Page {page} of {totalPages || 1}</span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProviderListing;