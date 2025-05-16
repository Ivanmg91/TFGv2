import React from 'react';
import './RelaseSlider.css';

const actualYear = new Date().getFullYear();

const RelaseSlider = ({ value, onChange, min = 1900, max = actualYear, step = 1 }) => {
  return (
    <div className="rating-slider">
      <label>
        {value}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
      </label>
    </div>
  );
};

export default RelaseSlider;