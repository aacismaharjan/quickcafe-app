// src/App.tsx
import React, { useState } from 'react'
import Menu from './Menu'
import Order from './Order'
import './App.css'

function App() {
  // Track orders with both name and price
  const [orders, setOrders] = useState<{ name: string, price: number }[]>([])

  // Function to add items to the order
  const addToOrder = (item: string, price: number) => {
    setOrders((prevOrders) => [...prevOrders, { name: item, price }])
  }

  // Function to remove an item from the order
  const removeFromOrder = (item: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.name !== item))
  }

  // Calculate the total price of the order
  const totalPrice = orders.reduce((total, order) => total + order.price, 0)

  // Function to clear all orders from the cart
  const clearOrders = () => {
    setOrders([])  // This clears the orders array
  }

  return (
    <div className="App">
      <h1>Welcome to QuickCafe !</h1>
      <Menu onAddToOrder={addToOrder} />  {/* Pass function to Menu */}
      <Order 
        orders={orders} 
        onRemoveFromOrder={removeFromOrder} 
        totalPrice={totalPrice} 
      />
      <button onClick={clearOrders} style={{ marginTop: '20px' }}>
        Clear Orders
      </button>
    </div>
  )
}

export default App
