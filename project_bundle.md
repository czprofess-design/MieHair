
Đây là bản tổng hợp toàn bộ mã nguồn của dự án AuraTech. Bạn có thể sử dụng file này để di chuyển dự án hoặc cung cấp bối cảnh đầy đủ cho các công cụ AI.

--- START OF FILE index.html ---
<!DOCTYPE html>
<html lang="en" class="theme-blue">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gradient Product Showcase</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      :root {
        --gradient-from: #0ea5e9;
        --gradient-to: #4f46e5;
        --accent-color: #0ea5e9;
        --accent-color-dark: #38bdf8;
        --accent-stop-1: #0ea5e9;
        --accent-stop-2: #4f46e5;
        --accent-dark-stop-1: #38bdf8;
        --accent-dark-stop-2: #6366f1;
        --breathing-glow-color: rgba(56, 189, 248, 0.2);
        --breathing-glow-color-strong: rgba(56, 189, 248, 0.4);
      }
      html.theme-blue {
        --gradient-from: #0ea5e9; /* sky-500 */
        --gradient-to: #4f46e5; /* indigo-600 */
        --accent-color: #0ea5e9; /* sky-500 */
        --accent-color-dark: #38bdf8; /* sky-400 */
        --accent-stop-1: #0ea5e9;
        --accent-stop-2: #4f46e5;
        --accent-dark-stop-1: #38bdf8;
        --accent-dark-stop-2: #6366f1;
        --breathing-glow-color: rgba(56, 189, 248, 0.2);
        --breathing-glow-color-strong: rgba(56, 189, 248, 0.4);
      }
      html.theme-rose {
        --gradient-from: #f43f5e; /* rose-500 */
        --gradient-to: #f97316; /* orange-500 */
        --accent-color: #f43f5e; /* rose-500 */
        --accent-color-dark: #fb7185; /* rose-400 */
        --accent-stop-1: #f43f5e;
        --accent-stop-2: #f97316;
        --accent-dark-stop-1: #fb7185;
        --accent-dark-stop-2: #fb923c;
        --breathing-glow-color: rgba(244, 63, 94, 0.2);
        --breathing-glow-color-strong: rgba(244, 63, 94, 0.4);
      }
    </style>
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
              'background-pan': {
                '0%': { 'background-position': '0% 50%' },
                '50%': { 'background-position': '100% 50%' },
                '100%': { 'background-position': '0% 50%' },
              },
              'breathingGlow': {
                '0%, 100%': { 'box-shadow': '0 0 15px 5px var(--breathing-glow-color)' },
                '50%': { 'box-shadow': '0 0 30px 10px var(--breathing-glow-color-strong)' },
              },
              'press-down': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(0.97)' },
              },
            },
            animation: {
              fadeIn: 'fadeIn 0.3s ease-out',
              fadeInUp: 'fadeInUp 0.5s ease-out forwards',
              fadeInDown: 'fadeInDown 0.5s ease-out',
              numberFlip: 'numberFlip 0.3s ease-out forwards',
              'background-pan': 'background-pan 15s ease infinite',
              'breathingGlow': 'breathingGlow 5s ease-in-out infinite',
              'press-down': 'press-down 0.2s ease-in-out',
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
  "name": "AIS0005 - Web 🎨 Template",
  "description": "An attractive product showcase application with smooth effects, gradient colors, light/dark themes, and a complete shopping cart and checkout experience.",
  "requestFramePermissions": []
}
--- END OF FILE metadata.json ---

--- START OF FILE App.tsx ---
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import AuthModal from './components/Auth';
import AccountModal from './components/AccountModal';
import ProductList from './components/ProductList';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import UserGuideModal from './components/UserGuide';
import { CartProvider } from './context/CartContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { translations } from './translations';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { QuestionMarkCircleIcon } from './components/Icons';
import { SettingsContext, SettingsContextType } from './context/SettingsContext';

const SupabaseNotConfigured: React.FC = () => (
  <div className="flex flex-col justify-center items-center text-center flex-grow animate-fadeIn bg-amber-100 dark:bg-amber-900/30 p-8 rounded-lg border border-amber-300 dark:border-amber-700">
    <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300">Supabase Not Configured</h2>
    <p className="mt-4 text-lg text-amber-800 dark:text-amber-400">
      To enable authentication and e-commerce features, you need to configure your Supabase credentials.
    </p>
    <p className="mt-2">Please update the following file with your project's URL and anon key:</p>
    <p className="mt-2 font-mono bg-amber-200 dark:bg-gray-700 p-2 rounded text-sm text-amber-900 dark:text-amber-200">
      lib/supabase.ts
    </p>
     <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      Note: A sample database is pre-configured so you can test the application immediately.
    </p>
  </div>
);

const AppContainer: React.FC<{ session: Session | null }> = ({ session }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [colorScheme, setColorScheme] = useLocalStorage<'blue' | 'rose'>('colorScheme', 'blue');
  const [language, setLanguage] = useLocalStorage<keyof typeof translations>('language', 'en');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-blue', 'theme-rose');
    root.classList.add(`theme-${colorScheme}`);
  }, [colorScheme]);

  const t = translations[language];

  const handleSignOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!session) {
      setAuthModalPrompt(t.signInToCheckout);
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const settingsContextValue: SettingsContextType = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    language,
    setLanguage,
    t,
  };

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col">
        <Header 
          session={session}
          handleSignOut={handleSignOut}
          onSignInClick={() => {
            setAuthModalPrompt('');
            setIsAuthModalOpen(true);
          }}
          onAccountClick={() => setIsAccountModalOpen(true)}
          onCartClick={() => setIsCartOpen(true)}
        />

        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col justify-center items-center">
          {isSupabaseConfigured ? (
            <ProductList />
          ) : (
            <SupabaseNotConfigured />
          )}
        </main>
        
        <Footer />
        <ScrollToTopButton />

        <button
          type="button"
          onClick={() => setIsUserGuideOpen(true)}
          aria-label={t.openUserGuideAria}
          title={t.howToUseThisApp}
          className="fixed bottom-8 left-8 z-50 p-3 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 ease-in-out hover:scale-110"
        >
          <QuestionMarkCircleIcon size={24} />
        </button>
        
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            prompt={authModalPrompt}
        />

        <AccountModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            session={session}
        />

        <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
        />
        
        <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            session={session}
        />

        <UserGuideModal
            isOpen={isUserGuideOpen}
            onClose={() => setIsUserGuideOpen(false)}
        />
      </div>
    </SettingsContext.Provider>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CartProvider session={session}>
      <AppContainer session={session} />
    </CartProvider>
  );
}
--- END OF FILE App.tsx ---

--- START OF FILE README.md ---
# AuraTech - Project Development Diary

This document tracks the development progress, features, and usage instructions for the AuraTech Product Showcase application.

## 📖 Project Overview

AuraTech is a modern, attractive e-commerce front-end application designed to showcase products with a focus on smooth user experience, beautiful gradient-based themes, and a complete shopping workflow.

