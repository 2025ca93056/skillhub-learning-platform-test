require('dotenv').config();
const sequelize = require('./src/sequelize');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create demo users
    const instructors = await User.bulkCreate([
      {
        email: 'alice@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Alice (Instructor)',
        role: 'instructor'
      },
      {
        email: 'bob@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Bob (Instructor)',
        role: 'instructor'
      },
    ]);

    const students = await User.bulkCreate([
      {
        email: 'student1@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Charlie (Student)',
        role: 'student'
      },
      {
        email: 'student2@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Diana (Student)',
        role: 'student'
      },
    ]);

    // Create demo courses (taught by instructors)
    await Course.bulkCreate([
      {
        title: 'Web Development Basics',
        description: 'Learn HTML, CSS, and JavaScript fundamentals',
        InstructorId: instructors[0].id,
      },
      {
        title: 'Advanced React',
        description: 'Master React hooks, state management, and performance',
        InstructorId: instructors[1].id,
      },
      {
        title: 'Node.js Backend',
        description: 'Build scalable backend systems with Node.js and Express',
        InstructorId: instructors[0].id,
      },
    ]);

    console.log('✓ Seed data created successfully');
    console.log('\nDemo Credentials:');
    console.log('Instructor: alice@example.com / password');
    console.log('Instructor: bob@example.com / password');
    console.log('Student: student1@example.com / password');
    console.log('Student: student2@example.com / password');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
