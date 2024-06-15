import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, '..', 'public', 'data.json');

const readData = async () => {
    try {
        const jsonData = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
};

const writeData = async (data) => {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing file:', err);
        throw err;
    }
};


export const singleTodo = async(req,res)=>{
    try {
        const data = await readData();
        const todoId = req.params.id;

        const todoIndex = data.todos.findIndex(todo => todo.id === todoId); 
        console.log(todoIndex);
        if(todoIndex === -1){
            return res.status(404).json({success: false,message:"Todo not found"})
        }
        const todo = data.todos[todoIndex];
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({success: false, message: 'Error reading data file' });
    }
}

export const getTodos = async (req, res) => {
    try {
        const data = await readData();
        res.status(200).json(data.todos);
    } catch (err) {
        res.status(500).json({success: false, message: 'Error reading data file' });
    }
};

export const addTodo = async (req, res) => {
    try {
        const {title,description} = req.body
        if(!title || !description){
            return res.status(400).json({success: false, message: 'Title and description are required' });
        }
        const data = await readData();
        const newTodo = {
            id: uuidv4(),
            title,
            description,
            createdAt: new Date().toISOString(),
        };
        data.todos.push(newTodo);
        await writeData(data);
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({success: false, message: 'Error writing data file' });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const data = await readData();
        const todoId = req.params.id;
        const updatedTodo = req.body;

        const todoIndex = data.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
            data.todos[todoIndex] = { ...data.todos[todoIndex], ...updatedTodo };
            await writeData(data);
            res.status(200).json(data.todos[todoIndex]);
        } else {
            res.status(404).json({success: false, message: 'Todo not found' });
        }
    } catch (err) {
        res.status(500).json({success: false, message: 'Error updating data file' });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const data = await readData();
        const todoId = req.params.id;

        const todoIndex = data.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
            const deletedTodo = data.todos.splice(todoIndex, 1);
            await writeData(data);
            res.status(200).json({success: true, message: 'Todo deleted', todo: deletedTodo[0] });
        } else {
            res.status(404).json({success: false, message: 'Todo not found' });
        }
    } catch (err) {
        res.status(500).json({success: false, message: 'Error deleting data file' });
    }
};


export const optional = async (req, res) => {
    try {
        const { page=1, limit=5, sort} = req.query;
        const data = await readData();
        const todos = data.todos;


        if (sort === 'newest') {
            todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sort === 'oldest') {
            todos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedTodos = todos.slice(startIndex, endIndex);

        res.json({
            total: todos.length,
            page: Number(page),
            limit: Number(limit),
            todos: paginatedTodos,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error reading data file' });
    }
};