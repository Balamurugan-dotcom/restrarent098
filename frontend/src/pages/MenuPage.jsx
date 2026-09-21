import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodCard from '../components/menu/FoodCard';
import FoodDetailsModal from '../components/menu/FoodDetailsModal';
import Loader from '../components/common/Loader';
import { Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Biryani', 'Chinese', 'Desserts', 'Beverages'];

const CATEGORY_EMOJIS = {
  All: '🍽️',
  Starters: '🔥',
  'Main Course': '🍛',
  Biryani: '🍚',
  Chinese: '🥢',
  Desserts: '🍮',
  Beverages: '☕',
};

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (search.trim()) params.search = search.trim();
        if (vegFilter === 'veg') params.isVeg = 'true';
        if (vegFilter === 'nonveg') params.isVeg = 'false';

        const res = await api.get('/api/foods', { params });
        if (res.data.success) {
          setFoods(res.data.data);
        }
      } catch (err) {
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFoods, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, search, vegFilter]);

  return (
    <div className="main-content">
      {/* Page Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A0A00 0%, #2D1108 50%, #1A0A00 100%)',
          padding: '3rem 0 4rem 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(230,81,0,0.2) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(255,152,0,0.1) 0%, transparent 55%)',
          }}
        />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <UtensilsCrossed size={15} />
            <span>Spice Garden Dining Menu</span>
          </div>
          <h1
            style={{
              color: '#ffffff',
              fontSize: '2.75rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}
          >
            Our Complete Kitchen Menu
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>
            60+ authentic Indian and Indo-Chinese delicacies crafted fresh to order.
            Search, filter by category or diet type.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 0' }}>
        {/* Search & Filter Toolbar */}
        <div className="filter-toolbar">
          <div className="search-input-wrap">
            <Search size={18} />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Search dishes (e.g. Biryani, Paneer, Butter...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search food items"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <SlidersHorizontal size={16} color="#64748B" />
            <button
              type="button"
              id="filter-all-btn"
              className={`diet-toggle-btn ${vegFilter === 'all' ? 'active' : ''}`}
              onClick={() => setVegFilter('all')}
              style={vegFilter === 'all' ? { background: '#F1F5F9', color: '#334155', borderColor: '#334155' } : {}}
            >
              All Items
            </button>
            <button
              type="button"
              id="filter-veg-btn"
              className={`diet-toggle-btn ${vegFilter === 'veg' ? 'active-veg' : ''}`}
              onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}
            >
              <span>🟢</span> Pure Veg
            </button>
            <button
              type="button"
              id="filter-nonveg-btn"
              className={`diet-toggle-btn ${vegFilter === 'nonveg' ? 'active-nonveg' : ''}`}
              onClick={() => setVegFilter(vegFilter === 'nonveg' ? 'all' : 'nonveg')}
            >
              <span>🔴</span> Non-Veg
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-filter-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`category-pill-${cat.toLowerCase().replace(' ', '-')}`}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{CATEGORY_EMOJIS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <div style={{ marginBottom: '1.5rem', color: '#64748B', fontSize: '0.9rem' }}>
            Showing <strong style={{ color: '#1E293B' }}>{foods.length}</strong> dishes
            {selectedCategory !== 'All' && (
              <span> in <strong style={{ color: '#E65100' }}>{selectedCategory}</strong></span>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#FEF2F2',
              borderRadius: '16px',
              color: '#B91C1C',
            }}
          >
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && <Loader message="Loading delicious menu items..." />}

        {/* Empty State */}
        {!loading && !error && foods.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <UtensilsCrossed size={52} color="#CBD5E1" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#475569' }}>No Dishes Found</h3>
            <p style={{ color: '#94A3B8' }}>Try adjusting your search or filter to find what you're craving.</p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setVegFilter('all');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Food Grid */}
        {!loading && !error && foods.length > 0 && (
          <div className="food-grid">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} onSelect={setSelectedFood} />
            ))}
          </div>
        )}
      </div>

      {/* Food Details Modal */}
      {selectedFood && (
        <FoodDetailsModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

export default MenuPage;
