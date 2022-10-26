import express from 'express';
import {
        obtenerProyetos,
        obtenerProyeto,
        nuevoProyecto,
        editarProyeto,
        eliminarProyeto,
        agregarColaborador,
        eliminarColaborador,
} from '../controllers/proyectoController.js'

import checkAuth from '../middleware/checkAuth.js'

const router = express.Router();


router.route("/")
.get(checkAuth, obtenerProyetos)
.post(checkAuth, nuevoProyecto)

router.route("/:id")
.get(checkAuth, obtenerProyeto)
.put(checkAuth, editarProyeto)
.delete(checkAuth, eliminarProyeto)


router.post("/agregar-colaborador/:id", checkAuth, agregarColaborador)
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador)



export default router;