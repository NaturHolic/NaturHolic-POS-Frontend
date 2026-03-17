// import { Header } from '@/components/Header';
// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
// } from 'recharts';
// import {
//   Package, ShoppingCart, TrendingUp, AlertTriangle,
//   ArrowUpRight, ArrowDownRight, Layers, DollarSign
// } from 'lucide-react';

// const API = import.meta.env.VITE_API_BASE_URL;

// const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// const PIE_COLORS = ['#0f0f0f', '#3b3b3b', '#6b6b6b', '#9ca3af', '#d1d5db', '#e5e7eb'];

// const toLocalDateStr = (date) => {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, '0');
//   const d = String(date.getDate()).padStart(2, '0');
//   return `${y}-${m}-${d}`;
// };

// // ── Custom Tooltip ────────────────────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       backgroundColor: '#0f0f0f', border: 'none', borderRadius: '8px',
//       padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
//     }}>
//       <p style={{ color: '#9ca3af', fontSize: '0.72rem', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
//       {payload.map((p, i) => (
//         <p key={i} style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700, margin: '2px 0' }}>
//           {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
//         </p>
//       ))}
//     </div>
//   );
// };

// // ── Stat Card ─────────────────────────────────────────────────────────────────
// const StatCard = ({ label, value, sub, icon: Icon, trend, trendUp }) => (
//   <div className="bw-card" style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
//     <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
//       <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral-400)' }}>{label}</p>
//       <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <Icon size={15} color="var(--color-neutral-600)" />
//       </div>
//     </div>
//     <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-black)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
//     {sub && <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '4px' }}>{sub}</p>}
//     {trend && (
//       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-neutral-100)' }}>
//         {trendUp ? <ArrowUpRight size={13} color="#16a34a" /> : <ArrowDownRight size={13} color="#dc2626" />}
//         <span style={{ fontSize: '0.72rem', fontWeight: 600, color: trendUp ? '#16a34a' : '#dc2626' }}>{trend}</span>
//       </div>
//     )}
//   </div>
// );

// // ── Section Header ────────────────────────────────────────────────────────────
// const SectionTitle = ({ title, sub }) => (
//   <div style={{ marginBottom: '16px' }}>
//     <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>{title}</h3>
//     {sub && <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '2px' }}>{sub}</p>}
//   </div>
// );

// export default function DashboardOverview() {
//   const today = new Date();
//   const [inventories, setInventories] = useState([]);
//   const [allSales, setAllSales] = useState([]);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         const yearStart = `${today.getFullYear()}-01-01`;
//         const todayStr = toLocalDateStr(today);

//         const [invRes, salesRes] = await Promise.all([
//           axios.get(`${API}/Inventories`),
//           axios.get(`${API}/GetCounterSales?startDate=${yearStart}&endDate=${todayStr}`),
//         ]);

//         setInventories(invRes.data.inventories || []);
//         setAllSales(salesRes.data.sales || salesRes.data.counterSales || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   // ── Derived: Inventory stats ────────────────────────────────────────────────
//   const totalProducts = inventories.length;
//   const totalStockUnits = inventories.reduce((s, i) => s + (i.totalUnits || 0), 0);
//   const lowStockItems = inventories.filter((i) => i.totalUnits <= 50);
//   const totalInventoryValue = inventories.reduce((s, i) => s + (i.totalBuyingPrice || 0), 0);

//   // ── Derived: Sales stats ────────────────────────────────────────────────────
//   const totalRevenue = allSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);
//   const totalSalesCount = allSales.length;
//   const totalUnitsSold = allSales.reduce((s, sale) => s + (sale.Totalunits || 0), 0);

//   // This month
//   const thisMonthSales = allSales.filter((s) => {
//     const d = new Date(s.createdAt);
//     return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
//   });
//   const thisMonthRevenue = thisMonthSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);

//   // Last month
//   const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//   const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
//   const lastMonthSales = allSales.filter((s) => {
//     const d = new Date(s.createdAt);
//     return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
//   });
//   const lastMonthRevenue = lastMonthSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);
//   const revenueGrowth = lastMonthRevenue > 0
//     ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
//     : null;

//   // ── Chart: Monthly sales (bar) ──────────────────────────────────────────────
//   const monthlySalesData = MONTHS_SHORT.map((month, idx) => {
//     const monthSales = allSales.filter((s) => {
//       const d = new Date(s.createdAt);
//       return d.getMonth() === idx && d.getFullYear() === today.getFullYear();
//     });
//     return {
//       month,
//       revenue: Math.floor(monthSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0)),
//       transactions: monthSales.length,
//     };
//   });

