import bcrypt from 'bcryptjs';
import { getUserRepository, getConversationRepository } from '../config/database';
import { User, Conversation } from '../entities';

export async function seedDatabase(): Promise<void> {
  try {
    const userRepo = getUserRepository();
    const convRepo = getConversationRepository();

    const count = await userRepo.count();

    if (count === 0) {
      console.log('[Seeder] Seeding initial database data via TypeORM...');
      const hashedPassword1 = await bcrypt.hash('password', 10);
      const hashedPassword2 = await bcrypt.hash('ai_password', 10);

      // Create testuser
      const testUser = userRepo.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword1,
      });
      const savedUser = await userRepo.save(testUser);

      // Create ai_assistant
      const aiUser = userRepo.create({
        username: 'ai_assistant',
        email: 'ai@example.com',
        password: hashedPassword2,
      });
      await userRepo.save(aiUser);

      // Create default conversation
      const convCount = await convRepo.count();
      if (convCount === 0) {
        const defaultConv = convRepo.create({
          title: 'Default Conversation',
          user: savedUser,
        });
        await convRepo.save(defaultConv);
      }

      console.log('[Seeder] Initial database seeding completed.');
    }
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error);
  }
}
