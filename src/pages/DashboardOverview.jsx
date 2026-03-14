// // import { Header } from '@/components/Header';
// // import { Bus, Users, MapPin, Activity, AlertCircle, Clock } from 'lucide-react';
// // import { getBuses } from '../utils/api';
// // import { useEffect, useState } from 'react';

// // export default function DashboardOverview() {
// //   const stats = [
// //     { label: 'Total Buses', value: '24', icon: Bus, trend: '+2 this month' },
// //     { label: 'Active Drivers', value: '18', icon: Users, trend: '4 on leave' },
// //     { label: 'Total Routes', value: '12', icon: MapPin, trend: '3 high traffic' },
// //     { label: 'Fleet Health', value: '94%', icon: Activity, trend: 'Excellent' },
// //   ];

// //   const recentAlerts = [
// //     { id: 1, type: 'warning', message: 'Bus B-103 requires engine maintenance', time: '2 hours ago' },
// //     { id: 2, type: 'error', message: 'Driver Ali Khan license expiring in 5 days', time: '5 hours ago' },
// //     { id: 3, type: 'info', message: "Route 'Express North' stop updated", time: 'Yesterday' },
    
// //   ];

// //   const[totalbus,settotalbuse]=useState(0);

// //   const fetchBus = async () => {
// //     const response = await getBuses()
    
// //     settotalbuse(response.length)
// //   }

// //   useEffect(() => {
// //     fetchBus()
// //   }, [])
// //   return (
// //     <div className="full-height-page" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
// //       <Header title="System Overview" />

// //       <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-6">
// //           {stats.map((stat) => (
// //             <div key={stat.label} className="bw-card p-6 flex flex-col gap-2">
// //               <div className="flex items-center justify-between text-neutral-400">
// //                 <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
// //                 <stat.icon size={18} />
// //               </div>
// //               <div className="text-3xl font-bold">{stat.value}</div>
// //               <div className="text-xs text-neutral-500 flex items-center gap-1">
// //                 <Clock size={12} />
// //                 {stat.trend}
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="grid grid-cols-1 grid-cols-lg-3 gap-8">
// //           {/* Main Activity Area */}
// //           <div className="lg-col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
// //             <div className="bw-card p-6">
// //               <h3 className="text-lg font-bold mb-6">Recent Fleet Activity</h3>
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
// //                 {[1, 2, 3].map((i) => (
// //                   <div key={i} className="flex gap-4 items-start">
// //                     <div
// //                       style={{
// //                         width: '2.5rem',
// //                         height: '2.5rem',
// //                         borderRadius: '50%',
// //                         backgroundColor: 'var(--color-black)',
// //                         color: 'var(--color-white)',
// //                         display: 'flex',
// //                         alignItems: 'center',
// //                         justifyContent: 'center',
// //                         flexShrink: 0,
// //                       }}
// //                     >
// //                       <Bus size={18} />
// //                     </div>
// //                     <div className="flex-1 pb-6 border-b">
// //                       <div className="flex justify-between items-start mb-1">
// //                         <span className="font-bold text-sm">Bus B-101 started trip</span>
// //                         <span className="text-xs text-neutral-400 font-mono">10:45 AM</span>
// //                       </div>
// //                       <p className="text-xs text-neutral-500">
// //                         Departed from Station A on 'Main City Route'. Driver: John Doe.
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Sidebar Area */}
// //           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
// //             <div className="bw-card p-6">
// //               <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">
// //                 Critical Alerts
// //               </h3>
// //               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// //                 {recentAlerts.map((alert) => (
// //                   <div
// //                     key={alert.id}
// //                     className="flex gap-3 items-start p-3 rounded-lg"
// //                     style={{
// //                       backgroundColor: 'var(--color-neutral-50)',
// //                       border: '1px solid var(--color-neutral-100)',
// //                     }}
// //                   >
// //                     <AlertCircle
// //                       className={alert.type === 'error' ? 'text-red-500' : 'text-amber-600'}
// //                       size={16}
// //                     />
// //                     <div>
// //                       <p className="text-xs font-medium" style={{ lineHeight: 1.6 }}>
// //                         {alert.message}
// //                       </p>
// //                       <span className="text-xs text-neutral-400 mt-1" style={{ display: 'block' }}>
// //                         {alert.time}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               <button className="w-full mt-6 py-2 text-xs font-bold border rounded-md transition-all"
// //                 style={{ borderColor: 'var(--color-black)' }}
// //                 onMouseEnter={(e) => {
// //                   e.target.style.backgroundColor = 'var(--color-black)';
// //                   e.target.style.color = 'var(--color-white)';
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   e.target.style.backgroundColor = 'transparent';
// //                   e.target.style.color = 'var(--color-black)';
// //                 }}
// //               >
// //                 View All Alerts
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


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
//   const [activeView, setActiveView] = useState('month'); // month | year

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
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
//               <SectionTitle title="Monthly Performance" sub={`${today.getFullYear()} breakdown`} />
//               <div style={{ display: 'flex', gap: '6px' }}>
//                 {['revenue', 'transactions'].map((v) => (
//                   <button key={v} onClick={() => setActiveView(v)} style={{
//                     padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
//                     border: activeView === v ? '2px solid var(--color-black)' : '2px solid var(--color-neutral-200)',
//                     backgroundColor: activeView === v ? 'var(--color-black)' : 'white',
//                     color: activeView === v ? 'white' : 'var(--color-neutral-500)',
//                     cursor: 'pointer',
//                   }}>
//                     {v === 'revenue' ? 'Revenue' : 'Orders'}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={monthlySalesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={18}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                 <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
//                 <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
//                   tickFormatter={activeView === 'revenue' ? (v) => `${(v / 1000).toFixed(0)}k` : undefined} />
//                 <Tooltip content={<CustomTooltip prefix={activeView === 'revenue' ? 'Rs. ' : ''} />} />
//                 <Bar dataKey={activeView} name={activeView === 'revenue' ? 'Revenue' : 'Orders'}
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
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import {
  Package, ShoppingCart, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Layers, DollarSign
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#0f0f0f', '#3b3b3b', '#6b6b6b', '#9ca3af', '#d1d5db', '#e5e7eb'];

const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: '#0f0f0f', border: 'none', borderRadius: '8px',
      padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      <p style={{ color: '#9ca3af', fontSize: '0.72rem', marginBottom: '4px', fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700, margin: '2px 0' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, trend, trendUp }) => (
  <div className="bw-card" style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
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

// ── Section Header ────────────────────────────────────────────────────────────
const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: '16px' }}>
    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>{title}</h3>
    {sub && <p style={{ fontSize: '0.72rem', color: 'var(--color-neutral-400)', marginTop: '2px' }}>{sub}</p>}
  </div>
);

