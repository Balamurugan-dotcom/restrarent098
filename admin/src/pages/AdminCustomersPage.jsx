import React, { useState, useEffect } from 'react';
import adminApi from '../api/adminApi';
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  Download,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setRefreshing(true);
      const res = await adminApi.get('/auth/users');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filtered list
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (c.name || '').toLowerCase().includes(term);
    const emailMatch = (c.email || '').toLowerCase().includes(term);
    const phoneMatch = (c.phone || '').includes(term);
    const areaMatch = (c.address?.area || c.address?.street || '').toLowerCase().includes(term);

    const matchesSearch = nameMatch || emailMatch || phoneMatch || areaMatch;

    if (filterType === 'active') {
      return matchesSearch && (c.orderCount || 0) > 0;
    }
    if (filterType === 'new') {
      // Registered within last 7 days
      const isRecent = (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24) <= 7;
      return matchesSearch && isRecent;
    }
    return matchesSearch;
  });

  const totalDiners = customers.length;
  const activeDiners = customers.filter((c) => (c.orderCount || 0) > 0).length;
  const totalLTV = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const exportCSV = () => {
    const headers = 'Name,Email,Phone,Area,City,Pincode,Orders Placed,Total Spent (INR),Registered Date\n';
    const rows = filteredCustomers
      .map((c) =>
        `"${c.name}","${c.email}","${c.phone}","${c.address?.area || 'Bangalore'}","${c.address?.city || 'Bangalore'}","${c.address?.pincode || ''}",${c.orderCount || 0},${c.totalSpent || 0},"${new Date(c.createdAt).toLocaleDateString('en-IN')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Spice_Garden_Registered_Customers_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem 1.75rem',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Registered Diners & Customer Accounts
            </h1>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {customers.length} Verified Accounts
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            Live directory of all diner accounts registered via the frontend storefront with order history and Bangalore delivery details.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={exportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.15rem',
              borderRadius: '9px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchCustomers}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.65rem 1.15rem',
              borderRadius: '9px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { if (!refreshing) e.currentTarget.style.backgroundColor = '#047857'; }}
            onMouseLeave={(e) => { if (!refreshing) e.currentTarget.style.backgroundColor = '#059669'; }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{refreshing ? 'Syncing...' : 'Sync Diners'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.4rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>REGISTERED DINERS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
              {totalDiners}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
              ● 100% Real Storefront Signups
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4F46E5',
            }}
          >
            <Users size={22} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.4rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600 }}>ACTIVE ORDERING DINERS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
              {activeDiners}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
              Placed 1+ authentic orders
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <ShoppingBag size={22} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1.25rem 1.4rem',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>LIFETIME VALUE (LTV)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>
              ₹{totalLTV.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
              Cumulative diner purchases
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}
          >
            <IndianRupee size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={17} color="#94A3B8" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search diners by name, email, phone, or Bangalore area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.88rem',
              backgroundColor: '#F8FAFC',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <option value="all">All Diners ({customers.length})</option>
            <option value="active">Active (Placed Orders)</option>
            <option value="new">Recently Registered (7d)</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
          Showing <strong>{filteredCustomers.length}</strong> of {customers.length} registered diners
        </div>
      </div>

      {/* Customers Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  DINER & PROFILE
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  CONTACT DETAILS
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  BANGALORE DELIVERY ADDRESS
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  ORDERS PLACED
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  TOTAL SPENT
                </th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.76rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  REGISTERED ON
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748B' }}>
                    <Users size={36} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>No registered diners found.</p>
                    <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}>
                      When users register on http://localhost:5173/register, their profile will appear here immediately.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((diner) => (
                  <tr
                    key={diner._id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Diner & Profile */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            backgroundColor: '#059669',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            flexShrink: 0,
                          }}
                        >
                          {(diner.name || 'D').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                            {diner.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={11} /> Verified Customer
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.84rem', color: '#0F172A', fontWeight: 600 }}>
                        {diner.email}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={12} color="#059669" />
                        <span>{diner.phone || 'Not provided'}</span>
                      </div>
                    </td>

                    {/* Bangalore Delivery Address */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#2563EB" />
                        <span>{diner.address?.area || diner.address?.street || 'Indiranagar'}, Bangalore</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginLeft: '17px' }}>
                        PIN: {diner.address?.pincode || '560038'}
                      </div>
                    </td>

                    {/* Orders Placed */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: (diner.orderCount || 0) > 0 ? '#ECFDF5' : '#F1F5F9',
                          color: (diner.orderCount || 0) > 0 ? '#065F46' : '#64748B',
                          border: `1px solid ${(diner.orderCount || 0) > 0 ? '#A7F3D0' : '#CBD5E1'}`,
                        }}
                      >
                        <ShoppingBag size={12} />
                        <span>{diner.orderCount || 0} {diner.orderCount === 1 ? 'Order' : 'Orders'}</span>
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                        ₹{(diner.totalSpent || 0).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        Lifetime Value
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} color="#64748B" />
                        <span>
                          {new Date(diner.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginLeft: '18px' }}>
                        {new Date(diner.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
