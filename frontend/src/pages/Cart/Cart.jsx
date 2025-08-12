import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartIsEmpty = getTotalCartAmount() === 0;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <React.Fragment key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${(item.price * cartItems[item._id]).toFixed(2)}</p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>X</p>
                </div>
                <hr />
              </React.Fragment>
            );
          }
          return null;
        })}

        {cartIsEmpty && (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${cartIsEmpty ? '0.00' : '2.00'}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${cartIsEmpty ? '0.00' : (getTotalCartAmount() + 2).toFixed(2)}</b>
            </div>
            <button
              disabled={cartIsEmpty}
              onClick={() => navigate('/order')}
              style={{ opacity: cartIsEmpty ? 0.6 : 1 }}
            >
              PROCEED TO CHECK OUT
            </button>
          </div>
        </div>

        <div className="cart-promocode">
          <p>If you have a promocode, enter it here</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Type promocode" />
            <button disabled={cartIsEmpty}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