//   // ── Chart: Last 30 days daily sales (area) ─────────────────────────────────
//   const last30Days = Array.from({ length: 30 }, (_, i) => {
//     const d = new Date(today);
//     d.setDate(d.getDate() - (29 - i));
//     const ds = toLocalDateStr(d);
//     const daySales = allSales.filter((s) => {
//       const sd = new Date(s.createdAt);
//       return toLocalDateStr(sd) === ds;
//     });
//     return {
//       date: `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`,
//       revenue: Math.floor(daySales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0)),
//       sales: daySales.length,
//     };
//   });

//   // ── Chart: Product stock pie ────────────────────────────────────────────────
//   const productStockPie = inventories
//     .sort((a, b) => (b.totalUnits || 0) - (a.totalUnits || 0))
//     .slice(0, 6)
//     .map((inv) => ({
//       name: inv.productName?.length > 16 ? inv.productName.slice(0, 14) + '…' : inv.productName,
//       value: inv.totalUnits || 0,
//     }));

//   // ── Chart: Top selling products (bar) ─────────────────────────────────────
//   const productSalesMap = {};
//   allSales.forEach((s) => {
//     if (!productSalesMap[s.productName]) productSalesMap[s.productName] = { units: 0, revenue: 0 };
//     productSalesMap[s.productName].units += s.Totalunits || 0;
//     productSalesMap[s.productName].revenue += s.TotalSellingPrice || 0;
//   });

//   const topProducts = Object.entries(productSalesMap)
//     .map(([name, v]) => ({ name: name.length > 14 ? name.slice(0, 12) + '…' : name, ...v }))
//     .sort((a, b) => b.revenue - a.revenue)
//     .slice(0, 7);

//   // ── Chart: Sales by vendor ─────────────────────────────────────────────────
//   const vendorMap = {};
//   allSales.forEach((s) => {
//     if (!vendorMap[s.vendorName]) vendorMap[s.vendorName] = 0;
//     vendorMap[s.vendorName] += s.TotalSellingPrice || 0;
//   });
//   const vendorPie = Object.entries(vendorMap)
//     .map(([name, value]) => ({ name: name.length > 16 ? name.slice(0, 14) + '…' : name, value: Math.floor(value) }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 5);

//   // ── Today's quick stats ────────────────────────────────────────────────────
//   const todayStr2 = toLocalDateStr(today);
//   const todaySales = allSales.filter((s) => toLocalDateStr(new Date(s.createdAt)) === todayStr2);
//   const todayRevenue = todaySales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);

//   if (loading) {
//     return (
//       <div className="full-height-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-neutral-200)', borderTop: '4px solid var(--color-black)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
//           <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>Loading dashboard...</p>
//         </div>
//         <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   return (
//     <div className="full-height-page">
//       <Header title="Dashboard Overview" />

//       <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

//         {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
//           <StatCard
//             label="Total Revenue (YTD)"
//             value={`Rs. ${Math.floor(totalRevenue).toLocaleString()}`}
//             sub="year to date"
//             icon={DollarSign}
//             trend={revenueGrowth ? `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs last month` : 'First month'}
//             trendUp={parseFloat(revenueGrowth) >= 0}
//           />
//           <StatCard
//             label="This Month"
//             value={`Rs. ${Math.floor(thisMonthRevenue).toLocaleString()}`}
//             sub={`${thisMonthSales.length} transactions`}
//             icon={TrendingUp}
//             trend={`Today: Rs. ${Math.floor(todayRevenue).toLocaleString()}`}
//             trendUp={todayRevenue > 0}
//           />
//           <StatCard
//             label="Total Products"
//             value={totalProducts}
//             sub={`${totalStockUnits.toLocaleString()} units in stock`}
//             icon={Package}
//             trend={lowStockItems.length > 0 ? `${lowStockItems.length} low stock items` : 'Stock healthy'}
//             trendUp={lowStockItems.length === 0}
//           />
//           <StatCard
//             label="Total Sales (YTD)"
//             value={totalSalesCount.toLocaleString()}
//             sub={`${totalUnitsSold.toLocaleString()} units sold`}
//             icon={ShoppingCart}
//             trend={`Inventory value: Rs. ${Math.floor(totalInventoryValue).toLocaleString()}`}
//             trendUp={true}
//           />
//         </div>

//         {/* ── 30-Day Daily Revenue Area Chart ───────────────────────────────── */}
//         <div className="bw-card" style={{ padding: '20px 24px' }}>
//           <SectionTitle title="Daily Revenue — Last 30 Days" sub="Revenue trend across the past month" />
//           <ResponsiveContainer width="100%" height={200}>
//             <AreaChart data={last30Days} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#0f0f0f" stopOpacity={0.15} />
//                   <stop offset="95%" stopColor="#0f0f0f" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//               <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
//                 interval={4} />
//               <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
//                 tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
//               <Tooltip content={<CustomTooltip prefix="Rs. " />} />
//               <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0f0f0f" strokeWidth={2}
//                 fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#0f0f0f' }} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         {/* ── Monthly Bar + Product Pie ──────────────────────────────────────── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>

