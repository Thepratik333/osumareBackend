export const validateTodo = (req, res, next) => {

    const { title, description } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({success: false, message: 'Invalid request: Title is required and should be a string.' });
    }

    if (!description || typeof description !== 'string') {
        return res.status(400).json({ success: false,message: 'Invalid request: Description is required and should be a string.' });
    }

    next();
};
