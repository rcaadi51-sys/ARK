/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider, useRouter } from './router/Router';
import { HirePulseProvider } from './context/HirePulseContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { CareersPage } from './pages/CareersPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewJobPage } from './pages/NewJobPage';
import { KanbanPipelinePage } from './pages/KanbanPipelinePage';
import { CandidateViewerPage } from './pages/CandidateViewerPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppRoutes() {
  const { path } = useRouter();

  // Route matching
  if (path === '/' || path === '') {
    return <CareersPage />;
  }

  if (path.startsWith('/jobs/')) {
    return <JobDetailPage />;
  }

  if (path === '/dashboard') {
    return <DashboardPage />;
  }

  if (path === '/dashboard/jobs/new') {
    return <NewJobPage />;
  }

  if (path.startsWith('/dashboard/jobs/')) {
    return <KanbanPipelinePage />;
  }

  if (path.startsWith('/dashboard/applications/')) {
    return <CandidateViewerPage />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  // Fallback to CareersPage
  return <CareersPage />;
}

export default function App() {
  return (
    <HirePulseProvider>
      <RouterProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0F172A] selection:bg-[#0B6E99]/15 selection:text-[#0B6E99]">
          <Header />
          <main className="flex-1 w-full">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </RouterProvider>
    </HirePulseProvider>
  );
}
