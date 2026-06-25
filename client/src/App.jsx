import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import ScrollToTop from '@/components/ui/ScrollToTop';
import Login from '@/pages/Login';
import AppLayout from '@/components/layout/AppLayout';
import PostIdeas from '@/pages/PostIdeas';
import MessageDrafts from '@/pages/MessageDrafts';
import Prospects from '@/pages/Prospects';
import AppSettings from '@/pages/AppSettings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, authChecked } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PostIdeas />} />
          <Route path="/messages" element={<MessageDrafts />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/settings" element={<AppSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App