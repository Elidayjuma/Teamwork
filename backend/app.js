const express = require('express')
const cors = require('cors');
// const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
// const departmentRoutes = require('./routes/departments');

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  });

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
// app.use('/departments', departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

//We export the server so that we can use it for testing
module.exports = app;