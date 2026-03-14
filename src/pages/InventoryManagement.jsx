import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Plus, Search, Edit2, Trash2, ChevronDown, X, Eye } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function InventoryManagement() {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewInventory, setViewInventory] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [currentInventory, setCurrentInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');

  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productDropdownRef = useRef(null);

  const [vendorSearch, setVendorSearch] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const vendorDropdownRef = useRef(null);


  const [isEditHistoryModalOpen, setIsEditHistoryModalOpen] = useState(false);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState(null);
  const [historyFormData, setHistoryFormData] = useState({
    addedUnits: '',
    buyingPricePerUnit: '',
    sellingPricePerUnit: '',
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    vendorName: '',
    inventoryType: 'bulk',
    type: 'Bag',
    variantMin: '',
    variantMax: '',
    quantity: '',
    buyingPricePerUnit: '',
    sellingPricePerUnit: '',
  });

  const fetchInventories = async () => {
    try {
      setPageLoading(true);
      const { data } = await axios.get(`${API}/Inventories`);
      setInventories(data.inventories || data.data || []);
    } catch (err) {
      console.error('Failed to fetch inventories:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteHistory = async (entryId) => {
    if (!window.confirm('Remove this stock entry? This will update inventory totals.')) return;
    try {
      const { data } = await axios.delete(
        `${API}/DeleteInventoryStockHistory?inventoryId=${viewInventory._id}&stockHistoryId=${entryId}`
      );
      const updatedInv = data.inventory;
      setViewInventory(updatedInv);
      setInventories((prev) =>
        prev.map((inv) => inv._id === updatedInv._id ? updatedInv : inv)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete stock entry.');
    }
  };
  const handleOpenEditHistory = (entry) => {
    setEditingHistoryEntry(entry);
    setHistoryFormData({
      addedUnits: entry.addedUnits,
      buyingPricePerUnit: entry.buyingPricePerUnit,
      sellingPricePerUnit: entry.sellingPricePerUnit,
    });
    setHistoryError('');
    setIsEditHistoryModalOpen(true);
  };

  // const handleSaveHistory = async (e) => {
  //   e.preventDefault();
  //   setHistoryLoading(true);
  //   setHistoryError('');
  //   try {
  //     const { data } = await axios.put(
  //       `${API}/UpdatedInventoryStockHistory?inventoryId=${viewInventory._id}&stockHistoryId=${editingHistoryEntry._id}`,
  //       {
  //         addedUnits: Number(historyFormData.addedUnits),
  //         buyingPricePerUnit: Number(historyFormData.buyingPricePerUnit),
  //         sellingPricePerUnit: Number(historyFormData.sellingPricePerUnit),
  //       }
  //     );
  //     // Refresh view inventory with updated data
  //     setViewInventory(data.inventory);
  //     setIsEditHistoryModalOpen(false);
  //     setEditingHistoryEntry(null);
  //     // Also update the main table row
  //     setInventories((prev) =>
  //       prev.map((inv) => inv._id === data.inventory._id ? data.inventory : inv)
  //     );
  //   } catch (err) {
  //     const msg = err.response?.data?.message || err.message || 'Failed to update stock history.';
  //     alert(msg);
  //     setHistoryError(msg);
  //   } finally {
  //     setHistoryLoading(false);
  //   }
  // };

  const handleSaveHistory = async (e) => {
    e.preventDefault();
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const { data } = await axios.put(
        `${API}/UpdatedInventoryStockHistory?inventoryId=${viewInventory._id}&stockHistoryId=${editingHistoryEntry._id}`,
        {
          addedUnits: Number(historyFormData.addedUnits),
          buyingPricePerUnit: Number(historyFormData.buyingPricePerUnit),
          sellingPricePerUnit: Number(historyFormData.sellingPricePerUnit),
        }
      );

      // Handle whatever key your backend returns
      const updatedInv = data.inventory || data.updatedInventory || data.data;

      if (updatedInv) {
        setViewInventory(updatedInv);
        setInventories((prev) =>
          prev.map((inv) => inv._id === updatedInv._id ? updatedInv : inv)
        );
      } else {
        // Backend didn't return full inventory — re-fetch to stay in sync
        const { data: fresh } = await axios.get(`${API}/SingleInventory?id=${viewInventory._id}`);
        setViewInventory(fresh.inventory);
        setInventories((prev) =>
          prev.map((inv) => inv._id === fresh.inventory._id ? fresh.inventory : inv)
        );
      }

      setIsEditHistoryModalOpen(false);
      setEditingHistoryEntry(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update stock history.';
      alert(msg);
      setHistoryError(msg);
    } finally {
      setHistoryLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/GetAllProducts`);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get(`${API}/GetAllVendors`);
      setVendors(data.vendors || []);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    }
  };

  useEffect(() => {
    fetchInventories();
    fetchProducts();
    fetchVendors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target)) {
        setShowProductDropdown(false);
      }
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(e.target)) {
        setShowVendorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProductSuggestions = products.filter((p) =>
    p.productName?.toLowerCase().includes(productSearch.toLowerCase())
  );


  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductSearch(product.productName);
    setFormData((prev) => ({
      ...prev,
      productName: product.productName,
      type: product.type,
      variantMin: product.variant?.[0] ?? '',
      variantMax: product.variant?.[1] ?? '',
    }));
    setShowProductDropdown(false);
  };

  const clearProductSelection = () => {
    setSelectedProduct(null);
    setProductSearch('');
    setFormData((prev) => ({ ...prev, productName: '', type: 'Bag', variantMin: '', variantMax: '' }));
  };

  const filteredVendorSuggestions = vendors.filter((v) =>
    v.vendorName?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setVendorSearch(vendor.vendorName);
    setFormData((prev) => ({ ...prev, vendorName: vendor.vendorName }));
    setShowVendorDropdown(false);
  };

  const clearVendorSelection = () => {
    setSelectedVendor(null);
    setVendorSearch('');
    setFormData((prev) => ({ ...prev, vendorName: '' }));
  };

  const handleViewInventory = async (id) => {
    try {
      setViewLoading(true);
      setIsViewModalOpen(true);
      const { data } = await axios.get(`${API}/SingleInventory?id=${id}`);
      setViewInventory(data.inventory);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load inventory details.');
      setIsViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleOpenModal = (inventory = null) => {
    if (inventory) {
      setCurrentInventory(inventory);

      const matchedProduct = products.find((p) => p.productName === inventory.productName);
      if (matchedProduct) {
        setSelectedProduct(matchedProduct);
        setProductSearch(matchedProduct.productName);
      } else {
        setSelectedProduct(null);
        setProductSearch(inventory.productName);
      }

      const matchedVendor = vendors.find((v) => v.vendorName === inventory.vendorName);
      if (matchedVendor) {
        setSelectedVendor(matchedVendor);
        setVendorSearch(matchedVendor.vendorName);
      } else {
        setSelectedVendor(null);
        setVendorSearch(inventory.vendorName);
      }

      setFormData({
        productName: inventory.productName,
        vendorName: inventory.vendorName,
        inventoryType: inventory.inventoryType,
        type: matchedProduct ? matchedProduct.type : inventory.type,
        variantMin: matchedProduct ? matchedProduct.variant?.[0] ?? inventory.variant?.[0] ?? '' : inventory.variant?.[0] ?? '',
        variantMax: matchedProduct ? matchedProduct.variant?.[1] ?? inventory.variant?.[1] ?? '' : inventory.variant?.[1] ?? '',
        quantity: inventory.quantity,
        buyingPricePerUnit: inventory.buyingPricePerUnit,
        sellingPricePerUnit: inventory.sellingPricePerUnit,
      });
    } else {
      setCurrentInventory(null);
      setSelectedProduct(null);
      setProductSearch('');
      setSelectedVendor(null);
      setVendorSearch('');
      setFormData({
        productName: '',
        vendorName: '',
        inventoryType: 'bulk',
        type: 'Bag',
        variantMin: '',
        variantMax: '',
        quantity: '',
        buyingPricePerUnit: '',
        sellingPricePerUnit: '',
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const body = {
      productName: formData.productName,
      vendorName: formData.vendorName,
      inventoryType: formData.inventoryType,
      type: formData.type,
      variant: [Number(formData.variantMin), Number(formData.variantMax)],
      quantity: Number(formData.quantity),
      buyingPricePerUnit: Number(formData.buyingPricePerUnit),
      sellingPricePerUnit: Number(formData.sellingPricePerUnit),
    };

    try {
      if (currentInventory) {
        const { data } = await axios.put(`${API}/UpdateInventory?id=${currentInventory._id}`, body);
        setInventories((prev) =>
          prev.map((inv) =>
            inv._id === currentInventory._id ? data.updatedInventory || { ...inv, ...body } : inv
          )
        );
        setIsModalOpen(false);
      } else {
        await axios.post(`${API}/CreateInventory`, body);
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

  // const handleDelete = async (inventory) => {
  //   if (!window.confirm(`Delete "${inventory.productName}" inventory?`)) return;
  //   try {
  //     await axios.delete(`${API}/DeleteInventory?id=${inventory._id}`);
  //     setInventories((prev) => prev.filter((inv) => inv._id !== inventory._id));
  //   } catch (err) {
  //     alert(err.response?.data?.message || 'Failed to delete inventory.');
  //   }
  // };


  const handleDelete = async (inventory) => {
    if (!window.confirm(`Delete "${inventory.productName}" inventory?`)) return;
    try {
      await axios.delete(`${API}/DeleteInventory?id=${inventory._id}`);
      setInventories((prev) => prev.filter((inv) => inv._id !== inventory._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete inventory.');
    }
  };


  const totalBuying = Math.floor(Number(formData.buyingPricePerUnit || 0) * Number(formData.quantity || 0));
  const totalSelling = Math.floor(Number(formData.sellingPricePerUnit || 0) * Number(formData.quantity || 0));

  // const filtered = inventories.filter((inv) =>
  //   inv?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   inv?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filtered = inventories.filter((inv) => {
    const matchesSearch =
      inv?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = vendorFilter === 'all' || inv?.vendorName === vendorFilter;
    return matchesSearch && matchesVendor;
  });
  if (pageLoading) {
    return (
      <div className="full-height-page">
        <Header title="Inventory Management" />
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
              <p className="text-neutral-500">Loading inventory...</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div className="full-height-page">
      <Header title="Inventory Management">
        <button onClick={() => handleOpenModal()} className="bw-button-primary">
          <Plus size={18} />
          <span>Add Inventory</span>
        </button>
      </Header>

      <div className="page-content">
        <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by product or vendor..."
              className="bw-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Vendor Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-neutral-500)', whiteSpace: 'nowrap' }}>
              Vendor
            </label>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="bw-input"
              style={{ minWidth: '160px', fontSize: '0.82rem' }}
            >
              <option value="all">All Vendors</option>
              {vendors.map((v) => (
                <option key={v._id} value={v.vendorName}>{v.vendorName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bw-card">
          <table className="w-full" style={{ textAlign: 'left' }}>
            <thead>
              <tr>
                <th className="bw-table-header">Product</th>
                <th className="bw-table-header">Vendor</th>
                <th className="bw-table-header">Type</th>
                <th className="bw-table-header">Variant</th>
                <th className="bw-table-header">Stock</th>
                <th className="bw-table-header">Buying/Unit</th>
                <th className="bw-table-header">Selling/Unit</th>
                <th className="bw-table-header">Total Buying</th>
                <th className="bw-table-header">Total Selling</th>
                <th className="bw-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv._id}>
                  <td className="bw-table-cell font-medium">{inv.productName}</td>
                  <td className="bw-table-cell text-neutral-500">{inv.vendorName}</td>
                  <td className="bw-table-cell">
                    <span style={{
                      padding: '2px 10px', borderRadius: '999px',
                      fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: inv.type === 'Bag' ? '#e0f2fe' : '#fef9c3',
                      color: inv.type === 'Bag' ? '#0369a1' : '#854d0e',
                    }}>
                      {inv.type}
                    </span>
                  </td>

                  <td className="bw-table-cell">
                    {/* <div className="font-medium">{inv.quantity}</div> */}
                    <div className="font-medium"> {inv.variant?.[0]} x {inv.variant?.[1]}</div>
                  </td>
                  <td className="bw-table-cell">
                    <div className="font-medium text-sm">{inv.shownAs || '—'}</div>
                    {/* <div className="text-xs text-neutral-400">{inv.totalUnits} {inv.unit}</div> */}
                  </td>
                  {/* <td className="bw-table-cell text-neutral-500">Rs. {Math.floor(inv.buyingPricePerUnit)?.toLocaleString()}</td>
                  <td className="bw-table-cell text-neutral-500">Rs. {Math.floor(inv.sellingPricePerUnit)?.toLocaleString()}</td> */}
                  <td className="bw-table-cell text-neutral-500">Rs. {parseFloat((inv.buyingPricePerUnit || 0).toFixed(2)).toLocaleString()}</td>
                  <td className="bw-table-cell text-neutral-500">Rs. {parseFloat((inv.sellingPricePerUnit || 0).toFixed(2)).toLocaleString()}</td>
                  <td className="bw-table-cell text-red-600 font-medium">
                    Rs. {Math.floor(inv.totalBuyingPrice ?? inv.buyingPricePerUnit * inv.quantity)?.toLocaleString()}
                  </td>
                  <td className="bw-table-cell text-green-600 font-medium">
                    Rs. {Math.floor(inv.totalSellingPrice ?? inv.sellingPricePerUnit * inv.quantity)?.toLocaleString()}
                  </td>
                  <td className="bw-table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewInventory(inv._id)} className="action-btn" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleOpenModal(inv)} className="action-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(inv)} className="action-btn action-btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="10" className="p-12 text-center text-neutral-500">
                    {searchTerm ? 'No inventory found matching your search.' : 'No inventory added yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setViewInventory(null); }}
        title="Inventory Details"
      >
        {viewLoading ? (
          <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
            <div className="text-center">
              <div style={{
                width: '30px', height: '30px',
                border: '3px solid var(--color-neutral-200)',
                borderTop: '3px solid var(--color-black)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 0.5rem',
              }} />
              <p className="text-sm text-neutral-500">Loading details...</p>
            </div>
          </div>
        ) : viewInventory ? (
          <div className="form-space">

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Product Name</p>
                <p className="font-medium text-sm">{viewInventory.productName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Vendor</p>
                <p className="font-medium text-sm">{viewInventory.vendorName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Type</p>
                <span style={{
                  padding: '2px 10px', borderRadius: '999px',
                  fontSize: '0.75rem', fontWeight: 600,
                  backgroundColor: viewInventory.type === 'Bag' ? '#e0f2fe' : '#fef9c3',
                  color: viewInventory.type === 'Bag' ? '#0369a1' : '#854d0e',
                }}>
                  {viewInventory.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Inventory Type</p>
                <p className="font-medium text-sm capitalize">{viewInventory.inventoryType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Shown As</p>
                <p className="font-medium text-sm">{viewInventory.shownAs || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Total Units</p>
                <p className="font-medium text-sm">{viewInventory.totalUnits} {viewInventory.unit}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Quantity</p>
                <p className="font-medium text-sm">{viewInventory.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Variant Range</p>
                <p className="font-medium text-sm">{viewInventory.variant?.[0]} – {viewInventory.variant?.[1]}</p>
              </div>
            </div>

            {/* Price Summary */}
            <div style={{
              padding: '12px 16px', backgroundColor: 'var(--color-neutral-50)',
              borderRadius: 'var(--radius)', border: '1px solid var(--color-neutral-200)',
            }}>
              <p className="text-xs font-medium text-neutral-600 mb-3">Price Summary</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">Buying / Unit</p>
                  <p className="font-semibold text-sm">Rs. {Math.floor(viewInventory.buyingPricePerUnit)?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Selling / Unit</p>
                  <p className="font-semibold text-sm">Rs. {Math.floor(viewInventory.sellingPricePerUnit)?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Total Buying</p>
                  <p className="font-semibold text-red-600">Rs. {Math.floor(viewInventory.totalBuyingPrice)?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Total Selling</p>
                  <p className="font-semibold text-green-600">Rs. {Math.floor(viewInventory.totalSellingPrice)?.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-neutral-200)' }}>
                <p className="text-xs text-neutral-500">Profit</p>
                <p className={`font-semibold ${viewInventory.totalSellingPrice - viewInventory.totalBuyingPrice >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  Rs. {Math.floor(viewInventory.totalSellingPrice - viewInventory.totalBuyingPrice)?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Stock History */}
            {viewInventory.stockHistory?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-600 mb-2">
                  Stock History ({viewInventory.stockHistory.length} entries)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* {[...viewInventory.stockHistory].reverse().map((entry, idx) => (
                    <div
                      key={entry._id}
                      style={{
                        padding: '12px',
                        backgroundColor: idx === 0 ? '#f0fdf4' : 'var(--color-neutral-50)',
                        borderRadius: 'var(--radius)',
                        border: `1px solid ${idx === 0 ? '#bbf7d0' : 'var(--color-neutral-200)'}`,
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{
                            padding: '2px 8px', borderRadius: '999px',
                            fontSize: '0.7rem', fontWeight: 600,
                            backgroundColor: entry.inventoryType === 'bulk' ? '#e0f2fe' : '#fef9c3',
                            color: entry.inventoryType === 'bulk' ? '#0369a1' : '#854d0e',
                          }}>
                            {entry.inventoryType}
                          </span>
                          {idx === 0 && (
                            <span style={{
                              padding: '2px 8px', borderRadius: '999px',
                              fontSize: '0.7rem', fontWeight: 600,
                              backgroundColor: '#dcfce7', color: '#166534',
                            }}>
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">
                          {new Date(entry.date).toLocaleDateString('en-GB')} {new Date(entry.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-neutral-500">Units Added</p>
                          <p className="font-semibold text-sm">{entry.addedUnits}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Buying / Unit</p>
                          <p className="font-medium text-sm">Rs. {Math.floor(entry.buyingPricePerUnit)?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Total Buying</p>
                          <p className="font-medium text-sm text-red-600">Rs. {Math.floor(entry.totalBuyingPrice)?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">Total Selling</p>
                          <p className="font-medium text-sm text-green-600">Rs. {Math.floor(entry.totalSellingPrice)?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))} */}

                  {[...viewInventory.stockHistory].reverse().map((entry, idx) => {

                    const buildStockDisplay = () => {
                      const unitsPerPack = entry.unitsPerPack || viewInventory.variant?.[1];
                      const packType = entry.type || viewInventory.type;
                      const packUnit = entry.unit || viewInventory.unit;

                      if (entry.inventoryType === 'openstock') {
                        return `${entry.addedUnits} ${packUnit || 'units'}`;
                      }

                      // bulk — calculate bags/boxes from units
                      // const fullPacks = unitsPerPack ? Math.floor(entry.addedUnits / unitsPerPack) : 0;
                      // const remainingUnits = unitsPerPack ? entry.addedUnits % unitsPerPack : entry.addedUnits;

                      const fullPacks = unitsPerPack ? Math.floor(entry.addedUnits / unitsPerPack) : 0;
                      const remainingUnits = unitsPerPack ? parseFloat((entry.addedUnits % unitsPerPack).toFixed(3)) : entry.addedUnits;
                      let display = '';
                      if (fullPacks > 0) {
                        display += `${fullPacks} ${packType}${fullPacks > 1 ? 's' : ''}`;
                      }
                      if (remainingUnits > 0) {
                        display += `${display ? ' ' : ''}${remainingUnits} ${packUnit}`;
                      }
                      return display || `${entry.addedUnits} ${packUnit || 'units'}`;
                    };
                    return (
                      <div
                        key={entry._id}
                        style={{
                          padding: '12px',
                          backgroundColor: idx === 0 ? '#f0fdf4' : 'var(--color-neutral-50)',
                          borderRadius: 'var(--radius)',
                          border: `1px solid ${idx === 0 ? '#bbf7d0' : 'var(--color-neutral-200)'}`,
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span style={{
                              padding: '2px 8px', borderRadius: '999px',
                              fontSize: '0.7rem', fontWeight: 600,
                              backgroundColor: entry.inventoryType === 'bulk' ? '#e0f2fe' : '#fef9c3',
                              color: entry.inventoryType === 'bulk' ? '#0369a1' : '#854d0e',
                            }}>
                              {entry.inventoryType}
                            </span>
                            {idx === 0 && (
                              <span style={{
                                padding: '2px 8px', borderRadius: '999px',
                                fontSize: '0.7rem', fontWeight: 600,
                                backgroundColor: '#dcfce7', color: '#166534',
                              }}>
                                Latest
                              </span>
                            )}


                            <p className="text-xs text-neutral-400">
                              {new Date(entry.date).toLocaleDateString('en-GB')}{' '}
                              {new Date(entry.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditHistory(entry)}
                              className="action-btn"
                              title="Edit this stock entry"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                            >
                              <Edit2 size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteHistory(entry._id)}
                              className="action-btn action-btn-delete"
                              title="Delete this stock entry"
                              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Stock Added Display */}
                        <div style={{
                          padding: '8px 12px', marginBottom: '10px',
                          backgroundColor: idx === 0 ? '#dcfce7' : 'var(--color-neutral-100)',
                          borderRadius: 'var(--radius)',
                          border: `1px solid ${idx === 0 ? '#86efac' : 'var(--color-neutral-200)'}`,
                        }}>
                          <p className="text-xs text-neutral-500 mb-1">Stock Added</p>
                          <p className="font-bold text-sm">{buildStockDisplay()}</p>
                          <p className="text-xs text-neutral-400">{entry.addedUnits} {entry.unit || 'units'} total</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-neutral-500">Buying / Unit</p>
                            <p className="font-medium text-sm">Rs. {Math.floor(entry.buyingPricePerUnit)?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500">Selling / Unit</p>
                            <p className="font-medium text-sm">Rs. {Math.floor(entry.sellingPricePerUnit)?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500">Total Buying</p>
                            <p className="font-medium text-sm text-red-600">Rs. {Math.floor(entry.totalBuyingPrice)?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500">Total Selling</p>
                            <p className="font-medium text-sm text-green-600">Rs. {Math.floor(entry.totalSellingPrice)?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => { setIsViewModalOpen(false); setViewInventory(null); }}
                className="bw-button-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentInventory ? 'Edit Inventory' : 'Add New Inventory'}
      >
        <form onSubmit={handleSave} className="form-space">

          {/* Product Dropdown */}
          <div>
            <label className="form-label">Product Name</label>
            <div style={{ position: 'relative' }} ref={productDropdownRef}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text" className="bw-input" placeholder="Search product..."
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); if (!e.target.value) clearProductSelection(); }}
                  onFocus={() => setShowProductDropdown(true)}
                  disabled={loading} required
                  style={{ paddingRight: selectedProduct ? '70px' : '40px' }}
                />
                {selectedProduct && (
                  <button type="button" onClick={clearProductSelection} style={{
                    position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', padding: '4px',
                  }}>
                    <X size={16} />
                  </button>
                )}
                <ChevronDown size={16} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-neutral-400)', pointerEvents: 'none',
                }} />
              </div>
              {showProductDropdown && filteredProductSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                  backgroundColor: 'white', border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  maxHeight: '200px', overflowY: 'auto', zIndex: 1000,
                }}>
                  {filteredProductSuggestions.map((product) => (
                    <div key={product._id} onClick={() => handleProductSelect(product)}
                      style={{
                        padding: '10px 12px', cursor: 'pointer',
                        backgroundColor: selectedProduct?._id === product._id ? 'var(--color-neutral-100)' : 'white',
                        borderBottom: '1px solid var(--color-neutral-200)',
                      }}
                      onMouseEnter={(e) => { if (selectedProduct?._id !== product._id) e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)'; }}
                      onMouseLeave={(e) => { if (selectedProduct?._id !== product._id) e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                      <div className="font-medium text-sm">{product.productName}</div>
                      <div className="text-xs text-neutral-500">{product.type} • {product.variant?.[0]}–{product.variant?.[1]} • {product.unit}</div>
                    </div>
                  ))}
                </div>
              )}
              {showProductDropdown && productSearch && filteredProductSuggestions.length === 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                  backgroundColor: 'white', border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '12px', zIndex: 1000,
                }}>
                  <p className="text-sm text-neutral-400 text-center">No products found. Add from Product Management first.</p>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Dropdown */}
          <div>
            <label className="form-label">Vendor Name</label>
            <div style={{ position: 'relative' }} ref={vendorDropdownRef}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text" className="bw-input" placeholder="Search vendor..."
                  value={vendorSearch}
                  onChange={(e) => { setVendorSearch(e.target.value); setShowVendorDropdown(true); if (!e.target.value) clearVendorSelection(); }}
                  onFocus={() => setShowVendorDropdown(true)}
                  disabled={loading} required
                  style={{ paddingRight: selectedVendor ? '70px' : '40px' }}
                />
                {selectedVendor && (
                  <button type="button" onClick={clearVendorSelection} style={{
                    position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', padding: '4px',
                  }}>
                    <X size={16} />
                  </button>
                )}
                <ChevronDown size={16} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-neutral-400)', pointerEvents: 'none',
                }} />
              </div>
              {showVendorDropdown && filteredVendorSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                  backgroundColor: 'white', border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  maxHeight: '200px', overflowY: 'auto', zIndex: 1000,
                }}>
                  {filteredVendorSuggestions.map((vendor) => (
                    <div key={vendor._id} onClick={() => handleVendorSelect(vendor)}
                      style={{
                        padding: '10px 12px', cursor: 'pointer',
                        backgroundColor: selectedVendor?._id === vendor._id ? 'var(--color-neutral-100)' : 'white',
                        borderBottom: '1px solid var(--color-neutral-200)',
                      }}
                      onMouseEnter={(e) => { if (selectedVendor?._id !== vendor._id) e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)'; }}
                      onMouseLeave={(e) => { if (selectedVendor?._id !== vendor._id) e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                      <div className="font-medium text-sm">{vendor.vendorName}</div>
                    </div>
                  ))}
                </div>
              )}
              {showVendorDropdown && vendorSearch && filteredVendorSuggestions.length === 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                  backgroundColor: 'white', border: '1px solid var(--color-neutral-300)',
                  borderRadius: 'var(--radius)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  padding: '12px', zIndex: 1000,
                }}>
                  <p className="text-sm text-neutral-400 text-center">No vendors found. Add from Vendor Management first.</p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Type */}
          <div>
            <label className="form-label">Inventory Type</label>
            <select className="bw-input" value={formData.inventoryType}
              onChange={(e) => setFormData({ ...formData, inventoryType: e.target.value })} disabled={loading}>
              <option value="bulk">Bulk</option>
              <option value="openstock">Open Stock</option>
            </select>
          </div>

          {/* Type Bag/Box */}
          <div>
            <label className="form-label">Type</label>
            <div className="flex gap-3 mt-1">
              {['Bag', 'Box'].map((t) => (
                <label key={t}
                  onClick={() => !selectedProduct && setFormData({ ...formData, type: t })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                    border: `2px solid ${formData.type === t ? 'var(--color-black)' : 'var(--color-neutral-300)'}`,
                    borderRadius: 'var(--radius)',
                    cursor: selectedProduct ? 'not-allowed' : 'pointer',
                    fontWeight: formData.type === t ? 600 : 400,
                    backgroundColor: formData.type === t ? 'var(--color-black)' : 'white',
                    color: formData.type === t ? 'white' : 'var(--color-neutral-700)',
                    opacity: selectedProduct ? 0.6 : 1,
                    transition: 'all 0.15s ease', userSelect: 'none',
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: `2px solid ${formData.type === t ? 'white' : 'var(--color-neutral-400)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {formData.type === t && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
                  </div>
                  {t}
                </label>
              ))}
            </div>
            {selectedProduct && <p className="text-xs text-neutral-400 mt-1">Type is auto-set from selected product.</p>}
          </div>

          {/* Variant Range */}
          <div>
            <label className="form-label">Variant Range</label>
            <div className="form-grid-2">
              <div>
                <input type="number" className="bw-input" placeholder="Min" value={formData.variantMin}
                  onChange={(e) => setFormData({ ...formData, variantMin: e.target.value })} required disabled={loading} min={0} />
                <p className="text-xs text-neutral-400 mt-1">Minimum</p>
              </div>
              <div>
                <input type="number" className="bw-input" placeholder="Max" value={formData.variantMax}
                  onChange={(e) => setFormData({ ...formData, variantMax: e.target.value })} required disabled={loading} min={0} />
                <p className="text-xs text-neutral-400 mt-1">Maximum</p>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="form-label">Quantity</label>
            {/* <input type="number" className="bw-input" placeholder="e.g. 50" value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required disabled={loading} min={1} /> */}
            <input type="number" className="bw-input" placeholder="e.g. 0.5" value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required disabled={loading} min={0.001} step={0.001} />
          </div>

          {/* Buying & Selling */}
          <div className="form-grid-2">
            <div>
              <label className="form-label">Buying Price / Unit</label>
              <input type="number" className="bw-input" placeholder="e.g. 100" value={formData.buyingPricePerUnit}
                onChange={(e) => setFormData({ ...formData, buyingPricePerUnit: e.target.value })} required disabled={loading} min={0} />
            </div>
            <div>
              <label className="form-label">Selling Price / Unit</label>
              <input type="number" className="bw-input" placeholder="e.g. 200" value={formData.sellingPricePerUnit}
                onChange={(e) => setFormData({ ...formData, sellingPricePerUnit: e.target.value })} required disabled={loading} min={0} />
            </div>
          </div>

          {/* Price Summary */}
          {((formData.quantity && formData.buyingPricePerUnit) || (formData.quantity && formData.sellingPricePerUnit)) ? (
            <div style={{
              padding: '12px 16px', backgroundColor: 'var(--color-neutral-50)',
              borderRadius: 'var(--radius)', border: '1px solid var(--color-neutral-200)',
            }}>
              <p className="text-xs font-medium text-neutral-600 mb-2">Price Summary</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-neutral-500">Total Buying</p>
                  <p className="font-semibold text-red-600">Rs. {totalBuying.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-xs text-neutral-500">Total Selling</p>
                  <p className="font-semibold text-green-600">Rs. {totalSelling.toLocaleString()}</p>
                </div>
              </div>
              {totalSelling > 0 && totalBuying > 0 && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-neutral-200)' }}>
                  <p className="text-xs text-neutral-500">Profit</p>
                  <p className={`font-semibold text-sm ${totalSelling - totalBuying >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    Rs. {(totalSelling - totalBuying).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: 'var(--radius)' }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bw-button-secondary flex-1" disabled={loading}>Cancel</button>
            <button type="submit" className="bw-button-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : currentInventory ? 'Update Inventory' : 'Add Inventory'}
            </button>
          </div>
        </form>
      </Modal>


      {/* Edit specific stock */}
      <Modal
        isOpen={isEditHistoryModalOpen}
        onClose={() => { setIsEditHistoryModalOpen(false); setEditingHistoryEntry(null); }}
        title="Edit Stock History Entry"
      >
        {editingHistoryEntry && (
          <form onSubmit={handleSaveHistory} className="form-space">

            {/* Entry info */}
            <div style={{
              padding: '10px 12px', backgroundColor: 'var(--color-neutral-50)',
              borderRadius: 'var(--radius)', border: '1px solid var(--color-neutral-200)',
            }}>
              <p className="text-xs text-neutral-500 mb-1">Entry Date</p>
              <p className="text-sm font-medium">
                {new Date(editingHistoryEntry.date).toLocaleDateString('en-GB')}{' '}
                {new Date(editingHistoryEntry.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span style={{
                marginTop: '6px', display: 'inline-block',
                padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
                backgroundColor: editingHistoryEntry.inventoryType === 'bulk' ? '#e0f2fe' : '#fef9c3',
                color: editingHistoryEntry.inventoryType === 'bulk' ? '#0369a1' : '#854d0e',
              }}>
                {editingHistoryEntry.inventoryType}
              </span>
            </div>

            <div>
              <label className="form-label">Units Added</label>
              {/* <input
                type="number" className="bw-input" placeholder="e.g. 10"
                value={historyFormData.addedUnits}
                onChange={(e) => setHistoryFormData({ ...historyFormData, addedUnits: e.target.value })}
                required disabled={historyLoading} min={1}
              /> */}
              <input type="number" className="bw-input" placeholder="e.g. 0.5"
                value={historyFormData.addedUnits}
                onChange={(e) => setHistoryFormData({ ...historyFormData, addedUnits: e.target.value })}
                required disabled={historyLoading} min={0.001} step={0.001} />
            </div>

            <div className="form-grid-2">
              <div>
                <label className="form-label">Buying / Unit</label>
                <input
                  type="number" className="bw-input" placeholder="e.g. 100"
                  value={historyFormData.buyingPricePerUnit}
                  onChange={(e) => setHistoryFormData({ ...historyFormData, buyingPricePerUnit: e.target.value })}
                  required disabled={historyLoading} min={0}
                />
              </div>
              <div>
                <label className="form-label">Selling / Unit</label>
                <input
                  type="number" className="bw-input" placeholder="e.g. 200"
                  value={historyFormData.sellingPricePerUnit}
                  onChange={(e) => setHistoryFormData({ ...historyFormData, sellingPricePerUnit: e.target.value })}
                  required disabled={historyLoading} min={0}
                />
              </div>
            </div>

            {/* Live preview */}
            {historyFormData.addedUnits && historyFormData.buyingPricePerUnit && (
              <div style={{
                padding: '12px 16px', backgroundColor: 'var(--color-neutral-50)',
                borderRadius: 'var(--radius)', border: '1px solid var(--color-neutral-200)',
              }}>
                <p className="text-xs font-medium text-neutral-600 mb-2">Preview</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500">Total Buying</p>
                    <p className="font-semibold text-red-600">
                      {/* Rs. {Math.floor(historyFormData.buyingPricePerUnit * historyFormData.addedUnits).toLocaleString()} */}
                      Rs. {Math.floor(historyFormData.sellingPricePerUnit * historyFormData.addedUnits).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total Selling</p>
                    <p className="font-semibold text-green-600">
                      {/* Rs. {Math.floor(historyFormData.sellingPricePerUnit * historyFormData.addedUnits).toLocaleString()} */}
                      Rs. {parseFloat((historyFormData.sellingPricePerUnit * historyFormData.addedUnits).toFixed(2)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {historyError && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: 'var(--radius)' }}>
                <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>{historyError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setIsEditHistoryModalOpen(false); setEditingHistoryEntry(null); }}
                className="bw-button-secondary flex-1"
                disabled={historyLoading}
              >
                Cancel
              </button>
              <button type="submit" className="bw-button-primary flex-1" disabled={historyLoading}>
                {historyLoading ? 'Saving...' : 'Update Entry'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}