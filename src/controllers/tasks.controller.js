const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const newTask = new Task({
            title,
            description,
            dueDate,
            status: 'pendiente',
            user: req.user.id
        });

        await newTask.save();

        res.status(201).json({
            message: 'Tarea creada exitosamente',
            task: newTask
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { status, search, startDate, endDate } = req.query;
        const query = { user: req.user.id };

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (startDate || endDate) {
            query.dueDate = {};
            if (startDate) query.dueDate.$gte = new Date(startDate);
            if (endDate) query.dueDate.$lte = new Date(endDate);
        }

        const tasks = await Task.find(query).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('user', 'name email'); // Opcional: incluir datos del usuario

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    console.log('entre a updateTask');
    
    try {
        const { title, description, status, dueDate } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        console.log('error 1');
        

        // Dentro de updateTask
        if (task.status === 'pendiente' && status === 'completada') {
            console.log('entre al if');
            
            return res.status(400).json({
                message: 'No puede saltar de "pendiente" a "completada"'
            });
        }
        console.log('error 2');

        if (task.status === 'en progreso' && status === 'pendiente') {
            return res.status(400).json({
                message: 'No puede volver a "pendiente" desde "en progreso"'
            });
        }
        console.log('error 3');

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
        console.log('error 4');
        
        if (task.status === 'completada') {
            return res.status(400).json({ message: 'Tarea completada no puede ser modificada' });
        }
        console.log('error 5');

        // const { title, description, status, dueDate } = req.body;
        console.log('error 6');

        if (task.status !== status && status) {

            if (task.status === 'pendiente' && status !== 'en progreso') {
                return res.status(400).json({ message: 'Solo puede cambiar a "en progreso"' });
            }

            if (task.status === 'en progreso' && status !== 'completada') {
                return res.status(400).json({ message: 'Solo puede cambiar a "completada"' });
            }

        }
        
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.json({ message: 'Tarea actualizada', task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
        if (task.status !== 'completada') {
            return res.status(400).json({ message: 'Solo se pueden eliminar tareas completadas' });
        }

        await task.deleteOne();
        res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};