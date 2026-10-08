export const GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Units at or below this number show "low stock"
export const LOW_STOCK = 5

// To change an image: right-click an image on Google > "Copy image address" > paste here.
// Broken links hide themselves automatically.
export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200',
  donors: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=1200',
  requests: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200',
}

// FORM PATTERNS (regular expressions)
export const PATTERNS = {
  name: /^[A-Za-z ]{3,40}$/,            // letters and spaces only, 3-40 characters
  aadhaar: /^[2-9][0-9]{11}$/,          // 12 digits, first digit 2-9
  phone: /^[6-9][0-9]{9}$/,             // 10 digits, starts with 6-9
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // something@something.something
  pincode: /^[1-9][0-9]{5}$/,           // 6 digits, not starting with 0
}