//           {/* Monthly Revenue Bar */}
//           <div className="bw-card" style={{ padding: '20px 24px' }}>
//             <div style={{ marginBottom: '16px' }}>
//               <SectionTitle title="Monthly Performance" sub={`${today.getFullYear()} — revenue breakdown`} />
//             </div>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={monthlySalesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={18}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                 <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
//                 <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
//                   tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
//                 <Tooltip content={<CustomTooltip prefix="Rs. " />} />
//                 <Bar dataKey="revenue" name="Revenue"
//                   fill="#0f0f0f" radius={[4, 4, 0, 0]}
//                   label={false}
//                 >
//                   {monthlySalesData.map((entry, index) => (
//                     <Cell key={index}
//                       fill={index === today.getMonth() ? '#0f0f0f' : '#e5e7eb'}
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Stock Distribution Pie */}
//           <div className="bw-card" style={{ padding: '20px 24px' }}>
//             <SectionTitle title="Stock Distribution" sub="Top products by units" />
//             {productStockPie.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={170}>
//                   <PieChart>
//                     <Pie data={productStockPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
//                       paddingAngle={3} dataKey="value">
//                       {productStockPie.map((_, i) => (
//                         <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
//                   {productStockPie.map((item, i) => (
//                     <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
//                         <span style={{ fontSize: '0.72rem', color: 'var(--color-neutral-600)' }}>{item.name}</span>
//                       </div>
//                       <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-black)' }}>
//                         {item.value.toLocaleString()} units
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No inventory data</div>
//             )}
//           </div>
//         </div>

//         {/* ── Top Products Bar + Vendor Pie ──────────────────────────────────── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>

//           {/* Top Selling Products */}
//           <div className="bw-card" style={{ padding: '20px 24px' }}>
//             <SectionTitle title="Top Selling Products" sub="By revenue, year to date" />
//             {topProducts.length > 0 ? (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={14}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
//                   <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
//                     tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
//                   <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} width={90} />
//                   <Tooltip content={<CustomTooltip prefix="Rs. " />} />
//                   <Bar dataKey="revenue" name="Revenue" fill="#0f0f0f" radius={[0, 4, 4, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No sales data yet</div>
//             )}
//           </div>

//           {/* Sales by Vendor */}
//           <div className="bw-card" style={{ padding: '20px 24px' }}>
//             <SectionTitle title="Revenue by Vendor" sub="Top vendors year to date" />
//             {vendorPie.length > 0 ? (
//               <>
//                 <ResponsiveContainer width="100%" height={170}>
//                   <PieChart>
//                     <Pie data={vendorPie} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
//                       {vendorPie.map((_, i) => (
//                         <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip prefix="Rs. " />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
//                   {vendorPie.map((item, i) => (
//                     <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
//                         <span style={{ fontSize: '0.72rem', color: 'var(--color-neutral-600)' }}>{item.name}</span>
//                       </div>
//                       <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-black)' }}>
//                         Rs. {item.value.toLocaleString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No vendor data</div>
//             )}
//           </div>
//         </div>

