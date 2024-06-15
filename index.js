import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import todoRoutes from './routes/todoRoute.js';
import { errorHandler } from './middleware/ErrorHandler.js';

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/todos', todoRoutes);
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
