const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const { connectDB } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    import('chalk').then((chalk) => {
      app.listen(PORT, () => {
        console.log(chalk.default.bgGreen(`Server is running at PORT: ${PORT}`));
      });
    });
  })
  .catch((err) => {
    import('chalk').then((chalk) => {
      console.log(chalk.default.bgRed("MongoDB Connection Failed!!!", err));
    });
  });
