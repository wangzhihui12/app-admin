import { join } from 'path';
export default {
  type: 'mysql',
  host: '192.168.3.113',
  // socketPath: '/tmp/mysql.sock',
  port: 3306,
  username: 'user_limin',
  password: 'LmotGSOY',
  database: 'app_admin',
  // entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
  entities: [join(__dirname, '../', 'modules/entities/**{.ts,.js}')],
  synchronize: true,
};
