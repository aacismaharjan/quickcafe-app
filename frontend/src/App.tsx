import { Slide, ToastContainer } from 'react-toastify';
import AppRoutes from './routes';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { CartProvider } from './context/CartContext';
import { LoadingProvider } from './context/LoadingContext';
import LoadingOverlay from './components/template/LoadingOverlay';
import './GlobalStyle.scss';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <LoadingProvider>
        <LoadingOverlay />
        <ThemeProvider theme={theme}>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            <ToastContainer position="top-center"  newestOnTop={true} closeOnClick theme="colored" transition={Slide} limit={5} autoClose={3000} />
          </CartProvider>
        </ThemeProvider>
      </LoadingProvider>
    </>
  );
}

export default App;
