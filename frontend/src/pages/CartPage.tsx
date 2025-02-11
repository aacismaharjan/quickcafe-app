import React, { useContext } from 'react';
import { Box, Typography, Button, IconButton, Container, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cart, removeFromCart, clearCart, updateQuantity } = cartContext;

  return (
    <Container maxWidth="md" disableGutters>
      <React.Fragment>
        <Box sx={{ p: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Cart
            </Typography>
            {cart.length > 0 ? (
              <>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', mb: 2, borderBottom: '1px solid #ccc', pb: 2 }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{
                        width: '100%', // Ensures it scales within its container
                        maxWidth: '200px', // Limits max width
                        aspectRatio: '16/9',
                        padding: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        objectFit: 'cover', // Ensures it fills the aspect ratio properly
                      }}
                    />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      {getPrice(item.price)}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Typography variant="h6">{item.quantity}</Typography>
                        </IconButton>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <AddIcon />
                        </IconButton>
                        <IconButton onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <Button variant="contained" color="error" onClick={clearCart} sx={{ marginRight: 2 }}>
                  Clear Cart
                </Button>

                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    navigate('/checkout');
                  }}
                >
                  Checkout
                </Button>
              </>
            ) : (
              <Typography variant="body1">Your cart is empty.</Typography>
            )}
          </Paper>
        </Box>
      </React.Fragment>
    </Container>
  );
};

export { CartPage };

export function getPrice(price: number) {
  return (
    <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: 'black' }}>
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="20px"
        style={{ display: 'inline-block', color: 'green', position: 'relative', top: -2, marginRight: 4 }}
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15 5h-11h3a4 4 0 1 1 0 8h-3l6 6"></path>
        <path d="M21 17l-4.586 -4.414a2 2 0 0 0 -2.828 2.828l.707 .707"></path>
      </svg>
      {price.toFixed(2)}
    </Typography>
  );
}
