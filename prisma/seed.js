// prisma/seed.js
import {
    PrismaClient
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [{
                name: 'Ilham Lutfi',
                email: 'ilham@example.com',
                role: 'admin',
                password: await bcrypt.hash('password123', 10),
            },
            {
                name: 'Jane Doe',
                email: 'jane@example.com',
                role: 'user',
                password: await bcrypt.hash('password123', 10),
            },
        ],
    });

    console.log('✅ Seed data inserted');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
