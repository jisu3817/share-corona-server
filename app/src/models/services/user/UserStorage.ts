import mariaDB from '../../../config/mariadb';

const mariadb = mariaDB;

class UserStorage {
  static async checkIdDuplication(userId: string) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      const query = `
        SELECT id 
        FROM users
        WHERE id = ?`;
      const id = await conn.query(query, [userId]);

      return id[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

export default UserStorage;
