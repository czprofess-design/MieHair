This file contains a complete bundle of the project's source code. Each file is clearly demarcated for easy parsing by developers and AI tools.

--- START OF FILE index.html ---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gradient Product Showcase</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            keyframes: {
              fadeIn: {
                '0%': { opacity: 0, transform: 'scale(0.95)' },
                '100%': { opacity: 1, transform: 'scale(1)' },
              },
              fadeInUp: {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
              fadeInDown: {
                '0%': { opacity: 0, transform: 'translateY(-20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
              numberFlip: {
                '0%': { opacity: 0, transform: 'translateY(0.5em)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
              jiggle: {
                '0%, 100%': { transform: 'scale(1) rotate(0)' },
                '25%': { transform: 'scale(1.1) rotate(-3deg)' },
                '75%': { transform: 'scale(1.1) rotate(3deg)' },
              },
              spinner: {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
              'background-pan': {
                '0%': { 'background-position': '0% 50%' },
                '50%': { 'background-position': '100% 50%' },
                '100%': { 'background-position': '0% 50%' },
              },
              'price-show': {
                '0%': { opacity: 0, transform: 'translateY(10px) scale(0.9)' },
                '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
              'price-hide-slash': {
                '0%': { transform: 'scaleX(0)' },
                '100%': { transform: 'scaleX(1)' },
              },
              'card-swoop': {
                '0%': { transform: 'translate(100px, -100px) rotate(45deg)', opacity: 0 },
                '50%': { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
                '100%': { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
              },
              'shine': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
              'breathingGlow': {
                '0%, 100%': { 'box-shadow': '0 0 15px 5px rgba(56, 189, 248, 0.2)' },
                '50%': { 'box-shadow': '0 0 30px 10px rgba(56, 189, 248, 0.4)' },
              },
              'icon-swoop-in': {
                '0%': { opacity: 0, transform: 'scale(0.5) rotate(-90deg)' },
                '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
              },
            },
            animation: {
              fadeIn: 'fadeIn 0.3s ease-out',
              fadeInUp: 'fadeInUp 0.5s ease-out forwards',
              fadeInDown: 'fadeInDown 0.5s ease-out',
              numberFlip: 'numberFlip 0.3s ease-out forwards',
              jiggle: 'jiggle 0.4s ease-in-out',
              spinner: 'spinner 1.2s linear infinite',
              'background-pan': 'background-pan 15s ease infinite',
              'background-pan-button': 'background-pan 4s ease infinite',
              'price-show': 'price-show 0.5s ease-out 0.8s forwards',
              'price-hide-slash': 'price-hide-slash 0.5s ease-out 0.4s forwards',
              'card-swoop': 'card-swoop 1s ease-out forwards',
              'shine': 'shine 1s ease-in-out',
              'breathingGlow': 'breathingGlow 5s ease-in-out infinite',
              'icon-swoop-in': 'icon-swoop-in 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
            },
          },
        },
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "@supabase/supabase-js": "https://aistudiocdn.com/@supabase/supabase-js@^2.75.0"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
--- END OF FILE index.html ---

--- START OF FILE index.tsx ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
--- END OF FILE index.tsx ---

--- START OF FILE metadata.json ---
{
  "name": "Copy of AIS0002 - Web Aura Tech",
  "description": "An attractive product showcase application with smooth effects, gradient colors, light/dark themes, and a complete shopping cart and checkout experience.",
  "requestFramePermissions": []
}
--- END OF FILE metadata.json ---

--- START OF FILE App.tsx ---
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import ValuePropositionBanner from './components/ValuePropositionBanner';
import ScrollToTopButton from './components/ScrollToTopButton';
import { SpinnerIcon } from './components/Icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SERVICES } from './constants';
import { translations } from './translations';
import type { Service, CartItem, PricingTier } from './types';

const ITEMS_PER_PAGE = 25; // 5 rows * 5 products

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-20" aria-label="Loading products">
    <SpinnerIcon className="text-sky-500 animate-spinner" size={48} />
  </div>
);

export default function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [language, setLanguage] = useLocalStorage<keyof typeof translations>('language', 'en');
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { categories, maxPrice } = useMemo(() => {
    const uniqueCategories = ['all', ...Array.from(new Set(SERVICES.map(p => p.category)))];
    const maxPriceValue = Math.ceil(Math.max(...SERVICES.flatMap(s => s.tiers.map(t => t.price))));
    return { categories: uniqueCategories, maxPrice: maxPriceValue };
  }, []);

  const [currentMaxPrice, setCurrentMaxPrice] = useState(maxPrice);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      setCurrentMaxPrice(maxPrice);
  }, [maxPrice]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Log user visit on initial load with a client-side IP fallback
  useEffect(() => {
    const logVisit = async () => {
      try {
        // 1. Fetch the client's public IP as a fallback data point.
        let clientIp: string | null = null;
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            clientIp = ipData.ip;
          }
        } catch (ipError) {
          console.warn('Could not fetch client IP for logging fallback:', ipError);
        }

        // 2. Send the request to our serverless function with a cache-busting parameter.
        // The unique timestamp forces Vercel to treat this as a new request every time.
        await fetch(`/api/log-visit?t=${Date.now()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Send the client-side IP in the body. It's ok if it's null.
          body: JSON.stringify({ clientIp }),
        });
      // FIX: The catch block was malformed and contained extraneous text.
      } catch (logError) {
        console.error('Failed to log visit:', logError);
      }
    };

    logVisit();
  }, []);

  const t = translations[language];

  const handleProductClick = useCallback((service: Service) => {
    setSelectedService(service);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedService(null);
  }, []);

  const handleAddToCart = useCallback((service: Service, tier: PricingTier) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.serviceId === service.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.serviceId === service.id ? { ...item, selectedTier: tier } : item
        );
      }
      return [...prevCart, { serviceId: service.id, name: service.name, imageUrl: service.imageUrl, selectedTier: tier }];
    });
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);
  }, [setCart]);

  const handleRemoveFromCart = useCallback((serviceId: number) => {
    setCart(prevCart => prevCart.filter(item => item.serviceId !== serviceId));
  }, [setCart]);
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  
  const handleFinishCheckout = () => {
    setIsCheckoutOpen(false);
    setCart([]);
  };

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentMaxPrice(maxPrice);
    setCurrentPage(1);
  }, [maxPrice]);

  // Derived state for filtering and pagination
  const filteredServices = useMemo(() => {
    return SERVICES
      .filter(service => {
        const searchTermLower = searchTerm.toLowerCase();
        return service.name.toLowerCase().includes(searchTermLower) ||
               service.description.toLowerCase().includes(searchTermLower) ||
               service.category.toLowerCase().includes(searchTermLower);
      })
      .filter(service => {
        return selectedCategory === 'all' || service.category === selectedCategory;
      })
      .filter(service => {
        return service.tiers.some(tier => tier.price <= currentMaxPrice);
      });
  }, [searchTerm, selectedCategory, currentMaxPrice]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);


  const cartItemCount = cart.length;
  const cartTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.selectedTier.price, 0);
  }, [cart]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans">
      <Header 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        isCartAnimating={isCartAnimating}
        t={t}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="container mx-auto px-4 pt-8">
        <Hero t={t} />
        <ValuePropositionBanner t={t} />

        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          currentMaxPrice={currentMaxPrice}
          setCurrentMaxPrice={setCurrentMaxPrice}
          maxPrice={maxPrice}
          onReset={handleResetFilters}
          t={t}
        />
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <ProductList products={paginatedServices} onProductClick={handleProductClick} t={t} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} t={t} />
            )}
          </>
        )}
      </main>
      
      <Footer t={t} />

      {selectedService && (
        <ProductModal
          product={selectedService}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          t={t}
        />
      )}

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        t={t}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onFinish={handleFinishCheckout}
        totalPrice={cartTotalPrice}
        t={t}
      />

      <ScrollToTopButton t={t} />
    </div>
  );
}
--- END OF FILE App.tsx ---

--- START OF FILE types.ts ---
export interface PricingTier {
  name: string;
  price: number;
  features: string[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  category: string;
  tiers: PricingTier[];
}

export interface CartItem {
  serviceId: number;
  name: string;
  imageUrl: string;
  selectedTier: PricingTier;
}

export type Translation = {
  // Header
  facebookAria: string;
  phoneAria: string;
  telegramAria: string;
  backToTopAria: string;
  scrollToTopAria: string;
  
  // ThemeToggle
  toggleThemeAria: string;

  // LanguageSwitcher
  language: string;

  // Header Cart
  openCartAria: string;
  
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  heroCardPass: string;
  heroCardTypicalCost: string;
  heroCardYourPrice: string;

  // Value Proposition
  vpCostTitle: string;
  vpCostDesc: string;
  vpConvenienceTitle: string;
  vpConvenienceDesc: string;
  vpVarietyTitle: string;
  vpVarietyDesc: string;

  // Filters
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  allCategories: string;
  reset: string;
  maxPriceLabel: string;

  // ProductList
  noProductsTitle: string;
  noProductsDesc: string;

  // ProductCard
  startsAt: string;
  perMonth: string;
  viewPlans: string;

  // ProductModal
  choosePlan: string;
  addToCart: string;
  close: string;

  // CartModal
  yourCart: string;
  cartEmpty: string;
  cartEmptyDesc: string;
  plan: string;
  monthlyTotal: string;
  checkout: string;
  removeAria: (name: string) => string;

  // CheckoutModal
  checkoutSavingsTitle: string;
  checkoutSavingsDesc: string;
  checkoutProcessingTitle: string;
  checkoutProcessingDesc: string;
  checkoutSuccessTitle: string;
  checkoutSuccessDesc: string;
  checkoutCompleteTitle: string;
  checkoutCompleteDesc: string;
  originalPrice: string;
  youPay: string;
  finishShopping: string;

  // Pagination
  previous: string;
  next: string;
  pageOf: (currentPage: number, totalPages: number) => string;

  // Footer
  copyright: (year: number) => string;
  contactUs: string;

  // TopBar
  yourSession: string;
  ipAddress: string;
  sessionTime: string;
  liveActivity: string;
  activeSubs: string;
  totalSavings: string;
};
--- END OF FILE types.ts ---

--- START OF FILE constants.ts ---
import type { Service } from './types';

export const SERVICES: Service[] = [
  // AI & Productivity
  {
    id: 1,
    name: 'ChatGPT Plus',
    category: 'AI/Productivity',
    description: 'Advanced AI assistant for creative and technical tasks.',
    fullDescription: 'Get priority access to new features, faster response times, and the power of GPT-4. Ideal for developers, writers, and researchers.',
    imageUrl: 'https://picsum.photos/seed/chatgpt/600/600',
    tiers: [
      { name: 'Plus', price: 20.00, features: ['Access to GPT-4', 'Faster response times', 'Priority access to new features', 'Advanced data analysis'] },
    ],
  },
  {
    id: 2,
    name: 'Midjourney',
    category: 'Creative Tools',
    description: 'Generate stunning images from text prompts.',
    fullDescription: 'A powerful AI image generator for artists, designers, and creators. Create unique visuals for any project with simple text commands.',
    imageUrl: 'https://picsum.photos/seed/midjourney/600/600',
    tiers: [
      { name: 'Basic Plan', price: 10.00, features: ['~200 generations/month', 'General commercial terms', 'Access to member gallery'] },
      { name: 'Standard Plan', price: 30.00, features: ['Unlimited Relax generations', '15 Fast hours/month', 'Stealth Mode option'] },
      { name: 'Pro Plan', price: 60.00, features: ['Unlimited Relax generations', '30 Fast hours/month', 'Stealth Mode included'] },
    ],
  },
  {
    id: 3,
    name: 'Notion AI',
    category: 'AI/Productivity',
    description: 'Your connected workspace with integrated AI.',
    fullDescription: 'Organize your life and work. Notion AI helps you write faster, brainstorm ideas, and summarize long documents directly in your workspace.',
    imageUrl: 'https://picsum.photos/seed/notion/600/600',
    tiers: [
      { name: 'AI Add-on', price: 10.00, features: ['Add to any paid plan', 'Unlimited AI responses', 'Summarize, rewrite, and brainstorm'] },
    ],
  },
  {
    id: 4,
    name: 'GitHub Copilot',
    category: 'Developer Tools',
    description: 'Your AI pair programmer.',
    fullDescription: 'Get code suggestions, complete functions, and write tests faster. Copilot helps you stay in the flow and spend less time on boilerplate code.',
    imageUrl: 'https://picsum.photos/seed/copilot/600/600',
    tiers: [
      { name: 'Individual', price: 10.00, features: ['IDE integration', 'Code completions', 'Chat in IDE'] },
      { name: 'Business', price: 19.00, features: ['All Individual features', 'Organization-wide policy management', 'Code referencing'] },
    ],
  },
  {
    id: 5,
    name: 'Grammarly',
    category: 'AI/Productivity',
    description: 'Write with confidence and clarity.',
    fullDescription: 'Go beyond basic grammar and spelling checks. Grammarly helps with tone, clarity, and conciseness to make your writing impactful.',
    imageUrl: 'https://picsum.photos/seed/grammarly/600/600',
    tiers: [
      { name: 'Premium', price: 12.00, features: ['Clarity-focused rewrites', 'Tone adjustments', 'Plagiarism detection'] },
      { name: 'Business', price: 15.00, features: ['All Premium features', 'Style guide', 'Team analytics'] },
    ],
  },
  
  // Video Streaming
  {
    id: 6,
    name: 'Netflix',
    category: 'Video Streaming',
    description: 'Unlimited movies, TV shows, and more.',
    fullDescription: 'Watch a massive library of content, from blockbuster movies and acclaimed TV series to award-winning originals.',
    imageUrl: 'https://picsum.photos/seed/netflix/600/600',
    tiers: [
      { name: 'Standard with Ads', price: 6.99, features: ['1080p (Full HD)', 'Watch on 2 supported devices at a time', 'Some ads'] },
      { name: 'Standard', price: 15.49, features: ['1080p (Full HD)', 'Ad-free', 'Download on 2 devices'] },
      { name: 'Premium', price: 22.99, features: ['4K (Ultra HD) + HDR', 'Spatial audio', 'Download on 6 devices'] },
    ],
  },
  {
    id: 7,
    name: 'Disney+',
    category: 'Video Streaming',
    description: 'The streaming home of Disney, Pixar, Marvel, Star Wars.',
    fullDescription: 'Enjoy the latest releases, classic films, and exclusive original content from the greatest storytellers in the world.',
    imageUrl: 'https://picsum.photos/seed/disneyplus/600/600',
    tiers: [
      { name: 'Basic (With Ads)', price: 7.99, features: ['Includes ads', 'Full content library'] },
      { name: 'Premium (No Ads)', price: 13.99, features: ['Ad-free experience', 'Downloads for offline viewing', '4K UHD and HDR'] },
    ],
  },
  {
    id: 8,
    name: 'Hulu',
    category: 'Video Streaming',
    description: 'Stream TV shows and movies On-Demand.',
    fullDescription: 'Get exclusive series, hit movies, and current episodes from popular TV shows. Add Live TV to watch your favorite sports and news.',
    imageUrl: 'https://picsum.photos/seed/hulu/600/600',
    tiers: [
      { name: 'With Ads', price: 7.99, features: ['Access to streaming library with ads'] },
      { name: 'No Ads', price: 17.99, features: ['Ad-free streaming library', 'Download & watch'] },
    ],
  },
  {
    id: 9,
    name: 'Max (HBO)',
    category: 'Video Streaming',
    description: 'The one to watch for iconic series, movies, and originals.',
    fullDescription: 'Stream all of HBO together with a collection of classic TV, blockbuster movies, and new Max Originals.',
    imageUrl: 'https://picsum.photos/seed/max/600/600',
    tiers: [
      { name: 'With Ads', price: 9.99, features: ['Watch with limited ads', '2 concurrent streams', 'Full HD'] },
      { name: 'Ad-Free', price: 15.99, features: ['No ads', '30 downloads', 'Full HD'] },
      { name: 'Ultimate Ad-Free', price: 19.99, features: ['No ads', '100 downloads', '4K UHD, Dolby Atmos'] },
    ],
  },
  {
    id: 10,
    name: 'YouTube Premium',
    category: 'Video Streaming',
    description: 'Ad-free YouTube and YouTube Music.',
    fullDescription: 'Enjoy your favorite videos and music without interruptions. Download content for offline viewing and play in the background on mobile.',
    imageUrl: 'https://picsum.photos/seed/youtube/600/600',
    tiers: [
      { name: 'Individual', price: 13.99, features: ['Ad-free videos', 'Background play', 'YouTube Music Premium'] },
      { name: 'Family', price: 22.99, features: ['Up to 5 members', 'All Individual features'] },
    ],
  },

  // Music Streaming
  {
    id: 11,
    name: 'Spotify',
    category: 'Music Streaming',
    description: 'Music for everyone.',
    fullDescription: 'Listen to millions of songs and podcasts. Discover new music, create your own playlists, and enjoy ad-free listening.',
    imageUrl: 'https://picsum.photos/seed/spotify/600/600',
    tiers: [
      { name: 'Premium Individual', price: 10.99, features: ['Ad-free music', 'Download to listen offline', 'On-demand playback'] },
      { name: 'Premium Duo', price: 14.99, features: ['2 Premium accounts', 'Duo Mix playlist'] },
      { name: 'Premium Family', price: 16.99, features: ['6 Premium accounts', 'Block explicit music', 'Spotify Kids'] },
    ],
  },
  {
    id: 12,
    name: 'Apple Music',
    category: 'Music Streaming',
    description: 'Over 100 million songs and 30,000 playlists.',
    fullDescription: 'Experience Spatial Audio with Dolby Atmos, listen in lossless audio, and sing along with Apple Music Sing.',
    imageUrl: 'https://picsum.photos/seed/applemusic/600/600',
    tiers: [
      { name: 'Individual', price: 10.99, features: ['Lossless audio', 'Spatial Audio', 'Ad-free listening'] },
      { name: 'Family', price: 16.99, features: ['Up to 6 people', 'Personal library for each member', 'Unlimited access'] },
    ],
  },
  
  // Creative Tools
  {
    id: 13,
    name: 'Adobe Creative Cloud',
    category: 'Creative Tools',
    description: 'The ultimate toolkit for creativity.',
    fullDescription: 'Get 20+ creative apps, including Photoshop, Illustrator, Premiere Pro, and Acrobat Pro. Create, collaborate, and be inspired.',
    imageUrl: 'https://picsum.photos/seed/adobe/600/600',
    tiers: [
      { name: 'Photography (1TB)', price: 19.99, features: ['Photoshop', 'Lightroom', '1TB cloud storage'] },
      { name: 'All Apps', price: 54.99, features: ['20+ creative apps', '100GB cloud storage', 'Adobe Fonts'] },
    ],
  },
  {
    id: 14,
    name: 'Canva Pro',
    category: 'Creative Tools',
    description: 'Design anything, effortlessly.',
    fullDescription: 'Create professional designs with ease. Access premium templates, millions of photos, and powerful tools like Brand Kit and Background Remover.',
    imageUrl: 'https://picsum.photos/seed/canva/600/600',
    tiers: [
      { name: 'Pro', price: 12.99, features: ['100+ million stock photos', 'Brand Kit', 'Magic Resize'] },
      { name: 'Teams', price: 14.99, features: ['All Pro features', 'Real-time collaboration', 'Team reports'] },
    ],
  },
  {
    id: 15,
    name: 'Figma',
    category: 'Creative Tools',
    description: 'The collaborative interface design tool.',
    fullDescription: 'Design, prototype, and collaborate all in one place. Build better products as a team, from initial ideas to final handoff.',
    imageUrl: 'https://picsum.photos/seed/figma/600/600',
    tiers: [
      { name: 'Professional', price: 12.00, features: ['Unlimited files', 'Version history', 'Shared libraries'] },
      { name: 'Organization', price: 45.00, features: ['Design system analytics', 'Centralized file management', 'Private plugins'] },
    ],
  },

  // Gaming
  {
    id: 16,
    name: 'Xbox Game Pass Ultimate',
    category: 'Gaming',
    description: 'Hundreds of high-quality games.',
    fullDescription: 'Get access to a huge library of games on console, PC, and cloud. Includes all the benefits of Xbox Live Gold and EA Play.',
    imageUrl: 'https://picsum.photos/seed/gamepass/600/600',
    tiers: [
      { name: 'Ultimate', price: 16.99, features: ['Console, PC, and Cloud gaming', 'New games on day one', 'Includes EA Play'] },
    ],
  },
  {
    id: 17,
    name: 'PlayStation Plus',
    category: 'Gaming',
    description: 'Enhance your PlayStation experience.',
    fullDescription: 'Enjoy online multiplayer, monthly games, exclusive discounts, and access to a massive catalog of PS4 and PS5 games.',
    imageUrl: 'https://picsum.photos/seed/psplus/600/600',
    tiers: [
      { name: 'Essential', price: 9.99, features: ['Online multiplayer', 'Monthly games', 'Exclusive discounts'] },
      { name: 'Extra', price: 14.99, features: ['All Essential benefits', 'Game Catalog'] },
      { name: 'Premium', price: 17.99, features: ['All Extra benefits', 'Classics Catalog', 'Cloud Streaming'] },
    ],
  },
  
  // Cloud Storage
  {
    id: 18,
    name: 'Dropbox',
    category: 'Cloud Storage',
    description: 'Securely store and share your files.',
    fullDescription: 'Keep all your files safe, organized, and accessible from any device. Collaborate with team members and back up important documents.',
    imageUrl: 'https://picsum.photos/seed/dropbox/600/600',
    tiers: [
      { name: 'Plus', price: 9.99, features: ['2 TB (2,000 GB) storage', 'File recovery', 'Password protection'] },
      { name: 'Professional', price: 16.58, features: ['3 TB (3,000 GB) storage', 'Advanced sharing controls', 'Watermarking'] },
    ],
  },
  {
    id: 19,
    name: 'Google One',
    category: 'Cloud Storage',
    description: 'More storage for everything Google.',
    fullDescription: 'Upgrade your storage across Google Drive, Gmail, and Google Photos. Share your plan with your family and get extra member benefits.',
    imageUrl: 'https://picsum.photos/seed/googleone/600/600',
    tiers: [
      { name: 'Basic (100 GB)', price: 1.99, features: ['100 GB storage', 'Access to Google experts', 'Share with up to 5 others'] },
      { name: 'Standard (200 GB)', price: 2.99, features: ['200 GB storage', '3% back in Google Store'] },
      { name: 'Premium (2 TB)', price: 9.99, features: ['2 TB storage', 'Google One VPN', '10% back in Google Store'] },
    ],
  },
  {
    id: 20,
    name: 'iCloud+',
    category: 'Cloud Storage',
    description: 'The best place for all your photos, files, and more.',
    fullDescription: 'iCloud+ gives you more storage for your data, plus premium features like Private Relay, Hide My Email, and HomeKit Secure Video support.',
    imageUrl: 'https://picsum.photos/seed/icloud/600/600',
    tiers: [
      { name: '50 GB', price: 0.99, features: ['50 GB storage', 'Private Relay', 'Hide My Email'] },
      { name: '200 GB', price: 2.99, features: ['200 GB storage', 'Share with family'] },
      { name: '2 TB', price: 9.99, features: ['2 TB storage', 'HomeKit Secure Video'] },
    ],
  },
].concat(
  ...Array.from({ length: 6 }, (_, i) => [ // Generate 30 more items, 5 per original category
    // AI/Productivity
    {
      id: 21 + i * 5, name: `Productivity Tool ${i+1}`, category: 'AI/Productivity', description: 'Enhance your workflow.',
      fullDescription: `This is a detailed description for Productivity Tool ${i+1}.`, imageUrl: `https://picsum.photos/seed/prod${i}/600/600`,
      tiers: [
        { name: 'Basic', price: 5.99 + i, features: ['Core feature A', 'Core feature B'] },
        { name: 'Pro', price: 12.99 + i*2, features: ['All Basic', 'Advanced feature C', 'Priority support'] }
      ]
    },
    // Video Streaming
    {
      id: 22 + i * 5, name: `Streaming Service ${i+1}`, category: 'Video Streaming', description: 'Your next favorite show awaits.',
      fullDescription: `This is a detailed description for Streaming Service ${i+1}.`, imageUrl: `https://picsum.photos/seed/stream${i}/600/600`,
      tiers: [
        { name: 'Standard', price: 8.99 + i, features: ['HD Streaming', '2 screens'] },
        { name: 'Premium', price: 15.99 + i*2, features: ['4K UHD Streaming', '4 screens', 'Offline downloads'] }
      ]
    },
    // Creative Tools
    {
      id: 23 + i * 5, name: `Creative Suite ${i+1}`, category: 'Creative Tools', description: 'Unleash your creativity.',
      fullDescription: `This is a detailed description for Creative Suite ${i+1}.`, imageUrl: `https://picsum.photos/seed/creative${i}/600/600`,
      tiers: [
        { name: 'Hobbyist', price: 9.99 + i, features: ['Basic tools', '10 projects'] },
        { name: 'Professional', price: 24.99 + i*2, features: ['All tools', 'Unlimited projects', 'Cloud sync'] }
      ]
    },
    // Gaming
    {
      id: 24 + i * 5, name: `Gaming Hub ${i+1}`, category: 'Gaming', description: 'The ultimate gaming library.',
      fullDescription: `This is a detailed description for Gaming Hub ${i+1}.`, imageUrl: `https://picsum.photos/seed/gaming${i}/600/600`,
      tiers: [
        { name: 'Core', price: 7.99 + i, features: ['Access to 50+ games', 'Online play'] },
        { name: 'Ultimate', price: 14.99 + i*2, features: ['Access to 200+ games', 'Cloud gaming', 'Exclusive content'] }
      ]
    },
    // Cloud Storage
    {
      id: 25 + i * 5, name: `Cloud Drive ${i+1}`, category: 'Cloud Storage', description: 'Your files, safe and sound.',
      fullDescription: `This is a detailed description for Cloud Drive ${i+1}.`, imageUrl: `https://picsum.photos/seed/cloud${i}/600/600`,
      tiers: [
        { name: 'Personal (500GB)', price: 4.99 + i, features: ['500 GB storage', 'File sharing'] },
        { name: 'Family (2TB)', price: 9.99 + i*2, features: ['2 TB storage', 'Share with family', 'Advanced security'] }
      ]
    },
  ])
);
--- END OF FILE constants.ts ---

--- START OF FILE translations.ts ---
import { Translation } from "./types";

const en: Translation = {
  // Header
  facebookAria: "Facebook Profile",
  phoneAria: "Telephone/Zalo",
  telegramAria: "Telegram Profile",
  backToTopAria: "Back to top",
  scrollToTopAria: "Scroll to top",

  // ThemeToggle
  toggleThemeAria: "Toggle theme",

  // LanguageSwitcher
  language: "Language",

  // Header Cart
  openCartAria: "Open cart",

  // Hero
  heroTitle: "Stop Overpaying for Subscriptions.",
  heroSubtitle: "We bundle the best services at a fraction of the cost. Get premium access to tools you love, without the premium price tag.",
  heroCTA: "Explore Plans",
  heroCardPass: "AuraCard Pass",
  heroCardTypicalCost: "Typical Monthly Cost",
  heroCardYourPrice: "Your Price",

  // Value Proposition
  vpCostTitle: "Cost Savings",
  vpCostDesc: "Bundle your favorite subscriptions and save up to 70% compared to individual plans.",
  vpConvenienceTitle: "Ultimate Convenience",
  vpConvenienceDesc: "Manage all your subscriptions in one place with a single, simple monthly payment.",
  vpVarietyTitle: "Curated Variety",
  vpVarietyDesc: "Access a wide range of top-tier services for productivity, creativity, and entertainment.",

  // Filters
  searchLabel: "Search",
  searchPlaceholder: "Search services, tools...",
  categoryLabel: "Category",
  allCategories: "All Categories",
  reset: "Reset",
  maxPriceLabel: "Max Price",

  // ProductList
  noProductsTitle: "No Services Found",
  noProductsDesc: "Try adjusting your search or filters to find what you're looking for.",

  // ProductCard
  startsAt: "Starts at",
  perMonth: "/mo",
  viewPlans: "View Plans",

  // ProductModal
  choosePlan: "Choose your plan:",
  addToCart: "Add to Cart",
  close: "Close",

  // CartModal
  yourCart: "Your Cart",
  cartEmpty: "Your cart is empty.",
  cartEmptyDesc: "Find a subscription plan to get started.",
  plan: "Plan",
  monthlyTotal: "Monthly Total",
  checkout: "Proceed to Checkout",
  removeAria: (name: string) => `Remove ${name} from cart`,

  // CheckoutModal
  checkoutSavingsTitle: "Confirm Your Savings",
  checkoutSavingsDesc: "Please scan the QR code with your payment app to complete the secure transaction.",
  checkoutProcessingTitle: "Processing Payment",
  checkoutProcessingDesc: "Please wait, we are securely processing your payment. Do not close this window.",
  checkoutSuccessTitle: "Payment Successful!",
  checkoutSuccessDesc: "Your payment has been received. We are now preparing your order.",
  checkoutCompleteTitle: "Order Confirmed",
  checkoutCompleteDesc: "Thank you for your purchase! You will receive a confirmation email shortly.",
  originalPrice: "Original Price",
  youPay: "You Pay",
  finishShopping: "Finish & Continue Shopping",

  // Pagination
  previous: "Previous",
  next: "Next",
  pageOf: (currentPage, totalPages) => `Page ${currentPage} of ${totalPages}`,

  // Footer
  copyright: (year) => `© ${year} AuraTech. All rights reserved.`,
  contactUs: "Contact Us",

  // TopBar
  yourSession: "Your Session",
  ipAddress: "IP",
  sessionTime: "Time",
  liveActivity: "Live Activity",
  activeSubs: "Active Subs",
  totalSavings: "Total Savings",
};

const vi: Translation = {
  // Header
  facebookAria: "Hồ sơ Facebook",
  phoneAria: "Điện thoại/Zalo",
  telegramAria: "Hồ sơ Telegram",
  backToTopAria: "Quay về đầu trang",
  scrollToTopAria: "Cuộn lên đầu trang",

  // ThemeToggle
  toggleThemeAria: "Chuyển đổi giao diện",

  // LanguageSwitcher
  language: "Ngôn ngữ",

  // Header Cart
  openCartAria: "Mở giỏ hàng",

  // Hero
  heroTitle: "Ngừng Trả Phí Quá Cao Cho Các Gói Đăng Ký.",
  heroSubtitle: "Chúng tôi gộp các dịch vụ tốt nhất với chi phí thấp hơn. Nhận quyền truy cập cao cấp vào các công cụ bạn yêu thích mà không phải trả giá cao.",
  heroCTA: "Khám Phá Các Gói",
  heroCardPass: "Thẻ AuraCard",
  heroCardTypicalCost: "Chi Phí Hàng Tháng",
  heroCardYourPrice: "Giá Của Bạn",

  // Value Proposition
  vpCostTitle: "Tiết Kiệm Chi Phí",
  vpCostDesc: "Gộp các gói đăng ký yêu thích của bạn và tiết kiệm tới 70% so với các gói riêng lẻ.",
  vpConvenienceTitle: "Tiện Lợi Tối Ưu",
  vpConvenienceDesc: "Quản lý tất cả các gói đăng ký của bạn ở một nơi với một khoản thanh toán hàng tháng đơn giản.",
  vpVarietyTitle: "Đa Dạng Chọn Lọc",
  vpVarietyDesc: "Truy cập vào nhiều dịch vụ hàng đầu cho năng suất, sáng tạo và giải trí.",

  // Filters
  searchLabel: "Tìm kiếm",
  searchPlaceholder: "Tìm dịch vụ, công cụ...",
  categoryLabel: "Danh mục",
  allCategories: "Tất cả danh mục",
  reset: "Đặt lại",
  maxPriceLabel: "Giá tối đa",

  // ProductList
  noProductsTitle: "Không Tìm Thấy Dịch Vụ",
  noProductsDesc: "Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn để tìm thứ bạn đang tìm.",

  // ProductCard
  startsAt: "Bắt đầu từ",
  perMonth: "/tháng",
  viewPlans: "Xem Gói",

  // ProductModal
  choosePlan: "Chọn gói của bạn:",
  addToCart: "Thêm vào giỏ hàng",
  close: "Đóng",

  // CartModal
  yourCart: "Giỏ hàng của bạn",
  cartEmpty: "Giỏ hàng của bạn trống.",
  cartEmptyDesc: "Tìm một gói đăng ký để bắt đầu.",
  plan: "Gói",
  monthlyTotal: "Tổng cộng hàng tháng",
  checkout: "Tiến hành thanh toán",
  removeAria: (name: string) => `Xóa ${name} khỏi giỏ hàng`,

  // CheckoutModal
  checkoutSavingsTitle: "Xác nhận Tiết kiệm của bạn",
  checkoutSavingsDesc: "Vui lòng quét mã QR bằng ứng dụng thanh toán của bạn để hoàn tất giao dịch an toàn.",
  checkoutProcessingTitle: "Đang xử lý thanh toán",
  checkoutProcessingDesc: "Vui lòng đợi, chúng tôi đang xử lý thanh toán của bạn một cách an toàn. Đừng đóng cửa sổ này.",
  checkoutSuccessTitle: "Thanh toán thành công!",
  checkoutSuccessDesc: "Thanh toán của bạn đã được nhận. Chúng tôi đang chuẩn bị đơn hàng của bạn.",
  checkoutCompleteTitle: "Đơn hàng đã được xác nhận",
  checkoutCompleteDesc: "Cảm ơn bạn đã mua hàng! Bạn sẽ sớm nhận được email xác nhận.",
  originalPrice: "Giá gốc",
  youPay: "Bạn trả",
  finishShopping: "Hoàn tất & Tiếp tục mua sắm",

  // Pagination
  previous: "Trước",
  next: "Sau",
  pageOf: (currentPage, totalPages) => `Trang ${currentPage} trên ${totalPages}`,

  // Footer
  copyright: (year) => `© ${year} AuraTech. Đã đăng ký bản quyền.`,
  contactUs: "Liên hệ",

  // TopBar
  yourSession: "Phiên của bạn",
  ipAddress: "IP",
  sessionTime: "Thời gian",
  liveActivity: "Hoạt động trực tiếp",
  activeSubs: "Gói đang hoạt động",
  totalSavings: "Tổng tiết kiệm",
};

const th: Translation = {
  // Header
  facebookAria: "โปรไฟล์ Facebook",
  phoneAria: "โทรศัพท์/Zalo",
  telegramAria: "โปรไฟล์ Telegram",
  backToTopAria: "กลับไปด้านบน",
  scrollToTopAria: "เลื่อนไปด้านบนสุด",

  // ThemeToggle
  toggleThemeAria: "สลับธีม",

  // LanguageSwitcher
  language: "ภาษา",

  // Header Cart
  openCartAria: "เปิดตะกร้าสินค้า",

  // Hero
  heroTitle: "หยุดจ่ายเงินเกินความจำเป็นสำหรับการสมัครสมาชิก",
  heroSubtitle: "เรารวมบริการที่ดีที่สุดในราคาประหยัด รับสิทธิ์การเข้าถึงเครื่องมือที่คุณชื่นชอบในระดับพรีเมียมโดยไม่ต้องจ่ายในราคาพรีเมียม",
  heroCTA: "สำรวจแผน",
  heroCardPass: "บัตร AuraCard",
  heroCardTypicalCost: "ค่าใช้จ่ายรายเดือนปกติ",
  heroCardYourPrice: "ราคาของคุณ",

  // Value Proposition
  vpCostTitle: "ประหยัดค่าใช้จ่าย",
  vpCostDesc: "รวมการสมัครสมาชิกที่คุณชื่นชอบและประหยัดได้ถึง 70% เมื่อเทียบกับแผนเดี่ยว",
  vpConvenienceTitle: "ความสะดวกสบายสูงสุด",
  vpConvenienceDesc: "จัดการการสมัครสมาชิกทั้งหมดของคุณในที่เดียวด้วยการชำระเงินรายเดือนที่ง่ายและสะดวก",
  vpVarietyTitle: "ความหลากหลายที่คัดสรร",
  vpVarietyDesc: "เข้าถึงบริการชั้นนำที่หลากหลายสำหรับประสิทธิภาพการทำงาน ความคิดสร้างสรรค์ และความบันเทิง",

  // Filters
  searchLabel: "ค้นหา",
  searchPlaceholder: "ค้นหาบริการ, เครื่องมือ...",
  categoryLabel: "หมวดหมู่",
  allCategories: "ทุกหมวดหมู่",
  reset: "รีเซ็ต",
  maxPriceLabel: "ราคาสูงสุด",

  // ProductList
  noProductsTitle: "ไม่พบบริการ",
  noProductsDesc: "ลองปรับการค้นหาหรือตัวกรองของคุณเพื่อค้นหาสิ่งที่คุณต้องการ",

  // ProductCard
  startsAt: "เริ่มต้นที่",
  perMonth: "/เดือน",
  viewPlans: "ดูแผน",

  // ProductModal
  choosePlan: "เลือกแผนของคุณ:",
  addToCart: "เพิ่มลงในตะกร้า",
  close: "ปิด",

  // CartModal
  yourCart: "ตะกร้าของคุณ",
  cartEmpty: "ตะกร้าของคุณว่างเปล่า",
  cartEmptyDesc: "ค้นหาแผนการสมัครสมาชิกเพื่อเริ่มต้น",
  plan: "แผน",
  monthlyTotal: "ยอดรวมรายเดือน",
  checkout: "ดำเนินการชำระเงิน",
  removeAria: (name: string) => `ลบ ${name} ออกจากตะกร้า`,

  // CheckoutModal
  checkoutSavingsTitle: "ยืนยันการประหยัดของคุณ",
  checkoutSavingsDesc: "โปรดสแกนรหัส QR ด้วยแอปชำระเงินของคุณเพื่อทำธุรกรรมที่ปลอดภัย",
  checkoutProcessingTitle: "กำลังประมวลผลการชำระเงิน",
  checkoutProcessingDesc: "โปรดรอสักครู่ เรากำลังประมวลผลการชำระเงินของคุณอย่างปลอดภัย อย่าปิดหน้าต่างนี้",
  checkoutSuccessTitle: "ชำระเงินสำเร็จ!",
  checkoutSuccessDesc: "ได้รับการชำระเงินของคุณแล้ว เรากำลังเตรียมคำสั่งซื้อของคุณ",
  checkoutCompleteTitle: "ยืนยันคำสั่งซื้อแล้ว",
  checkoutCompleteDesc: "ขอบคุณสำหรับการซื้อของคุณ! คุณจะได้รับอีเมลยืนยันในไม่ช้า",
  originalPrice: "ราคาเดิม",
  youPay: "คุณจ่าย",
  finishShopping: "เสร็จสิ้นและช็อปปิ้งต่อ",

  // Pagination
  previous: "ก่อนหน้า",
  next: "ถัดไป",
  pageOf: (currentPage, totalPages) => `หน้า ${currentPage} จาก ${totalPages}`,

  // Footer
  copyright: (year) => `© ${year} AuraTech. สงวนลิขสิทธิ์`,
  contactUs: "ติดต่อเรา",

  // TopBar
  yourSession: "เซสชันของคุณ",
  ipAddress: "IP",
  sessionTime: "เวลา",
  liveActivity: "กิจกรรมสด",
  activeSubs: "สมาชิใช้งานอยู่",
  totalSavings: "ยอดประหยัดทั้งหมด",
};


export const translations = { en, vi, th };

export const languageOptions = [
    { id: 'en', name: 'English' },
    { id: 'vi', name: 'Tiếng Việt' },
    { id: 'th', name: 'ไทย' },
];
--- END OF FILE translations.ts ---

--- START OF FILE hooks/useLocalStorage.ts ---
// FIX: Import React to make the React namespace available for type annotations.
import React, { useState, useEffect } from 'react';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}
--- END OF FILE hooks/useLocalStorage.ts ---

--- START OF FILE components/ActivityTicker.tsx ---
import React, { useState, useEffect } from 'react';
import { UsersIcon, DollarSignIcon } from './Icons';
import { Translation } from '../types';

interface AnimatedNumberProps {
  value: number;
  isCurrency?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, isCurrency = false }) => {
  const formattedValue = isCurrency ? value.toLocaleString() : value.toString();
  return (
    <span key={value} className="animate-numberFlip inline-block">
      {formattedValue}
    </span>
  );
};

interface ActivityTickerProps {
  t: Translation;
}

const ActivityTicker: React.FC<ActivityTickerProps> = ({ t }) => {
  const [activity, setActivity] = useState({ subs: 127, savings: 2540 });

  useEffect(() => {
    let timeoutId: number;
    const updateActivity = () => {
      setActivity(prev => ({
        subs: prev.subs + Math.floor(Math.random() * 2) + 1,
        savings: prev.savings + (Math.floor(Math.random() * 40) + 10),
      }));
      const randomInterval = Math.random() * (12000 - 4000) + 4000;
      timeoutId = window.setTimeout(updateActivity, randomInterval);
    };

    timeoutId = window.setTimeout(updateActivity, Math.random() * 5000 + 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex items-center space-x-4 text-xs">
      <div className="flex items-center space-x-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="font-semibold hidden lg:inline">{t.liveActivity}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <UsersIcon size={16} className="text-sky-500" />
        <span><AnimatedNumber value={activity.subs} /> <span className="hidden lg:inline">{t.activeSubs}</span></span>
      </div>
      <div className="flex items-center space-x-1.5">
        <DollarSignIcon size={16} className="text-green-500" />
        <span className="hidden lg:inline">{t.totalSavings}:</span>
        <span className="font-mono">$<AnimatedNumber value={activity.savings} isCurrency /></span>
      </div>
    </div>
  );
};

export default ActivityTicker;
--- END OF FILE components/ActivityTicker.tsx ---

--- START OF FILE components/CartModal.tsx ---
import React, { useMemo } from 'react';
import type { CartItem, Translation } from '../types';
import { CloseIcon, TrashIcon } from './Icons';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (serviceId: number) => void;
  onCheckout: () => void;
  t: Translation;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onCheckout, t }) => {
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.selectedTier.price, 0);
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-fadeIn">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">{t.yourCart}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400">{t.cartEmpty}</p>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t.cartEmptyDesc}</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.serviceId} className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-sky-600 dark:text-sky-400">{item.selectedTier.name} {t.plan}</p>
                  <p className="text-lg font-bold mt-1">${item.selectedTier.price.toFixed(2)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{t.perMonth}</span></p>
                </div>
                 <button onClick={() => onRemoveItem(item.serviceId)} className="p-2 text-gray-500 hover:text-red-500 transition-colors" aria-label={t.removeAria(item.name)}>
                   <TrashIcon />
                 </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">{t.monthlyTotal}</span>
            <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={cartItems.length === 0}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {t.checkout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
--- END OF FILE components/CartModal.tsx ---

--- START OF FILE components/CheckoutModal.tsx ---
import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon, CheckCircleIcon, CreditCardIcon, SpinnerIcon } from './Icons';
import { Translation } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: () => void;
  totalPrice: number;
  t: Translation;
}

type PaymentStatus = 'pending' | 'processing' | 'success' | 'complete';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onFinish, totalPrice, t }) => {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const originalPrice = useMemo(() => totalPrice * 3.5, [totalPrice]);

  useEffect(() => {
    if (isOpen) {
      setStatus('pending');
      const timer1 = setTimeout(() => setStatus('processing'), 3000);
      const timer2 = setTimeout(() => setStatus('success'), 6000);
      const timer3 = setTimeout(() => setStatus('complete'), 8000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    if (status === 'complete') {
      onFinish();
    } else {
      onClose();
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'pending':
        return {
          icon: null,
          title: t.checkoutSavingsTitle,
          message: t.checkoutSavingsDesc,
        };
      case 'processing':
        return {
          icon: <SpinnerIcon className="text-sky-500 animate-spinner" size={64}/>,
          title: t.checkoutProcessingTitle,
          message: t.checkoutProcessingDesc,
        };
      case 'success':
        return {
          icon: <CheckCircleIcon className="text-green-500" size={64}/>,
          title: t.checkoutSuccessTitle,
          message: t.checkoutSuccessDesc,
        };
      case 'complete':
        return {
          icon: <CheckCircleIcon className="text-green-500" size={64}/>,
          title: t.checkoutCompleteTitle,
          message: t.checkoutCompleteDesc,
        };
      default:
        return { icon: null, title: '', message: '' };
    }
  };

  if (!isOpen) return null;

  const { icon, title, message } = getStatusContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 animate-fadeIn text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={t.close}
        >
          <CloseIcon />
        </button>

        {icon && <div className="mb-6 flex justify-center">{icon}</div>}

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>

        {status === 'pending' && (
          <div className="animate-fadeIn">
            <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-lg">
                  <span>{t.originalPrice}</span>
                  <div className="relative">
                      <span className="opacity-70">${originalPrice.toFixed(2)}</span>
                      <div className="absolute inset-y-0 my-auto h-0.5 w-full bg-red-500 transform origin-left animate-price-hide-slash rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-gray-800 dark:text-white font-bold text-2xl mt-4 opacity-0 animate-price-show">
                  <span className="text-green-500">{t.youPay}</span>
                  <div className="flex items-center gap-2">
                      <CreditCardIcon className="text-green-500" size={28}/>
                      <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example" 
                alt="QR Code for payment"
                className="w-48 h-48"
              />
            </div>
          </div>
        )}
        
        {status === 'complete' && (
           <button 
            onClick={onFinish}
            className="w-full mt-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {t.finishShopping}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
--- END OF FILE components/CheckoutModal.tsx ---

--- START OF FILE components/Filters.tsx ---
import React from 'react';
import { SearchIcon } from './Icons';
import { Translation } from '../types';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  currentMaxPrice: number;
  setCurrentMaxPrice: (price: number) => void;
  maxPrice: number;
  onReset: () => void;
  t: Translation;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  currentMaxPrice,
  setCurrentMaxPrice,
  maxPrice,
  onReset,
  t,
}) => {
  return (
    <div className="mb-12 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.searchLabel}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="text-gray-400" size={20} />
            </span>
            <input
              type="text"
              id="search"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-sky-500 focus:border-sky-500 transition"
              aria-label={t.searchLabel}
            />
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.categoryLabel}
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-sky-500 focus:border-sky-500 transition"
            aria-label={t.categoryLabel}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? t.allCategories : cat}
              </option>
            ))}
          </select>
        </div>
        
        {/* Reset Button */}
        <div>
            <button
                onClick={onReset}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
                aria-label={t.reset}
            >
                {t.reset}
            </button>
        </div>

        {/* Price Slider */}
        <div className="md:col-span-4 mt-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.maxPriceLabel}: <span className="font-bold text-sky-600 dark:text-sky-400">${Number(currentMaxPrice).toFixed(0)}</span>
          </label>
          <input
            type="range"
            id="price"
            min="0"
            max={maxPrice}
            value={currentMaxPrice}
            onChange={(e) => setCurrentMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer range-slider"
            aria-label={t.maxPriceLabel}
          />
           <style>{`
            .range-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              background: #0ea5e9; /* sky-500 */
              border-radius: 50%;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .range-slider::-webkit-slider-thumb:hover {
              background: #0284c7; /* sky-600 */
            }
            .range-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              background: #0ea5e9; /* sky-500 */
              border-radius: 50%;
              cursor: pointer;
              border: none;
              transition: background-color 0.2s;
            }
            .range-slider::-moz-range-thumb:hover {
              background: #0284c7; /* sky-600 */
            }
           `}</style>
        </div>
      </div>
    </div>
  );
};

