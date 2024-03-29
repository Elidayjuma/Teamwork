/**
 * This page initializes the database by creating tables and initializing static database values
 * First install "make-runnable"
 * then on the terminal run "node db createTables"
 * then initialize static tables by running "node db initializeStaticValues"
 * create the admin by running "node db createAdmin"
 */
const db = require('./config/connection');
const pool = db.pool;

const bcrypt = require('bcrypt');

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      departments(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      job_positions(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      roles(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );
    
    CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(200) NOT NULL UNIQUE,
        password VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        status INTEGER DEFAULT 1,
        phone_no INTEGER NOT NULL UNIQUE,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );
      
    CREATE TABLE IF NOT EXISTS
      role_users(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id INTEGER NOT NULL REFERENCES roles(id),
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      user_details(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(200) NOT NULL,
        last_name VARCHAR(200) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        avatar VARCHAR(200),
        user_address VARCHAR(200),
        job_position INTEGER REFERENCES job_positions(id),
        department INTEGER REFERENCES departments(id),
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      post_types(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      posts(
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content VARCHAR(20000),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status INTEGER NOT NULL DEFAULT 1,
        gif_url VARCHAR(500),
        post_type INTEGER NOT NULL REFERENCES post_types(id),
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );
      
    CREATE TABLE IF NOT EXISTS
      comments(
        id SERIAL PRIMARY KEY,
        content VARCHAR(20000),
        user_id INTEGER NOT NULL REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      post_likes(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );
    
    CREATE TABLE IF NOT EXISTS
      post_tags(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );
    
    CREATE TABLE IF NOT EXISTS
      posts_tags(
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        post_tag_id INTEGER REFERENCES post_tags(id),
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS
      flagged_posts(
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        content VARCHAR(20000) NOT NULL,
        status INTEGER DEFAULT 1,
        created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        modified_date TIMESTAMP
      );
    `;


  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Initialize static DB values
 */
const initializeStaticValues = () => {
  const queryText =
    `INSERT INTO departments(
    name, status)
    VALUES 
      ('Overall', 1),
      ('Accounting', 1),
      ('Human Resource Management', 1),
      ('Marketing', 1),
      ('Production', 1),
      ('Information Tech', 1),
      ('Operations', 1),
      ('Customer Service', 1),
      ('Purchasings', 1),
      ('Legal Department', 1);

    INSERT INTO job_positions(
      name, status)
      VALUES 
        ('Manager', 1),
        ('Secretary', 1),
        ('Accountant', 1),
        ('Procurement Officer', 1),
        ('Advisor', 1),
        ('Brand Strategist', 1);
    
    INSERT INTO roles(
      name, status)
      VALUES 
        ('Super User', 1),
        ('Admin', 1),
        ('Employee', 1);

    INSERT INTO post_types(
      name, status)
      VALUES 
        ('Articles', 1),
        ('gifs', 1);

    INSERT INTO post_tags(
      name, status)
      VALUES 
        ('laughter', 1),
        ('out', 1),
        ('office', 1);
  `;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create Admin
 */
const createAdmin = async (req, res) => {
  try {
    let initialPassword = bcrypt.hashSync("admin", 10);
    const username = "admin";
    const email = "admin@admin.team";
    const phone_no = 123456789;
    const admin = await pool.query(`
    INSERT INTO users (
    username, password, email, phone_no) 
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
      [username, initialPassword, email, phone_no]);

    await pool.query(`INSERT INTO role_users (user_id, role_id) VALUES ($1, $2)`, [admin.rows[0].id, 2]);
    console.log("Mission completed");
    pool.end();
  } catch (err) {
    console.log(err);
    pool.end();
  }

}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTables,
  initializeStaticValues,
  createAdmin
};

require('make-runnable');