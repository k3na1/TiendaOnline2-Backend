require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('./models'); // Importa tu modelo Users (plural)
const authenticateToken = require("./middleware/auth"); // Importa el guardia

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Variables de entorno y seguridad
const SECRET_KEY = process.env.SECRET_KEY; 
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 FUNCIÓN DE DESENCRIPTADO (Para cumplir con lo que pide el profe)
function decryptPassword(encrypted) {
  try {
    // 1. Decodificar desde Base64
    const decoded = Buffer.from(encrypted, "base64").toString("utf8");
    // 2. Verificar integridad (que termine con la clave secreta)
    if (!decoded.endsWith(SECRET_KEY)) {
      return null;
    }
    // 3. Retornar la contraseña limpia
    return decoded.slice(0, -SECRET_KEY.length);
  } catch (e) {
    return null;
  }
}

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

// ®️ REGISTRO DE USUARIO
app.post('/register', async (req, res) => {
  try {
    // Recibimos los datos tal cual están en tu modelo Users
    const { run, tipo, nombre, apellidos, correo, password } = req.body;

    // 1. Seguridad: Desencriptamos la clave que viene del front
    const passwordPlain = decryptPassword(password);
    
    if (!passwordPlain) {
      return res.status(400).json({ error: 'Contraseña inválida o manipulada' });
    }

    // 2. Seguridad: Hasheamos la contraseña para guardarla
    const hashedPassword = await bcrypt.hash(passwordPlain, BCRYPT_ROUNDS);

    // 3. Guardamos en la Base de Datos
    const newUser = await Users.create({
      run,
      tipo,
      nombre,
      apellidos,
      correo,
      password: hashedPassword 
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al registrar', details: error.message });
  }
});

// 🟢 LOGIN DE USUARIO
app.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Buscamos si existe el correo
    const user = await Users.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 2. Verificamos la contraseña
    // NOTA: Si el login también envía la clave encriptada desde el front, 
    // usa: decryptPassword(password) aquí antes de comparar.
    const passwordValida = await bcrypt.compare(password, user.password); 
    
    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3. Generamos el Token de acceso
    const token = jwt.sign(
      { id: user.id, correo: user.correo, tipo: user.tipo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: "Login exitoso", token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🔓 RUTA DE PRUEBA (Solo usuarios con Token)
app.get('/perfil', authenticateToken, async (req, res) => {
  // Buscamos los datos del usuario logueado (sin devolver la password)
  const user = await Users.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });
  res.json(user);
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor TiendaOnline corriendo en puerto ${PORT}`);
});