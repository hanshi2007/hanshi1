const Customer = require('../models/Customer');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all customers (search, filter, pagination)
// @route   GET /api/customers?search=&city=&page=&limit=
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const { search, city, state, country, page = 1, limit = 10 } = req.query;

  const query = { owner: req.user._id };

  if (search) {
    query.$text = { $search: search };
  }
  if (city) query.city = city;
  if (state) query.state = state;
  if (country) query.country = country;

  const skip = (Number(page) - 1) * Number(limit);

  const [customers, total] = await Promise.all([
    Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Customer.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: customers.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: customers,
  });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, owner: req.user._id });
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
  res.status(200).json({ success: true, data: customer });
});

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: customer });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
  res.status(200).json({ success: true, data: customer });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
  res.status(200).json({ success: true, message: 'Customer deleted successfully' });
});

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };