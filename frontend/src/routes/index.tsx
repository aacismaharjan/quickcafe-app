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
import { DashboardMenuDetailPage } from '../pages/dashboard/menu-item/DashboardMenuDetailPage';
import { DashboardCreateMenuDetailPage } from '../pages/dashboard/menu-item/DashboardCreateMenuDetailPage';
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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

      <Route path="/dashboard" element={<DashboardProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/menu-detail" element={<DashboardMenuDetailPage />} />
        <Route path="/dashboard/menu-detail/create" element={<DashboardCreateMenuDetailPage />} />
        <Route path="/dashboard/menu-detail/:menuItemId/edit" element={<DashboardCreateMenuDetailPage />} />
        <Route path="/dashboard/menu" element={<MenuPage />} />
        <Route path="/dashboard/menu/create" element={<CreateMenuPage />} />
        <Route path="/dashboard/menu/:menuId/edit" element={<CreateMenuPage />} />
        <Route path="/dashboard/ledger" element={<LedgerPage />} />
        <Route path="/dashboard/ledger/create" element={<CreateLedgerPage />} />
        <Route path="/dashboard/ledger/:ledgerId/edit" element={<CreateLedgerPage />} />
        <Route path="/dashboard/orders" element={<OrderPage />} />
        <Route path="/dashboard/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/dashboard/settings" element={<DashboardSettingPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
