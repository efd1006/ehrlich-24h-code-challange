import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../../modules/auth/utils';
import { UserRole } from '../../modules/user/enums';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    let tableName = 'users';

    let users = [
      {
        id: uuidv4(),
        email: 'user1@mail.com',
        password: await hashPassword('P@ssw0rd123'),
      },
      {
        id: uuidv4(),
        email: 'user2@mail.com',
        password: await hashPassword('P@ssw0rd123'),
      },
      {
        id: uuidv4(),
        email: 'admin@mail.com',
        password: await hashPassword('P@ssw0rd123'),
        role: UserRole.ADMIN
      },
    ];
    await connection.getRepository(tableName).save([...users], { chunk: 500 });
  }
}