## ✨ Key Features

*   **Product Showcase**: Fetches and displays products from a Supabase backend.
*   **Dual-Tone Themes**: Switch between Light and Dark modes.
*   **Customizable Accent Colors**: Two gradient color schemes (Blue/Indigo and Rose/Orange).
*   **Multi-language Support**: English, Vietnamese (Tiếng Việt), and Thai (ไทย).
*   **Full Shopping Cart**: Add products, update quantities, and remove items.
*   **User Authentication**: Secure sign-in/sign-up and account management powered by Supabase Auth.
*   **Persistent Cart**: Cart state is saved in local storage for guests and synced to the database for logged-in users.
*   **Checkout Process**: A simulated checkout process that saves order details to the database.
*   **Responsive Design**: A fully responsive layout for all screen sizes.
*   **In-App User Guide**: A comprehensive guide available directly within the application.

## 💻 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Supabase (Database, Auth)
-   **State Management**: React Context API
-   **Build Tool**: Vite (inferred from `index.html`)

## 🚀 Development Log

### **Version 1.2 - Architectural Refactor: State Management with Context**

*   **Date**: [Current Date]
*   **Changes**:
    *   **Architecture**: Implemented a global `SettingsContext` to act as a single source of truth for application-wide settings (theme, color scheme, language).
    *   **Bug Fix**: This refactor resolves a bug where some UI elements (like the User Guide button tooltip) were not updating consistently when the language was changed.
    *   **Code Quality**: All components now consume settings from the central context, simplifying props and improving maintainability and performance. Removed redundant state management from individual components.

### **Version 1.1 - Mobile Header Cleanup & UX Improvements**

*   **Date**: [Current Date]
*   **Changes**:
    *   **UX**: Added a tooltip to the "User Guide" button, which now displays its purpose in the currently selected language on hover.
    *   **UI/Responsive**: Refactored the top bar in the header. The IP Address and Session Time information is now hidden on mobile devices to provide a cleaner and less cluttered interface.

### **Version 1.0 - Initial E-commerce Implementation**

*   **Date**: [Current Date]
*   **Changes**:
    *   **Project Initialization**: Set up the basic React application structure with Tailwind CSS.
    *   **UI Foundation**: Created core UI components including `Header`, `Footer`, `SettingsController`, and modals.
    *   **Theming Engine**: Implemented a robust theming system with support for light/dark modes and two distinct gradient color schemes.
    *   **Internationalization (i18n)**: Integrated a translation system with support for English, Vietnamese, and Thai.
    *   **Authentication**: Integrated Supabase Auth for user sign-up, sign-in, and account management.
    *   **E-commerce Core**:
        *   Re-integrated the full e-commerce functionality.
        *   Created `ProductList`, `ProductCard`, and `ProductModal` to display products fetched from the Supabase database.
        *   Developed `CartContext` to manage the application's shopping cart state, handling both guest (local storage) and authenticated user (Supabase) carts.
        *   Built `CartModal` and `CheckoutModal` to provide a complete shopping and checkout flow.
        *   Updated the `Header` to include a dynamic cart icon showing the item count.
    *   **Project Documentation**:
        *   Created this `README.md` file to serve as a project diary and central documentation hub.
        *   Added a new `UserGuide` component to provide in-app instructions for all major features.

## 📋 How to Use (In-App Guide)

The following guide explains how to use the various features of the AuraTech application.

### **1. Appearance & Settings**

-   **Access Settings**: Click the **settings icon (⚙️)** in the top-right corner of the header.
-   **Theme**: Choose between **Light** and **Dark** mode for your preferred viewing experience.
-   **Accent Color**: Select one of the color bubbles to change the application's gradient theme.
-   **Language**: Switch between English, Tiếng Việt, and ไทย.

### **2. Shopping**

-   **Viewing Products**: Scroll through the main page to see all available products. Click on any product card to open a detailed view with more information.
-   **Adding to Cart**:
    -   Click the **"Add to Cart"** button on a product card to add one item to your cart.
    -   In the detailed view, you can adjust the quantity before adding.
-   **Managing Your Cart**:
    -   Click the **shopping cart icon (🛒)** in the header to open your cart.
    -   Inside the cart, use the **plus (+)** and **minus (-)** buttons to change item quantities.
    -   Click the **trash icon (🗑️)** to remove an item completely.

### **3. Checkout**

-   **Proceed to Checkout**: Once you are happy with your cart, click the "Proceed to Checkout" button.
-   **Sign In**: If you are not already signed in, you will be prompted to do so. This is required to save your order history.
-   **Confirm Purchase**: Review your order details in the checkout modal and click "Confirm Purchase" to complete the transaction. Your cart will be cleared, and a simulated order will be saved to your account.

### **4. Your Account**

-   **Sign In/Up**: Click the "Sign In" button in the header to create an account or log in.
-   **Account Management**: When logged in, click your email address in the header to open the user menu. From there, you can access your **Account Settings** to update your profile information or change your password.
-   **Sign Out**: Log out of your account from the user menu.
--- END OF FILE README.md ---

--- START OF FILE types.ts ---
export type Translation = {
  // Header
  facebookAria: string;
  phoneAria: string;
  telegramAria: string;
  backToTopAria: string;
  scrollToTopAria: string;
  settingsAria: string;
  openUserGuideAria: string;
  howToUseThisApp: string;
  
  // ThemeController
  toggleThemeAria: string;
  appearanceSettingsAria: string;
  themeLabel: string;
  lightTheme: string;
  darkTheme: string;
  accentColorLabel: string;

  // LanguageSwitcher
  language: string;

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
  
  // Auth
  authHeader: string;
  authPrompt: string;
  authPromptLogin: string;
  emailLabel: string;
  passwordLabel: string;
  signIn: string;
  signUp: string;
  signOut: string;
  signingIn: string;
  signingUp: string;
  magicLinkSent: string;
  signInToContinue: string;
  signInToCheckout: string;
  cancel: string;

  // Account Modal
  accountSettings: string;
  profile: string;
  password: string;
  updateProfile: string;
  fullName: string;
  websiteLabel: string;
  addressLabel: string;
  cityLabel: string;
  countryLabel: string;
  update: string;
  updating: string;
  profileUpdated: string;
  changePassword: string;
  newPassword: string;
  confirmNewPassword: string;
  passwordUpdated: string;
  passwordsDoNotMatch: string;
  
  // Cart & Checkout
  yourCart: string;
  emptyCart: string;
  emptyCartPrompt: string;
  subtotal: string;
  checkout: string;
  remove: string;
  addToCart: string;
  addedToCart: string;
  close: string;
  quantity: string;
  total: string;
  checkoutTitle: string;
  confirmPurchase: string;
  purchaseSuccessful: string;
  purchaseSuccessfulMessage: string;
};

export type Product = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  long_description?: string | null;
  image_url: string;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
};
--- END OF FILE types.ts ---

