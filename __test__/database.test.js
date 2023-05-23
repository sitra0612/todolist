const mysql = require('mysql2');

// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users',
});

describe('Test the database queries', () => {
  let userId;
  let taskId;

  beforeAll((done) => {
    connection.connect((err) => {
      if (err) throw err;
      console.log('Connected to MySQL database');
      done();
    });
  });

  afterAll((done) => {
    connection.end((err) => {
      if (err) throw err;
      console.log('Disconnected from MySQL database');
      done();
    });
  });

  it('should insert a new user into the database', (done) => {
    const user = { fullname: 'testuser',email:"testuser@gmail.com", password: 'testpassword123!',age: '23' };
    connection.query('INSERT INTO information SET ?', user, (err, results) => {
      if (err) throw err;
      userId = results.insertId;
      expect(results.affectedRows).toBe(1);
      done();
    });
  });

  it('should insert a new task for the user into the database', (done) => {
    const task = { task: 'Test Task' };
    connection.query('INSERT INTO tasks SET ?', task, (err, results) => {
      if (err) throw err;
      taskId = results.insertId;
      expect(results.affectedRows).toBe(1);
      done();
    });
  });

  

  it('should delete the created task from the database', (done) => {
    connection.query('DELETE FROM tasks WHERE id = ? ', [taskId], (err, results) => {
      if (err) throw err;
      expect(results.affectedRows).toBe(1);
      done();
    });
  });

  it('should delete the created user from the database', (done) => {
    connection.query('DELETE FROM information WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      expect(results.affectedRows).toBe(1);
      done();
    });
  });
});
