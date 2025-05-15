import React from 'react';
import './RatingSlider.css';

const RatingSlider = ({ value, onChange, min = 0, max = 10, step = 0.1 }) => {
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

export default RatingSlider;