//         {/* ── Low Stock Alert Table ──────────────────────────────────────────── */}
//         {lowStockItems.length > 0 && (
//           <div className="bw-card" style={{ padding: '20px 24px' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
//               <AlertTriangle size={16} color="#d97706" />
//               <SectionTitle title="Low Stock Alerts" sub={`${lowStockItems.length} product${lowStockItems.length > 1 ? 's' : ''} running low (≤ 50 units)`} />
//             </div>
//             <table className="w-full" style={{ textAlign: 'left' }}>
//               <thead>
//                 <tr>
//                   <th className="bw-table-header">Product</th>
//                   <th className="bw-table-header">Vendor</th>
//                   <th className="bw-table-header">Type</th>
//                   <th className="bw-table-header">Units Left</th>
//                   <th className="bw-table-header">Shown As</th>
//                   <th className="bw-table-header">Selling / Unit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {lowStockItems.map((item, idx) => (
//                   <tr key={item._id || idx}>
//                     <td className="bw-table-cell font-medium">{item.productName}</td>
//                     <td className="bw-table-cell text-neutral-500">{item.vendorName}</td>
//                     <td className="bw-table-cell">
//                       <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: item.type === 'Bag' ? '#e0f2fe' : '#fef9c3', color: item.type === 'Bag' ? '#0369a1' : '#854d0e' }}>
//                         {item.type}
//                       </span>
//                     </td>
//                     <td className="bw-table-cell">
//                       <span style={{ fontWeight: 700, color: item.totalUnits <= 10 ? '#dc2626' : '#d97706' }}>
//                         {item.totalUnits}
//                       </span>
//                     </td>
//                     <td className="bw-table-cell text-neutral-500">{item.shownAs || '—'}</td>
//                     <td className="bw-table-cell font-medium">Rs. {Math.floor(item.sellingPricePerUnit)?.toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ── Recent Sales Table ─────────────────────────────────────────────── */}
//         <div className="bw-card" style={{ padding: '20px 24px' }}>
//           <SectionTitle title="Recent Sales" sub="Last 10 counter sales" />
//           <table className="w-full" style={{ textAlign: 'left' }}>
//             <thead>
//               <tr>
//                 <th className="bw-table-header">#</th>
//                 <th className="bw-table-header">Product</th>
//                 <th className="bw-table-header">Vendor</th>
//                 <th className="bw-table-header">Inv. Type</th>
//                 <th className="bw-table-header">Qty</th>
//                 <th className="bw-table-header">Total Units</th>
//                 <th className="bw-table-header">Revenue</th>
//                 <th className="bw-table-header">Date & Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allSales.slice(0, 10).map((sale, idx) => (
//                 <tr key={sale._id || idx}>
//                   <td className="bw-table-cell text-neutral-400 text-sm">{idx + 1}</td>
//                   <td className="bw-table-cell font-medium">{sale.productName}</td>
//                   <td className="bw-table-cell text-neutral-500">{sale.vendorName}</td>
//                   <td className="bw-table-cell">
//                     <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: sale.inventoryType === 'bulk' ? '#ede9fe' : '#fef3c7', color: sale.inventoryType === 'bulk' ? '#6d28d9' : '#92400e' }}>
//                       {sale.inventoryType || '—'}
//                     </span>
//                   </td>
//                   <td className="bw-table-cell">{sale.quantity}</td>
//                   <td className="bw-table-cell text-neutral-500">{sale.Totalunits}</td>
//                   <td className="bw-table-cell font-semibold text-green-600">
//                     Rs. {Math.floor(sale.TotalSellingPrice || 0).toLocaleString()}
//                   </td>
//                   <td className="bw-table-cell text-neutral-400 text-sm">
//                     {sale.createdAt
//                       ? new Date(sale.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
//                         new Date(sale.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
//                       : '—'}
//                   </td>
//                 </tr>
//               ))}
//               {allSales.length === 0 && (
//                 <tr>
//                   <td colSpan="8" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>
//                     No sales recorded yet.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//       </div>

//       <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
//     </div>
//   );
// }

import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  Package, ShoppingCart, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, DollarSign,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PIE_COLORS   = ['#0f0f0f','#3b3b3b','#6b6b6b','#9ca3af','#d1d5db','#e5e7eb'];

// ── Date helpers ──────────────────────────────────────────────────────────────
const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const getMonthStart = (m, y) => `${y}-${String(m + 1).padStart(2, '0')}-01`;
const getMonthEnd   = (m, y) => {
  const last = new Date(y, m + 1, 0).getDate();
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
};

// ── Sub-components ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: '#0f0f0f', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <p style={{ color: '#9ca3af', fontSize: '0.72rem', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700, margin: '2px 0' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, trend, trendUp }) => (
  <div className="bw-card" style={{ padding: '20px 22px' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-neutral-400)' }}>{label}</p>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color="var(--color-neutral-600)" />
      </div>
    </div>
    <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-black)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '4px' }}>{sub}</p>}
    {trend && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-neutral-100)' }}>
        {trendUp ? <ArrowUpRight size={13} color="#16a34a" /> : <ArrowDownRight size={13} color="#dc2626" />}
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: trendUp ? '#16a34a' : '#dc2626' }}>{trend}</span>
      </div>
    )}
  </div>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: '16px' }}>
    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>{title}</h3>
    {sub && <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '2px' }}>{sub}</p>}
  </div>
);

