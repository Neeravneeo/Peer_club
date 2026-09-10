import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const badges = [
  {
    slug: 'first_quiz',
    name: 'Brain Starter',
    description: 'Complete your first AI quiz',
    iconUrl: '/badges/first_quiz.svg',
    category: 'quiz',
    threshold: 1,
  },
  {
    slug: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 10 quizzes',
    iconUrl: '/badges/quiz_master.svg',
    category: 'quiz',
    threshold: 10,
  },
  {
    slug: 'streak_3',
    name: 'On a Roll',
    description: 'Maintain a 3-day study streak',
    iconUrl: '/badges/streak_3.svg',
    category: 'streak',
    threshold: 3,
  },
  {
    slug: 'streak_7',
    name: 'On Fire',
    description: 'Maintain a 7-day study streak',
    iconUrl: '/badges/streak_7.svg',
    category: 'streak',
    threshold: 7,
  },
  {
    slug: 'streak_30',
    name: 'Unstoppable',
    description: 'Maintain a 30-day study streak',
    iconUrl: '/badges/streak_30.svg',
    category: 'streak',
    threshold: 30,
  },
  {
    slug: 'study_hour_1',
    name: 'Clock In',
    description: 'Log 1 hour of total study time',
    iconUrl: '/badges/study_hour_1.svg',
    category: 'study_time',
    threshold: 60,
  },
  {
    slug: 'study_hour_10',
    name: 'Dedicated',
    description: 'Log 10 hours of total study time',
    iconUrl: '/badges/study_hour_10.svg',
    category: 'study_time',
    threshold: 600,
  },
  {
    slug: 'study_hour_50',
    name: 'Scholar',
    description: 'Log 50 hours of total study time',
    iconUrl: '/badges/study_hour_50.svg',
    category: 'study_time',
    threshold: 3000,
  },
  {
    slug: 'first_room',
    name: 'Team Player',
    description: 'Join your first study room',
    iconUrl: '/badges/first_room.svg',
    category: 'social',
    threshold: 1,
  },
  {
    slug: 'room_creator',
    name: 'Host',
    description: 'Create your first study room',
    iconUrl: '/badges/room_creator.svg',
    category: 'social',
    threshold: 1,
  },
];

async function main() {
  console.log('Seeding MVP badges...');
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge,
    });
  }
  console.log('✅ 10 MVP Badges seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
