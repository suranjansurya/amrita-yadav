export const photoConfig = {
  // Default image path expected in public/images/amrita.jpg or public/amrita.jpg
  defaultPhotoSrc: '/images/amrita.jpg',
  fallbackPhotoSrc: '/amrita.jpg',
  
  // Available 3D frame styles
  styles: [
    { id: 'rounded', label: 'Rounded Premium', icon: '✨' },
    { id: 'crystal', label: 'Crystal Glass', icon: '💎' },
    { id: 'heart', label: 'Heart Silhouette', icon: '❤️' },
  ],
  
  defaultStyle: 'rounded',
  defaultAutoRotate: true,
  defaultRotationSpeed: 0.15,
};
