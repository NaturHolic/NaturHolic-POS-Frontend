import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Plus, Search, ChevronDown, X, ChevronLeft, ChevronRight, ShoppingCart, Calendar, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PERIOD_TABS = [
  { key: 'day', label: 'Today' },
  { key: '1m', label: '1 Month' },
  { key: '2m', label: '2 Months' },
  { key: '3m', label: '3 Months' },
  { key: '4m', label: '4 Months' },
  { key: '5m', label: '5 Months' },
  { key: '6m', label: '6 Months' },
  { key: 'year', label: 'This Year' },
];

const getDateRange = (selectedDate, period) => {
  const end = new Date(selectedDate);
  end.setHours(23, 59, 59, 999);
  if (period === 'day') {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    return { startDate: toLocalDateStr(start), endDate: toLocalDateStr(end) };
  }
  if (period === 'year') {
    const start = new Date(end.getFullYear(), 0, 1);
    return { startDate: toLocalDateStr(start), endDate: toLocalDateStr(end) };
  }
  const months = parseInt(period);
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  start.setDate(start.getDate() + 1);
  return { startDate: toLocalDateStr(start), endDate: toLocalDateStr(end) };
};

const emptyForm = {
  productName: '', vendorName: '', inventoryType: 'bulk',
  type: 'Bag', variantMin: '', variantMax: '', quantity: '', sellingPricePerUnit: '',
};

