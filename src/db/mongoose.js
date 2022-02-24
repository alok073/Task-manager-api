const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log("Database connected 🥳🥳🥳🥳")
}).catch(() => {
    console.error('Database Connection failed ☹️☹️☹️☹️');
    console.log("error : " + err);
})
