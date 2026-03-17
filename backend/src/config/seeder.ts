import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Admin User
  const adminEmail = 'admin@smartlearn.ai';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'SmartLearn Admin',
        password_hash: passwordHash,
      },
    });
    console.log('✅ Admin user created (admin@smartlearn.ai / admin123)');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Create Starter Courses
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
            { title: 'React Fundamentals', url: 'SqcY0GlTVqw', order: 0 },
            { title: 'Hooks Deep Dive', url: 'LlvBzyy-558', order: 1 },
          ],
        },
        {
          title: 'Next.js App Router',
          order: 1,
          videos: [
            { title: 'Server Components vs Client Components', url: 'hD0G9X8O4Sg', order: 0 },
            { title: 'Routing & Layouts', url: 'wm5gMKuwSYk', order: 1 },
          ],
        },
      ],
    },
    {
      title: 'Python for Data Science',
      slug: 'python-data-science',
      category: 'Artificial Intelligence',
      tutor_name: 'Prof. Michael Chen',
      description: 'Learn Python programming from scratch and dive into data analysis with Pandas, Numpy, and Matplotlib.',
      is_published: true,
      sections: [
        {
          title: 'Python Basics',
          order: 0,
          videos: [
            { title: 'Variables and Data Types', url: 'nLRL_NcnK-4', order: 0 },
            { title: 'Control Flow & Functions', url: '8OKTAedgFYg', order: 1 },
          ],
        },
      ],
    },
  ];

  for (const s of subjects) {
    const existing = await prisma.subject.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      const createdSubject = await prisma.subject.create({
        data: {
          title: s.title,
          slug: s.slug,
          category: s.category,
          description: s.description,
          is_published: s.is_published,
        },
      });

      for (const sect of s.sections) {
        const createdSection = await prisma.section.create({
          data: {
            subject_id: createdSubject.id,
            title: sect.title,
            order_index: sect.order,
          },
        });

        await prisma.video.createMany({
          data: sect.videos.map((v) => ({
            section_id: createdSection.id,
            title: v.title,
            youtube_video_id: v.url,
            order_index: v.order,
            description: `A lesson on ${v.title}.`,
          })),
        });
      }
      console.log(`✅ Created course: ${s.title}`);
    } else {
      console.log(`ℹ️ Course already exists: ${s.title}`);
    }
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
