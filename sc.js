const Service = require('../models/Service');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all services (filter by category, search by name)
// @route   GET /api/services?category=&search=
// @access  Private
const getServices = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const query = { owner: req.user._id, isActive: true };

  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  const services = await Service.find(query).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: services.length, data: services });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Private
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, owner: req.user._id });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, data: service });
});

// @desc    Create service
// @route   POST /api/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const service = await Service.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: service });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, data: service });
});

// @desc    Delete (soft-delete) service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { isActive: false },
    { new: true }
  );
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, message: 'Service deleted successfully' });
});

module.exports = { getServices, getService, createService, updateService, deleteService };