--- START OF FILE constants.ts ---

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
  settingsAria: "Open settings",
  openUserGuideAria: "Open User Guide",
  howToUseThisApp: "How to Use This App",

  // ThemeToggle & Controller
  toggleThemeAria: "Toggle theme",
  appearanceSettingsAria: "Appearance",
  themeLabel: "Theme",
  lightTheme: "Light",
  darkTheme: "Dark",
  accentColorLabel: "Accent Color",

  // LanguageSwitcher
  language: "Language",

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

  // Auth
  authHeader: "Welcome to AuraTech",
  authPrompt: "Sign in to your account to continue.",
  authPromptLogin: "Don't have an account?",
  emailLabel: "Email address",
  passwordLabel: "Password",
  signIn: "Sign In",
  signUp: "Sign Up",
  signOut: "Sign Out",
  signingIn: "Signing In...",
  signingUp: "Signing Up...",
  magicLinkSent: "Check your email for the login link!",
  signInToContinue: "Sign in to continue",
  signInToCheckout: "Please sign in to proceed to checkout.",
  cancel: "Cancel",

  // Account Modal
  accountSettings: "Account Settings",
  profile: "Profile",
  password: "Password",
  updateProfile: "Update Profile",
  fullName: "Full Name",
  websiteLabel: "Website",
  addressLabel: "Address",
  cityLabel: "City",
  countryLabel: "Country",
  update: "Update",
  updating: "Updating...",
  profileUpdated: "Profile updated successfully!",
  changePassword: "Change Password",
  newPassword: "New Password",
  confirmNewPassword: "Confirm New Password",
  passwordUpdated: "Password updated successfully!",
  passwordsDoNotMatch: "Passwords do not match.",

  // Cart & Checkout
  yourCart: "Your Cart",
  emptyCart: "Your cart is empty",
  emptyCartPrompt: "Looks like you haven't added anything yet.",
  subtotal: "Subtotal",
  checkout: "Proceed to Checkout",
  remove: "Remove",
  addToCart: "Add to Cart",
  addedToCart: "Added!",
  close: "Close",
  quantity: "Quantity",
  total: "Total",
  checkoutTitle: "Confirm Your Order",
  confirmPurchase: "Confirm Purchase",
  purchaseSuccessful: "Purchase Successful!",
  purchaseSuccessfulMessage: "Thank you for your order. A confirmation has been sent to your email.",
};

const vi: Translation = {
  // Header
  facebookAria: "Hồ sơ Facebook",
  phoneAria: "Điện thoại/Zalo",
  telegramAria: "Hồ sơ Telegram",
  backToTopAria: "Quay về đầu trang",
  scrollToTopAria: "Cuộn lên đầu trang",
  settingsAria: "Mở cài đặt",
  openUserGuideAria: "Mở Hướng dẫn sử dụng",
  howToUseThisApp: "Hướng dẫn sử dụng ứng dụng",

  // ThemeToggle & Controller
  toggleThemeAria: "Chuyển đổi giao diện",
  appearanceSettingsAria: "Giao diện",
  themeLabel: "Giao diện",
  lightTheme: "Sáng",
  darkTheme: "Tối",
  accentColorLabel: "Màu nhấn",

  // LanguageSwitcher
  language: "Ngôn ngữ",

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
  
  // Auth
  authHeader: "Chào mừng đến với AuraTech",
  authPrompt: "Đăng nhập để tiếp tục.",
  authPromptLogin: "Chưa có tài khoản?",
  emailLabel: "Địa chỉ email",
  passwordLabel: "Mật khẩu",
  signIn: "Đăng nhập",
  signUp: "Đăng ký",
  signOut: "Đăng xuất",
  signingIn: "Đang đăng nhập...",
  signingUp: "Đang đăng ký...",
  magicLinkSent: "Kiểm tra email của bạn để lấy liên kết đăng nhập!",
  signInToContinue: "Đăng nhập để tiếp tục",
  signInToCheckout: "Vui lòng đăng nhập để tiến hành thanh toán.",
  cancel: "Hủy",

  // Account Modal
  accountSettings: "Cài đặt tài khoản",
  profile: "Hồ sơ",
  password: "Mật khẩu",
  updateProfile: "Cập nhật hồ sơ",
  fullName: "Họ và tên",
  websiteLabel: "Trang web",
  addressLabel: "Địa chỉ",
  cityLabel: "Thành phố",
  countryLabel: "Quốc gia",
  update: "Cập nhật",
  updating: "Đang cập nhật...",
  profileUpdated: "Hồ sơ đã được cập nhật thành công!",
  changePassword: "Đổi mật khẩu",
  newPassword: "Mật khẩu mới",
  confirmNewPassword: "Xác nhận mật khẩu mới",
  passwordUpdated: "Mật khẩu đã được cập nhật thành công!",
  passwordsDoNotMatch: "Mật khẩu không khớp.",
  
  // Cart & Checkout
  yourCart: "Giỏ hàng của bạn",
  emptyCart: "Giỏ hàng của bạn đang trống",
  emptyCartPrompt: "Có vẻ như bạn chưa thêm sản phẩm nào.",
  subtotal: "Tạm tính",
  checkout: "Tiến hành thanh toán",
  remove: "Xóa",
  addToCart: "Thêm vào giỏ",
  addedToCart: "Đã thêm!",
  close: "Đóng",
  quantity: "Số lượng",
  total: "Tổng cộng",
  checkoutTitle: "Xác nhận đơn hàng",
  confirmPurchase: "Xác nhận mua hàng",
  purchaseSuccessful: "Mua hàng thành công!",
  purchaseSuccessfulMessage: "Cảm ơn bạn đã đặt hàng. Một xác nhận đã được gửi đến email của bạn.",
};

