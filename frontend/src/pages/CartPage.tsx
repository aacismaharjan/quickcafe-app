import React, { useContext } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cart, removeFromCart, clearCart, updateQuantity } = cartContext;

  return (
    <React.Fragment>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Cart
        </Typography>
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', mb: 2, borderBottom: '1px solid #ccc', pb: 2 }}>
                <img src={item.imageUrl} alt={item.title} width="80" />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography variant="subtitle1">Price: ${item.price.toFixed(2)}</Typography>
                  <Typography variant="subtitle2">Quantity: {item.quantity}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      -
                    </Button>
                    <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <IconButton onClick={() => removeFromCart(item.id)}>
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
      </Box>
    </React.Fragment>
  );
};

export { CartPage };
