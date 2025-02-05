import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {signOut, onAuthStateChanged} from 'firebase/auth';
import { BrowserRouter as Router, Route,Routes ,Navigate } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import {useScrollToTop} from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { Iconify } from 'src/components/iconify';
import { auth } from './firebase';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import StudentsPage from './components/StudentPage';

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={() => {
        signOut(auth);
        toast.success('Logged out successfully');
      }} />
      <div style={{ flex: 1, padding: '20px' }}>
        <StudentsPage />
      </div>
    </div>
  );
}

function App() {
  useScrollToTop();

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      {githubButton}
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </ThemeProvider>
  );
}

export default App;
