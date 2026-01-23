import { useApp, AppProvider } from '@/contexts/AppContext';
import { LoginScreen } from '@/components/LoginScreen';
import { Dashboard } from '@/components/Dashboard';

function AppContent() {
  const { isLoggedIn } = useApp();
  
  return isLoggedIn ? <Dashboard /> : <LoginScreen />;
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