export default Filters;
--- END OF FILE components/Filters.tsx ---

--- START OF FILE components/Footer.tsx ---
import React from 'react';
import { Translation } from '../types';
import { GdprShieldIcon, ShieldLockIcon } from './Icons';

interface FooterProps {
  t: Translation;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="mt-16 py-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm mb-6">
            <p>{t.copyright(new Date().getFullYear())}</p>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
            <a href="mailto:support@auratech.dev" className="hover:text-sky-500 transition-colors">{t.contactUs}</a>
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
            <h4 className="text-xs uppercase font-semibold tracking-wider mb-4 text-gray-500 dark:text-gray-500">Security & Compliance</h4>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
                <div title="Secure Sockets Layer/Transport Layer Security" className="flex items-center space-x-2 filter grayscale opacity-70">
                    <ShieldLockIcon size={18} />
                    <span className="text-xs font-medium">Secure SSL/TLS</span>
                </div>
                <div title="General Data Protection Regulation Compliant" className="flex items-center space-x-2 filter grayscale opacity-70">
                    <GdprShieldIcon size={18} />
                    <span className="text-xs font-medium">GDPR Compliant</span>
                </div>
                 <div title="Powered by Amazon Web Services" className="flex items-center space-x-2 filter grayscale opacity-70">
                    <span className="text-xs font-medium">Powered by AWS</span>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
--- END OF FILE components/Footer.tsx ---

--- START OF FILE components/Header.tsx ---
import React from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import TopBar from './TopBar';
import { CartIcon, LogoIcon, FacebookIcon, PhoneIcon, TelegramIcon } from './Icons';
import { Translation } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isCartAnimating: boolean;
  t: Translation;
  language: keyof typeof translations;
  setLanguage: (lang: keyof typeof translations) => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, theme, toggleTheme, isCartAnimating, t, language, setLanguage }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm">
      <TopBar t={t} />
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        
        {/* Left: Socials */}
        <div className="flex-1 flex justify-start items-center space-x-1 md:space-x-2">
          <a
            href="https://facebook.com/thainguyeninfi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.facebookAria}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br from-sky-500 to-indigo-600 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <FacebookIcon size={20} />
          </a>
          <a
            href="tel:0938618875"
            aria-label={t.phoneAria}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br from-sky-500 to-indigo-600 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <PhoneIcon size={20} />
          </a>
          <a
            href="https://t.me/thainguyeninfi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.telegramAria}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br from-sky-500 to-indigo-600 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <TelegramIcon size={20} />
          </a>
        </div>
        
        {/* Center: Logo */}
        <div className="flex-1 flex justify-center items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              role="button"
              aria-label={t.backToTopAria}
            >
              <LogoIcon />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500">
                AuraTech
              </span>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center space-x-1 md:space-x-2">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} t={t} />
          <LanguageSwitcher language={language} setLanguage={setLanguage} t={t} />
          <button
            onClick={onCartClick}
            className={`relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isCartAnimating ? 'animate-jiggle' : ''}`}
            aria-label={t.openCartAria}
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
--- END OF FILE components/Header.tsx ---

