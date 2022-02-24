const router = require('express').Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

/*
ROUTES:-

1] POST "/tasks"
2] GET "/tasks"
3] GET "/tasks/:id"
4] PATCH "/tasks/:id"
5] DELETE "tasks/:id"

*/

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        console.log("Task saved successfully!!");
        res.status(201).send(task);
    } catch (error) {
        console.log("Some error in saving data to db : " + error);
        res.send(error.message);
    }
})

// GET: "/tasks" => get all tasks
// GET: "/tasks?completed=true" => get all tasks whose completed value is 'true'
// GET: "/tasks?limit=2" => just get the first 2 tasks
// GET: "/tasks?limit=2&skip=2" => skip the first 2 tasks and get the next 2 tasks
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy) {
        const fields = req.query.sortBy.split(":");
        const fieldName = fields[0];
        const sortOrder = fields[1] === 'asc' ? 1 : -1;
        sort[fieldName] = sortOrder;

        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        console.log(sort);
    }

    try {
        //const tasks = await Task.find({ owner: req.user._id });
        await req.user.populate({
            path: "tasks",
            match: match,
            options: {
                limit: req.query.limit,
                skip: req.query.skip,
                sort: sort
            }
        })

        console.log("tasks fetched successfully!!");
        res.status(200).send(req.user.tasks);
    } catch (error) {
        console.log("Error detected : " + error);
        res.status(400).send(error.message);
    }
})


router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id: _id, owner: req.user._id});
        if(!task) {
            res.status(404).send("No task present against the given ID");
        }
        res.status(200).send(task);
    } catch (error) {
        console.log("Error detected : " + error);
        res.status(400).send(error.message);
    }
})


router.patch("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    //make sure user can only update fields which are present
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isGivenFieldPresent = updates.every((update) => allowedUpdates.includes(update))
    if(!isGivenFieldPresent) {
        res.status(404).send("Error: Invalid field to update. Cannot update this field!");
    }
    
    try {
        const task = await Task.findOneAndUpdate({_id: _id, owner: req.user._id}, req.body, {new: true, runValidators: true});
        if(!task) {
            res.status(404).send("No task present against the given ID");
        }
        res.status(200).send(task);
    } catch (error) {
        console.log("Some error in getting response : " + error);
        res.status(400).send(error.message);
    }
})


router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id });
        if(!task) {
            res.status(404).send("No task present against the given ID");
        }
        res.status(200).send(task);
    } catch (error) {
        console.log("Some error in getting response : " + error);
        res.status(400).send(error.message);
    }
})


module.exports = router;