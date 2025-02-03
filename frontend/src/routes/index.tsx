// routes/index.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import ProtectedRoute, { DashboardProtectedRoute } from '../utils/ProtectedRoute';
import { MenuItemPage } from '../pages/MenuItemPage';
import { CartPage } from '../pages/CartPage';
import { FavoritesPage } from '../pages/FavoritePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { MyOrderHistory } from '../pages/MyOrderHistory';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import AppLayout from '../components/template/AppLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MenuDetailPage } from '../pages/dashboard/menu-item/MenuDetailPage';
import { CreateMenuDetailPage } from '../pages/dashboard/menu-item/CreateMenuDetailPage';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import MenuPage from '../pages/dashboard/menu/MenuPage';
import CreateMenuPage from '../pages/dashboard/menu/CreateMenuPage';
import LedgerPage from '../pages/dashboard/ledger/LedgerPage';
import CreateLedgerPage from '../pages/dashboard/ledger/CreateLedgerPage';
import { SearchPage } from '../pages/SearchPage';
import { DashboardSettingPage } from '../pages/dashboard/SettingPage';
import { OrderPage } from '../pages/dashboard/order/OrderPage';
import { OrderDetailsPage } from '../pages/dashboard/order/OrderDetailsPage';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes for Main App */}
      <Route
        path="/"
        element={
          <AppLayout>
            <ProtectedRoute />
          </AppLayout>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/menu-items/:menuItemId" element={<MenuItemPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/my-order-history" element={<MyOrderHistory />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<SettingsPage />} />
      </Route>

      {/* Dashboard Routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardProtectedRoute />
          </DashboardLayout>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="menu-detail" element={<MenuDetailPage />} />
        <Route path="menu-detail/create" element={<CreateMenuDetailPage />} />
        <Route path="menu-detail/:menuItemId/edit" element={<CreateMenuDetailPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/create" element={<CreateMenuPage />} />
        <Route path="menu/:menuId/edit" element={<CreateMenuPage />} />
        <Route path="ledger" element={<LedgerPage />} />
        <Route path="ledger/create" element={<CreateLedgerPage />} />
        <Route path="ledger/:ledgerId/edit" element={<CreateLedgerPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="settings" element={<DashboardSettingPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