--- START OF FILE components/Hero.tsx ---
import React, { useState, useEffect } from 'react';
import { ShieldIcon, TrendingDownIcon } from './Icons';
import { Translation } from '../types';

interface HeroProps {
  t: Translation;
}

const animatedDeals = [
  { name: 'Netflix Premium', oldPrice: 22.99 },
  { name: 'Spotify Family', oldPrice: 16.99 },
  { name: 'Midjourney Pro', oldPrice: 60.00 },
  { name: 'GitHub Copilot', oldPrice: 19.00 },
  { name: 'Adobe All Apps', oldPrice: 54.99 },
  { name: 'YouTube Premium', oldPrice: 13.99 },
];

const finalDeal = { name: 'Your Bundle', oldPrice: 188.95, newPrice: 29.99 };

const PromoLine: React.FC = () => {
  const [deal, setDeal] = useState(animatedDeals[0]);
  const [phase, setPhase] = useState('cycling'); // 'cycling', 'paused', 'finished'

  useEffect(() => {
    let cycleInterval: number | undefined;
    let phaseTimer: number;

    if (phase === 'cycling') {
      cycleInterval = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * animatedDeals.length);
        setDeal(animatedDeals[randomIndex]);
      }, 120);

      phaseTimer = window.setTimeout(() => {
        setPhase('paused');
      }, 2500);
    } else if (phase === 'paused') {
      phaseTimer = window.setTimeout(() => {
        setPhase('finished');
      }, 500);
    } else if (phase === 'finished') {
      phaseTimer = window.setTimeout(() => {
        setPhase('cycling');
      }, 4000); // Loop back to cycling after 4 seconds
    }

    return () => {
      if (cycleInterval) clearInterval(cycleInterval);
      clearTimeout(phaseTimer);
    };
  }, [phase]);

  const CyclingContent: React.FC<{deal: {name: string, oldPrice: number}}> = React.memo(({deal}) => (
    <>
      {deal.name}{' '}
      <s className="text-red-500/80">${deal.oldPrice.toFixed(2)}</s>
    </>
  ));

  const renderContent = () => {
    switch (phase) {
      case 'cycling':
        return <span className="opacity-70"><CyclingContent deal={deal} /></span>;
      case 'paused':
        // Last deal from cycling phase is shown statically
        return <span><CyclingContent deal={deal} /></span>;
      case 'finished':
        return (
          <div className="flex items-center justify-center gap-2 sm:gap-3 animate-fadeIn">
            <span className="hidden sm:inline">
              All subscriptions{' '}
              <s className="text-red-500/80">${finalDeal.oldPrice.toFixed(2)}</s>
            </span>
             <span className="sm:hidden">
              <s className="text-red-500/80">Paying individually</s>
            </span>
            <div className="animate-icon-swoop-in">
                <TrendingDownIcon className="text-sky-400" size={24}/>
            </div>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              One bill: ${finalDeal.newPrice.toFixed(2)}
            </span>
          </div>
        );
      default:
        return <div className="h-full w-full"></div>;
    }
  };

  return (
    <div className="mb-4 h-10 flex justify-center items-center text-center p-2 font-mono text-sm md:text-base text-gray-400 dark:text-gray-300 bg-slate-200/50 dark:bg-black/30 rounded-lg backdrop-blur-sm border border-white/10 shadow-inner">
      <div className="transition-all duration-300">{renderContent()}</div>
    </div>
  );
};


