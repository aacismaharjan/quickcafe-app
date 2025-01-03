import { ToastContainer } from 'react-toastify';
import './App.css';
import AppRoutes from './routes';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { CartProvider } from './context/CartContext';
import { LoadingProvider } from './context/LoadingContext';
import LoadingOverlay from './components/template/LoadingOverlay';

function App() {
  return (
    <>
      <LoadingProvider>
        <LoadingOverlay />
        <ThemeProvider theme={theme}>
          <CartProvider>
            <AppRoutes />
            <ToastContainer />
          </CartProvider>
        </ThemeProvider>
      </LoadingProvider>
    </>
  );
}

export default App;
