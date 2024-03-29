const express = require('express')
const cors = require('cors');
const { cloudinaryConfig } = require('./config/cloudinaryConfig');

const app = express();

app.use(cors());
app.use(express.json());
app.use('*', cloudinaryConfig);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
// const departmentRoutes = require('./routes/departments');

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
// app.use('/departments', departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

//We export the server so that we can use it for testing
module.exports = app;