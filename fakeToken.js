const jwt = require('jsonwebtoken');

const payload = { userId: 1, nombre: 'UsuarioFake' }; // Puedes poner lo que quieras
const secret = 'TuClaveSecretaSuperSegura123!'; // Debe coincidir con process.env.JWT_SECRET
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('Token fake generado:\n', token);
