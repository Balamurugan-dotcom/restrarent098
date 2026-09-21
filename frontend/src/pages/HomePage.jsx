import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import FoodCard from '../components/menu/FoodCard';
import FoodDetailsModal from '../components/menu/FoodDetailsModal';
import Loader from '../components/common/Loader';
import {
  ArrowRight,
  Flame,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Bike,
  Sparkles,
  Utensils,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/foods/hyderabadi-dum-chicken-biryani.jpg',
    title: 'Hyderabadi Dum Biryani',
    tag: 'Signature Biryani',
    price: '₹340',
  },
  {
    id: 2,
    image: '/images/foods/chicken-ghee-roast.jpg',
    title: 'Chicken Ghee Roast',
    tag: 'Coastal Legend',
    price: '₹340',
  },
  {
    id: 3,
    image: '/images/foods/old-delhi-butter-chicken.jpg',
    title: 'Old Delhi Butter Chicken',
    tag: 'Chef Special',
    price: '₹360',
  },
  {
    id: 4,
    image: '/images/foods/bangalore-mutton-sukka-curry.jpg',
    title: 'Bangalore Mutton Sukka',
    tag: 'Local Favorite',
    price: '₹420',
  },
  {
    id: 5,
    image: '/images/foods/paneer-tikka-angara.jpg',
    title: 'Paneer Tikka Angara',
    tag: 'Clay Oven Specialty',
    price: '₹260',
  },
];

const DEFAULT_REVIEWS = [
  {
    _id: 'def-rev-1',
    customerName: 'Priya Sundaram',
    location: 'Indiranagar 100ft Road',
    rating: 5,
    comment:
      'The Hyderabadi Dum Biryani was sensational! Ultra tender meat, aromatic aged basmati rice, and zero greasy aftertaste. Delivered piping hot in 24 minutes in heavy-duty thermal packing.',
    dishesLoved: ['Hyderabadi Dum Chicken Biryani', 'Kesari Rasmalai'],
  },
  {
    _id: 'def-rev-2',
    customerName: 'Arjun Nambiar',
    location: 'Koramangala 4th Block',
    rating: 5,
    comment:
      'Hands down the best Chicken Ghee Roast in Bangalore. The Byadgi chilli paste and pure ghee glaze reminded me of traditional coastal home feasts. Absolute 10/10 perfection!',
    dishesLoved: ['Chicken Ghee Roast', 'Amritsari Kulcha with Chole'],
  },
  {
    _id: 'def-rev-3',
    customerName: 'Meera Kulkarni',
    location: 'HSR Layout Sector 2',
    rating: 5,
    comment:
      'Ordered Bangalore Mutton Sukka Curry and Dal Makhani for an anniversary family dinner. Melt-in-mouth lamb chunks and rich royal flavours that everyone praised wholeheartedly.',
    dishesLoved: ['Bangalore Mutton Sukka Curry', 'Gulab Jamun with Shahi Rabdi'],
  },
];

