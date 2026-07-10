require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const Settings = require('../models/Settings');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Customer.deleteMany(), Service.deleteMany(), Settings.deleteMany()]);

  console.log('Creating sample admin user...');
  const admin = await User.create({
    name: 'Hanshikha Admin',
    email: 'admin@quotationapp.com',
    password: 'password123',
    role: 'admin',
  });

  await Settings.create({
    owner: admin._id,
    companyName: 'FreshTech Solutions',
    email: 'contact@freshtech.com',
    phone: '+91 9876543210',
    address: 'Vellore, Tamil Nadu, India',
    website: 'https://freshtech.com',
    gstNumber: '33ABCDE1234F1Z5',
    currency: 'INR',
    defaultGstPercentage: 18,
  });

  console.log('Creating sample services...');
  await Service.create([
    { owner: admin._id, name: 'Website Development', category: 'Web Development', unitPrice: 25000, gstPercentage: 18, unit: 'Project', description: 'Responsive multi-page website' },
    { owner: admin._id, name: 'Mobile App Development', category: 'Mobile App Development', unitPrice: 60000, gstPercentage: 18, unit: 'Project', description: 'Cross-platform mobile app (React Native)' },
    { owner: admin._id, name: 'UI/UX Design', category: 'UI/UX Design', unitPrice: 15000, gstPercentage: 18, unit: 'Project', description: 'Figma design and prototyping' },
    { owner: admin._id, name: 'SEO Optimization', category: 'SEO', unitPrice: 8000, gstPercentage: 18, unit: 'Month', description: 'Monthly SEO service' },
    { owner: admin._id, name: 'API Development', category: 'API Development', unitPrice: 20000, gstPercentage: 18, unit: 'Project', description: 'REST API with documentation' },
    { owner: admin._id, name: 'Hosting & Deployment', category: 'Hosting', unitPrice: 3000, gstPercentage: 18, unit: 'Month', description: 'Cloud hosting and maintenance' },
  ]);

  console.log('Creating sample customers...');
  await Customer.create([
    {
      owner: admin._id,
      fullName: 'Ravi Kumar',
      companyName: 'Kumar Retail Pvt Ltd',
      email: 'ravi@kumarretail.com',
      phone: '+91 9123456780',
      gstNumber: '33XXXXX0000X1Z1',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      postalCode: '600001',
    },
    {
      owner: admin._id,
      fullName: 'Priya Sundaram',
      companyName: 'Sundaram Exports',
      email: 'priya@sundaramexports.com',
      phone: '+91 9988776655',
      city: 'Vellore',
      state: 'Tamil Nadu',
      country: 'India',
      postalCode: '632001',
    },
  ]);

  console.log('Seed data created successfully!');
  console.log('Login with: admin@quotationapp.com / password123');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});