const th: Translation = {
  // Header
  facebookAria: "โปรไฟล์ Facebook",
  phoneAria: "โทรศัพท์/Zalo",
  telegramAria: "โปรไฟล์ Telegram",
  backToTopAria: "กลับไปด้านบน",
  scrollToTopAria: "เลื่อนไปด้านบนสุด",
  settingsAria: "เปิดการตั้งค่า",
  openUserGuideAria: "เปิดคู่มือการใช้งาน",
  howToUseThisApp: "วิธีใช้แอพนี้",

  // ThemeToggle & Controller
  toggleThemeAria: "สลับธีม",
  appearanceSettingsAria: "ลักษณะ",
  themeLabel: "ธีม",
  lightTheme: "สว่าง",
  darkTheme: "มืด",
  accentColorLabel: "สีเน้น",

  // LanguageSwitcher
  language: "ภาษา",

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

  // Auth
  authHeader: "ยินดีต้อนรับสู่ AuraTech",
  authPrompt: "ลงชื่อเข้าใช้บัญชีของคุณเพื่อดำเนินการต่อ",
  authPromptLogin: "ไม่มีบัญชี?",
  emailLabel: "ที่อยู่อีเมล",
  passwordLabel: "รหัสผ่าน",
  signIn: "ลงชื่อเข้าใช้",
  signUp: "ลงทะเบียน",
  signOut: "ออกจากระบบ",
  signingIn: "กำลังลงชื่อเข้าใช้...",
  signingUp: "กำลังลงทะเบียน...",
  magicLinkSent: "ตรวจสอบอีเมลของคุณสำหรับลิงค์เข้าสู่ระบบ!",
  signInToContinue: "ลงชื่อเข้าใช้เพื่อดำเนินการต่อ",
  signInToCheckout: "กรุณาลงชื่อเข้าใช้เพื่อดำเนินการชำระเงิน",
  cancel: "ยกเลิก",

    // Account Modal
  accountSettings: "ตั้งค่าบัญชี",
  profile: "โปรไฟล์",
  password: "รหัสผ่าน",
  updateProfile: "อัปเดตโปรไฟล์",
  fullName: "ชื่อเต็ม",
  websiteLabel: "เว็บไซต์",
  addressLabel: "ที่อยู่",
  cityLabel: "เมือง",
  countryLabel: "ประเทศ",
  update: "อัปเดต",
  updating: "กำลังอัปเดต...",
  profileUpdated: "อัปเดตโปรไฟล์สำเร็จแล้ว!",
  changePassword: "เปลี่ยนรหัสผ่าน",
  newPassword: "รหัสผ่านใหม่",
  confirmNewPassword: "ยืนยันรหัสผ่านใหม่",
  passwordUpdated: "อัปเดตรรหัสผ่านสำเร็จแล้ว!",
  passwordsDoNotMatch: "รหัสผ่านไม่ตรงกัน",
  
  // Cart & Checkout
  yourCart: "รถเข็นของคุณ",
  emptyCart: "รถเข็นของคุณว่างเปล่า",
  emptyCartPrompt: "ดูเหมือนว่าคุณยังไม่ได้เพิ่มอะไรเลย",
  subtotal: "ยอดรวม",
  checkout: "ดำเนินการชำระเงิน",
  remove: "ลบ",
  addToCart: "เพิ่มในรถเข็น",
  addedToCart: "เพิ่มแล้ว!",
  close: "ปิด",
  quantity: "จำนวน",
  total: "ทั้งหมด",
  checkoutTitle: "ยืนยันคำสั่งซื้อของคุณ",
  confirmPurchase: "ยืนยันการสั่งซื้อ",
  purchaseSuccessful: "ซื้อสำเร็จ!",
  purchaseSuccessfulMessage: "ขอบคุณสำหรับคำสั่งซื้อของคุณ การยืนยันถูกส่งไปยังอีเมลของคุณแล้ว",
};


export const translations = { en, vi, th };

export const languageOptions = [
    { id: 'en', name: 'English' },
    { id: 'vi', name: 'Tiếng Việt' },
    { id: 'th', name: 'ไทย' },
];
--- END OF FILE translations.ts ---

--- START OF FILE lib/supabase.ts ---
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These credentials connect to the sample Supabase project.
// For a production app, replace them with your own project's URL and anon key.
// FIX: Explicitly typing the constants as `string` prevents TypeScript from inferring them as
// literal types, which caused errors in the comparisons on lines 11 and 12.
const supabaseUrl: string = 'https://lmwcvulazahaweyikkjq.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtd2N2dWxhemFoYXdleWlra2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjU1MTcsImV4cCI6MjA3NjkwMTUxN30.Jcz4hlmETfTKO-9JjxEfax7OVNcxeGlCJ6v-FLaToTE';

// FIX: The original check used the actual credentials as placeholder values, preventing the app from running.
// This now checks against generic placeholder text, allowing the app to proceed with the credentials above.
export const isSupabaseConfigured =
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key';

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not configured. Please add your SUPABASE_URL and SUPABASE_ANON_KEY to lib/supabase.ts to enable authentication."
  );
}

// Initialize the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
--- END OF FILE lib/supabase.ts ---

--- START OF FILE hooks/useLocalStorage.ts ---
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

--- START OF FILE context/CartContext.tsx ---
import React, { createContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T) {
  // FIX: Explicitly pass `undefined` to `useRef` to satisfy TypeScript's expectation of one argument.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  loading: boolean;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  loading: true,
});

/**
 * Fetches all cart items for a given user by performing two separate queries:
 * one to get cart item relations (product_id, quantity) and another to get
 * the full product details. This is more robust than a single join query.
 */
const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
    const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', userId);

    if (cartError) {
        console.error('Error fetching cart items:', cartError.message);
        throw cartError;
    }

    if (!cartData || cartData.length === 0) {
        return [];
    }

    const productIds = cartData.map(item => item.product_id);

    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

    if (productsError) {
        console.error('Error fetching products for cart:', productsError.message);
        throw productsError;
    }

    if (!productsData) {
        return [];
    }

    const productsById = productsData.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
    }, {} as Record<number, Product>);

    return cartData
        .map(item => {
            const product = productsById[item.product_id];
            if (!product) return null; // Gracefully handle if a product was deleted
            return { ...product, quantity: item.quantity };
        })
        .filter((item): item is CartItem => item !== null);
};


