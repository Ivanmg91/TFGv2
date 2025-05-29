import React from 'react';
import DonationButton from '../components/DonationButton/DonationButton';

function WhoWeArePage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 85 }}>
      <DonationButton amount="1" label="Donar" />
    </div>
  );
}

export default WhoWeArePage;