export default function DashboardOverview() {
  const today = new Date();
  const [inventories, setInventories] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const yearStart = `${today.getFullYear()}-01-01`;
        const todayStr = toLocalDateStr(today);

        const [invRes, salesRes] = await Promise.all([
          axios.get(`${API}/Inventories`),
          axios.get(`${API}/GetCounterSales?startDate=${yearStart}&endDate=${todayStr}`),
        ]);

        setInventories(invRes.data.inventories || []);
        setAllSales(salesRes.data.sales || salesRes.data.counterSales || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derived: Inventory stats ────────────────────────────────────────────────
  const totalProducts = inventories.length;
  const totalStockUnits = inventories.reduce((s, i) => s + (i.totalUnits || 0), 0);
  const lowStockItems = inventories.filter((i) => i.totalUnits <= 50);
  const totalInventoryValue = inventories.reduce((s, i) => s + (i.totalBuyingPrice || 0), 0);

  // ── Derived: Sales stats ────────────────────────────────────────────────────
  const totalRevenue = allSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);
  const totalSalesCount = allSales.length;
  const totalUnitsSold = allSales.reduce((s, sale) => s + (sale.Totalunits || 0), 0);

  // This month
  const thisMonthSales = allSales.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const thisMonthRevenue = thisMonthSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);

  // Last month
  const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const lastMonthSales = allSales.filter((s) => {
    const d = new Date(s.createdAt);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  const lastMonthRevenue = lastMonthSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);
  const revenueGrowth = lastMonthRevenue > 0
    ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
    : null;

  // ── Chart: Monthly sales (bar) ──────────────────────────────────────────────
  const monthlySalesData = MONTHS_SHORT.map((month, idx) => {
    const monthSales = allSales.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() === idx && d.getFullYear() === today.getFullYear();
    });
    return {
      month,
      revenue: Math.floor(monthSales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0)),
      transactions: monthSales.length,
    };
  });

  // ── Chart: Last 30 days daily sales (area) ─────────────────────────────────
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const ds = toLocalDateStr(d);
    const daySales = allSales.filter((s) => {
      const sd = new Date(s.createdAt);
      return toLocalDateStr(sd) === ds;
    });
    return {
      date: `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`,
      revenue: Math.floor(daySales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0)),
      sales: daySales.length,
    };
  });

  // ── Chart: Product stock pie ────────────────────────────────────────────────
  const productStockPie = inventories
    .sort((a, b) => (b.totalUnits || 0) - (a.totalUnits || 0))
    .slice(0, 6)
    .map((inv) => ({
      name: inv.productName?.length > 16 ? inv.productName.slice(0, 14) + '…' : inv.productName,
      value: inv.totalUnits || 0,
    }));

  // ── Chart: Top selling products (bar) ─────────────────────────────────────
  const productSalesMap = {};
  allSales.forEach((s) => {
    if (!productSalesMap[s.productName]) productSalesMap[s.productName] = { units: 0, revenue: 0 };
    productSalesMap[s.productName].units += s.Totalunits || 0;
    productSalesMap[s.productName].revenue += s.TotalSellingPrice || 0;
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, v]) => ({ name: name.length > 14 ? name.slice(0, 12) + '…' : name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 7);

  // ── Chart: Sales by vendor ─────────────────────────────────────────────────
  const vendorMap = {};
  allSales.forEach((s) => {
    if (!vendorMap[s.vendorName]) vendorMap[s.vendorName] = 0;
    vendorMap[s.vendorName] += s.TotalSellingPrice || 0;
  });
  const vendorPie = Object.entries(vendorMap)
    .map(([name, value]) => ({ name: name.length > 16 ? name.slice(0, 14) + '…' : name, value: Math.floor(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // ── Today's quick stats ────────────────────────────────────────────────────
  const todayStr2 = toLocalDateStr(today);
  const todaySales = allSales.filter((s) => toLocalDateStr(new Date(s.createdAt)) === todayStr2);
  const todayRevenue = todaySales.reduce((s, sale) => s + (sale.TotalSellingPrice || 0), 0);

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
          <StatCard
            label="Total Revenue (YTD)"
            value={`Rs. ${Math.floor(totalRevenue).toLocaleString()}`}
            sub="year to date"
            icon={DollarSign}
            trend={revenueGrowth ? `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs last month` : 'First month'}
            trendUp={parseFloat(revenueGrowth) >= 0}
          />
          <StatCard
            label="This Month"
            value={`Rs. ${Math.floor(thisMonthRevenue).toLocaleString()}`}
            sub={`${thisMonthSales.length} transactions`}
            icon={TrendingUp}
            trend={`Today: Rs. ${Math.floor(todayRevenue).toLocaleString()}`}
            trendUp={todayRevenue > 0}
          />
          <StatCard
            label="Total Products"
            value={totalProducts}
            sub={`${totalStockUnits.toLocaleString()} units in stock`}
            icon={Package}
            trend={lowStockItems.length > 0 ? `${lowStockItems.length} low stock items` : 'Stock healthy'}
            trendUp={lowStockItems.length === 0}
          />
          <StatCard
            label="Total Sales (YTD)"
            value={totalSalesCount.toLocaleString()}
            sub={`${totalUnitsSold.toLocaleString()} units sold`}
            icon={ShoppingCart}
            trend={`Inventory value: Rs. ${Math.floor(totalInventoryValue).toLocaleString()}`}
            trendUp={true}
          />
        </div>

        {/* ── 30-Day Daily Revenue Area Chart ───────────────────────────────── */}
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
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="Rs. " />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0f0f0f" strokeWidth={2}
                fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#0f0f0f' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Monthly Bar + Product Pie ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>

          {/* Monthly Revenue Bar */}
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <SectionTitle title="Monthly Performance" sub={`${today.getFullYear()} — revenue breakdown`} />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySalesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="Rs. " />} />
                <Bar dataKey="revenue" name="Revenue"
                  fill="#0f0f0f" radius={[4, 4, 0, 0]}
                  label={false}
                >
                  {monthlySalesData.map((entry, index) => (
                    <Cell key={index}
                      fill={index === today.getMonth() ? '#0f0f0f' : '#e5e7eb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Distribution Pie */}
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Stock Distribution" sub="Top products by units" />
            {productStockPie.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={productStockPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                      paddingAngle={3} dataKey="value">
                      {productStockPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
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
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-black)' }}>
                        {item.value.toLocaleString()} units
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No inventory data</div>
            )}
          </div>
        </div>

        {/* ── Top Products Bar + Vendor Pie ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>

          {/* Top Selling Products */}
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Top Selling Products" sub="By revenue, year to date" />
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip content={<CustomTooltip prefix="Rs. " />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#0f0f0f" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No sales data yet</div>
            )}
          </div>

          {/* Sales by Vendor */}
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <SectionTitle title="Revenue by Vendor" sub="Top vendors year to date" />
            {vendorPie.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={vendorPie} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
                      {vendorPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
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
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-black)' }}>
                        Rs. {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>No vendor data</div>
            )}
          </div>
        </div>

        {/* ── Low Stock Alert Table ──────────────────────────────────────────── */}
        {lowStockItems.length > 0 && (
          <div className="bw-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertTriangle size={16} color="#d97706" />
              <SectionTitle title="Low Stock Alerts" sub={`${lowStockItems.length} product${lowStockItems.length > 1 ? 's' : ''} running low (≤ 50 units)`} />
            </div>
            <table className="w-full" style={{ textAlign: 'left' }}>
              <thead>
                <tr>
                  <th className="bw-table-header">Product</th>
                  <th className="bw-table-header">Vendor</th>
                  <th className="bw-table-header">Type</th>
                  <th className="bw-table-header">Units Left</th>
                  <th className="bw-table-header">Shown As</th>
                  <th className="bw-table-header">Selling / Unit</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td className="bw-table-cell font-medium">{item.productName}</td>
                    <td className="bw-table-cell text-neutral-500">{item.vendorName}</td>
                    <td className="bw-table-cell">
                      <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, backgroundColor: item.type === 'Bag' ? '#e0f2fe' : '#fef9c3', color: item.type === 'Bag' ? '#0369a1' : '#854d0e' }}>
                        {item.type}
                      </span>
                    </td>
                    <td className="bw-table-cell">
                      <span style={{ fontWeight: 700, color: item.totalUnits <= 10 ? '#dc2626' : '#d97706' }}>
                        {item.totalUnits}
                      </span>
                    </td>
                    <td className="bw-table-cell text-neutral-500">{item.shownAs || '—'}</td>
                    <td className="bw-table-cell font-medium">Rs. {Math.floor(item.sellingPricePerUnit)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Recent Sales Table ─────────────────────────────────────────────── */}
        <div className="bw-card" style={{ padding: '20px 24px' }}>
          <SectionTitle title="Recent Sales" sub="Last 10 counter sales" />
          <table className="w-full" style={{ textAlign: 'left' }}>
            <thead>
              <tr>
                <th className="bw-table-header">#</th>
                <th className="bw-table-header">Product</th>
                <th className="bw-table-header">Vendor</th>
                <th className="bw-table-header">Inv. Type</th>
                <th className="bw-table-header">Qty</th>
                <th className="bw-table-header">Total Units</th>
                <th className="bw-table-header">Revenue</th>
                <th className="bw-table-header">Date & Time</th>
              </tr>
            </thead>
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
                  <td className="bw-table-cell font-semibold text-green-600">
                    Rs. {Math.floor(sale.TotalSellingPrice || 0).toLocaleString()}
                  </td>
                  <td className="bw-table-cell text-neutral-400 text-sm">
                    {sale.createdAt
                      ? new Date(sale.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
                        new Date(sale.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                </tr>
              ))}
              {allSales.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-neutral-400)', fontSize: '0.8rem' }}>
                    No sales recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}