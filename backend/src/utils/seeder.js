const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const products = [
    {
        name: "Kid Tapered Slim Fit Trouser",
        price: 38,
        image: ["assets/p_img47.png"],
        category: "Kids",
        subCategory: "Bottomwear",
    },
    {
        name: "Men Round Neck Pure Cotton T-shirt",
        price: 64,
        image: ["assets/p_img8.png"],
        category: "Men",
        subCategory: "Topwear",
    },
    {
        name: "Boy Round Neck Pure Cotton T-shirt",
        price: 60,
        image: ["assets/p_img14.png"],
        category: "Kids",
        subCategory: "Topwear",
    },
    {
        name: "Women Zip-Front Relaxed Fit Jacket",
        price: 74,
        image: ["assets/p_img35.png"],
        category: "Women",
        subCategory: "Winterwear",
        bestseller: true,
    },
    {
        name: "Men Tapered Fit Flat-Front Trousers",
        price: 58,
        image: ["assets/p_img15.png"],
        category: "Men",
        subCategory: "Bottomwear",
    },
    {
        name: "Girls Round Neck Cotton Top",
        price: 56,
        image: ["assets/p_img6.png"],
        category: "Kids",
        subCategory: "Topwear",
    },
    {
        name: "Women Zip-Front Relaxed Fit Jacket",
        price: 68,
        image: ["assets/p_img51.png"],
        category: "Women",
        subCategory: "Winterwear",
        bestseller: true,
    },
    {
        name: "Kid Tapered Slim Fit Trouser",
        price: 40,
        image: ["assets/p_img50.png"],
        category: "Kids",
        subCategory: "Bottomwear",
    },
    {
        name: "Men Printed Plain Cotton Shirt",
        price: 52,
        image: ["assets/p_img39.png"],
        category: "Men",
        subCategory: "Topwear",
    },
    {
        name: "Women Zip-Front Relaxed Fit Jacket",
        price: 78,
        image: ["assets/p_img36.png"],
        category: "Women",
        subCategory: "Winterwear",
        bestseller: true,
    },
    {
        name: "Men Slim Fit Relaxed Denim Jacket",
        price: 72,
        image: ["assets/p_img46.png"],
        category: "Men",
        subCategory: "Winterwear",
        bestseller: true,
    },
    {
        name: "Men Slim Fit Relaxed Denim Jacket",
        price: 84,
        image: ["assets/p_img52.png"],
        category: "Men",
        subCategory: "Winterwear",
        bestseller: true,
    },
    {
        name: "Women Zip-Front Relaxed Fit Jacket",
        price: 78,
        image: ["assets/p_img44.png"],
        category: "Women",
        subCategory: "Winterwear",
    },
    {
        name: "Men Slim Fit Relaxed Denim Jacket",
        price: 86,
        image: ["assets/p_img45.png"],
        category: "Men",
        subCategory: "Winterwear",
    },
    {
        name: "Women Round Neck Cotton Top",
        price: 48,
        image: ["assets/p_img1.png"],
        category: "Women",
        subCategory: "Topwear",
    },
    {
        name: "Men Slim Fit Casual Shirt",
        price: 55,
        image: ["assets/p_img2.png"],
        category: "Men",
        subCategory: "Topwear",
    },
    {
        name: "Women Palazzo Pants",
        price: 62,
        image: ["assets/p_img3.png"],
        category: "Women",
        subCategory: "Bottomwear",
    },
    {
        name: "Kid Cotton Printed T-shirt",
        price: 35,
        image: ["assets/p_img4.png"],
        category: "Kids",
        subCategory: "Topwear",
    },
    {
        name: "Women Skinny Fit Jeans",
        price: 70,
        image: ["assets/p_img5.png"],
        category: "Women",
        subCategory: "Bottomwear",
    },
    {
        name: "Men Regular Fit Chinos",
        price: 65,
        image: ["assets/p_img7.png"],
        category: "Men",
        subCategory: "Bottomwear",
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Product.deleteMany();
        console.log('Existing products removed.');

        await Product.insertMany(products);
        console.log('Data Seeded Successfully!');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
