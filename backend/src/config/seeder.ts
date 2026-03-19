import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Admin User
  const adminEmail = 'admin@smartlearn.ai';
  const passwordHash = await hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password_hash: passwordHash },
    create: {
      email: adminEmail,
      name: 'SmartLearn Admin',
      password_hash: passwordHash,
    },
  });
  console.log('✅ Admin user ready (admin@smartlearn.ai / admin123)');

  // 2. Create Expanded Course Library
  const subjects = [
    {
      title: 'Mastering React & Next.js',
      slug: 'react-nextjs-mastery',
      category: 'Programming',
      tutor_name: 'Dr. Sarah Wilson',
      description: 'The ultimate guide to building modern web applications with React, Next.js, and Tailwind CSS.',
      is_published: true,
      sections: [
        {
          title: 'Introduction to React',
          order: 0,
          videos: [
            { title: 'React Fundamentals 2024', url: 'SqcY0GlTVqw', order: 0 },
            { title: 'Advanced Hooks Pattern', url: 'LlvBzyy-558', order: 1 },
          ],
        },
      ],
    },
    {
      title: 'Python for Data Science',
      slug: 'python-data-science',
      category: 'Artificial Intelligence',
      tutor_name: 'Prof. Michael Chen',
      description: 'Learn Python programming from scratch and dive into data analysis with Pandas and Numpy.',
      is_published: true,
      sections: [
        {
          title: 'Python Basics',
          order: 0,
          videos: [
            { title: 'Variables and Logic', url: 'nLRL_NcnK-4', order: 0 },
            { title: 'Functions & Modules', url: '8OKTAedgFYg', order: 1 },
          ],
        },
      ],
    },
    {
      title: 'AWS Cloud Practitioner',
      slug: 'aws-cloud-practitioner',
      category: 'Cloud Computing',
      tutor_name: 'Cloud Guru Jay',
      description: 'Master the fundamentals of Amazon Web Services and prepare for the CCP certification.',
      is_published: true,
      sections: [
        {
          title: 'AWS Core Services',
          order: 0,
          videos: [
            { title: 'What is Cloud Computing?', url: '3hLmDS179YE', order: 0 },
            { title: 'EC2 and S3 Basics', url: 'ji3_Z9vAUKs', order: 1 },
          ],
        },
      ],
    },
    {
      title: 'UI/UX Design with Figma',
      slug: 'figma-design-mastery',
      category: 'Design',
      tutor_name: 'Elena Design',
      description: 'Learn to create stunning, user-centric designs from wireframes to high-fidelity prototypes.',
      is_published: true,
      sections: [
        {
          title: 'Figma Basics',
          order: 0,
          videos: [
            { title: 'Getting Started with Figma', url: 'Gu1X0Zt5G60', order: 0 },
            { title: 'Auto Layout Masterclass', url: 'Tid_m5xayA4', order: 1 },
          ],
        },
      ],
    },
    {
      title: 'Ethical Hacking 101',
      slug: 'ethical-hacking-beginners',
      category: 'Cybersecurity',
      tutor_name: 'ZeroDay Sam',
      description: 'An introduction to the world of ethical hacking and information security.',
      is_published: true,
      sections: [
        {
          title: 'Security Fundamentals',
          order: 0,
          videos: [
            { title: 'The Hacker Mindset', url: '3Kq1MIfTWCE', order: 0 },
            { title: 'Network Scanning Basics', url: 'WnN6dBofSGP4', order: 1 },
          ],
        },
      ],
    },
    {
      title: 'Flutter for Mobile Dev',
      slug: 'flutter-mobile-mastery',
      category: 'Mobile Dev',
      tutor_name: 'Max Flutter',
      description: 'Build beautiful native applications for iOS and Android with a single codebase.',
      is_published: true,
      sections: [
        {
          title: 'Dart & Flutter Intro',
          order: 0,
          videos: [
            { title: 'Intro to Flutter', url: 'x0uinJ58z9Q', order: 0 },
            { title: 'Widget Tree Explained', url: '769M9mZ4Lq8', order: 1 },
          ],
        },
      ],
    },
    {
        title: 'Complete Java Bootcamp',
        slug: 'java-programming-bootcamp',
        category: 'Programming',
        tutor_name: 'Code Wizard',
        description: 'Comprehensive Java course covering everything from basics to advanced OOP and Multithreading.',
        is_published: true,
        sections: [
          {
            title: 'Java Fundamentals',
            order: 0,
            videos: [
              { title: 'Java Installation & Setup', url: 'UmnCZ7-9yDY', order: 0 },
              { title: 'OOP in Java', url: 'mAtkPQO1FBA', order: 1 },
            ],
          },
        ],
      },
      {
        title: 'Mastering SQL for Data Science',
        slug: 'sql-data-science',
        category: 'Data Science',
        tutor_name: 'Data Dan',
        description: 'Unlock the power of data by mastering SQL queries and database management.',
        is_published: true,
        sections: [
          {
            title: 'SQL Core Queries',
            order: 0,
            videos: [
              { title: 'SELECT & WHERE Clause', url: '7S_tz1z_5bA', order: 0 },
              { title: 'JOIN Operations', url: '9Pzj7Aj25lw', order: 1 },
            ],
          },
        ],
      },
  ];

  for (const s of subjects) {
    const createdSubject = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        category: s.category,
        tutor_name: s.tutor_name,
        description: s.description,
      },
      create: {
        title: s.title,
        slug: s.slug,
        category: s.category,
        tutor_name: s.tutor_name,
        description: s.description,
        is_published: s.is_published,
      },
    });

    for (const sect of s.sections) {
      const existingSection = await prisma.section.findFirst({ 
        where: { subject_id: createdSubject.id, title: sect.title } 
      });

      const createdSection = await prisma.section.upsert({
        where: { id: existingSection?.id || "new-section-id" },
        update: { order_index: sect.order },
        create: {
          subject_id: createdSubject.id,
          title: sect.title,
          order_index: sect.order,
        },
      });

      for (const v of sect.videos) {
        const existingVideo = await prisma.video.findFirst({ 
          where: { section_id: createdSection.id, youtube_video_id: v.url } 
        });

        await prisma.video.upsert({
          where: { id: existingVideo?.id || "new-video-id" },
          update: { title: v.title, order_index: v.order },
          create: {
            section_id: createdSection.id,
            title: v.title,
            youtube_video_id: v.url,
            order_index: v.order,
            description: `A lesson on ${v.title}.`,
          }
        });
      }
    }
    console.log(`✅ Course synced: ${s.title}`);
  }

  console.log('🌿 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
