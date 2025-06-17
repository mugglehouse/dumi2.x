// 颜色选择器
import React, { useState, type FC } from 'react';

interface ColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ defaultColor = '#1890ff', onChange }) => {
  const [color, setColor] = useState(defaultColor);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange?.(newColor);
  };
  
  return (
    <div className="color-picker">
      <input 
        type="color" 
        value={color} 
        onChange={handleColorChange} 
      />
      <span className="color-value">{color}</span>
    </div>
  );
};

export default ColorPicker;