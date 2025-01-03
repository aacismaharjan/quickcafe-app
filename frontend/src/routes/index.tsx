// routes/index.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import ProtectedRoute from '../utils/ProtectedRoute';
import { MenuItemPage } from '../pages/MenuItemPage';
import { CartPage } from '../pages/CartPage';
import { FavoritesPage } from '../pages/FavoritePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { MyOrderHistory } from '../pages/MyOrderHistory';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import AppLayout from '../components/template/AppLayout';

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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/my-order-history" element={<MyOrderHistory />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<SettingsPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
