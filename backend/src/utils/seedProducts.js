const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/database');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const products = [
  {
    name: 'Classic Crewneck Tee',
    description: 'A timeless crewneck t-shirt made from premium, soft-touch cotton. Perfect for everyday wear, it offers a comfortable fit and a clean, minimalist look.',
    price: 45.00,
    category: 'Men',
    type: 'T-Shirts',
    images: [{ url: 'https://picsum.photos/seed/saine1/800/1000' }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Grey'],
    stockQuantity: 100,
    featured: true
  },
  {
    name: 'Urban Hoodie',
    description: 'Stay warm and stylish with our Urban Hoodie. Featuring a relaxed fit, a cozy fleece interior, and a modern design, it\'s the perfect layering piece for any season.',
    price: 120.00,
    category: 'Men',
    type: 'Hoodies',
    images: [{ url: 'https://picsum.photos/seed/saine2/800/1000' }],
    sizes: ['S', 'M', 'L'],
    colors: ['Navy', 'Black', 'Olive'],
    stockQuantity: 50,
    featured: true
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Versatile and comfortable, these slim-fit chinos are crafted from a stretch-cotton blend for all-day comfort. Dress them up or down for any occasion.',
    price: 85.00,
    category: 'Men',
    type: 'Pants',
    images: [{ url: 'https://picsum.photos/seed/saine3/800/1000' }],
    sizes: ['30', '32', '34', '36'],
    colors: ['Khaki', 'Navy', 'Grey'],
    stockQuantity: 75
  },
  {
    name: 'Linen Button-Up Shirt',
    description: 'A breathable and lightweight linen shirt, perfect for warm weather. It features a classic collar and a tailored fit for a sharp, sophisticated look.',
    price: 95.00,
    category: 'Women',
    type: 'Shirts',
    images: [{ url: 'https://picsum.photos/seed/saine4/800/1000' }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Beige'],
    stockQuantity: 60
  },
  {
    name: 'Denim Jacket',
    description: 'An iconic denim jacket with a modern twist. Made from durable denim with a slight stretch for comfort, it features classic pocket styling and branded hardware.',
    price: 150.00,
    category: 'Women',
    type: 'Jackets',
    images: [{ url: 'https://picsum.photos/seed/saine5/800/1000' }],
    sizes: ['M', 'L', 'XL'],
    colors: ['Indigo', 'Light Blue'],
    stockQuantity: 40
  },
  {
    name: 'Flowy Maxi Dress',
    description: 'An elegant maxi dress made from a lightweight, breathable fabric. Perfect for summer events or a relaxed day out.',
    price: 135.00,
    category: 'Women',
    type: 'Dresses',
    images: [{ url: 'https://picsum.photos/seed/saine9/800/1000' }],
    sizes: ['S', 'M', 'L'],
    colors: ['Floral', 'Red', 'Blue'],
    stockQuantity: 45
  },
  {
    name: 'Essential Beanie',
    description: 'A soft, ribbed beanie made from a warm wool blend. The perfect accessory for colder days, featuring a subtle embroidered logo.',
    price: 35.00,
    category: 'Kids',
    type: 'Accessories',
    images: [{ url: 'https://picsum.photos/seed/saine8/800/1000' }],
    sizes: ['One Size'],
    colors: ['Black', 'Yellow', 'Pink'],
    stockQuantity: 120
  },
  {
    name: 'Graphic Print Tee',
    description: 'A fun and playful graphic tee for kids, made from 100% organic cotton for ultimate comfort.',
    price: 30.00,
    category: 'Kids',
    type: 'T-Shirts',
    images: [{ url: 'https://picsum.photos/seed/saine10/800/1000' }],
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Blue', 'White'],
    stockQuantity: 150
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
