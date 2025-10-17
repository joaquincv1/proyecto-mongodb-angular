// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Conectado a MongoDB Atlas exitosamente'))
.catch((error) => console.error('❌ Error conectando a MongoDB:', error));

// Esquema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true // Añade createdAt y updatedAt
});

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

// --- RUTAS DE LA API ---

// Ruta para registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
  try {
    const { nombreCompleto, email, password } = req.body;

    if (!nombreCompleto || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombreCompleto,
      email,
      password: hashedPassword,
    });
    const usuarioGuardado = await nuevoUsuario.save();
    const userResponse = usuarioGuardado.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales incorrectas.' });
    }
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales incorrectas.' });
    }
    const userResponse = usuario.toObject();
    delete userResponse.password;
    res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: userResponse
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta pública para obtener la lista de todos los usuarios
app.get('/api/users/public', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});