const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

const router = express.Router();

// @route GET /api/tickets (User's tickets)
router.get('/', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).populate('event', 'title date location image');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route POST /api/tickets (Purchase ticket)
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, tierName, quantity = 1 } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const tier = event.priceTiers.find((t) => t.name === tierName);
    if (!tier) {
      return res.status(400).json({ message: 'Invalid ticket tier' });
    }

    if (tier.sold + quantity > tier.quantity) {
      return res.status(400).json({ message: `Only ${tier.quantity - tier.sold} tickets remaining for this tier` });
    }

    // Mock payment successful, create tickets
    const ticketsToCreate = Array(quantity).fill({
      event: eventId,
      user: req.user._id,
      tierName,
      price: tier.price,
    });

    const createdTickets = await Ticket.insertMany(ticketsToCreate);

    // Update sold count
    tier.sold += quantity;
    await event.save();

    res.status(201).json(createdTickets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route GET /api/tickets/admin (Admin view all tickets)
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('event', 'title date').populate('user', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/tickets/:id/status (Admin update ticket status)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = req.body.status;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/tickets/validate/:id (Admin validate/scan QR ticket)
router.put('/validate/:id', protect, admin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('event', 'title date');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (ticket.status === 'used') {
      return res.status(400).json({ message: 'Ticket has already been used!', ticket });
    }
    
    if (ticket.status === 'cancelled') {
      return res.status(400).json({ message: 'Ticket was cancelled!', ticket });
    }

    ticket.status = 'used';
    await ticket.save();
    
    res.json({ message: 'Ticket validated successfully!', ticket });
  } catch (error) {
    // If it's a cast error, it's an invalid ID format
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid ticket ID format' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
