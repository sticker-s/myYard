const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// @route GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route POST /api/events (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, date, location, image, capacity, priceTiers } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      image,
      capacity,
      priceTiers,
      createdBy: req.user._id,
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route PUT /api/events/:id (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, description, date, location, image, capacity, priceTiers } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.location = location || event.location;
      event.image = image || event.image;
      event.capacity = capacity || event.capacity;
      event.priceTiers = priceTiers || event.priceTiers;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route DELETE /api/events/:id (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
