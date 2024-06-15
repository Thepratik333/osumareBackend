import express from 'express';
import { getTodos, addTodo, updateTodo, deleteTodo, singleTodo, optional } from '../controllers/todoController.js';
import { validateTodo } from '../middleware/Validate.js';

const router = express.Router();

router.get('/all', getTodos);
router.get('/', validateTodo, optional); // in this i added pagination, sorting
router.get('/:id',validateTodo, singleTodo);
router.post('/add', validateTodo, addTodo);
router.put('/:id', validateTodo, updateTodo);
router.delete('/:id', validateTodo, deleteTodo);

export default router;
