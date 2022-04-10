const router = require('express').Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

/*
ROUTES:-

1] POST: /users
2] POST: /users/login
3] GET: /users/me
4] PATCH: /users/me
5] POST: /users/logout
6] POST: /users/logoutAll
7] DELETE: /users/me

*/

router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        console.log("Data saved successfully!!");

        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        console.log("Some error in saving data to db : " + error);
        res.status(400).send(error.message);
    }
})


router.post("/users/login", async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    } catch (error) {
        console.log("Some exception occurred : " + error);
        res.status(400).send(error.message);
    }
})


router.post("/users/logout", auth, async (req, res) => {
    try {
        console.log(`Going to logout user with token ${req.token}`);
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        console.log(`user with token ${req.token} successfully logged out!`);
        res.status(200).send("User logged out");
    } catch (error) {
        console.log("Some exception occurred : " + error);
        res.status(400).send(error.message);
    }
})


router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        console.log("User logged out from all sessions!!");

        res.status(200).send("User logged out from all sessions!!");
    } catch (error) {
        console.log("Some exception occurred : " + error);
        res.status(400).send(error.message);
    }
})


router.get("/users/me", auth, async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        console.log("Error detected : " + error);
        res.status(400).send(error.message);
    }
})


router.patch("/users/me", auth, async (req, res) => {
    //make sure user can only update fields which are present
    console.log("The request is : " + req.body.age);
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isGivenFieldPresent = updates.every((update) => allowedUpdates.includes(update))
    if(!isGivenFieldPresent) {
        res.status(404).send("Error: Invalid field to update. Cannot update this field!");
    }

    try {
        //update all the fields of the user given in the req.body
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })
        await req.user.save();
        console.log("Details updated successfully");

        res.status(200).send(req.user);
    } catch (error) {
        console.log("Some exception occurred : " + error);
        res.status(400).send(error.message);
    }
})


router.delete("/users/me", auth, async (req,res) => {
    try {
        console.log("The user whose account is to be deleted is : " + req.user);
        await req.user.remove();
        console.log("User account deleted successfully");
        res.status(200).send("User account deleted successfully!!");
    } catch (error) {
        console.log("Some exception occurred : " + error);
        res.status(400).send(error.message);
    }
})



// router.get("/users", auth, async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).send(users);
//     } catch (error) {
//         console.log("Error detected : " + error);
//         res.status(400).send(error.message);
//     }
// })


// router.get("/users/:id", async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findOne({_id});
//         if(!user) {
//             res.status(404).send("No user present against the given ID");
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         console.log("Some error in getting response : " + error);
//         res.status(400).send(error.message);
//     }
// })


// router.patch("/users/:id", async (req, res) => {
//     const _id = req.params.id;
//     //make sure user can only update fields which are present
//     const allowedUpdates = ['name', 'age', 'email', 'password'];
//     const updates = Object.keys(req.body);
//     const isGivenFieldPresent = updates.every((update) => allowedUpdates.includes(update))
//     if(!isGivenFieldPresent) {
//         res.status(404).send("Error: Invalid field to update. Cannot update this field!");
//     }
//     try {
//         const user = await User.findById(_id);
//         //update all the fields of the user given in the req.body
//         updates.forEach((update) => {
//             user[update] = req.body[update];
//         })
//         await user.save();
//         if(!user) {
//             res.status(404).send("No user present against the given ID");
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         console.log("Some error in getting response : " + error);
//         res.status(400).send(error.message);
//     }
// })


// router.delete("/users/:id", async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findByIdAndDelete(_id);
//         if(!user) {
//             res.status(404).send("No user present against the given ID");
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         console.log("Some error in getting response : " + error);
//         res.status(400).send(error.message);
//     }
// })


module.exports = router;