const Hero: React.FC<HeroProps> = ({ t }) => {
  const scrollToProducts = () => {
    // This targets the ValuePropositionBanner, which is right above the filters/products.
    const firstSection = document.querySelector('.container > .mb-12');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="container mx-auto px-4 flex items-center min-h-[50vh] py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        {/* Left side: Text and CTA */}
        <div className="text-center animate-fadeInUp">
          <PromoLine />
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 pb-2">
            {t.heroTitle}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="mt-8">
             <button
              onClick={scrollToProducts}
              className="relative overflow-hidden px-8 py-3 text-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group bg-[length:200%_auto] animate-background-pan-button"
            >
              {t.heroCTA}
              <div className="absolute top-0 -left-full w-full h-full bg-white opacity-20 transform -skew-x-45 group-hover:animate-shine"></div>
            </button>
          </div>
        </div>
        
        {/* Right side: Visual */}
        <div className="hidden md:flex justify-center items-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className="relative w-80 h-48 bg-gray-800 dark:bg-gray-900 rounded-xl p-4 flex flex-col justify-between text-left animate-breathingGlow overflow-hidden">
              <div className="flex justify-between items-start z-10">
                  <span className="text-gray-300 font-bold text-lg">{t.heroCardPass}</span>
                  <svg width="40" height="40" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                      <linearGradient id="hero-card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      </defs>
                      <path fill="url(#hero-card-gradient)" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Z"/>
                      <circle cx="100" cy="128" r="24" fill="#3f3f46"/>
                      <circle cx="156" cy="128" r="24" fill="#3f3f46" opacity="0.6"/>
                  </svg>
              </div>
              
              <div className="flex justify-between items-end z-10 text-white w-full">
                  {/* Left: Card details */}
                  <div className="opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.8s forwards' }}>
                      <p className="text-xs font-mono tracking-wider text-gray-400">**** **** **** 1234</p>
                      <p className="font-semibold text-sm">Jordan Pickford</p>
                  </div>

                  {/* Right: Price details */}
                  <div className="text-right">
                      <div 
                        className="opacity-0" 
                        style={{ animation: 'fadeInUp 0.5s ease-out 0.5s forwards'}}
                      >
                          <span className="text-sm text-gray-400">{t.heroCardTypicalCost}</span>
                          <div className="relative inline-block ml-2">
                              <span className="text-xl font-semibold text-red-400/80">
                                  $99.99
                              </span>
                              <div className="absolute top-1/2 -mt-px h-0.5 w-full bg-red-400 transform origin-left rounded-full"
                                  style={{ animation: 'price-hide-slash 0.3s ease-out 1s forwards' }}>
                              </div>
                          </div>
                      </div>
                      <div 
                        className="opacity-0 mt-1" 
                        style={{ animation: 'fadeInUp 0.5s ease-out 1.2s forwards'}}
                      >
                          <span className="text-sm text-sky-400">{t.heroCardYourPrice}</span>
                          <div className="flex justify-end items-center gap-2">
                              <ShieldIcon size={22} className="text-sky-400"/>
                              <span className="text-2xl font-bold">
                                  $29.99
                              </span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
--- END OF FILE components/Hero.tsx ---

--- START OF FILE components/Icons.tsx ---
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const CartIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const MinusIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" className="stop-sky-500 dark:stop-sky-400" />
        <stop offset="100%" className="stop-indigo-600 dark:stop-indigo-500" />
      </linearGradient>
    </defs>
    <path fill="url(#logo-gradient)" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Zm36.44-86.58-24-56a8 8 0 0 0-14.88 6.36l15.08 35.22h-25.3l15.08-35.22a8 8 0 0 0-14.88-6.36l-24 56A8 8 0 0 0 96 136h16.29l-4.48 10.46a8 8 0 0 0 14.88 6.36l14.23-33.18a.52.52 0 0 1 .16 0a.49.49 0 0 1 .16 0l14.23 33.18a8 8 0 1 0 14.88-6.36L143.71 136H160a8 8 0 0 0 6.58-12.42.8.8 0 0 0-.14-.16Z"/>
    <style>{`
      .stop-sky-500 { stop-color: #0ea5e9; }
      .stop-indigo-600 { stop-color: #4f46e5; }
      .dark .stop-sky-400 { stop-color: #38bdf8; }
      .dark .stop-indigo-500 { stop-color: #6366f1; }
    `}</style>
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

export const TelegramIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const DollarSignIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

export const SlidersIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="21" x2="4" y2="14"></line>
      <line x1="4" y1="10" x2="4" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="3"></line>
      <line x1="20" y1="21" x2="20" y2="16"></line>
      <line x1="20" y1="12" x2="20" y2="3"></line>
      <line x1="1" y1="14" x2="7" y2="14"></line>
      <line x1="9" y1="8" x2="15" y2="8"></line>
      <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
);

export const PackageIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.2"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export const VerifiedIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export const TrendingDownIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className, size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

export const ShieldLockIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <rect x="9" y="9" width="6" height="7" rx="1"></rect>
        <path d="M12 9V7a2 2 0 0 0-4 0v2"></path>
    </svg>
);