interface CartProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, session }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>('cart', []);
  const [loading, setLoading] = useState(true);
  const prevSession = usePrevious(session);

  // Sync cart on session change (login/logout)
  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setCartItems(localCart);
        setLoading(false);
        return;
      }

      try {
        // User logged in
        if (session && !prevSession) {
          const dbCart = await fetchUserCart(session.user.id);
          
          // Merge local cart into DB cart
          if (localCart.length > 0) {
              const mergedCart = [...dbCart];

              localCart.forEach(localItem => {
                  const existingItem = mergedCart.find(item => item.id === localItem.id);
                  if (existingItem) {
                      existingItem.quantity += localItem.quantity;
                  } else {
                      mergedCart.push(localItem);
                  }
              });
              
              const itemsToUpsert = mergedCart.map(item => ({
                  user_id: session.user.id,
                  product_id: item.id,
                  quantity: item.quantity,
              }));
              
              // Clear old items before upserting the merged list
              await supabase.from('cart_items').delete().eq('user_id', session.user.id);
              const { error: upsertError } = await supabase.from('cart_items').upsert(itemsToUpsert);
              
              if (upsertError) console.error("Error merging cart:", upsertError.message);
              
              setLocalCart([]); // Clear local cart after merge
              setCartItems(mergedCart);
          } else {
              setCartItems(dbCart);
          }

        // User logged out
        } else if (!session && prevSession) {
          setCartItems([]); // Clear cart, guest cart will be empty by default
          setLocalCart([]);
        
        // Session unchanged or initial load
        } else {
           if (session) {
              const userCart = await fetchUserCart(session.user.id);
              setCartItems(userCart);
           } else {
              setCartItems(localCart);
           }
        }
      } catch (error) {
          // The error is already logged in the fetchUserCart function
          console.error("Failed to sync cart.", error);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);


  const addToCart = async (product: Product, quantity: number) => {
    const optimisticCart = [...cartItems];
    const existingItemIndex = optimisticCart.findIndex(item => item.id === product.id);
    if (existingItemIndex > -1) {
        optimisticCart[existingItemIndex].quantity += quantity;
    } else {
        optimisticCart.push({ ...product, quantity });
    }
    setCartItems(optimisticCart);

    if (session) {
        const { data } = await supabase
            .from('cart_items')
            .select('quantity')
            .eq('user_id', session.user.id)
            .eq('product_id', product.id)
            .single();

        const newQuantity = (data?.quantity || 0) + quantity;
        
        const { error } = await supabase.from('cart_items').upsert({
            user_id: session.user.id,
            product_id: product.id,
            quantity: newQuantity,
        }, {
            onConflict: 'user_id,product_id'
        });
        if (error) console.error("Error adding to cart:", error.message);
    } else {
        setLocalCart(optimisticCart);
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const optimisticCart = cartItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
    setCartItems(optimisticCart);

    if (session) {
        const { error } = await supabase.from('cart_items').update({ quantity: newQuantity }).match({ user_id: session.user.id, product_id: productId });
        if (error) console.error("Error updating quantity:", error.message);
    } else {
        setLocalCart(optimisticCart);
    }
  };

  const removeFromCart = async (productId: number) => {
    const optimisticCart = cartItems.filter(item => item.id !== productId);
    setCartItems(optimisticCart);

    if (session) {
        const { error } = await supabase.from('cart_items').delete().match({ user_id: session.user.id, product_id: productId });
        if (error) console.error("Error removing from cart:", error.message);
    } else {
        setLocalCart(optimisticCart);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (session) {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', session.user.id);
        if (error) console.error("Error clearing cart:", error.message);
    } else {
        setLocalCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
--- END OF FILE context/CartContext.tsx ---

--- START OF FILE context/SettingsContext.tsx ---
import React from 'react';
import { translations } from '../translations';
import { Translation } from '../types';

// Define the shape of the context data
export interface SettingsContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  colorScheme: 'blue' | 'rose';
  setColorScheme: (scheme: 'blue' | 'rose') => void;
  language: keyof typeof translations;
  setLanguage: (lang: keyof typeof translations) => void;
  t: Translation;
}

// Create the context with an undefined initial value
export const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

// Custom hook for consuming the context, which provides better type safety and error handling
export const useSettings = (): SettingsContextType => {
    const context = React.useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
--- END OF FILE context/SettingsContext.tsx ---

--- START OF FILE components/Header.tsx ---
import React, { useState, useRef, useEffect, useContext } from 'react';
import TopBar from './TopBar';
import SettingsController from './SettingsController';
import { LogoIcon, LogOutIcon, UserIcon, ShoppingCartIcon } from './Icons';
import { CartContext } from '../context/CartContext';
import type { Session } from '@supabase/supabase-js';
import { useSettings } from '../context/SettingsContext';

interface HeaderProps {
  session: Session | null;
  handleSignOut: () => void;
  onSignInClick: () => void;
  onAccountClick: () => void;
  onCartClick: () => void;
}

const UserMenu: React.FC<{session: Session, onAccountClick: () => void, handleSignOut: () => void}> = 
({ session, onAccountClick, handleSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useSettings();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userEmail = session.user.email || '';
    const userInitial = userEmail.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--accent-color)] dark:hover:text-[var(--accent-color-dark)] transition-colors"
            >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center text-white font-bold text-xs">
                    {userInitial}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{userEmail}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-fadeIn">
                    <div className="p-2">
                        <button
                            onClick={() => { onAccountClick(); setIsOpen(false); }}
                            className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                        >
                            <UserIcon size={16} />
                            <span>{t.accountSettings}</span>
                        </button>
                        <div className="my-1 border-t border-black/10 dark:border-white/10"></div>
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                            <LogOutIcon size={16} />
                            <span>{t.signOut}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CartButton: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
    const { cartItems, loading } = useContext(CartContext);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <button
            onClick={onCartClick}
            className="relative p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
            aria-label={`View cart with ${itemCount} items`}
        >
            <ShoppingCartIcon size={20} />
            {!loading && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-color)] text-white text-[10px] font-bold animate-press-down">
                    {itemCount}
                </span>
            )}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ session, handleSignOut, onSignInClick, onAccountClick, onCartClick }) => {
  const { t } = useSettings();

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm">
      <TopBar />
      <div className="container mx-auto px-4 py-2 md:py-0 h-auto md:h-20 flex flex-wrap md:flex-nowrap justify-between items-center">
        
        <div className="flex items-center space-x-1 md:space-x-2 md:flex-1 md:justify-start">
          <a href="https://facebook.com/thainguyeninfi" target="_blank" rel="noopener noreferrer" aria-label={t.facebookAria} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" className="w-5 h-5" />
          </a>
          <a href="https://zalo.me/0938618875" target="_blank" rel="noopener noreferrer" aria-label={t.phoneAria} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg">
            <img src="https://i.postimg.cc/T1hP9NLm/Zalo-2.png" alt="Zalo" className="w-5 h-5" />
          </a>
          <a href="https://t.me/thainguyeninfi" target="_blank" rel="noopener noreferrer" aria-label={t.telegramAria} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="w-5 h-5" />
          </a>
        </div>
        
        <div className="w-full order-first md:w-auto md:order-none md:flex-1 flex justify-center items-center pb-2 md:pb-0 border-b md:border-b-0 border-slate-200 dark:border-slate-700/50 mb-2 md:mb-0">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              role="button"
              aria-label={t.backToTopAria}
            >
              <LogoIcon />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)]">
                AuraTech
              </span>
            </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3 md:flex-1 md:justify-end">
          
          {session ? (
            <UserMenu session={session} onAccountClick={onAccountClick} handleSignOut={handleSignOut} />
          ) : (
             <button 
                onClick={onSignInClick}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
            >
                {t.signIn}
            </button>
          )}
          
          <CartButton onCartClick={onCartClick} />

          <SettingsController />
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
--- END OF FILE components/Header.tsx ---

--- START OF FILE components/TopBar.tsx ---
import React from 'react';
import SessionInfo from './SessionInfo';
import ActivityTicker from './ActivityTicker';

