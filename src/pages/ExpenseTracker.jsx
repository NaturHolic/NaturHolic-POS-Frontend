import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Plus, Search, Edit2, Trash2, Receipt, TrendingDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

const MONTHS_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const emptyForm = { title: '', amount: '' };

export default function ExpenseTracker() {
  const today = new Date();

  // ── View state ────────────────────────────────────────────────────────────
  const [viewMonth,  setViewMonth]  = useState(today.getMonth());
  const [viewYear,   setViewYear]   = useState(today.getFullYear());
  const [activeTab,  setActiveTab]  = useState('month'); // 'month' | 'overall'
  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // ── Data state ────────────────────────────────────────────────────────────
  const [expenses,     setExpenses]     = useState([]);
  const [total,        setTotal]        = useState(0);
  const [allExpenses,  setAllExpenses]  = useState([]); // for overall tab
  const [allTotal,     setAllTotal]     = useState(0);
  const [pageLoading,  setPageLoading]  = useState(true);
  const [allLoading,   setAllLoading]   = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');

  // ── Calendar modal state ──────────────────────────────────────────────────
  const [showCalModal,  setShowCalModal]  = useState(false);
  const [calYear,       setCalYear]       = useState(today.getFullYear());
  // Track which months have data: Set of "YYYY-M" strings
  const [monthsWithData, setMonthsWithData] = useState(new Set());

  // ── CRUD modal state ──────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp,  setEditingExp]  = useState(null);
  const [formData,    setFormData]    = useState(emptyForm);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // ── Helpers ───────────────────────────────────────────────────────────────
  const recalc = (list) => list.reduce((s, e) => s + (e.amount || 0), 0);

  // ── Fetch month expenses ──────────────────────────────────────────────────
  const fetchExpenses = async (month, year) => {
    try {
      setPageLoading(true);
      const { data } = await axios.get(`${API}/GetExpenses?month=${month}&year=${year}`);
      const list = data.expenses || [];
      setExpenses(list);
      setTotal(data.total ?? recalc(list));
    } catch (err) {
      console.error(err);
      setExpenses([]);
      setTotal(0);
    } finally {
      setPageLoading(false);
    }
  };

  // ── Fetch ALL expenses (overall tab) ──────────────────────────────────────
  const fetchAllExpenses = async () => {
    try {
      setAllLoading(true);
      // Fetch all months we know have data + current month
      const results = [];
      for (let i = 0; i <= 24; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        try {
          const { data } = await axios.get(`${API}/GetExpenses?month=${m}&year=${y}`);
          const list = data.expenses || [];
          if (list.length > 0) results.push(...list);
        } catch { /* skip */ }
      }
      // Sort newest first
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllExpenses(results);
      setAllTotal(recalc(results));
    } catch (err) {
      console.error(err);
    } finally {
      setAllLoading(false);
    }
  };

  // ── Build months-with-data set (for calendar dots) ────────────────────────
  const buildMonthsWithData = async () => {
    const withData = new Set();
    for (let i = 0; i <= 24; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      try {
        const { data } = await axios.get(`${API}/GetExpenses?month=${m}&year=${y}`);
        if ((data.expenses || []).length > 0) withData.add(`${y}-${m}`);
      } catch { /* skip */ }
    }
    setMonthsWithData(withData);
  };

  useEffect(() => { fetchExpenses(viewMonth, viewYear); }, [viewMonth, viewYear]);
  useEffect(() => { buildMonthsWithData(); }, []);
  useEffect(() => {
    if (activeTab === 'overall' && allExpenses.length === 0) fetchAllExpenses();
  }, [activeTab]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingExp(null); setFormData(emptyForm); setError(''); setIsModalOpen(true);
  };
  const handleOpenEdit = (exp) => {
    setEditingExp(exp); setFormData({ title: exp.title, amount: exp.amount }); setError(''); setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (editingExp) {
        const { data } = await axios.put(`${API}/UpdateExpense?id=${editingExp._id}`, {
          title: formData.title, amount: Number(formData.amount),
        });
        const updated = data.expense;
        setExpenses((prev) => {
          const newList = prev.map((x) => x._id === updated._id ? updated : x);
          setTotal(recalc(newList));
          return newList;
        });
        // Also update in allExpenses if loaded
        setAllExpenses((prev) => {
          const newList = prev.map((x) => x._id === updated._id ? updated : x);
          setAllTotal(recalc(newList));
          return newList;
        });
      } else {
        const { data } = await axios.post(`${API}/CreateExpense`, {
          title: formData.title, amount: Number(formData.amount),
        });
        const newExp = data.expense;
        if (newExp.month === viewMonth && newExp.year === viewYear) {
          setExpenses((prev) => { const l = [newExp, ...prev]; setTotal(recalc(l)); return l; });
        }
        setAllExpenses((prev) => { const l = [newExp, ...prev]; setAllTotal(recalc(l)); return l; });
        // Mark month as having data
        setMonthsWithData((prev) => new Set([...prev, `${newExp.year}-${newExp.month}`]));
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const handleDelete = async (exp) => {
    if (!window.confirm(`Delete "${exp.title}"?`)) return;
    try {
      await axios.delete(`${API}/DeleteExpense?id=${exp._id}`);
      setExpenses((prev) => { const l = prev.filter((x) => x._id !== exp._id); setTotal(recalc(l)); return l; });
      setAllExpenses((prev) => { const l = prev.filter((x) => x._id !== exp._id); setAllTotal(recalc(l)); return l; });
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete.');
    }
  };

  // ── Calendar month select ─────────────────────────────────────────────────
  const handleSelectMonth = (m) => {
    setViewMonth(m);
    setViewYear(calYear);
    setActiveTab('month');
    setShowCalModal(false);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const displayExpenses = activeTab === 'month' ? expenses : allExpenses;
  const displayTotal    = activeTab === 'month' ? total : allTotal;
  const displayLoading  = activeTab === 'month' ? pageLoading : allLoading;

  const filtered = displayExpenses.filter((e) =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewLabel = MONTHS_FULL[viewMonth] + ' ' + viewYear;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="full-height-page">
      <Header title="Expense Tracker">
        {isCurrentMonth && activeTab === 'month' && (
          <button onClick={handleOpenCreate} className="bw-button-primary">
            <Plus size={18} /><span>Add Expense</span>
          </button>
        )}
      </Header>

      <div className="page-content">

        {/* ── Top bar: tabs + calendar button ─────────────────────────── */}
        <div className="bw-card mb-6" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { key: 'month',   label: 'This Month' },
                { key: 'overall', label: 'Overall'     },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  padding: '7px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                  border: activeTab === tab.key ? '2px solid var(--color-black)' : '2px solid var(--color-neutral-200)',
                  backgroundColor: activeTab === tab.key ? 'var(--color-black)' : 'white',
                  color: activeTab === tab.key ? 'white' : 'var(--color-neutral-600)',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Calendar button — only visible in month tab */}
            {activeTab === 'month' && (
              <button onClick={() => { setCalYear(viewYear); setShowCalModal(true); }} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                border: '2px solid var(--color-neutral-200)', backgroundColor: 'white',
                color: 'var(--color-black)', cursor: 'pointer', transition: 'all 0.12s ease',
              }}>
                <Calendar size={15} />
                {MONTHS_SHORT[viewMonth]} {viewYear}
                {isCurrentMonth && (
                  <span style={{ fontSize: '0.6rem', backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    CURRENT
                  </span>
                )}
              </button>
            )}

            {activeTab === 'overall' && (
              <span style={{ fontSize: '0.78rem', color: 'var(--color-neutral-400)', fontWeight: 500 }}>
                All time expenses
              </span>
            )}
          </div>
        </div>

        {/* ── KPI cards ───────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div className="bw-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral-400)' }}>
                {activeTab === 'month' ? 'Total Spent' : 'Overall Spent'}
              </p>
              <TrendingDown size={15} color="var(--color-neutral-400)" />
            </div>
            <p style={{ fontSize: '1.7rem', fontWeight: 800, color: '#dc2626', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Rs. {Math.floor(displayTotal).toLocaleString()}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '4px' }}>
              {activeTab === 'month' ? viewLabel : 'since beginning'}
            </p>
          </div>

          <div className="bw-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral-400)' }}>
                {activeTab === 'month' ? 'This Month' : 'Total Entries'}
              </p>
              <Receipt size={15} color="var(--color-neutral-400)" />
            </div>
            <p style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-black)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {displayExpenses.length}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '4px' }}>expenses recorded</p>
          </div>
        </div>

        {/* ── Search + read-only badge ─────────────────────────────────── */}
        <div className="mb-4 flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search by title..."
              className="bw-input pl-10" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {activeTab === 'month' && !isCurrentMonth && (
            <span style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
              backgroundColor: '#fef3c7', color: '#92400e', whiteSpace: 'nowrap',
            }}>
              Read-only — past month
            </span>
          )}
          {activeTab === 'overall' && (
            <span style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
              backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)', whiteSpace: 'nowrap',
            }}>
              Read-only — all time
            </span>
          )}
        </div>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <div className="bw-card">
          {displayLoading ? (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <div className="text-center">
                <div style={{ width: '36px', height: '36px', border: '4px solid var(--color-neutral-200)', borderTop: '4px solid var(--color-black)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
                <p className="text-sm text-neutral-500">Loading expenses...</p>
              </div>
            </div>
          ) : (
            <table className="w-full" style={{ textAlign: 'left' }}>
              <thead>
                <tr>
                  <th className="bw-table-header">#</th>
                  <th className="bw-table-header">Title</th>
                  <th className="bw-table-header">Amount</th>
                  <th className="bw-table-header">Date & Time</th>
                  {activeTab === 'month' && isCurrentMonth && (
                    <th className="bw-table-header text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp, idx) => (
                  <tr key={exp._id || idx}>
                    <td className="bw-table-cell text-neutral-400 text-sm">{idx + 1}</td>
                    <td className="bw-table-cell font-medium">{exp.title}</td>
                    <td className="bw-table-cell font-semibold" style={{ color: '#dc2626' }}>
                      Rs. {Math.floor(exp.amount).toLocaleString()}
                    </td>
                    <td className="bw-table-cell text-neutral-400 text-sm">
                      {exp.createdAt
                        ? new Date(exp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
                          ' ' + new Date(exp.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    {activeTab === 'month' && isCurrentMonth && (
                      <td className="bw-table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(exp)} className="action-btn" title="Edit"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(exp)} className="action-btn action-btn-delete" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && !displayLoading && (
                  <tr>
                    <td colSpan={activeTab === 'month' && isCurrentMonth ? 5 : 4} style={{ padding: '60px 0', textAlign: 'center' }}>
                      <TrendingDown size={32} style={{ color: 'var(--color-neutral-300)', margin: '0 auto 12px', display: 'block' }} />
                      <p className="text-neutral-400 text-sm">
                        {searchTerm
                          ? 'No expenses match your search.'
                          : activeTab === 'month'
                            ? 'No expenses recorded for ' + viewLabel + '.'
                            : 'No expenses recorded yet.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Calendar Month Picker Modal ──────────────────────────────── */}
      {showCalModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }} onClick={() => setShowCalModal(false)}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '24px',
            width: '340px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }} onClick={(e) => e.stopPropagation()}>

            {/* Year navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <button onClick={() => setCalYear((y) => y - 1)} className="action-btn">
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-black)' }}>{calYear}</span>
              <button
                onClick={() => setCalYear((y) => y + 1)}
                disabled={calYear >= today.getFullYear()}
                className="action-btn"
                style={{ opacity: calYear >= today.getFullYear() ? 0.3 : 1, cursor: calYear >= today.getFullYear() ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 3×4 month grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {MONTHS_SHORT.map((name, m) => {
                const isFuture = calYear > today.getFullYear() || (calYear === today.getFullYear() && m > today.getMonth());
                const isSelected = m === viewMonth && calYear === viewYear;
                const isCurrent  = m === today.getMonth() && calYear === today.getFullYear();
                const hasData    = monthsWithData.has(`${calYear}-${m}`);

                return (
                  <button key={m} onClick={() => !isFuture && handleSelectMonth(m)} disabled={isFuture}
                    style={{
                      position: 'relative',
                      padding: '12px 8px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
                      border: isSelected ? '2px solid var(--color-black)' : isCurrent ? '2px solid var(--color-neutral-300)' : '2px solid transparent',
                      backgroundColor: isSelected ? 'var(--color-black)' : isCurrent ? 'var(--color-neutral-50)' : 'var(--color-neutral-50)',
                      color: isFuture ? 'var(--color-neutral-300)' : isSelected ? 'white' : 'var(--color-neutral-700)',
                      cursor: isFuture ? 'not-allowed' : 'pointer',
                      transition: 'all 0.1s ease',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    }}
                    onMouseEnter={(e) => { if (!isSelected && !isFuture) e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = isCurrent ? 'var(--color-neutral-50)' : 'var(--color-neutral-50)'; }}
                  >
                    {name}
                    {/* Green dot if month has expense data */}
                    {hasData && (
                      <span style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : '#16a34a',
                      }} />
                    )}
                    {!hasData && <span style={{ width: '5px', height: '5px', opacity: 0 }} />}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-neutral-100)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-neutral-400)' }}>Has expenses</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', border: '1.5px solid var(--color-neutral-400)', backgroundColor: 'transparent' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-neutral-400)' }}>Current month</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExp ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSave} className="form-space">
          <div>
            <label className="form-label">Title</label>
            <input type="text" className="bw-input" placeholder="e.g. Monthly Rent"
              value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required disabled={loading} />
          </div>
          <div>
            <label className="form-label">Amount (Rs.)</label>
            <input type="number" className="bw-input" placeholder="e.g. 15000"
              value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required disabled={loading} min={0} step={0.01} />
          </div>
          {formData.amount > 0 && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', borderRadius: 'var(--radius)', border: '1px solid #fecaca' }}>
              <p className="text-xs text-neutral-500 mb-1">Expense Amount</p>
              <p style={{ fontWeight: 700, fontSize: '1.2rem', color: '#dc2626' }}>
                Rs. {Math.floor(Number(formData.amount) || 0).toLocaleString()}
              </p>
            </div>
          )}
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: 'var(--radius)' }}>
              <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bw-button-secondary flex-1" disabled={loading}>Cancel</button>
            <button type="submit" className="bw-button-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : editingExp ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}