export const GdprShieldIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M12 8l.84 2.53L15.5 11l-2.1 1.8.63 2.7-2.53-.94L9 15.5l.63-2.7L7.5 11l2.66.47L12 8z"/>
    </svg>
);
--- END OF FILE components/Icons.tsx ---

--- START OF FILE components/LanguageSwitcher.tsx ---
import React, { useState, useEffect, useRef } from 'react';
import { GlobeIcon, ChevronDownIcon, CheckIcon } from './Icons';
import { Translation } from '../types';
import { translations, languageOptions } from '../translations';


interface LanguageSwitcherProps {
  language: keyof typeof translations;
  setLanguage: (lang: keyof typeof translations) => void;
  t: Translation;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (langId: keyof typeof translations) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const currentLanguageName = languageOptions.find(opt => opt.id === language)?.name || 'Language';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t.language}
      >
        <GlobeIcon size={20} />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguageName}</span>
        <ChevronDownIcon size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">
            {languageOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleLanguageChange(option.id as keyof typeof translations)}
                className="w-full text-left flex justify-between items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                <span>{option.name}</span>
                {language === option.id && <CheckIcon size={16} className="text-sky-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
--- END OF FILE components/LanguageSwitcher.tsx ---

--- START OF FILE components/Pagination.tsx ---
import React from 'react';
import { Translation } from '../types';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: Translation;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, t }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center mt-12 mb-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {t.previous}
      </button>
      <div className="hidden sm:flex items-center mx-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 mx-1 rounded-lg shadow-md transition ${
              currentPage === page
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
       <div className="sm:hidden mx-2 text-gray-700 dark:text-gray-300">
        {t.pageOf(currentPage, totalPages)}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {t.next}
      </button>
    </div>
  );
};

