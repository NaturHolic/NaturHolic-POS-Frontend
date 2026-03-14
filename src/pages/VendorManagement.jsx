import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendorName, setVendorName] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setPageLoading(true);
      const { data } = await axios.get(`${API}/GetAllVendors`);
      setVendors(data.vendors || []);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleOpenModal = (vendor = null) => {
    if (vendor) {
      setCurrentVendor(vendor);
      setVendorName(vendor.vendorName);
    } else {
      setCurrentVendor(null);
      setVendorName('');
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (currentVendor) {
        const { data } = await axios.put(`${API}/UpdateVendor?id=${currentVendor._id}`, { vendorName });
        setVendors((prev) =>
          prev.map((v) => v._id === currentVendor._id ? data.updatedVendor : v)
        );
        setIsModalOpen(false);
      } else {
        await axios.post(`${API}/CreateVendor`, { vendorName });
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong.';
      alert(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`Delete vendor "${vendor.vendorName}"?`)) return;
    try {
      await axios.delete(`${API}/DeleteVendor?id=${vendor._id}`);
      setVendors((prev) => prev.filter((v) => v._id !== vendor._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vendor.');
    }
  };

  const filtered = vendors.filter((v) =>
    v.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (pageLoading) {
    return (
      <div className="full-height-page">
        <Header title="Vendor Management" />
        <div className="page-content">
          <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div style={{
                width: '40px', height: '40px',
                border: '4px solid var(--color-neutral-200)',
                borderTop: '4px solid var(--color-black)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }} />
              <p className="text-neutral-500">Loading vendors...</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div className="full-height-page">
      <Header title="Vendor Management">
        <button onClick={() => handleOpenModal()} className="bw-button-primary">
          <Plus size={18} />
          <span>Add Vendor</span>
        </button>
      </Header>

      <div className="page-content">
        <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search vendors..."
              className="bw-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bw-card">
          <table className="w-full" style={{ textAlign: 'left' }}>
            <thead>
              <tr>
                <th className="bw-table-header">#</th>
                <th className="bw-table-header">Vendor Name</th>
                <th className="bw-table-header">Created At</th>
                <th className="bw-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vendor, index) => (
                <tr key={vendor._id}>
                  <td className="bw-table-cell text-neutral-400 text-sm">{index + 1}</td>
                  <td className="bw-table-cell font-medium">{vendor.vendorName}</td>
                  <td className="bw-table-cell text-neutral-500 text-sm">
                    {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="bw-table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(vendor)} className="action-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(vendor)} className="action-btn action-btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-neutral-500">
                    {searchTerm ? 'No vendors found matching your search.' : 'No vendors added yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentVendor ? 'Edit Vendor' : 'Add New Vendor'}
      >
        <form onSubmit={handleSave} className="form-space">
          <div>
            <label className="form-label">Vendor Name</label>
            <input
              type="text"
              className="bw-input"
              placeholder="e.g. Ahmed Traders"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem', backgroundColor: '#fee2e2',
              border: '1px solid #ef4444', borderRadius: 'var(--radius)',
            }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bw-button-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bw-button-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : currentVendor ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}