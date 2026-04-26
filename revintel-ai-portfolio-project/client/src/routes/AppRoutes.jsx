import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ForecastPage from '../pages/ForecastPage';
import ProductsPage from '../pages/ProductsPage';
import RegionsPage from '../pages/RegionsPage';
import AnomaliesPage from '../pages/AnomaliesPage';
import ScenarioPage from '../pages/ScenarioPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/demo-login" element={<LoginPage />} />
      <Route path="/app" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="forecasting" element={<ForecastPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="regions" element={<RegionsPage />} />
        <Route path="anomalies" element={<AnomaliesPage />} />
        <Route path="scenario-planner" element={<ScenarioPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
