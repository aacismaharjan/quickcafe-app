// src/Order.tsx
import React from 'react'

const Order = ({
  orders,
  onRemoveFromOrder,
  totalPrice
}: {
  orders: { name: string, price: number }[],
  onRemoveFromOrder: (item: string) => void,
  totalPrice: number
}) => {
  return (
    <div>
      <h2>Your Order</h2>
      {orders.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              {order.name} - ${order.price}
              <button onClick={() => onRemoveFromOrder(order.name)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <hr />
      <div>
        <strong>Total Items: {orders.length}</strong><br />
        <strong>Total Price: ${totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  )
}

export default Order
