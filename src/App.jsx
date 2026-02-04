import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { CampaignList } from './pages/Campaigns/CampaignList';
import { CampaignDetail } from './pages/Campaigns/CampaignDetail';
import { ScreenList } from './pages/Inventory/ScreenList';
import { ScreenForm } from './pages/Inventory/ScreenForm';
import { BulkUpload } from './pages/Inventory/BulkUpload';
import { SlotConfiguration } from './pages/Config/SlotConfiguration';
import { SlotForm } from './pages/Config/SlotForm';
import { PricingConfiguration } from './pages/Config/PricingConfiguration';
import { PricingForm } from './pages/Config/PricingForm';
import { EventCalendar } from './pages/Events/EventCalendar';
import { EventForm } from './pages/Events/EventForm';
import { TenantManagement } from './pages/Tenants/TenantManagement';
import { TenantForm } from './pages/Tenants/TenantForm';
import { UserManagement } from './pages/Users/UserManagement';
import { UserForm } from './pages/Users/UserForm';
import { AgencyForm } from './pages/Users/AgencyForm';
import { CampaignForm } from './pages/Campaigns/CampaignForm';
import { ReportList } from './pages/Reports/ReportList';
import { CampaignReport } from './pages/Reports/CampaignReport';
import { UserReport } from './pages/Reports/UserReport';
import { ScreenReport } from './pages/Reports/ScreenReport';
import { ContractList } from './pages/Contracts/ContractList';
import { ContractForm } from './pages/Contracts/ContractForm';
import { QuotationList } from './pages/Quotations/QuotationList';
import { QuotationForm } from './pages/Quotations/QuotationForm';

// Placeholder pages for valid routing
const Placeholder = ({ title }) => <h1 className="text-2xl font-bold">{title} Page</h1>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/campaigns" element={<CampaignList />} />
                <Route path="/campaigns/new" element={<CampaignForm />} />
                <Route path="/campaigns/:id" element={<CampaignDetail />} />
                <Route path="/campaigns/:id/edit" element={<CampaignForm />} />
                <Route path="/inventory" element={<ScreenList />} />
                <Route path="/inventory/bulk-upload" element={<BulkUpload />} />
                <Route path="/inventory/:id" element={<ScreenForm />} />
                <Route path="/slots" element={<SlotConfiguration />} />
                <Route path="/slots/:id" element={<SlotForm />} />
                <Route path="/pricing" element={<PricingConfiguration />} />
                <Route path="/pricing/:id" element={<PricingForm />} />
                <Route path="/events" element={<EventCalendar />} />
                <Route path="/events/:id" element={<EventForm />} />
                <Route path="/tenants" element={<TenantManagement />} />
                <Route path="/tenants/:id" element={<TenantForm />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/users/:id" element={<UserForm />} />
                <Route path="/agencies/:id" element={<AgencyForm />} />
                <Route path="/reports" element={<ReportList />} />
                <Route path="/reports/campaign/:id" element={<CampaignReport />} />
                <Route path="/reports/users" element={<UserReport />} />
                <Route path="/reports/screens" element={<ScreenReport />} />
                <Route path="/contracts" element={<ContractList />} />
                <Route path="/contracts/new" element={<ContractForm />} />
                <Route path="/contracts/:id" element={<ContractForm />} />
                <Route path="/quotations" element={<QuotationList />} />
                <Route path="/quotations/new" element={<QuotationForm />} />
                <Route path="/quotations/:id" element={<QuotationForm />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
