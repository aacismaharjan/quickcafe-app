/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, Divider, Paper, Container } from '@mui/material';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { API_SERVER } from '../utils/AxiosInstance';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { getPrice } from './CartPage';
import useStoredIDs from '../utils/useStoredIDs';

export const calculateGrandTotal = (orderDetails: any) => {
  return orderDetails.reduce((total: number, item: any) => {
    return total + item.quantity * item.unitPrice;
  }, 0);
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState<number>(2); // 0 for cash, 1 for card
  const [formData, setFormData] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null); // Reference to the form
  const { canteenID } = useStoredIDs();

  useEffect(() => {
    if (formData && formRef.current) {
      formRef.current.submit();
    }
  }, [formData]);

  if (!cartContext) {
    return null;
  }

  const { cart, clearCart } = cartContext;

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = subtotal * 1.1; // Assuming a 10% tax rate or other adjustments

  const handleCompleteOrder = async (e: React.MouseEvent) => {
    e.preventDefault();

    const orderPayload = {
      canteen: {
        id: canteenID,
      },
      orderStatus: 0,
      orderDetails: cart.map((item) => ({
        menuItem: { id: item.id },
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      paymentStatus: 0, // Assuming 1 is unpaid, 2 is paid
      paymentMethod, // 0 for cash, 1 for card
    };

    try {
      const res = await axiosInstance.post('/profile/orders', orderPayload);
      const order = res.data;

      if (order.paymentMethod == 'ONLINE' && order.paymentStatus == 'PENDING') {
        // Calculate grand total
        const amount = calculateGrandTotal(order.orderDetails);
        const tax_amount = 10; // tax as provided in the requirements
        const total_amount = amount + tax_amount;

        const hash = CryptoJS.HmacSHA256(
          `total_amount=${total_amount},transaction_uuid=${order.uuid},product_code=EPAYTEST`,
          '8gBm/:&EnhH.1/q'
        );
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        // Prepare form data
        setFormData({
          amount: amount,
          failure_url: `${API_SERVER}/api/v1/profile/orders/${order.id}/checkout`,
          product_delivery_charge: 0,
          product_service_charge: 0,
          product_code: 'EPAYTEST',
          signature: hashInBase64,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          success_url: `${API_SERVER}/api/v1/profile/orders/${order.id}/checkout`,
          tax_amount: tax_amount,
          total_amount: total_amount,
          transaction_uuid: order.uuid,
        });

        return;
      }

      clearCart();
      toast.info('Your order has been successfully placed.');
      navigate(`/order-confirmation?orderId=${res.data.id}`, {
        state: {
          orderDetails: cart,
          grandTotal,
        },
      });
    } catch (error) {
      console.error('Failed to complete order', error);
    }
  };

  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Paper sx={{ mt: 3 }}>
          <form ref={formRef} action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <Box sx={{ p: 2, margin: 'auto' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Checkout
              </Typography>

              {/* Cart Items */}
              <Paper sx={{ p: 2, mb: 2 }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="subtitle1">{getPrice(item.price)}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ alignSelf: 'center' }}>
                      {getPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="subtitle1">Subtotal</Typography>
                  <Typography variant="subtitle1">{getPrice(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="subtitle1">Grand Total</Typography>
                  <Typography variant="subtitle1">{getPrice(grandTotal)}</Typography>
                </Box>
              </Paper>

              {/* Payment Method Selection */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Payment Method
                </Typography>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(Number(e.target.value))} row>
                  <FormControlLabel value={0} control={<Radio />} label="Cash" />
                  <FormControlLabel value={2} control={<Radio defaultChecked />} label="Online (Esewa)" />
                </RadioGroup>
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'none' }}>
                  <input type="text" id="amount" name="amount" value={formData?.amount ?? ''} required />
                  <input type="text" id="tax_amount" name="tax_amount" value={formData?.tax_amount ?? ''} required />
                  <input
                    type="text"
                    id="total_amount"
                    name="total_amount"
                    value={formData?.total_amount ?? ''}
                    required
                  />
                  <input
                    type="text"
                    id="transaction_uuid"
                    name="transaction_uuid"
                    value={formData?.transaction_uuid ?? ''}
                    required
                  />
                  <input
                    type="text"
                    id="product_code"
                    name="product_code"
                    value={formData?.product_code ?? 'EPAYTEST'}
                    required
                  />
                  <input
                    type="text"
                    id="product_service_charge"
                    name="product_service_charge"
                    value={formData?.product_service_charge ?? '0'}
                    required
                  />
                  <input
                    type="text"
                    id="product_delivery_charge"
                    name="product_delivery_charge"
                    value={formData?.product_delivery_charge ?? '0'}
                    required
                  />
                  <input
                    type="text"
                    id="success_url"
                    name="success_url"
                    value={formData?.success_url ?? `${window.location.origin}/checkout`}
                    required
                  />
                  <input
                    type="text"
                    id="failure_url"
                    name="failure_url"
                    value={formData?.failure_url ?? `${window.location.origin}/checkout`}
                    required
                  />
                  <input
                    type="text"
                    id="signed_field_names"
                    name="signed_field_names"
                    value={formData?.signed_field_names ?? 'total_amount,transaction_uuid,product_code'}
                    required
                  />
                  <input type="text" id="signature" name="signature" value={formData?.signature ?? ''} required />
                </Box>
                <Button variant="contained" color="primary" onClick={handleCompleteOrder} sx={{ width: '100%' }}>
                  Complete Order
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate('/cart')} sx={{ width: '100%' }}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </React.Fragment>
  );
};

export { CheckoutPage };