export default function DailySales() {
  const today = new Date();
  const todayStr = toLocalDateStr(today);

  // ── Calendar state ────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);
  const [activePeriod, setActivePeriod] = useState('day');
  const calendarRef = useRef(null);

  // ── Sales state ───────────────────────────────────────────────────────────────
  const [sales, setSales] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saleCounts, setSaleCounts] = useState({});

  // ── Create / Edit Modal ───────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null); // null = create, object = edit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Products / Vendors ────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedProductStock, setSelectedProductStock] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);

  // ── Product dropdown ──────────────────────────────────────────────────────────
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productDropdownRef = useRef(null);

  // ── Vendor dropdown ───────────────────────────────────────────────────────────
  const [vendorSearch, setVendorSearch] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const vendorDropdownRef = useRef(null);

  const [formData, setFormData] = useState(emptyForm);

  // ── Fetch sales ───────────────────────────────────────────────────────────────
  const fetchSales = async (date, period) => {
    try {
      setPageLoading(true);
      const { startDate, endDate } = getDateRange(date, period);
      const { data } = await axios.get(`${API}/GetCounterSales?startDate=${startDate}&endDate=${endDate}`);
      setSales(data.sales || data.counterSales || data.data || []);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
      setSales([]);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchMonthSaleCounts = async (month, year) => {
    try {
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      const { data } = await axios.get(`${API}/GetCounterSales?startDate=${startDate}&endDate=${endDate}`);
      const salesList = data.sales || data.counterSales || data.data || [];
      const counts = {};
      salesList.forEach((s) => {
        const dateStr = toLocalDateStr(new Date(s.createdAt || s.date));
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      });
      setSaleCounts(counts);
    } catch {
      setSaleCounts({});
    }
  };

  useEffect(() => { fetchMonthSaleCounts(calendarMonth, calendarYear); }, [calendarMonth, calendarYear]);
  useEffect(() => {
    axios.get(`${API}/GetAllProducts`).then(({ data }) => setProducts(data.products || [])).catch(() => { });
    axios.get(`${API}/GetAllVendors`).then(({ data }) => setVendors(data.vendors || [])).catch(() => { });
  }, []);
  useEffect(() => { fetchSales(selectedDate, activePeriod); }, [selectedDate, activePeriod]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setShowCalendar(false);
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target)) setShowProductDropdown(false);
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(e.target)) setShowVendorDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Calendar helpers ──────────────────────────────────────────────────────────
  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();
  const isCurrentMonth = calendarMonth === today.getMonth() && calendarYear === today.getFullYear();

  const handlePrevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear((y) => y - 1); }
    else setCalendarMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (isCurrentMonth) return;
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear((y) => y + 1); }
    else setCalendarMonth((m) => m + 1);
  };
  const handleDayClick = (day) => {
    const ds = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (ds > todayStr) return;
    setSelectedDate(ds);
    setShowCalendar(false);
  };

  // ── Product dropdown ──────────────────────────────────────────────────────────
  const filteredProducts = products.filter((p) => p.productName?.toLowerCase().includes(productSearch.toLowerCase()));

  const handleProductSelect = async (product) => {
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
    try {
      setStockLoading(true);
      setSelectedProductStock(null);
      const { data } = await axios.get(`${API}/Inventories`);
      const all = data.inventories || data.data || [];
      const match = all.find((inv) => inv.productName === product.productName) || null;
      setSelectedProductStock(match);
      if (match?.vendorName) {
        const matchedVendor = vendors.find((v) => v.vendorName === match.vendorName);
        setSelectedVendor(matchedVendor || null);
        setVendorSearch(match.vendorName);
        setFormData((prev) => ({ ...prev, vendorName: match.vendorName }));
      }
    } catch { setSelectedProductStock(null); }
    finally { setStockLoading(false); }
  };

  const clearProductSelection = () => {
    setSelectedProduct(null); setProductSearch(''); setSelectedProductStock(null);
    setSelectedVendor(null); setVendorSearch('');
    setFormData((prev) => ({ ...prev, productName: '', type: 'Bag', variantMin: '', variantMax: '', vendorName: '' }));
  };

  // ── Vendor dropdown ───────────────────────────────────────────────────────────
  const filteredVendors = vendors.filter((v) => v.vendorName?.toLowerCase().includes(vendorSearch.toLowerCase()));

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor); setVendorSearch(vendor.vendorName);
    setFormData((prev) => ({ ...prev, vendorName: vendor.vendorName }));
    setShowVendorDropdown(false);
  };

  const clearVendorSelection = () => {
    setSelectedVendor(null); setVendorSearch('');
    setFormData((prev) => ({ ...prev, vendorName: '' }));
  };

  // ── Modal open helpers ────────────────────────────────────────────────────────
  const resetModal = () => {
    setSelectedProduct(null); setProductSearch('');
    setSelectedVendor(null); setVendorSearch('');
    setSelectedProductStock(null);
    setFormData(emptyForm);
    setError('');
    setEditingSale(null);
  };

  const handleOpenCreate = () => {
    resetModal();
    setIsModalOpen(true);
  };

  // const handleOpenEdit = (sale) => {
  //   setEditingSale(sale);
  //   // Pre-fill form from existing sale
  //   const matchedProduct = products.find((p) => p.productName === sale.productName);
  //   if (matchedProduct) {
  //     setSelectedProduct(matchedProduct);
  //     setProductSearch(matchedProduct.productName);
  //   } else {
  //     setSelectedProduct(null);
  //     setProductSearch(sale.productName || '');
  //   }
  //   const matchedVendor = vendors.find((v) => v.vendorName === sale.vendorName);
  //   if (matchedVendor) {
  //     setSelectedVendor(matchedVendor);
  //     setVendorSearch(matchedVendor.vendorName);
  //   } else {
  //     setSelectedVendor(null);
  //     setVendorSearch(sale.vendorName || '');
  //   }
  //   setFormData({
  //     productName: sale.productName || '',
  //     vendorName: sale.vendorName || '',
  //     inventoryType: sale.inventoryType || 'bulk',
  //     type: sale.type || 'Bag',
  //     variantMin: sale.variant?.[0] ?? '',
  //     variantMax: sale.variant?.[1] ?? '',
  //     quantity: sale.quantity || '',
  //     sellingPricePerUnit: sale.sellingPricePerUnit || '',
  //   });
  //   setSelectedProductStock(null);
  //   setError('');
  //   setIsModalOpen(true);
  // };

  // ── Create / Update submit ────────────────────────────────────────────────────

  const handleOpenEdit = async (sale) => {
    setEditingSale(sale);
    const matchedProduct = products.find((p) => p.productName === sale.productName);
    if (matchedProduct) {
      setSelectedProduct(matchedProduct);
      setProductSearch(matchedProduct.productName);
    } else {
      setSelectedProduct(null);
      setProductSearch(sale.productName || '');
    }
    const matchedVendor = vendors.find((v) => v.vendorName === sale.vendorName);
    if (matchedVendor) {
      setSelectedVendor(matchedVendor);
      setVendorSearch(matchedVendor.vendorName);
    } else {
      setSelectedVendor(null);
      setVendorSearch(sale.vendorName || '');
    }
    setFormData({
      productName: sale.productName || '',
      vendorName: sale.vendorName || '',
      inventoryType: sale.inventoryType || 'bulk',
      type: sale.type || 'Bag',
      variantMin: sale.variant?.[0] ?? '',
      variantMax: sale.variant?.[1] ?? '',
      quantity: sale.quantity || '',
      sellingPricePerUnit: sale.sellingPricePerUnit || '',
    });
    setError('');
    setIsModalOpen(true);

    // ── Fetch current stock so the stock card shows in edit mode too ──
    try {
      setStockLoading(true);
      setSelectedProductStock(null);
      const { data } = await axios.get(`${API}/Inventories`);
      const all = data.inventories || data.data || [];
      setSelectedProductStock(all.find((inv) => inv.productName === sale.productName) || null);
    } catch {
      setSelectedProductStock(null);
    } finally {
      setStockLoading(false);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    const body = {
      productName: formData.productName,
      vendorName: formData.vendorName,
      inventoryType: formData.inventoryType,
      type: formData.type,
      variant: [Number(formData.variantMin), Number(formData.variantMax)],
      quantity: Number(formData.quantity),
      sellingPricePerUnit: Number(formData.sellingPricePerUnit),
    };

    try {
      if (editingSale) {
        // ── UPDATE ──
        const { data } = await axios.put(`${API}/UpdateCounterSale?id=${editingSale._id}`, body);
        const updated = data.sale || data.counterSale || data.data;
        if (updated) {
          setSales((prev) => prev.map((s) => s._id === updated._id ? updated : s));
        } else {
          fetchSales(selectedDate, activePeriod);
        }
      } else {
        // ── CREATE ──
        const { data } = await axios.post(`${API}/CreateCounterSale`, body);
        const newSale = data.sale || data.counterSale || data.data;
        if (newSale && activePeriod === 'day') {
          const saleDate = toLocalDateStr(new Date(newSale.createdAt || newSale.date || Date.now()));
          if (saleDate === selectedDate) { setSales((prev) => [newSale, ...prev]); }
          else fetchSales(selectedDate, activePeriod);
        } else {
          fetchSales(selectedDate, activePeriod);
        }
        fetchMonthSaleCounts(calendarMonth, calendarYear);
      }
      setIsModalOpen(false);
      resetModal();
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.message || err.message || 'Something went wrong.';
      alert(msg); setError(msg);
    } finally { setLoading(false); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async (sale) => {
    if (!window.confirm(`Delete sale of "${sale.productName}"? This will restore units back to inventory.`)) return;
    try {
      await axios.delete(`${API}/DeleteCounterSale?id=${sale._id}`);
      setSales((prev) => prev.filter((s) => s._id !== sale._id));
      fetchMonthSaleCounts(calendarMonth, calendarYear);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete sale.');
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDay = getFirstDay(calendarMonth, calendarYear);
  const totalRevenue = sales.reduce((sum, s) => sum + (s.TotalSellingPrice ?? s.sellingPricePerUnit * s.quantity ?? 0), 0);
  const totalQty = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const filtered = sales.filter((s) =>
    s?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalSelling = parseFloat((Number(formData.sellingPricePerUnit || 0) * Number(formData.quantity || 0)).toFixed(2));

  const getPeriodLabel = () => {
    const { startDate, endDate } = getDateRange(selectedDate, activePeriod);
    const fmt = (ds) => { const [y, m, d] = ds.split('-'); return `${d} ${MONTHS[parseInt(m) - 1]} ${y}`; };
    if (activePeriod === 'day') return fmt(startDate);
    const [sy] = startDate.split('-');
    if (activePeriod === 'year') return `Year ${sy}`;
    return `${fmt(startDate)} — ${fmt(endDate)}`;
  };

  const [selY, selM, selD] = selectedDate.split('-');
  const formattedBtn = `${selD} ${MONTHS[parseInt(selM) - 1]} ${selY}`;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="full-height-page">
      <Header title="Counter Sales">
        <button onClick={handleOpenCreate} className="bw-button-primary">
          <Plus size={18} /><span>Register Sale</span>
        </button>
      </Header>

      <div className="page-content">

        {/* ── Top bar ───────────────────────────────────────────────── */}
        <div className="bw-card mb-6" style={{ padding: '14px 20px' }} id="overflow-show">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {PERIOD_TABS.map((tab) => (
                <button key={tab.key} onClick={() => setActivePeriod(tab.key)} style={{
                  padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem',
                  fontWeight: activePeriod === tab.key ? 700 : 500,
                  border: activePeriod === tab.key ? '2px solid var(--color-black)' : '2px solid var(--color-neutral-200)',
                  backgroundColor: activePeriod === tab.key ? 'var(--color-black)' : 'white',
                  color: activePeriod === tab.key ? 'white' : 'var(--color-neutral-600)',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Calendar button */}
            <div style={{ position: 'relative' }} ref={calendarRef}>
              <button onClick={() => setShowCalendar((v) => !v)} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px',
                border: showCalendar ? '2px solid var(--color-black)' : '2px solid var(--color-neutral-300)',
                backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                color: 'var(--color-black)', transition: 'all 0.12s ease', whiteSpace: 'nowrap',
              }}>
                <Calendar size={15} />
                {formattedBtn}
                <ChevronDown size={14} style={{ color: 'var(--color-neutral-400)', transform: showCalendar ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }} />
              </button>

              {showCalendar && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  backgroundColor: 'white', border: '1px solid var(--color-neutral-200)',
                  borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '16px', width: '300px', zIndex: 2000,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <button onClick={handlePrevMonth} className="action-btn"><ChevronLeft size={15} /></button>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{MONTHS[calendarMonth]} {calendarYear}</span>
                    <button onClick={handleNextMonth} className="action-btn" style={{ opacity: isCurrentMonth ? 0.3 : 1, cursor: isCurrentMonth ? 'not-allowed' : 'pointer' }}>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
                    {DAYS.map((d) => (
                      <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-neutral-400)', padding: '3px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const ds = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = ds === selectedDate;
                      const isToday = ds === todayStr;
                      const isFuture = ds > todayStr;
                      const count = saleCounts[ds] || 0;
                      return (
                        <button key={day} onClick={() => handleDayClick(day)} disabled={isFuture} style={{
                          padding: '5px 2px 3px', textAlign: 'center', fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : isToday ? 600 : 400, borderRadius: '6px',
                          border: isToday && !isSelected ? '2px solid var(--color-black)' : '2px solid transparent',
                          backgroundColor: isSelected ? 'var(--color-black)' : 'transparent',
                          color: isFuture ? 'var(--color-neutral-300)' : isSelected ? 'white' : isToday ? 'var(--color-black)' : 'var(--color-neutral-700)',
                          cursor: isFuture ? 'not-allowed' : 'pointer', transition: 'all 0.1s ease',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                        }}
                          onMouseEnter={(e) => { if (!isSelected && !isFuture) e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          {day}
                          {count > 0 && <span style={{ fontSize: '0.55rem', fontWeight: 700, lineHeight: 1, color: isSelected ? 'rgba(255,255,255,0.8)' : '#16a34a', letterSpacing: '-0.02em' }}>{count}</span>}
                          {count === 0 && !isFuture && <span style={{ fontSize: '0.55rem', lineHeight: 1, opacity: 0 }}>0</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--color-neutral-100)', textAlign: 'center' }}>
                    <button onClick={() => { setSelectedDate(todayStr); setCalendarMonth(today.getMonth()); setCalendarYear(today.getFullYear()); setShowCalendar(false); }}
                      style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-black)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                      Go to Today
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Period label */}
        <div style={{ marginBottom: '10px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-neutral-500)', fontWeight: 500 }}>
            Showing results for <span style={{ fontWeight: 700, color: 'var(--color-black)' }}>{getPeriodLabel()}</span>
          </p>
        </div>

        {/* ── Summary cards ──────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Sales', value: sales.length, sub: 'transactions', color: 'var(--color-black)' },
            { label: 'Units Sold', value: parseFloat((totalQty).toFixed(3)), sub: 'total quantity', color: 'var(--color-black)' },
            { label: 'Revenue', value: `Rs. ${Math.floor(totalRevenue).toLocaleString()}`, sub: 'total selling', color: '#16a34a' },
          ].map((card) => (
            <div key={card.label} className="bw-card" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{card.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: card.color }}>{card.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)', marginTop: '2px' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Search ────────────────────────────────────────────────── */}
        <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search by product or vendor..." className="bw-input pl-10"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────── */}
        <div className="bw-card">
          {pageLoading ? (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <div className="text-center">
                <div style={{ width: '36px', height: '36px', border: '4px solid var(--color-neutral-200)', borderTop: '4px solid var(--color-black)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
                <p className="text-sm text-neutral-500">Loading sales...</p>
              </div>
            </div>
          ) : (
            <table className="w-full" style={{ textAlign: 'left' }}>
              <thead>
                <tr>
                  <th className="bw-table-header">#</th>
                  <th className="bw-table-header">Product</th>
                  <th className="bw-table-header">Vendor</th>
                  <th className="bw-table-header">Type</th>
                  <th className="bw-table-header">Variant</th>
                  <th className="bw-table-header">Inv. Type</th>
                  <th className="bw-table-header">Qty</th>
                  <th className="bw-table-header">Selling / Unit</th>
                  <th className="bw-table-header">Total</th>
                  <th className="bw-table-header">{activePeriod === 'day' ? 'Time' : 'Date'}</th>
                  <th className="bw-table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sale, idx) => (
                  <tr key={sale._id || idx}>
                    <td className="bw-table-cell text-neutral-400 text-sm">{idx + 1}</td>
                    <td className="bw-table-cell font-medium">{sale.productName}</td>
                    <td className="bw-table-cell text-neutral-500">{sale.vendorName}</td>
                    <td className="bw-table-cell">
                      <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: sale.type === 'Bag' ? '#e0f2fe' : '#fef9c3', color: sale.type === 'Bag' ? '#0369a1' : '#854d0e' }}>{sale.type}</span>
                    </td>
                    <td className="bw-table-cell text-neutral-500">{sale.variant?.[0]} – {sale.variant?.[1]}</td>
                    <td className="bw-table-cell">
                      <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: sale.inventoryType === 'bulk' ? '#ede9fe' : '#fef3c7', color: sale.inventoryType === 'bulk' ? '#6d28d9' : '#92400e' }}>{sale.inventoryType}</span>
                    </td>
                    <td className="bw-table-cell font-medium">{sale.quantity}</td>
                    <td className="bw-table-cell text-neutral-500">Rs. {Math.floor(sale.sellingPricePerUnit)?.toLocaleString()}</td>
                    <td className="bw-table-cell font-semibold text-green-600">
                      Rs. {Math.floor(sale.TotalSellingPrice ?? sale.sellingPricePerUnit * sale.quantity)?.toLocaleString()}
                    </td>
                    <td className="bw-table-cell text-neutral-400 text-sm">
                      {sale.createdAt || sale.date
                        ? activePeriod === 'day'
                          ? new Date(sale.createdAt || sale.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                          : new Date(sale.createdAt || sale.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="bw-table-cell text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(sale)} className="action-btn" title="Edit Sale">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(sale)} className="action-btn action-btn-delete" title="Delete Sale">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="11" style={{ padding: '60px 0', textAlign: 'center' }}>
                      <ShoppingCart size={32} style={{ color: 'var(--color-neutral-300)', margin: '0 auto 12px', display: 'block' }} />
                      <p className="text-neutral-400 text-sm">
                        {searchTerm ? 'No sales matching your search.' : 'No counter sales found for this period.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetModal(); }}
        title={editingSale ? 'Edit Counter Sale' : 'Register Counter Sale'}
      >
        <form onSubmit={handleSave} className="form-space">

          {/* Product Dropdown */}
          <div>
            <label className="form-label">Product Name</label>
            <div style={{ position: 'relative' }} ref={productDropdownRef}>
              <div style={{ position: 'relative' }}>
                <input type="text" className="bw-input" placeholder="Search product..."
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); if (!e.target.value) clearProductSelection(); }}
                  onFocus={() => setShowProductDropdown(true)} disabled={loading} required
                  style={{ paddingRight: selectedProduct ? '70px' : '40px' }} />
                {selectedProduct && (
                  <button type="button" onClick={clearProductSelection} style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <X size={16} />
                  </button>
                )}
                <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
              </div>
              {showProductDropdown && filteredProducts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: 'white', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                  {filteredProducts.map((product) => (
                    <div key={product._id} onClick={() => handleProductSelect(product)}
                      style={{ padding: '10px 12px', cursor: 'pointer', backgroundColor: selectedProduct?._id === product._id ? 'var(--color-neutral-100)' : 'white', borderBottom: '1px solid var(--color-neutral-200)' }}
                      onMouseEnter={(e) => { if (selectedProduct?._id !== product._id) e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)'; }}
                      onMouseLeave={(e) => { if (selectedProduct?._id !== product._id) e.currentTarget.style.backgroundColor = 'white'; }}>
                      <div className="font-medium text-sm">{product.productName}</div>
                      <div className="text-xs text-neutral-500">{product.type} • {product.variant?.[0]}–{product.variant?.[1]} • {product.unit}</div>
                    </div>
                  ))}
                </div>
              )}
              {showProductDropdown && productSearch && filteredProducts.length === 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: 'white', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius)', padding: '12px', zIndex: 1000 }}>
                  <p className="text-sm text-neutral-400 text-center">No products found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stock display */}
          {selectedProduct && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius)', border: `1px solid ${selectedProductStock ? '#bbf7d0' : stockLoading ? 'var(--color-neutral-200)' : '#fecaca'}`, backgroundColor: selectedProductStock ? '#f0fdf4' : stockLoading ? 'var(--color-neutral-50)' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {stockLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', border: '2px solid var(--color-neutral-300)', borderTop: '2px solid var(--color-black)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span className="text-xs text-neutral-500">Checking stock...</span>
                </div>
              ) : selectedProductStock ? (
                <>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#166534', marginBottom: '2px' }}>Current Stock</p>
                    <p className="font-bold text-sm" style={{ color: '#15803d' }}>{selectedProductStock.shownAs || `${selectedProductStock.totalUnits} ${selectedProductStock.unit}`}</p>
                    <p className="text-xs" style={{ color: '#86efac', marginTop: '1px' }}>{parseFloat((selectedProductStock.totalUnits || 0).toFixed(3))} {selectedProductStock.unit} total</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="text-xs text-neutral-500 mb-1">Selling / Unit</p>
                    <p className="font-semibold text-sm">Rs. {Math.floor(selectedProductStock.sellingPricePerUnit)?.toLocaleString()}</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#dc2626', marginBottom: '2px' }}>No Stock Found</p>
                  <p className="text-xs" style={{ color: '#ef4444' }}>This product has no inventory recorded.</p>
                </div>
              )}
            </div>
          )}

          {/* Vendor Dropdown */}
          <div>
            <label className="form-label">Vendor Name</label>
            <div style={{ position: 'relative' }} ref={vendorDropdownRef}>
              <div style={{ position: 'relative' }}>
                <input type="text" className="bw-input" placeholder="Search vendor..."
                  value={vendorSearch}
                  onChange={(e) => { setVendorSearch(e.target.value); setShowVendorDropdown(true); if (!e.target.value) clearVendorSelection(); }}
                  onFocus={() => !selectedProduct && setShowVendorDropdown(true)}
                  disabled={loading || !!selectedProduct}
                  required
                  style={{ paddingRight: selectedVendor ? '70px' : '40px', opacity: selectedProduct ? 0.7 : 1 }} />
                {selectedVendor && !selectedProduct && (
                  <button type="button" onClick={clearVendorSelection} style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <X size={16} />
                  </button>
                )}
                <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
              </div>
              {selectedProduct && <p className="text-xs text-neutral-400 mt-1">Vendor is auto-set from selected product's inventory.</p>}
              {showVendorDropdown && !selectedProduct && filteredVendors.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: 'white', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                  {filteredVendors.map((vendor) => (
                    <div key={vendor._id} onClick={() => handleVendorSelect(vendor)}
                      style={{ padding: '10px 12px', cursor: 'pointer', backgroundColor: selectedVendor?._id === vendor._id ? 'var(--color-neutral-100)' : 'white', borderBottom: '1px solid var(--color-neutral-200)' }}
                      onMouseEnter={(e) => { if (selectedVendor?._id !== vendor._id) e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)'; }}
                      onMouseLeave={(e) => { if (selectedVendor?._id !== vendor._id) e.currentTarget.style.backgroundColor = 'white'; }}>
                      <div className="font-medium text-sm">{vendor.vendorName}</div>
                    </div>
                  ))}
                </div>
              )}
              {showVendorDropdown && !selectedProduct && vendorSearch && filteredVendors.length === 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: 'white', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius)', padding: '12px', zIndex: 1000 }}>
                  <p className="text-sm text-neutral-400 text-center">No vendors found.</p>
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
                <label key={t} onClick={() => !selectedProduct && setFormData({ ...formData, type: t })}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: `2px solid ${formData.type === t ? 'var(--color-black)' : 'var(--color-neutral-300)'}`, borderRadius: 'var(--radius)', cursor: selectedProduct ? 'not-allowed' : 'pointer', fontWeight: formData.type === t ? 600 : 400, backgroundColor: formData.type === t ? 'var(--color-black)' : 'white', color: formData.type === t ? 'white' : 'var(--color-neutral-700)', opacity: selectedProduct ? 0.6 : 1, transition: 'all 0.15s ease', userSelect: 'none' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${formData.type === t ? 'white' : 'var(--color-neutral-400)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
            <input type="number" className="bw-input" placeholder="e.g. 0.5" value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required disabled={loading} min={0.001} step={0.001} />
          </div>

          {/* Selling Price */}
          <div>
            <label className="form-label">Selling Price / Unit</label>
            <input type="number" className="bw-input" placeholder="e.g. 200" value={formData.sellingPricePerUnit}
              onChange={(e) => setFormData({ ...formData, sellingPricePerUnit: e.target.value })} required disabled={loading} min={0} />
          </div>

          {/* Sale summary */}
          {formData.quantity && formData.sellingPricePerUnit ? (
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--radius)', border: '1px solid var(--color-neutral-200)' }}>
              <p className="text-xs font-medium text-neutral-600 mb-2">Sale Summary</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-neutral-500">Qty × Price</p>
                  <p className="text-sm text-neutral-600">{formData.quantity} × Rs. {Math.floor(formData.sellingPricePerUnit).toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-xs text-neutral-500">Total Revenue</p>
                  <p className="font-bold text-green-600" style={{ fontSize: '1.1rem' }}>Rs. {totalSelling.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Edit warning */}
          {editingSale && (
            <div style={{ padding: '10px 14px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 'var(--radius)' }}>
              <p className="text-xs" style={{ color: '#92400e' }}>
                Editing will restore the original units back to inventory and deduct the new quantity.
              </p>
            </div>
          )}

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: 'var(--radius)' }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => { setIsModalOpen(false); resetModal(); }} className="bw-button-secondary flex-1" disabled={loading}>Cancel</button>
            <button type="submit" className="bw-button-primary flex-1" disabled={loading}>
              {loading ? (editingSale ? 'Updating...' : 'Registering...') : (editingSale ? 'Update Sale' : 'Register Sale')}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}