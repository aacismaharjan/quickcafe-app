// routes/index.tsx
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { useAuth } from '../hooks/useAuth';
import MapPage from '../pages/MapPage';
import ReviewsPage from '../pages/dashboard/review/ReviewsPage';
import { ViewPage } from '../pages/ViewPage';

const AppRoutes: React.FC = () => {
  const { verify, refresh } = useAuth();
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const isValid = await verify(accessToken);
        if (!isValid) {
          const newToken = await refresh();
          if (newToken) {
            localStorage.setItem('accessToken', newToken);
          } else {
            window.location.href = '/login';
          }
        }
      }
    };

    checkToken();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/view" element={<ViewPage/>}></Route>

        <Route path="/map" element={<MapPage />} />
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
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="settings" element={<DashboardSettingPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