// ── Profit mini-card used inside the profit grid ──────────────────────────────
const PCell = ({ label, value, sub, valueCss, bgCss, borderCss }) => (
  <div style={{ padding: '16px 18px', borderRadius: '10px', backgroundColor: bgCss || 'var(--color-neutral-50)', border: `1px solid ${borderCss || 'var(--color-neutral-200)'}` }}>
    <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-neutral-400)', marginBottom: '8px' }}>{label}</p>
    <p style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', ...valueCss }}>{value}</p>
    {sub && <p style={{ fontSize: '0.65rem', color: 'var(--color-neutral-400)', marginTop: '4px' }}>{sub}</p>}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const today = new Date();

  // ── Dashboard base data ───────────────────────────────────────────────────
  const [inventories, setInventories] = useState([]);
  const [allSales,    setAllSales]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  // ── Profit state ──────────────────────────────────────────────────────────
  const [profitTab,     setProfitTab]     = useState('month');  // 'month' | 'overall'
  const [profitMonth,   setProfitMonth]   = useState(today.getMonth());
  const [profitYear,    setProfitYear]    = useState(today.getFullYear());
  const [showCalModal,  setShowCalModal]  = useState(false);
  const [calYear,       setCalYear]       = useState(today.getFullYear());
  const [profitData,    setProfitData]    = useState(null);   // month profit
  const [overallData,   setOverallData]   = useState(null);   // YTD profit
  const [profitLoading, setProfitLoading] = useState(false);
  const [ytdLoading,    setYtdLoading]    = useState(false);

  const isCurMonth = profitMonth === today.getMonth() && profitYear === today.getFullYear();

  // ── Fetch base dashboard data ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const yearS   = `${today.getFullYear()}-01-01`;
        const todayS  = toLocalDateStr(today);
        const [invRes, salesRes] = await Promise.all([
          axios.get(`${API}/Inventories`),
          axios.get(`${API}/GetCounterSales?startDate=${yearS}&endDate=${todayS}`),
        ]);
        setInventories(invRes.data.inventories || []);
        setAllSales(salesRes.data.sales || salesRes.data.counterSales || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  // ── Fetch month profit ────────────────────────────────────────────────────
  const fetchMonthProfit = async (m, y) => {
    try {
      setProfitLoading(true);
      const { data } = await axios.get(
        `${API}/GetProfitSummary?startDate=${getMonthStart(m, y)}&endDate=${getMonthEnd(m, y)}`
      );
      setProfitData(data);
    } catch (e) { console.error(e); setProfitData(null); }
    finally { setProfitLoading(false); }
  };

  // ── Fetch YTD profit (lazy — only when tab first opened) ──────────────────
  const fetchOverallProfit = async () => {
    try {
      setYtdLoading(true);
      const { data } = await axios.get(
        `${API}/GetProfitSummary?startDate=${today.getFullYear()}-01-01&endDate=${toLocalDateStr(today)}`
      );
      setOverallData(data);
    } catch (e) { console.error(e); setOverallData(null); }
    finally { setYtdLoading(false); }
  };

  useEffect(() => { fetchMonthProfit(profitMonth, profitYear); }, [profitMonth, profitYear]);
  useEffect(() => { if (profitTab === 'overall' && !overallData) fetchOverallProfit(); }, [profitTab]);

  const handleSelectMonth = (m) => {
    setProfitMonth(m); setProfitYear(calYear);
    setProfitTab('month'); setShowCalModal(false);
  };

  // ── Derived: inventory ────────────────────────────────────────────────────
  const totalProducts      = inventories.length;
  const totalStockUnits    = inventories.reduce((s, i) => s + (i.totalUnits || 0), 0);
  const lowStockItems      = inventories.filter((i) => i.totalUnits <= 50);
  const totalInventoryValue = inventories.reduce((s, i) => s + (i.totalBuyingPrice || 0), 0);

  // ── Derived: sales ────────────────────────────────────────────────────────
  const totalRevenue    = allSales.reduce((s, x) => s + (x.TotalSellingPrice || 0), 0);
  const totalSalesCount = allSales.length;
  const totalUnitsSold  = allSales.reduce((s, x) => s + (x.Totalunits || 0), 0);

  const thisMonthSales   = allSales.filter((s) => { const d = new Date(s.createdAt); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); });
  const thisMonthRevenue = thisMonthSales.reduce((s, x) => s + (x.TotalSellingPrice || 0), 0);
  const lastMo           = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const lastMoYr         = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const lastMonthRevenue = allSales.filter((s) => { const d = new Date(s.createdAt); return d.getMonth() === lastMo && d.getFullYear() === lastMoYr; }).reduce((s, x) => s + (x.TotalSellingPrice || 0), 0);
  const revenueGrowth    = lastMonthRevenue > 0 ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1) : null;
  const todayRevenue     = allSales.filter((s) => toLocalDateStr(new Date(s.createdAt)) === toLocalDateStr(today)).reduce((s, x) => s + (x.TotalSellingPrice || 0), 0);

  // ── Derived: charts ───────────────────────────────────────────────────────
  const monthlySalesData = MONTHS_SHORT.map((month, idx) => {
    const ms = allSales.filter((s) => { const d = new Date(s.createdAt); return d.getMonth() === idx && d.getFullYear() === today.getFullYear(); });
    return { month, revenue: Math.floor(ms.reduce((s, x) => s + (x.TotalSellingPrice || 0), 0)) };
  });

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (29 - i));
    const ds = toLocalDateStr(d);
    return { date: `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`, revenue: Math.floor(allSales.filter((s) => toLocalDateStr(new Date(s.createdAt)) === ds).reduce((s, x) => s + (x.TotalSellingPrice || 0), 0)) };
  });

  const productStockPie = [...inventories].sort((a, b) => (b.totalUnits || 0) - (a.totalUnits || 0)).slice(0, 6).map((inv) => ({ name: inv.productName?.length > 16 ? inv.productName.slice(0, 14) + '…' : inv.productName, value: inv.totalUnits || 0 }));
  const prodSalesMap = {}; allSales.forEach((s) => { if (!prodSalesMap[s.productName]) prodSalesMap[s.productName] = { units: 0, revenue: 0 }; prodSalesMap[s.productName].units += s.Totalunits || 0; prodSalesMap[s.productName].revenue += s.TotalSellingPrice || 0; });
  const topProducts  = Object.entries(prodSalesMap).map(([name, v]) => ({ name: name.length > 14 ? name.slice(0, 12) + '…' : name, ...v })).sort((a, b) => b.revenue - a.revenue).slice(0, 7);
  const vendorMap    = {}; allSales.forEach((s) => { vendorMap[s.vendorName] = (vendorMap[s.vendorName] || 0) + (s.TotalSellingPrice || 0); });
  const vendorPie    = Object.entries(vendorMap).map(([name, value]) => ({ name: name.length > 16 ? name.slice(0, 14) + '…' : name, value: Math.floor(value) })).sort((a, b) => b.value - a.value).slice(0, 5);

  // ── Active profit data ────────────────────────────────────────────────────
  const pd          = profitTab === 'month' ? profitData : overallData;
  const pdLoading   = profitTab === 'month' ? profitLoading : ytdLoading;
  const profitLabel = profitTab === 'month' ? `${MONTHS_FULL[profitMonth]} ${profitYear}` : `${today.getFullYear()} Year to Date`;
  const fmtRs       = (n) => n == null ? '—' : `Rs. ${Math.floor(n).toLocaleString()}`;
  const netColor    = !pd ? '#6b7280' : pd.netProfit >= 0 ? '#4ade80' : '#f87171';
  const grossColor  = !pd ? '#6b7280' : pd.grossProfit >= 0 ? '#16a34a' : '#dc2626';

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="full-height-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-neutral-200)', borderTop: '4px solid var(--color-black)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-400)', fontWeight: 600 }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div className="full-height-page">
      <Header title="Dashboard Overview" />
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          <StatCard label="Total Revenue (YTD)" value={`Rs. ${Math.floor(totalRevenue).toLocaleString()}`} sub="year to date" icon={DollarSign}
            trend={revenueGrowth ? `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs last month` : 'First month'} trendUp={parseFloat(revenueGrowth) >= 0} />
          <StatCard label="This Month" value={`Rs. ${Math.floor(thisMonthRevenue).toLocaleString()}`} sub={`${thisMonthSales.length} transactions`} icon={TrendingUp}
            trend={`Today: Rs. ${Math.floor(todayRevenue).toLocaleString()}`} trendUp={todayRevenue > 0} />
          <StatCard label="Total Products" value={totalProducts} sub={`${totalStockUnits.toLocaleString()} units in stock`} icon={Package}
            trend={lowStockItems.length > 0 ? `${lowStockItems.length} low stock items` : 'Stock healthy'} trendUp={lowStockItems.length === 0} />
          <StatCard label="Total Sales (YTD)" value={totalSalesCount.toLocaleString()} sub={`${totalUnitsSold.toLocaleString()} units sold`} icon={ShoppingCart}
            trend={`Inventory value: Rs. ${Math.floor(totalInventoryValue).toLocaleString()}`} trendUp={true} />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PROFIT ANALYSIS SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <div className="bw-card" style={{ padding: '22px 26px' }}>

          {/* Section header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>Profit Analysis</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                {profitLabel}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Tabs */}
              {[{ key: 'month', label: 'This Month' }, { key: 'overall', label: 'Overall (YTD)' }].map((t) => (
                <button key={t.key} onClick={() => setProfitTab(t.key)} style={{
                  padding: '6px 16px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600,
                  border: profitTab === t.key ? '2px solid var(--color-black)' : '2px solid var(--color-neutral-200)',
                  backgroundColor: profitTab === t.key ? 'var(--color-black)' : 'white',
                  color: profitTab === t.key ? 'white' : 'var(--color-neutral-600)',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                }}>{t.label}</button>
              ))}

              {/* Calendar button — month tab only */}
              {profitTab === 'month' && (
                <button onClick={() => { setCalYear(profitYear); setShowCalModal(true); }} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px',
                  border: '2px solid var(--color-neutral-200)', backgroundColor: 'white',
                  fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-black)', cursor: 'pointer',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {MONTHS_SHORT[profitMonth]} {profitYear}
                  {isCurMonth && (
                    <span style={{ fontSize: '0.58rem', backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>CURRENT</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Profit cards */}
          {pdLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '110px', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', border: '3px solid var(--color-neutral-200)', borderTop: '3px solid var(--color-black)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '0.82rem', color: 'var(--color-neutral-400)' }}>Calculating profit...</p>
            </div>
          ) : pd ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>

                {/* Total Selling */}
                <PCell
                  label="Total Selling"
                  value={fmtRs(pd.totalSelling)}
                  sub="from counter sales"
                  valueCss={{ color: '#16a34a' }}
                />

                {/* Cost of Goods */}
                <PCell
                  label="Cost of Goods"
                  value={fmtRs(pd.totalBuying)}
                  sub="buying cost of sold units"
                  valueCss={{ color: '#dc2626' }}
                />

                {/* Gross Profit */}
                <PCell
                  label="Gross Profit"
                  value={fmtRs(pd.grossProfit)}
                  sub="selling − cost of goods"
                  valueCss={{ color: grossColor }}
                  bgCss={pd.grossProfit >= 0 ? '#f0fdf4' : '#fef2f2'}
                  borderCss={pd.grossProfit >= 0 ? '#bbf7d0' : '#fecaca'}
                />

                {/* Expenses */}
                <PCell
                  label={profitTab === 'month' ? 'Monthly Expenses' : 'YTD Expenses'}
                  value={fmtRs(pd.totalExpenses)}
                  sub="from expense tracker"
                  valueCss={{ color: '#d97706' }}
                />

                {/* Net Profit — black bg if positive */}
                <div style={{
                  padding: '16px 18px', borderRadius: '10px',
                  backgroundColor: pd.netProfit >= 0 ? '#0f0f0f' : '#fef2f2',
                  border: `1px solid ${pd.netProfit >= 0 ? '#0f0f0f' : '#fecaca'}`,
                }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: pd.netProfit >= 0 ? 'rgba(255,255,255,0.45)' : 'var(--color-neutral-400)', marginBottom: '8px' }}>Net Profit</p>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: netColor }}>{fmtRs(pd.netProfit)}</p>
                  <p style={{ fontSize: '0.65rem', color: pd.netProfit >= 0 ? 'rgba(255,255,255,0.3)' : 'var(--color-neutral-400)', marginTop: '4px' }}>gross − expenses</p>
                </div>
              </div>

              {/* Formula bar */}
              <div style={{ marginTop: '14px', padding: '9px 14px', backgroundColor: 'var(--color-neutral-50)', borderRadius: '8px', border: '1px solid var(--color-neutral-100)' }}>
                <p style={{ fontSize: '0.69rem', color: 'var(--color-neutral-400)', fontFamily: 'monospace', margin: 0 }}>
                  Gross = Total Selling − Cost of Goods &nbsp;|&nbsp; Net = Gross − {profitTab === 'month' ? 'Monthly' : 'YTD'} Expenses &nbsp;|&nbsp; {pd.salesCount} sale{pd.salesCount !== 1 ? 's' : ''} in period
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.82rem' }}>
              No data available for {profitLabel}.
            </div>
          )}
        </div>

        {/* ── 30-Day Revenue Area Chart ──────────────────────────────────────── */}
        <div className="bw-card" style={{ padding: '20px 24px' }}>
          <SectionTitle title="Daily Revenue — Last 30 Days" sub="Revenue trend across the past month" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={last30Days} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f0f0f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f0f0f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="Rs. " />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0f0f0f" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#0f0f0f' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Monthly Bar + Stock Pie ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Monthly Performance" sub={`${today.getFullYear()} — revenue breakdown`} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySalesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="Rs. " />} />
                <Bar dataKey="revenue" name="Revenue" fill="#0f0f0f" radius={[4, 4, 0, 0]}>
                  {monthlySalesData.map((_, i) => <Cell key={i} fill={i === today.getMonth() ? '#0f0f0f' : '#e5e7eb'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Stock Distribution" sub="Top products by units" />
            {productStockPie.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={productStockPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {productStockPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {productStockPie.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-neutral-600)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{item.value.toLocaleString()} units</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No inventory data</div>}
          </div>
        </div>

        {/* ── Top Products + Vendor Pie ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Top Selling Products" sub="By revenue, year to date" />
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip content={<CustomTooltip prefix="Rs. " />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#0f0f0f" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No sales data yet</div>}
          </div>

          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Revenue by Vendor" sub="Top vendors year to date" />
            {vendorPie.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={vendorPie} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
                      {vendorPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip prefix="Rs. " />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {vendorPie.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-neutral-600)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>Rs. {item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No vendor data</div>}
          </div>
        </div>

        {/* ── Low Stock Alerts ───────────────────────────────────────────────── */}
        {lowStockItems.length > 0 && (
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertTriangle size={16} color="#d97706" />
              <SectionTitle title="Low Stock Alerts" sub={`${lowStockItems.length} product${lowStockItems.length > 1 ? 's' : ''} running low (≤ 50 units)`} />
            </div>
            <table className="w-full" style={{ textAlign: 'left' }}>
              <thead><tr>
                <th className="bw-table-header">Product</th><th className="bw-table-header">Vendor</th>
                <th className="bw-table-header">Type</th><th className="bw-table-header">Units Left</th>
                <th className="bw-table-header">Shown As</th><th className="bw-table-header">Selling / Unit</th>
              </tr></thead>
              <tbody>
                {lowStockItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td className="bw-table-cell font-medium">{item.productName}</td>
                    <td className="bw-table-cell text-neutral-500">{item.vendorName}</td>
                    <td className="bw-table-cell">
                      <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: item.type === 'Bag' ? '#e0f2fe' : '#fef9c3', color: item.type === 'Bag' ? '#0369a1' : '#854d0e' }}>{item.type}</span>
                    </td>
                    <td className="bw-table-cell"><span style={{ fontWeight: 700, color: item.totalUnits <= 10 ? '#dc2626' : '#d97706' }}>{item.totalUnits}</span></td>
                    <td className="bw-table-cell text-neutral-500">{item.shownAs || '—'}</td>
                    <td className="bw-table-cell font-medium">Rs. {Math.floor(item.sellingPricePerUnit)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Recent Sales ───────────────────────────────────────────────────── */}
        <div className="bw-card" style={{ padding: '20px 24px' }}>
          <SectionTitle title="Recent Sales" sub="Last 10 counter sales" />
          <table className="w-full" style={{ textAlign: 'left' }}>
            <thead><tr>
              <th className="bw-table-header">#</th><th className="bw-table-header">Product</th>
              <th className="bw-table-header">Vendor</th><th className="bw-table-header">Inv. Type</th>
              <th className="bw-table-header">Qty</th><th className="bw-table-header">Total Units</th>
              <th className="bw-table-header">Revenue</th><th className="bw-table-header">Date & Time</th>
            </tr></thead>
            <tbody>
              {allSales.slice(0, 10).map((sale, idx) => (
                <tr key={sale._id || idx}>
                  <td className="bw-table-cell text-neutral-400 text-sm">{idx + 1}</td>
                  <td className="bw-table-cell font-medium">{sale.productName}</td>
                  <td className="bw-table-cell text-neutral-500">{sale.vendorName}</td>
                  <td className="bw-table-cell">
                    <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: sale.inventoryType === 'bulk' ? '#ede9fe' : '#fef3c7', color: sale.inventoryType === 'bulk' ? '#6d28d9' : '#92400e' }}>
                      {sale.inventoryType || '—'}
                    </span>
                  </td>
                  <td className="bw-table-cell">{sale.quantity}</td>
                  <td className="bw-table-cell text-neutral-500">{sale.Totalunits}</td>
                  <td className="bw-table-cell font-semibold text-green-600">Rs. {Math.floor(sale.TotalSellingPrice || 0).toLocaleString()}</td>
                  <td className="bw-table-cell text-neutral-400 text-sm">
                    {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(sale.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
              {allSales.length === 0 && <tr><td colSpan="8" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No sales recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── Calendar Month Picker Modal ────────────────────────────────────── */}
      {showCalModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowCalModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '320px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}>

            <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-black)', marginBottom: '18px' }}>Select Month — Profit</p>

            {/* Year navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button onClick={() => setCalYear((y) => y - 1)} className="action-btn"><ChevronLeft size={16} /></button>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{calYear}</span>
              <button onClick={() => setCalYear((y) => y + 1)} disabled={calYear >= today.getFullYear()} className="action-btn"
                style={{ opacity: calYear >= today.getFullYear() ? 0.3 : 1, cursor: calYear >= today.getFullYear() ? 'not-allowed' : 'pointer' }}>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 3×4 month grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {MONTHS_SHORT.map((name, m) => {
                const isFuture   = calYear > today.getFullYear() || (calYear === today.getFullYear() && m > today.getMonth());
                const isSelected = m === profitMonth && calYear === profitYear;
                const isCurrent  = m === today.getMonth() && calYear === today.getFullYear();
                return (
                  <button key={m} onClick={() => !isFuture && handleSelectMonth(m)} disabled={isFuture}
                    style={{
                      padding: '12px 8px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
                      border: isSelected ? '2px solid var(--color-black)' : isCurrent ? '2px solid var(--color-neutral-300)' : '2px solid transparent',
                      backgroundColor: isSelected ? 'var(--color-black)' : 'var(--color-neutral-50)',
                      color: isFuture ? 'var(--color-neutral-300)' : isSelected ? 'white' : 'var(--color-neutral-700)',
                      cursor: isFuture ? 'not-allowed' : 'pointer', transition: 'all 0.1s ease',
                    }}
                    onMouseEnter={(e) => { if (!isSelected && !isFuture) e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)'; }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <button onClick={() => setShowCalModal(false)} style={{ marginTop: '16px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)', backgroundColor: 'white', fontSize: '0.8rem', color: 'var(--color-neutral-500)', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}