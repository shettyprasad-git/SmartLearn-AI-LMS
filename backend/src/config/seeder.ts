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
      const createdSection = await prisma.section.upsert({
        where: { 
          // Since we don't have a natural unique key for sections besides title within a subject,
          // we'll just find or create. For seeder it's fine.
          id: (await prisma.section.findFirst({ where: { subject_id: createdSubject.id, title: sect.title } }))?.id || ""
        },
        update: { order_index: sect.order },
        create: {
          subject_id: createdSubject.id,
          title: sect.title,
          order_index: sect.order,
        },
      });

      for (const v of sect.videos) {
        await prisma.video.upsert({
          where: {
            id: (await prisma.video.findFirst({ where: { section_id: createdSection.id, youtube_video_id: v.url } }))?.id || ""
          },
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