export default Pagination;
--- END OF FILE components/Pagination.tsx ---

--- START OF FILE components/ProductCard.tsx ---
import React, { useState } from 'react';
import type { Service, Translation } from '../types';
import { ShieldIcon, VerifiedIcon } from './Icons';

interface ProductCardProps {
  product: Service;
  onClick: (product: Service) => void;
  index: number;
  t: Translation;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, index, t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const startingPrice = product.tiers.length > 0 ? product.tiers[0].price : 0;
  // Create a plausible "original" price for the discount effect
  const originalPrice = startingPrice > 5 ? startingPrice * 1.4 + 5 : startingPrice + 10;
  
  return (
    <div 
      className="bg-gradient-to-br from-sky-500/50 to-indigo-500/50 p-[1.5px] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group opacity-0 animate-fadeInUp"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => onClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick(product)}
    >
      <div className="bg-white dark:bg-gray-800 rounded-[10.5px] h-full flex flex-col justify-between">
        <div>
          <div className="relative">
            <img className="w-full h-40 object-cover rounded-t-[10px]" src={product.imageUrl} alt={product.name} />
            
            {/* Shield Icon on Hover */}
            <div className={`absolute top-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="p-2 bg-sky-500/80 backdrop-blur-sm rounded-full text-white shadow-lg">
                <ShieldIcon size={20} />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-[10px]"></div>
            <div className="absolute bottom-2 left-3">
              <h3 className="text-lg font-bold text-white">{product.name}</h3>
              <p className="text-xs text-gray-300">{product.category}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 h-10 line-clamp-2">{product.description}</p>
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="flex justify-between items-center h-12">
            <div className="relative w-28 text-right">
              {/* Default Price */}
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-full transition-all duration-300 ease-in-out ${isHovered ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.startsAt}</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  ${startingPrice.toFixed(2)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{t.perMonth}</span>
                </p>
              </div>
              
              {/* Hover Price */}
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-full transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <p className="text-xs text-red-500 dark:text-red-400 line-through">
                  ${originalPrice.toFixed(2)}
                </p>
                <div className="flex justify-end items-center gap-1">
                  <VerifiedIcon size={16} className="text-green-500" />
                  <p className="text-lg font-bold text-sky-500 dark:text-sky-400">
                    ${startingPrice.toFixed(2)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{t.perMonth}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden px-4 py-2 text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-full shadow-md group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-300">
              {t.viewPlans}
              <div className="absolute top-0 -left-full w-full h-full bg-white opacity-20 transform -skew-x-45 group-hover:animate-shine"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
--- END OF FILE components/ProductCard.tsx ---

--- START OF FILE components/ProductList.tsx ---
import React from 'react';
import ProductCard from './ProductCard';
import type { Service, Translation } from '../types';

interface ProductListProps {
  products: Service[];
  onProductClick: (product: Service) => void;
  t: Translation;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductClick, t }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{t.noProductsTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t.noProductsDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} index={index} t={t} />
      ))}
    </div>
  );
};

export default ProductList;
--- END OF FILE components/ProductList.tsx ---

--- START OF FILE components/ProductModal.tsx ---
import React, { useState, useEffect } from 'react';
import type { Service, PricingTier, Translation } from '../types';
import { CloseIcon, CheckIcon } from './Icons';

interface ProductModalProps {
  product: Service | null;
  onClose: () => void;
  onAddToCart: (product: Service, tier: PricingTier) => void;
  t: Translation;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, t }) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  useEffect(() => {
    if (product && product.tiers.length > 0) {
      setSelectedTier(product.tiers[0]);
    } else {
      setSelectedTier(null);
    }
  }, [product]);
  
  if (!product) return null;

  const handleAddToCartClick = () => {
    if (product && selectedTier) {
      onAddToCart(product, selectedTier);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl m-4 animate-fadeIn max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label={t.close}
        >
          <CloseIcon />
        </button>

        <div className="grid md:grid-cols-2 flex-grow min-h-0">
          <div className="relative md:rounded-l-2xl overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover min-h-[250px] md:min-h-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white">
                <span className="text-sm font-semibold bg-black/30 px-2 py-1 rounded">{product.category}</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-1">{product.name}</h2>
             </div>
          </div>
          <div className="p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{product.fullDescription}</p>
              
              <h3 className="text-lg font-bold mb-3">{t.choosePlan}</h3>
              <div className="space-y-3">
                {product.tiers.map((tier) => {
                  const originalPrice = tier.price > 5 ? tier.price * 1.4 + 5 : tier.price + 10;
                  return (
                    <div
                      key={tier.name}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedTier?.name === tier.name ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700'}`}
                      role="radio"
                      aria-checked={selectedTier?.name === tier.name}
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && setSelectedTier(tier)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 ${selectedTier?.name === tier.name ? 'border-sky-500 bg-sky-500' : 'border-gray-400'} flex items-center justify-center`}>
                            {selectedTier?.name === tier.name && <CheckIcon className="text-white" size={14}/>}
                          </div>
                          <span className="font-semibold">{tier.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-red-500 dark:text-red-400 line-through opacity-75">
                            ${originalPrice.toFixed(2)}
                          </span>
                          <span className="block font-bold text-lg">${tier.price.toFixed(2)}<span className="font-normal text-sm text-gray-500 dark:text-gray-400">{t.perMonth}</span></span>
                        </div>
                      </div>
                      <ul className="mt-3 pl-8 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {tier.features.map((feature, i) => <li key={i} className="list-disc">{feature}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleAddToCartClick}
                disabled={!selectedTier}
                className="w-full px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {t.addToCart}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
--- END OF FILE components/ProductModal.tsx ---

--- START OF FILE components/ScrollToTopButton.tsx ---
import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from './Icons';
import { Translation } from '../types';

interface ScrollToTopButtonProps {
  t: Translation;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t.scrollToTopAria}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`
      }
    >
      <ChevronUpIcon size={24} />
    </button>
  );
};

