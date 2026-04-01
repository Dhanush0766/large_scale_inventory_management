const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function testLogin() {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (users.length === 0) {
      console.log('User admin not found');
      process.exit(1);
    }
    const user = users[0];
    console.log('Found user:', user.username);
    console.log('Database hash:', user.password);
    
    const isMatch = await bcrypt.compare('admin123', user.password);
    console.log('Password Match for "admin123":', isMatch);
    
    // Also generate a new hash and test it
    const newHash = await bcrypt.hash('admin123', 10);
    console.log('New hash check:', await bcrypt.compare('admin123', newHash));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testLogin();
