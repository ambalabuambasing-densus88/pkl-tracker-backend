import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Cukup gunakan kurung kosong karena "library" engine otomatis membaca env
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('guru123', 10);
  
  const guru = await prisma.user.upsert({
    where: { email: 'guru@pkltracker.com' },
    update: {},
    create: {
      name: 'Guru Pembimbing',
      email: 'guru@pkltracker.com',
      password: hashedPassword,
      role: 'GURU',
    },
  });

  console.log('Akun Guru Berhasil Dibuat:', guru.email);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });