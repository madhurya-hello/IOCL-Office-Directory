// profileUtils.js
const bgColors = ["#E74694", "#00B4D8", "#FF9E00", "#2EC4B6", "#E71D36", "#FF9F1C", "#3A86FF"];



// Simple hash function to convert a string to a number
const stringToHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Get consistent color for a name
export const getColorForName = (name) => {
  const hash = stringToHash(name);
  return bgColors[hash % bgColors.length];
};

// Generate profile image with consistent color
export const generateProfileImage = (name, size = 40) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Get consistent background color
  const bgColor = getColorForName(name);
  
  // Draw background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw initial
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `${size/2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), size/2, size/2);
  
  return canvas.toDataURL();
};