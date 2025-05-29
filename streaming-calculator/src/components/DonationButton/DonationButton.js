import React from 'react';
import './DonationButton.css'

const PAYPAL_EMAIL = 'montianogonzalezivan@gmail.com'; // Cambia esto por tu correo de PayPal

const DonationButton = ({ amount = '', label = 'Donar con PayPal' }) => (
  <form action={`https://www.paypal.com/donate`} method="post" target="_blank">
    <input type="hidden" name="business" value={PAYPAL_EMAIL} />
    <input type="hidden" name="currency_code" value="EUR" />
    {amount && <input type="hidden" name="amount" value={amount} />}
    <button type="submit" className='button' style={{
      background: '#ffc439',
      color: '#111',
      border: 'none',
      borderRadius: 8,
      padding: '12px 28px',
      fontSize: 18,
      fontWeight: 'bold',
      cursor: 'pointer',
    }}>
      <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" style={{ height: 24, marginRight: 8, verticalAlign: 'middle' }} />
      {label}
    </button>
  </form>
);

export default DonationButton;