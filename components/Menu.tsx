// src/Menu.tsx
import React from 'react'

const menuItems = [
  { name: 'Burger', price: 5, image: '/assets/Burger.jpeg' },
  { name: 'Pizza', price: 7, image: '/assets/Pizza.jpeg' },
  { name: 'Pasta', price: 6, image: '/assets/Pasta.jpeg' },
  { name: 'Salad', price: 4, image: '/assets/Salad.jpeg' },
]

const Menu = ({ onAddToOrder }: { onAddToOrder: (item: string, price: number) => void }) => {
  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item">
            <img src={item.image} alt={item.name} className="menu-item-img" />
            <div>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <button onClick={() => onAddToOrder(item.name, item.price)}>Add to Order</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Menu