const TopBar: React.FC = () => {
    return (
        <div className="bg-slate-100 dark:bg-black/20 text-gray-600 dark:text-gray-400 animate-fadeInDown border-b border-black/5 dark:border-white/5">
            <div className="container mx-auto px-4 h-8 flex justify-center md:justify-between items-center">
                {/* Session info: Hidden on mobile, shown on desktop */}
                <div className="hidden md:block">
                    <SessionInfo />
                </div>
                {/* Live activity ticker is always visible */}
                <div>
                    <ActivityTicker />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
--- END OF FILE components/TopBar.tsx ---

--- START OF FILE components/SessionInfo.tsx ---
import React, { useState, useEffect } from 'react';
import { GlobeIcon, ClockIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

const SessionInfo: React.FC = () => {
  const { t } = useSettings();
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
        <GlobeIcon size={16} className="text-[var(--accent-color)]" />
        <span>{t.ipAddress}:</span>
        <span className="font-mono">{ip}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <ClockIcon size={16} className="text-[var(--accent-color)]" />
        <span>{t.sessionTime}:</span>
        <span className="font-mono">{sessionTime}</span>
      </div>
    </div>
  );
};

export default SessionInfo;
--- END OF FILE components/SessionInfo.tsx ---

--- START OF FILE components/ActivityTicker.tsx ---
import React, { useState, useEffect } from 'react';
import { UsersIcon, DollarSignIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

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

const ActivityTicker: React.FC = () => {
  const { t } = useSettings();
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
        <span className="font-semibold">{t.liveActivity}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <UsersIcon size={16} className="text-[var(--accent-color)]" />
        <span><AnimatedNumber value={activity.subs} /> <span>{t.activeSubs}</span></span>
      </div>
      <div className="flex items-center space-x-1.5">
        <DollarSignIcon size={16} className="text-green-500" />
        <span>{t.totalSavings}:</span>
        <span className="font-mono">$<AnimatedNumber value={activity.savings} isCurrency /></span>
      </div>
    </div>
  );
};

export default ActivityTicker;
--- END OF FILE components/ActivityTicker.tsx ---

--- START OF FILE components/SettingsController.tsx ---
import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, CheckIcon, SettingsIcon } from './Icons';
import { translations, languageOptions } from '../translations';
import { useSettings } from '../context/SettingsContext';

const colorThemes = [
    { name: 'blue', from: 'from-sky-500', to: 'to-indigo-600' },
    { name: 'rose', from: 'from-rose-500', to: 'to-orange-500' },
];

const SettingsController: React.FC = () => {
  const {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    language,
    setLanguage,
    t
  } = useSettings();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (langId: keyof typeof translations) => {
    setLanguage(langId);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1.5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-md hover:shadow-lg transition-all transform hover:scale-110"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t.settingsAria}
      >
        <SettingsIcon size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-fadeIn"
          role="menu"
        >
          <div className="p-3 space-y-4">
            {/* Appearance Section */}
            <div className="space-y-3">
              <h3 className="px-1 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">{t.appearanceSettingsAria}</h3>
              
              {/* Light/Dark Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">{t.themeLabel}</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      theme === 'light'
                        ? 'bg-[var(--accent-color)] text-white font-semibold'
                        : 'bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <SunIcon size={16} /> {t.lightTheme}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-[var(--accent-color)] text-white font-semibold'
                        : 'bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    <MoonIcon size={16} /> {t.darkTheme}
                  </button>
                </div>
              </div>

              {/* Color Scheme Chooser */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">{t.accentColorLabel}</label>
                <div className="flex items-center space-x-3 px-1">
                  {colorThemes.map((ct) => (
                    <button
                      key={ct.name}
                      onClick={() => setColorScheme(ct.name as 'blue' | 'rose')}
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${ct.from} ${ct.to} transition-transform transform hover:scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ${
                        colorScheme === ct.name ? 'ring-[var(--accent-color)]' : 'ring-transparent'
                      }`}
                      aria-label={`Switch to ${ct.name} theme`}
                    >
                      {colorScheme === ct.name && <CheckIcon size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/10 dark:border-white/10"></div>

            {/* Language Section */}
            <div className="space-y-1">
               <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-2 px-1">{t.language}</label>
               <div className="space-y-1">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleLanguageChange(option.id as keyof typeof translations)}
                      className="w-full text-left flex justify-between items-center px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                      role="menuitem"
                    >
                      <span>{option.name}</span>
                      {language === option.id && <CheckIcon size={16} className="text-[var(--accent-color)]" />}
                    </button>
                  ))}
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsController;
--- END OF FILE components/SettingsController.tsx ---

--- START OF FILE components/Footer.tsx ---
import React from 'react';
import { GdprShieldIcon, ShieldLockIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

const Footer: React.FC = () => {
  const { t } = useSettings();

  return (
    <footer className="mt-16 py-8 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm mb-6">
            <p>{t.copyright(new Date().getFullYear())}</p>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
            <a href="mailto:support@auratech.dev" className="hover:text-[var(--accent-color)] transition-colors">{t.contactUs}</a>
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

--- START OF FILE components/ScrollToTopButton.tsx ---
import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

const ScrollToTopButton: React.FC = () => {
  const { t } = useSettings();
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
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg hover:shadow-xl transform-gpu transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`
      }
    >
      <ChevronUpIcon size={24} />
    </button>
  );
};

export default ScrollToTopButton;
--- END OF FILE components/ScrollToTopButton.tsx ---

--- START OF FILE components/Auth.tsx ---
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogoIcon, XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt?: string;
}

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, prompt }) => {
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>('signIn');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setEmail('');
      setPassword('');
      setError(null);
      setMessage(null);
      setAuthView('signIn');
      if (prompt) {
        setMessage(prompt);
      }
    }
  }, [isOpen, prompt]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    let authError = null;

    if (authView === 'signUp') {
      const { error } = await supabase.auth.signUp({ email, password });
      authError = error;
      if (!error) setMessage(t.magicLinkSent);
    } else { // 'signIn'
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
      if (!error) onClose();
    }
    
    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };
  
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
       // Also provide redirectTo for password reset emails to work in this environment
       redirectTo: window.location.origin,
    });
    if (error) {
        setError(error.message);
    } else {
        setMessage(t.magicLinkSent);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out animate-fadeInUp overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
              aria-label={t.close}
          >
              <XIcon size={24} />
          </button>
          
          <div className="flex flex-col items-center mb-6">
              <LogoIcon size={40} />
              <h1 id="auth-modal-title" className="text-2xl font-bold text-center mt-3 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)]">
                 {authView === 'forgotPassword' ? 'Reset Password' : (prompt ? t.signInToContinue : t.authHeader)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-1">
                {authView !== 'forgotPassword' && (prompt || t.authPrompt)}
              </p>
          </div>

          {authView !== 'forgotPassword' ? (
            <>
            <div className="grid grid-cols-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-6">
                <button onClick={() => setAuthView('signIn')} className={`py-3 transition-colors ${authView === 'signIn' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}>
                    {t.signIn}
                </button>
                 <button onClick={() => setAuthView('signUp')} className={`py-3 transition-colors ${authView === 'signUp' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}>
                    {t.signUp}
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                  <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                          {t.emailLabel}
                      </label>
                      <input
                          id="email"
                          className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                          type="email"
                          placeholder={t.emailLabel}
                          value={email}
                          required
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                         {t.passwordLabel}
                      </label>
                      <input
                          id="password"
                          className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                          type="password"
                          placeholder={t.passwordLabel}
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
              </div>
              
              {authView === 'signIn' && (
                <div className="text-right mt-2">
                    <button type="button" onClick={() => setAuthView('forgotPassword')} className="text-xs text-gray-500 dark:text-gray-400 hover:text-[var(--accent-color)] dark:hover:text-[var(--accent-color-dark)] transition-colors">
                        Forgot Password?
                    </button>
                </div>
              )}

              {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
              {message && <p className="mt-3 text-center text-xs text-green-500">{message}</p>}

              <div className="mt-6">
                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 transition"
                  >
                      {loading ? (authView === 'signIn' ? t.signingIn : t.signingUp) : (authView === 'signIn' ? t.signIn : t.signUp)}
                  </button>
              </div>
            </form>
            </>
          ) : (
            <form onSubmit={handlePasswordReset}>
                 <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Enter your email and we'll send you a link to reset your password.</p>
                 <input
                    id="email-reset"
                    className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                    type="email"
                    placeholder={t.emailLabel}
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                 {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
                 {message && <p className="mt-3 text-center text-xs text-green-500">{message}</p>}

                 <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 transition"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setAuthView('signIn')} className="mt-3 w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-[var(--accent-color)] dark:hover:text-[var(--accent-color-dark)] transition-colors">
                    Back to Sign In
                </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
--- END OF FILE components/Auth.tsx ---

--- START OF FILE components/AccountModal.tsx ---
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { XIcon } from './Icons';
import type { Session } from '@supabase/supabase-js';
import { useSettings } from '../context/SettingsContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, session }) => {
    const { t } = useSettings();
    const [activeTab, setActiveTab] = useState('profile');
    
    // Profile state
    const [profileLoading, setProfileLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    
    // Password state
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (isOpen && session) {
            getProfile();
            // Reset other states
            setActiveTab('profile');
            setProfileMessage('');
            setPasswordMessage('');
            setPasswordError('');
            setPassword('');
            setConfirmPassword('');
        }
    }, [isOpen, session]);

    const getProfile = async () => {
        if (!session) return;
        setProfileLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`full_name, website, address, city, country`)
                .eq('id', session.user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
                throw error;
            }

            if (data) {
                setFullName(data.full_name || '');
                setWebsite(data.website || '');
                setAddress(data.address || '');
                setCity(data.city || '');
                setCountry(data.country || '');
            } else {
                 // Fallback to user metadata if profile doesn't exist yet
                 setFullName(session.user.user_metadata.full_name || '');
            }

        } catch (error: any) {
            console.error('Error fetching profile:', error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setProfileLoading(true);
        setProfileMessage('');
        
        // First, update user metadata in auth.users for consistency (e.g., for header)
        const { error: userError } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        });

        if (userError) {
             setProfileMessage(userError.message);
             setProfileLoading(false);
             return;
        }

        // Then, upsert the complete profile data in the public.profiles table
        const updates = {
            id: session.user.id,
            full_name: fullName,
            website,
            address,
            city,
            country,
            updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase.from('profiles').upsert(updates);

        if (profileError) {
            setProfileMessage(profileError.message);
        } else {
            setProfileMessage(t.profileUpdated);
        }
        setProfileLoading(false);
        setTimeout(() => setProfileMessage(''), 3000);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError(t.passwordsDoNotMatch);
            return;
        }
        setPasswordLoading(true);
        setPasswordMessage('');
        setPasswordError('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setPasswordError(error.message);
        } else {
            setPasswordMessage(t.passwordUpdated);
            setPassword('');
            setConfirmPassword('');
        }
        setPasswordLoading(false);
        setTimeout(() => setPasswordMessage(''), 3000);
    };


  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 relative">
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                aria-label={t.close}
            >
                <XIcon size={24} />
            </button>
            <h2 id="account-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.accountSettings}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</p>

            <div className="border-b border-gray-200 dark:border-gray-700 mt-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>{t.profile}</button>
                    <button onClick={() => setActiveTab('password')} className={`${activeTab === 'password' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>{t.password}</button>
                </nav>
            </div>

            <div className="mt-6 min-h-[280px]">
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileUpdate}>
                        <h3 className="text-lg font-medium">{t.updateProfile}</h3>
                        {profileLoading ? (
                           <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading profile...</div>
                        ) : (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.fullName}</label>
                                <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.websiteLabel}</label>
                                <input type="url" id="website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.addressLabel}</label>
                                <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.cityLabel}</label>
                                    <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.countryLabel}</label>
                                    <input type="text" id="country" value={country} onChange={e => setCountry(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                                </div>
                            </div>
                        </div>
                        )}
                        <div className="mt-6 flex items-center justify-between">
                            <button type="submit" disabled={profileLoading} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none disabled:opacity-50">
                                {profileLoading ? t.updating : t.update}
                            </button>
                            {profileMessage && <span className="text-sm text-green-600 dark:text-green-400 animate-fadeIn">{profileMessage}</span>}
                        </div>
                    </form>
                )}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordUpdate}>
                        <h3 className="text-lg font-medium">{t.changePassword}</h3>
                         <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.newPassword}</label>
                                <input type="password" id="newPassword" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.confirmNewPassword}</label>
                                <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                            </div>
                        </div>
                         <div className="mt-6 flex items-center justify-between">
                            <button type="submit" disabled={passwordLoading} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none disabled:opacity-50">
                                {passwordLoading ? t.updating : t.update}
                            </button>
                             {passwordError && <span className="text-sm text-red-600 dark:text-red-400 animate-fadeIn">{passwordError}</span>}
                            {passwordMessage && <span className="text-sm text-green-600 dark:text-green-400 animate-fadeIn">{passwordMessage}</span>}
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
--- END OF FILE components/AccountModal.tsx ---

--- START OF FILE components/ProductList.tsx ---
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import { Product } from '../types';
import ProductModal from './ProductModal';
import { useSettings } from '../context/SettingsContext';


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useSettings();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }); 

        if (dbError) {
          throw dbError;
        }

        setProducts(data || []);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Could not fetch products. Please ensure your Supabase table is configured correctly.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 animate-pulse">Loading Products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</div>;
  }

  if (products.length === 0) {
      return <div className="text-center text-gray-500">No products found. Add some in your Supabase dashboard!</div>;
  }

  return (
    <div className="w-full">
        <h1 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)] pb-2 animate-fadeInDown">
            Discover Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} t={t} />
            ))}
        </div>
        {selectedProduct && (
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                t={t}
            />
        )}
    </div>
  );
};

export default ProductList;
--- END OF FILE components/ProductList.tsx ---

--- START OF FILE components/ProductCard.tsx ---
import React, { useContext, useState } from 'react';
import { Product, Translation } from '../types';
import { CartContext } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  t: Translation;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, t }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  return (
    <div 
      className="group relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fadeInUp cursor-pointer"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onProductClick(product)}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      <div className="p-5 absolute bottom-0 left-0 right-0">
        <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent-color-dark)] transition-colors duration-300 truncate">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-200 dark:text-gray-300 line-clamp-2 h-[2.5em]">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-semibold text-white">
            ${product.price.toLocaleString()}
          </p>
          <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 group-hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)] disabled:opacity-80 disabled:cursor-not-allowed ${added ? 'bg-green-500 from-green-500 to-green-600' : ''}`}
          >
            {added ? t.addedToCart : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
--- END OF FILE components/ProductCard.tsx ---

--- START OF FILE components/ProductModal.tsx ---
import React, { useState, useContext, useEffect } from 'react';
import { Product, Translation } from '../types';
import { CartContext } from '../context/CartContext';
import { XIcon, PlusIcon, MinusIcon } from './Icons';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, t }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useContext(CartContext);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1); // Reset quantity when modal opens
      setAdded(false); // Reset added state
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
        setAdded(false);
        onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
            aria-label={t.close}
        >
          <XIcon size={28} />
        </button>
        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
            <h2 id="product-modal-title" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)] pr-8">
                {product.name}
            </h2>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-2">${product.price.toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-4 flex-grow">
                {product.long_description || product.description}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><MinusIcon /></button>
                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><PlusIcon /></button>
                </div>
                 <button 
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)] disabled:opacity-80 disabled:cursor-not-allowed ${added ? 'bg-green-500 from-green-500 to-green-600' : ''}`}
                >
                    {added ? t.addedToCart : t.addToCart}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
--- END OF FILE components/ProductModal.tsx ---

--- START OF FILE components/CartModal.tsx ---
import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { XIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { t } = useSettings();
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
    >
        <div 
            className="fixed inset-0"
            onClick={onClose}
        />
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out animate-fadeIn" style={{ animationName: 'slideInRight' }}>
            <style>{`
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            `}</style>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 id="cart-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{t.yourCart}</h2>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label={t.close}
                >
                    <XIcon size={24} />
                </button>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toLocaleString()}</p>
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><MinusIcon size={12}/></button>
                                        <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><PlusIcon size={12} /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="font-bold text-gray-800 dark:text-gray-100">${(item.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 mt-2" aria-label={`${t.remove} ${item.name}`}>
                                    <TrashIcon size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                    <ShoppingCartIcon size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t.emptyCart}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t.emptyCartPrompt}</p>
                 </div>
            )}
            
            {/* Footer */}
            {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="flex justify-between font-semibold">
                        <span>{t.subtotal}</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={onCheckout}
                        className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
                    >
                        {t.checkout}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default CartModal;
--- END OF FILE components/CartModal.tsx ---

--- START OF FILE components/CheckoutModal.tsx ---
import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { XIcon, CheckIcon } from './Icons';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { useSettings } from '../context/SettingsContext';


interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, session }) => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { t } = useSettings();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset states when modal opens
      setIsSuccess(false); 
      setIsProcessing(false);
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirmPurchase = async () => {
    if (!session || cartItems.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
        // 1. Create an order record
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: session.user.id,
                total_amount: subtotal,
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        const orderId = orderData.id;

        // 2. Create order_items records
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
        }));
        
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        // 3. Clear the user's cart
        await clearCart();

        // 4. Show success screen
        setIsSuccess(true);

    } catch (err: any) {
        console.error("Error processing purchase:", err);
        setError("Could not process your order. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 relative">
            <button 
                onClick={handleClose} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                aria-label={t.close}
            >
                <XIcon size={24} />
            </button>

            {isSuccess ? (
                <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                        <CheckIcon size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.purchaseSuccessful}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{t.purchaseSuccessfulMessage}</p>
                    <button 
                        onClick={handleClose}
                        className="mt-6 w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
                    >
                        {t.close}
                    </button>
                </div>
            ) : (
                <>
                    <h2 id="checkout-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.checkoutTitle}</h2>
                    <div className="mt-4 border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 my-4 max-h-60 overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{t.quantity}: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t.total}</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>

                    {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}

                    <button 
                        onClick={handleConfirmPurchase}
                        disabled={cartItems.length === 0 || isProcessing}
                        className="mt-6 w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)] disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : t.confirmPurchase}
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
--- END OF FILE components/CheckoutModal.tsx ---

--- START OF FILE components/UserGuide.tsx ---
import React, { useEffect } from 'react';
import { XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0" open>
    <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent-color)] dark:group-hover:text-[var(--accent-color-dark)] transition-colors">
      {title}
      <span className="transform transition-transform duration-200 group-open:rotate-180 text-sm">▼</span>
    </summary>
    <div className="mt-4 text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none">
      {children}
    </div>
  </details>
);

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
    const { t } = useSettings();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;
  
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-guide-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out animate-fadeInUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 id="user-guide-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{t.howToUseThisApp}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        aria-label={t.close}
                    >
                        <XIcon size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <GuideSection title="1. Appearance & Settings">
                      <ul>
                        <li><strong>Access Settings:</strong> Click the <strong>settings icon (⚙️)</strong> in the top-right corner of the header.</li>
                        <li><strong>Theme:</strong> Choose between <strong>Light</strong> and <strong>Dark</strong> mode for your preferred viewing experience.</li>
                        <li><strong>Accent Color:</strong> Select one of the color bubbles to change the application's gradient theme.</li>
                        <li><strong>Language:</strong> Switch between English, Tiếng Việt, and ไทย.</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title="2. Shopping">
                       <ul>
                        <li><strong>Viewing Products:</strong> Scroll through the main page to see all available products. Click on any product card to open a detailed view with more information.</li>
                        <li>
                            <strong>Adding to Cart:</strong>
                            <ul className="list-disc ml-6 mt-1">
                                <li>Click the <strong>"Add to Cart"</strong> button on a product card to add one item to your cart.</li>
                                <li>In the detailed view, you can adjust the quantity before adding.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Managing Your Cart:</strong>
                             <ul className="list-disc ml-6 mt-1">
                                <li>Click the <strong>shopping cart icon (🛒)</strong> in the header to open your cart.</li>
                                <li>Inside the cart, use the <strong>plus (+)</strong> and <strong>minus (-)</strong> buttons to change item quantities.</li>
                                <li>Click the <strong>trash icon (🗑️)</strong> to remove an item completely.</li>
                            </ul>
                        </li>
                      </ul>
                    </GuideSection>

                    <GuideSection title="3. Checkout">
                       <ul>
                        <li><strong>Proceed to Checkout:</strong> Once you are happy with your cart, click the "Proceed to Checkout" button.</li>
                        <li><strong>Sign In:</strong> If you are not already signed in, you will be prompted to do so. This is required to save your order history.</li>
                        <li><strong>Confirm Purchase:</strong> Review your order details in the checkout modal and click "Confirm Purchase" to complete the transaction. Your cart will be cleared, and a simulated order will be saved to your account.</li>
                      </ul>
                    </GuideSection>
                    
                    <GuideSection title="4. Your Account">
                         <ul>
                            <li><strong>Sign In/Up:</strong> Click the "Sign In" button in the header to create an account or log in.</li>
                            <li><strong>Account Management:</strong> When logged in, click your email address in the header to open the user menu. From there, you can access your <strong>Account Settings</strong> to update your profile information or change your password.</li>
                            <li><strong>Sign Out:</strong> Log out of your account from the user menu.</li>
                        </ul>
                    </GuideSection>
                </div>
            </div>
        </div>
    );
};

export default UserGuideModal;
--- END OF FILE components/UserGuide.tsx ---

--- START OF FILE components/Icons.tsx ---
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const SunIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx