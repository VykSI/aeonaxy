const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const fileupload = require('express-fileupload');
const { neonDB } = require('./middlewares/database')

const db = async () => {
  try {
    await neonDB`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await neonDB`
          CREATE TABLE IF NOT EXISTS users (
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              username VARCHAR(50) UNIQUE NOT NULL,
              password VARCHAR(100) NOT NULL,
              email VARCHAR(100) UNIQUE NOT NULL,
              wrole VARCHAR(255)
          )
      `;
    await neonDB`
          CREATE TABLE IF NOT EXISTS user_info (
              user_id UUID UNIQUE,
              profile_pic_url VARCHAR(255),
              description TEXT,
              FOREIGN KEY (user_id) REFERENCES users(id)
          )
      `;
    await neonDB`
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
                  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
              END IF;
          END $$
      `;
    await neonDB`
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rating_value') THEN
                  CREATE TYPE rating_value AS ENUM ('0', '1', '2', '3', '4', '5');
              END IF;
          END $$
      `;
    await neonDB`
          CREATE TABLE IF NOT EXISTS courses (
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              title VARCHAR(100),
              description TEXT,
              category TEXT,
              difficulty difficulty_level,
              rating rating_value
          )
      `;
    await neonDB`
          CREATE TABLE IF NOT EXISTS user_courses (
              user_id UUID,
              course_id UUID,
              PRIMARY KEY (user_id, course_id),
              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (course_id) REFERENCES courses(id)
          )
      `;
  } catch (error) {
    if (error.severity !== 'NOTICE') {
      console.error("Database setup failed:", error);
    }
  }
};


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload({ useTempFiles: true }))
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, debug = false, () => {
  db().then(() => {
    console.log("Database setup completed");
  }).catch(error => {
    console.error("Database setup failed:", error);
  });

  console.log(`Server is running on port ${PORT}`);
});
