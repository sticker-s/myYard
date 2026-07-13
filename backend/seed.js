const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Event = require('./src/models/Event');
const Ticket = require('./src/models/Ticket');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myyard')
  .then(() => console.log('MongoDB Connected to MyYard db'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));

const importData = async () => {
  try {
    await User.deleteMany();
    await Event.deleteMany();
    await Ticket.deleteMany();

    // Create Admin User
    const admin = new User({
      name: 'Admin User',
      email: 'admin@myyard.com',
      password: 'admin123',
      role: 'admin',
    });
    await admin.save();

    // Create Normal Users
    const user1 = new User({
      name: 'Test User 1',
      email: 'user1@myyard.com',
      password: 'user123',
    });
    await user1.save();

    const user2 = new User({
      name: 'Test User 2',
      email: 'user2@myyard.com',
      password: 'user123',
    });
    await user2.save();

    // Create Sample Events
    const event1 = new Event({
      title: 'Neon Nights Festival',
      description: 'An unforgettable night of synthwave, retro visuals, and dancing under the neon lights.',
      date: new Date('2026-08-15T20:00:00Z'),
      location: 'Central Plaza, Campus Main',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      capacity: 500,
      priceTiers: [
        { name: 'Standard', price: 20, quantity: 400, sold: 10 },
        { name: 'VIP', price: 50, quantity: 100, sold: 5 },
      ],
      createdBy: admin._id,
    });
    await event1.save();

    const event2 = new Event({
      title: 'Tech Symposium 2026',
      description: 'Annual gathering of tech enthusiasts, featuring keynote speakers, workshops, and networking.',
      date: new Date('2026-09-10T09:00:00Z'),
      location: 'Auditorium Hall B',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      capacity: 300,
      priceTiers: [
        { name: 'Student', price: 10, quantity: 200, sold: 50 },
        { name: 'Professional', price: 75, quantity: 100, sold: 20 },
      ],
      createdBy: admin._id,
    });
    await event2.save();

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
