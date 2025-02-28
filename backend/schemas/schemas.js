const mongoose = require('mongoose'); 
const { Schema } = mongoose;

/**
 * Define el esquema de usuarios
 */
const usuarioSchema = new mongoose.Schema({
    usuario: String,
    correo: String,
    password: String,
    direccion: String,
    nombre: String,
    telefono: String
});

/**
 * Define el esquema para almacenar logs
 */
const errorSchema = new mongoose.Schema({
    error: String,
    info: String,
    url: String,
    date: { type: Date, default: Date.now }
});

/**
 * Define el esquema de imagenes
 */
const photoSchema = new Schema({
    data: Buffer,
    contentType: String,
    uid: String
});


//Archivos adjuntos
const archivoSchema = new mongoose.Schema({
    nombre: String,
    tipo: String,
    tamaño: Number,
    ruta: String,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

//Exporta los esquemas creados para ser usados en otras partes del servidor
module.exports = {
    usuarioSchema, 
    photoSchema,
    errorSchema
}

//Validar schema de usuario

const usuarioSchemaValidation = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 6 },
    direccion: { type: String, default: '' },
    nombre: { type: String, required: true },
    telefono: { type: String, match: /^[0-9]{10}$/ } // Ejemplo para un número de teléfono de 10 dígitos
});
