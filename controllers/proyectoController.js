import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerProyetos = async (req, res) => {
  const proyectos = await Proyecto.find().where("creador").equals(req.usuario);

  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (e) {
    console.log(e);
  }
};

const obtenerProyeto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(401).json({ msg: error.message });
  }

  //Obtener las tareas del proyecto
  const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)
  
    res.json({
      proyecto,
      tareas
    });
};

const editarProyeto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(401).json({ msg: error.message });
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (e) {
    console.log(e);
  }
};

const eliminarProyeto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(401).json({ msg: error.message });
  }
  try{
    await proyecto.deleteOne();
    res.json({msg: "proyecto eliminado"})

  }catch(e){
    console.log(e)
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};


export {
  obtenerProyetos,
  obtenerProyeto,
  nuevoProyecto,
  editarProyeto,
  eliminarProyeto,
  agregarColaborador,
  eliminarColaborador,
};
