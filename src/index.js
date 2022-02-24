const express = require('express');
require("./db/mongoose");

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})

