const express = require('express'),
      router = express(),
      {ensureAuth} = require('../middleware/auth'),
      Todo = require('../models/Todo')

// Create new todo
// POST /todo/
router.post('/', ensureAuth, async (req, res) => {
    try{
        req.body.author = req.user.id
        await Todo.create(req.body)
        res.send('Received')
    }
    catch(error) {
        console.error(error)
        res.render('errors/500')
    }
})

// Delete the todo
// POST /todo/taskNo
router.delete('/:taskNo', ensureAuth,  async(req, res)=> {
    try {
        const taskNo = parseInt(req.params.taskNo)
        const todo =  await Todo.findOne({taskNo: taskNo}).populate('author')
        if(!todo) {
            console.error('No todo found')
            res.render('errors/500')
        }
        else if(todo.author._id != req.user.id) {
            console.error('bad user attempt')
            res.render('errors/500')
        }
        else {
            await Todo.deleteOne(todo)
            res.send('deleted')
        }
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})


module.exports = router