const HomePage = () => {
  const [allSignatureFoods, setAllSignatureFoods] = useState([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide interval (4 seconds, pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [foodsRes, reviewsRes] = await Promise.all([
          api.get('/api/foods'),
          api.get('/api/reviews'),
        ]);

        let items = [];
        if (foodsRes.data?.success && Array.isArray(foodsRes.data.data)) {
          items = foodsRes.data.data;
        }

        setAllSignatureFoods(items);
        if (reviewsRes.data?.success && Array.isArray(reviewsRes.data.data) && reviewsRes.data.data.length > 0) {
          setReviews(reviewsRes.data.data.slice(0, 3));
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      } catch (err) {
        console.error('Failed to load home page data:', err.message);
        setReviews(DEFAULT_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const signatureCategories = [
    { id: 'All', label: 'All Bestsellers', icon: '🔥' },
    { id: 'Biryani', label: 'Biryani & Rice', icon: '🍚' },
    { id: 'Starters', label: 'Starters & Tandoor', icon: '🍗' },
    { id: 'Main Course', label: 'Royal Curries', icon: '🥘' },
    { id: 'Chinese', label: 'Indo-Chinese', icon: '🥢' },
    { id: 'Desserts', label: 'Desserts & Sweets', icon: '🍨' },
  ];

  const displayedDishes = useMemo(() => {
    if (!allSignatureFoods || allSignatureFoods.length === 0) return [];

    if (selectedCategoryTab === 'All') {
      // Prioritize popular items, ensuring balanced representation across key categories
      const populars = allSignatureFoods.filter((f) => f.isPopular);

      // Curate 12 premier dishes: 3 Biryanis, 3 Starters, 3 Main Course Curries, 2 Chinese, 1 Dessert
      const pickFromCat = (catName, limit) => {
        const fromPop = populars.filter((f) => f.category === catName);
        if (fromPop.length >= limit) return fromPop.slice(0, limit);
        const fromAll = allSignatureFoods.filter((f) => f.category === catName);
        return [...fromPop, ...fromAll.filter((f) => !fromPop.some((p) => p._id === f._id))].slice(0, limit);
      };

      const topBiryani = pickFromCat('Biryani', 3);
      const topStarters = pickFromCat('Starters', 3);
      const topCurries = pickFromCat('Main Course', 3);
      const topChinese = pickFromCat('Chinese', 2);
      const topDessert = pickFromCat('Desserts', 1);

      const combined = [...topBiryani, ...topStarters, ...topCurries, ...topChinese, ...topDessert];

      // Fill up to 12 if any category had fewer items
      if (combined.length < 12) {
        const ids = new Set(combined.map((f) => f._id));
        const pool = populars.length > 0 ? populars : allSignatureFoods;
        for (const item of pool) {
          if (!ids.has(item._id) && item.category !== 'Beverages') {
            combined.push(item);
            ids.add(item._id);
            if (combined.length >= 12) break;
          }
        }
      }

      return combined.slice(0, 12);
    } else {
      // Filter by the selected category tab - show up to 12 dishes
      const catFoods = allSignatureFoods.filter((f) => f.category === selectedCategoryTab);
      // Place popular dishes first
      const sorted = [...catFoods].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
      return sorted.slice(0, 12);
    }
  }, [allSignatureFoods, selectedCategoryTab]);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <Sparkles size={16} />
              <span>Bangalore's Finest Indian Kitchen • Indiranagar</span>
            </div>

            <h1 className="hero-title">
              Authentic Indian Flavors, <br />
              <span className="serif-accent">Slow-Cooked</span> to Perfection.
            </h1>

            <p className="hero-desc">
              From aromatic Hyderabadi Dum Biryanis and sizzling Mangalorean Ghee Roasts to slow-simmered rich curries,
              experience traditional royal recipes prepared with pure desi ghee and delivered express to your doorstep.
            </p>

            <div className="hero-cta-group">
              <Link to="/menu" className="btn btn-primary btn-lg" id="home-order-now-btn">
                <span>Explore Full Menu</span>
                <ArrowRight size={20} />
              </Link>
              <a href="#location-hours" className="btn btn-secondary btn-lg">
                <MapPin size={18} color="#E65100" />
                <span>Visit Bangalore Outlet</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="num">60+</div>
                <div className="label">Handcrafted Dishes</div>
              </div>
              <div className="hero-stat-item">
                <div className="num">10 km</div>
                <div className="label">Express Delivery Radius</div>
              </div>
              <div className="hero-stat-item">
                <div className="num">4.9 ★</div>
                <div className="label">Customer Rating</div>
              </div>
            </div>
          </div>

          <div
            className="hero-visual"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="hero-slider-container">
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`hero-slide-item ${index === currentSlide ? 'active' : ''}`}
                >
                  <img src={slide.image} alt={slide.title} />
                  <div className="hero-slide-gradient" />
                </div>
              ))}

              {/* Floating Dynamic Dish Tag */}
              <div className="hero-dish-tag">
                <div className="hero-dish-info">
                  <span className="hero-dish-category">{HERO_SLIDES[currentSlide].tag}</span>
                  <span className="hero-dish-name">{HERO_SLIDES[currentSlide].title}</span>
                </div>
                <div className="hero-dish-price">{HERO_SLIDES[currentSlide].price}</div>
              </div>

              {/* Slider Navigation Arrows */}
              <button
                type="button"
                className="hero-slider-nav-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                }}
                aria-label="Previous Dish"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="hero-slider-nav-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                }}
                aria-label="Next Dish"
              >
                <ChevronRight size={20} />
              </button>

              {/* Slide Dots Indicator */}
              <div className="hero-slider-dots">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`hero-slider-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="hero-floating-card">
              <div className="hero-floating-badge">
                <Bike size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E293B' }}>
                  Express Delivery
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  35–45 mins across Bangalore
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BANGALORE DELIVERY PROMISE BANNER */}
      <section style={{ background: '#FAFAF8', padding: '0.25rem 0 1rem 0', borderBottom: '1px solid #F1F5F9' }}>
        <div className="container">
          <div className="delivery-notice-banner" style={{ margin: 0 }}>
            <div className="icon-box">
              <Bike size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="title">Bangalore Express Dining & Home Delivery Zone</div>
              <div className="subtitle">
                Our kitchen is located at 100 Feet Road, Indiranagar. We deliver fresh, piping hot food within an
                approximate <strong>10 km radius</strong> across Indiranagar, Koramangala, Domlur, HAL, MG Road,
                Ulsoor, and surrounding areas.
              </div>
            </div>
            <Link to="/menu" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Order Food Now
            </Link>
          </div>
        </div>
      </section>

      {/* 3. RESTAURANT INTRODUCTION & CULINARY HERITAGE */}
      <section style={{ padding: '2.5rem 0 2rem 0' }}>
        <div className="container">
          <div className="about-heritage-grid">
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80"
                alt="Spice Garden Restaurant Ambience Bangalore"
                style={{ borderRadius: '24px', boxShadow: 'var(--shadow-md)', width: '100%', height: '380px', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '20px',
                  background: '#14171A',
                  color: '#ffffff',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div style={{ color: '#FFB300', fontWeight: 800, fontSize: '1.5rem' }}>100% Desi Ghee</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>& Authentic Whole Spices</div>
              </div>
            </div>

            <div>
              <div className="section-tag">About Spice Garden</div>
              <h2 className="section-title">Bringing Royal Indian Culinary Heritage to Bangalore</h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Founded with a deep passion for regional Indian culinary traditions, <strong>Spice Garden</strong> blends
                time-honored techniques like slow charcoal dum cooking, tandoor roasting, and stone-ground spice
                masalas to create unforgettable flavors.
              </p>
              <div className="about-features-grid">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Award size={22} color="#E65100" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Master Chefs</h4>
                    <p style={{ fontSize: '0.82rem' }}>20+ years of royal culinary mastery</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Utensils size={22} color="#E65100" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Hygienic Packaging</h4>
                    <p style={{ fontSize: '0.82rem' }}>Tamper-evident, heat-sealed containers</p>
                  </div>
                </div>
              </div>
              <Link to="/menu" className="btn btn-outline-primary">
                Explore Our Specialities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR DISHES */}
      <section style={{ background: '#F8FAFC', padding: '2rem 0 3rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <div className="section-tag">
              <Flame size={15} />
              <span>Chef's Signature Selections</span>
            </div>
            <h2 className="section-title">Most Loved Dishes in Bangalore</h2>
            <p className="section-subtitle">
              Handpicked customer favorites slow-cooked with pure desi ghee and delivered piping hot to your table.
            </p>
          </div>

          {/* Telemetry Highlights Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '0.85rem 1.25rem',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <span style={{ color: '#E65100', fontSize: '1rem' }}>👑</span>
              <span>Royal Authentic Recipes</span>
            </div>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <span style={{ color: '#E65100', fontSize: '1rem' }}>🔥</span>
              <span>100% Pure Desi Ghee & Charcoal Smoked</span>
            </div>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <span style={{ color: '#059669', fontSize: '1rem' }}>⚡</span>
              <span>30-Min Fast Express Delivery</span>
            </div>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
              <span style={{ color: '#F59E0B', fontSize: '1rem' }}>⭐</span>
              <span>4.9★ Bangalore's Highest Rated</span>
            </div>
          </div>

          {/* Interactive Category Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.6rem',
              marginBottom: '2.5rem',
            }}
          >
            {signatureCategories.map((tab) => {
              const isActive = selectedCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategoryTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: isActive ? '1px solid #E65100' : '1px solid #E2E8F0',
                    background: isActive
                      ? 'linear-gradient(135deg, #E65100, #F97316)'
                      : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    boxShadow: isActive
                      ? '0 4px 14px rgba(230, 81, 0, 0.3)'
                      : '0 1px 3px rgba(0,0,0,0.02)',
                    transform: isActive ? 'translateY(-1px)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dishes Grid */}
          {loading ? (
            <Loader message="Fetching signature dishes..." />
          ) : displayedDishes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px dashed #CBD5E1',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              <Flame size={42} color="#E65100" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
                No Signature Dishes in this Category
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.25rem' }}>
                Browse our full authentic menu or switch to another signature category.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategoryTab('All')}
                className="btn btn-outline-primary btn-sm"
              >
                Show All Bestsellers
              </button>
            </div>
          ) : (
            <div className="food-grid-signature">
              {displayedDishes.map((food) => (
                <FoodCard key={food._id} food={food} onSelect={setSelectedFood} />
              ))}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
              Showing {displayedDishes.length} signature picks from our 60+ authentic Bangalore dishes
            </p>
            <Link
              to="/menu"
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2.25rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(230, 81, 0, 0.28)',
              }}
            >
              <span>Explore Full 60+ Items Menu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* BANGALORE CULINARY PROOF & TRUST METRICS BAR (BRIDGES SECTION 4 & 5) */}
      <div
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '2.25rem 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                background: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #EEF2F6',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}
              >
                ⭐
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  4.9 / 5.0 Rating
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  2,800+ Verified Bangalore Diners
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                background: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #EEF2F6',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  28 Mins Express
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  Indiranagar, Koramangala & HSR
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                background: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #EEF2F6',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#FFEDD5',
                  color: '#EA580C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}
              >
                🥘
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  100% Pure Desi Ghee
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  Slow-Dum Charcoal Cooking
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                background: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #EEF2F6',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#E0E7FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}
              >
                🛡️
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  FSSAI Gold Certified
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  Daily Hygiene & Temp Audits
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CUSTOMER REVIEWS SHOWCASE */}
      <section style={{ padding: '3.5rem 0 4rem 0', background: '#FAFAFA' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="section-tag">
              <Star size={15} />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="section-title">What Bangalore Foodies Say</h2>
            <p className="section-subtitle">
              Verified reviews from food lovers across Indiranagar, Koramangala, HSR Layout, and beyond.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="review-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="star-rating" style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        fill={i < rev.rating ? '#F59E0B' : 'none'}
                        color={i < rev.rating ? '#F59E0B' : '#CBD5E1'}
                      />
                    ))}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E', marginLeft: '4px' }}>
                      5.0
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#16A34A',
                      fontWeight: 700,
                      background: '#DCFCE7',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                    }}
                  >
                    ✓ Verified Diner
                  </span>
                </div>

                <p style={{ color: '#334155', fontSize: '0.94rem', lineHeight: '1.65', fontStyle: 'italic', margin: 0 }}>
                  "{rev.comment}"
                </p>

                {rev.dishesLoved && rev.dishesLoved.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                    {rev.dishesLoved.map((dish, dIdx) => (
                      <span
                        key={dIdx}
                        style={{
                          fontSize: '0.75rem',
                          background: '#FFF7ED',
                          color: '#C2410C',
                          border: '1px solid #FED7AA',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        ✨ Loved: {dish}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className="review-author"
                  style={{
                    marginTop: 'auto',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    className="review-author-avatar"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E65100, #F97316)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    {rev.customerName ? rev.customerName.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      {rev.customerName}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>
                      {rev.location || 'Bangalore Foodie • Verified Order'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              to="/reviews"
              className="btn btn-secondary"
              style={{
                borderRadius: '10px',
                padding: '0.75rem 1.75rem',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              Read More Reviews or Submit Yours
            </Link>
          </div>
        </div>
      </section>

      {/* 6. OPENING HOURS & BANGALORE LOCATION SECTION */}
      <section
        id="location-hours"
        className="section-padding"
        style={{
          background: 'linear-gradient(145deg, #1c0e07 0%, #2c160b 45%, #180c06 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 179, 0, 0.15)',
          borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
        }}
      >
        {/* Subtle warm ambient spice glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(230, 81, 0, 0.12) 0%, rgba(255, 152, 0, 0.03) 60%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="location-hours-grid">
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 152, 0, 0.12)',
                  border: '1px solid rgba(255, 179, 0, 0.3)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '50px',
                  color: '#FDBA74',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                <MapPin size={14} color="#FB923C" />
                <span>Find Us in Indiranagar</span>
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#FFFBF5', margin: '0.5rem 0 1.25rem 0', fontWeight: 800 }}>
                Spice Garden Restaurant & Delivery Hub
              </h2>
              <p style={{ color: '#E2D9D2', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                Whether you prefer to dine in or enjoy restaurant-style delicacies in the comfort of your living room,
                we are ready to serve you with warm Indian hospitality.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.1rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #E65100, #F59E0B)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(230, 81, 0, 0.3)',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ color: '#FFFBF5', fontSize: '1.05rem', marginBottom: '3px', fontWeight: 700 }}>Address</h4>
                    <p style={{ color: '#E2E8F0', fontSize: '0.92rem', lineHeight: '1.5' }}>
                      #42, 100 Feet Road, 12th Main, Indiranagar, Bangalore, Karnataka - 560038
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.1rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #E65100, #F59E0B)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(230, 81, 0, 0.3)',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 style={{ color: '#FFFBF5', fontSize: '1.05rem', marginBottom: '3px', fontWeight: 700 }}>Kitchen Hours</h4>
                    <p style={{ color: '#E2E8F0', fontSize: '0.92rem' }}>
                      Monday – Sunday: 11:00 AM – 11:30 PM (All 7 Days)
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <Link
                  to="/menu"
                  className="btn btn-primary btn-lg"
                  style={{
                    boxShadow: '0 6px 20px rgba(230, 81, 0, 0.4)',
                    padding: '0.95rem 2rem',
                    fontSize: '1.05rem',
                  }}
                >
                  Order Online for Instant Delivery
                </Link>
              </div>
            </div>

            {/* Visual Location Card */}
            <div
              style={{
                background: 'linear-gradient(160deg, rgba(56, 29, 17, 0.8) 0%, rgba(31, 15, 8, 0.95) 100%)',
                borderRadius: '24px',
                padding: '2.25rem',
                border: '1px solid rgba(255, 179, 0, 0.22)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 179, 0, 0.15)',
                    border: '1px solid rgba(255, 179, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB300',
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h3 style={{ color: '#FFFBF5', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                    Delivery Radius Guidelines
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#FDBA74' }}>Bangalore Fast Dispatch</span>
                </div>
              </div>

              <p style={{ color: '#E2D9D2', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.75rem' }}>
                We strictly prepare each order fresh. To ensure freshness and optimal temperature, delivery is
                restricted to approximately <strong style={{ color: '#FFFBF5' }}>10 km</strong> from our Indiranagar outlet.
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.92rem',
                  color: '#F1F5F9',
                  padding: 0,
                  margin: 0,
                }}
              >
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ADE80',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span>Free delivery on orders ₹500 and above</span>
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ADE80',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span>₹40 delivery fee for orders below ₹500</span>
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ADE80',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span>Minimum order value: ₹200</span>
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ADE80',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span>Cash on Delivery & Instant Online Payment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Food Dish Modal */}
      {selectedFood && (
        <FoodDetailsModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

export default HomePage;
