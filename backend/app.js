const express = require('express')
const cors = require('cors');

const userRoutes = require('./routes/users');
// const postRoutes = require('./routes/posts');
// const commentRoutes = require('./routes/comments');
// const departmentRoutes = require('./routes/departments');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  });

app.use('/users', userRoutes);
//app.use('/posts', postRoutes);
// app.use('/comments', commentRoutes);
// app.use('/departments', departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});