export default ScrollToTopButton;
--- END OF FILE components/ScrollToTopButton.tsx ---

--- START OF FILE components/SessionInfo.tsx ---
import React, { useState, useEffect } from 'react';
import { GlobeIcon, ClockIcon } from './Icons';
import { Translation } from '../types';

interface SessionInfoProps {
  t: Translation;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ t }) => {
  const [ip, setIp] = useState('...');
  const [sessionTime, setSessionTime] = useState('00:00');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://api.ipify.org?format=json', { signal })
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch((err) => {
        if (err.name !== 'AbortError') {
            setIp('Unavailable');
        }
      });
      
      return () => {
        controller.abort();
      };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      setSessionTime(`${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center space-x-4 text-xs">
      <div className="flex items-center space-x-1.5">
        <GlobeIcon size={16} className="text-sky-500" />
        <span className="hidden sm:inline">{t.ipAddress}:</span>
        <span className="font-mono">{ip}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <ClockIcon size={16} className="text-sky-500" />
        <span className="hidden sm:inline">{t.sessionTime}:</span>
        <span className="font-mono">{sessionTime}</span>
      </div>
    </div>
  );
};

export default SessionInfo;
--- END OF FILE components/SessionInfo.tsx ---

--- START OF FILE components/ThemeToggle.tsx ---
import React from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { Translation } from '../types';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: Translation;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme, t }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={t.toggleThemeAria}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default React.memo(ThemeToggle);
--- END OF FILE components/ThemeToggle.tsx ---

--- START OF FILE components/TopBar.tsx ---
import React from 'react';
import SessionInfo from './SessionInfo';
import ActivityTicker from './ActivityTicker';
import { Translation } from '../types';

interface TopBarProps {
    t: Translation;
}

const TopBar: React.FC<TopBarProps> = ({ t }) => {
    return (
        <div className="bg-slate-100 dark:bg-black/20 text-gray-600 dark:text-gray-400 animate-fadeInDown border-b border-black/5 dark:border-white/5">
            <div className="container mx-auto px-4 h-8 flex justify-between items-center">
                <SessionInfo t={t} />
                <div className="hidden md:flex">
                    <ActivityTicker t={t} />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
--- END OF FILE components/TopBar.tsx ---

--- START OF FILE components/ValuePropositionBanner.tsx ---
import React from 'react';
import { DollarSignIcon, SlidersIcon, PackageIcon } from './Icons';
import { Translation } from '../types';

interface ValuePropositionBannerProps {
  t: Translation;
}

const ValuePropositionBanner: React.FC<ValuePropositionBannerProps> = ({ t }) => {
  const features = [
    {
      Icon: DollarSignIcon,
      title: t.vpCostTitle,
      description: t.vpCostDesc,
    },
    {
      Icon: SlidersIcon,
      title: t.vpConvenienceTitle,
      description: t.vpConvenienceDesc,
    },
    {
      Icon: PackageIcon,
      title: t.vpVarietyTitle,
      description: t.vpVarietyDesc,
    },
  ];

  return (
    <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="group p-4 rounded-xl transition-all transform hover:scale-105 duration-300 hover:bg-sky-100/50 dark:hover:bg-sky-900/20 hover:shadow-xl hover:shadow-sky-500/10">
              <div className="flex justify-center items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Icon size={28} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionBanner;
--- END OF FILE components/ValuePropositionBanner.tsx ---

--- START OF FILE api/log-visit.ts ---
// This file should be placed in the `api` directory at the root of your project.
// It requires a hosting environment that supports serverless functions (e.g., Vercel, Netlify).
// You will also need to install the Supabase JS library in that environment.

// In a real project with a package.json, you would run: npm install @supabase/supabase-js
// For now, we assume the library is available in the runtime.
import { createClient } from '@supabase/supabase-js';

// Define common headers to prevent caching
const NO_CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

// This is a common function signature for modern Edge Functions (Vercel, Netlify, etc.).
// It uses the standard Web API Request and Response objects.
export default async (req: Request): Promise<Response> => {
  // We only want to handle POST requests for this action.
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { ...NO_CACHE_HEADERS, Allow: 'POST' } });
  }

  // Retrieve Supabase credentials from environment variables for security.
  // These must be set in your hosting provider's settings.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are not set.');
    // Do not expose detailed errors to the client.
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), { 
      status: 500,
      headers: NO_CACHE_HEADERS,
    });
  }

  try {
    // **Source 1: Server-Side Detection (Primary and most reliable)**
    // Extract IP from trusted headers. This is the preferred method as it's harder to spoof.
    const serverDetectedIp = req.headers.get('x-vercel-forwarded-for')?.trim()
                         || req.headers.get('x-forwarded-for')?.split(',').shift()?.trim()
                         || req.headers.get('x-real-ip')?.trim();

    // **Source 2: Client-Side Detection (Fallback)**
    // Get the IP that the client detected for itself. This is a fallback in case headers are missing.
    let clientDetectedIp: string | null = null;
    try {
      const body = await req.json();
      if (body && typeof body.clientIp === 'string') {
        clientDetectedIp = body.clientIp;
      }
    } catch (e) {
      // Body might be empty or not valid JSON, which is fine. We'll just ignore it.
    }

    // **Final IP determination**
    // Prioritize the server-detected IP. If it's not available, use the client-provided one.
    // If neither is available, fallback to 'unknown'.
    const finalIp = serverDetectedIp || clientDetectedIp || 'unknown';

    // **Diagnostic Logging: Capture the full request URL**
    // This includes the cache-busting timestamp and serves as proof of execution.
    const requestUrl = req.url;

    // Initialize the Supabase client using the secure service key.
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Insert a new row into the 'visits' table with the final determined IP address
    // and the full request URL for verification.
    const { error } = await supabase
      .from('visits')
      .insert({ 
        ip_address: finalIp,
        request_url: requestUrl // Save the unique URL as proof
      });

    if (error) {
      console.error('Supabase insert error:', error.message);
      return new Response(JSON.stringify({ error: 'Could not log visit.' }), {
        status: 500,
        headers: NO_CACHE_HEADERS,
      });
    }
    
    // Return a success response to the client.
    return new Response(JSON.stringify({ message: 'Visit logged successfully.' }), {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
    console.error('Handler error:', errorMessage);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
        status: 500,
        headers: NO_CACHE_HEADERS,
    });
  }
};

// This config is often used by platforms like Vercel to specify the runtime.
// 'edge' is lightweight and fast, perfect for a simple function like this.
export const config = {
  runtime: 'edge',
};
--- END OF FILE api/log-visit.ts ---
