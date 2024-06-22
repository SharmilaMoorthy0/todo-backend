const express=require('express')

const router=express.Router()
const auth = require('../middleware/auth')
const { newtodo, alltodo, getsingletodo, edittodo, TaskIsCompleted, Deletetodo } = require('../controller/todo.controller')


router.post('/new/todo',auth,newtodo)
router.get('/all/todo',auth,alltodo)
router.get('/todo/:id',auth,getsingletodo)
router.delete('/remove/todo/:id',auth,Deletetodo)
router.put('/update/todo/:id',auth,edittodo)
router.post('/complete/todo',auth,TaskIsCompleted)

module.exports=router