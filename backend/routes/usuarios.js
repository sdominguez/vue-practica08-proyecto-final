const {Router} = require('express');

const { 
    get_all_usuarios,
    save_usuario,
    get_usuario_by_id_body,
    update_usuario,
    delete_usuario
     } = require('../controllers/usuarios');

     const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();

router.get('/get_all', get_all_usuarios); 
router.get('/get_by_id_body', get_usuario_by_id_body); 
router.post('/save', save_usuario);
router.put('/update/:id', update_usuario);
router.delete('/delete/:id',[validarJWT], delete_usuario);

module.exports = router;