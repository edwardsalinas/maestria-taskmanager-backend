// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
  
//   console.log(token);
//   console.log(process.env.JWT_SECRET);
  
//   if (!token) {
//     return res.status(401).json({ message: 'Acceso no autorizado' });
//   }

//   try {

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log({decoded});
    
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token inválido' });
//   }
// };


// middleware/auth.middleware.js
// const authMiddleware = (req, res, next) => {
//   // Excluir rutas públicas
//   if (req.path.startsWith('/api/auth')) {
//     return next();
//   }
  
//   const token = req.header('Authorization')?.replace('Bearer ', '');
  
//   if (!token) {
//     return res.status(401).json({ message: 'Acceso no autorizado' });
//   }
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token inválido' });
//   }
// };

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  const publicPaths = ['/api/auth/register', '/api/auth/login', '/','/register', '/login'];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  
  try {    
    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    res.status(401).json({ 
      message: 'Token inválido',
      error: error.message
    });
  }
};

module.exports = authMiddleware;