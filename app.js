const express = require('express');
const router = require('./router/index');

const app = express();
const PORT = process.env.PORT; //Cloud9利用のため

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', router);
app.listen(PORT, () => {
  console.log(`Server Listen on PORT:${PORT}...`);
});