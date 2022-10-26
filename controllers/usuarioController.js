import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
  //Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email: email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();
    res.json(usuarioAlmacenado);
  } catch (e) {
    console.log(e);
  }
};

const autenticar = async (req, res) => {
  //Comprobar si el usuario existe
  const { email, password } = req.body;

  //Comprobar si el usuario esta confirmado
  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(404).json({ msg: error.message });
  }

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(404).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente" });
    console.log(usuarioConfirmar);
  } catch (e) {
    console.log(e);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Mail no valido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuario.token = generarId();
    await usuario.save();
    res.json({ msg: "Hemos enviado un mail con las instrucciones" });
  } catch (e) {
    console.log();
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try{
    await usuario.save();
    res.json({msg: "Password modificado correctamente"})
    }catch(e){
    console.log(e)
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message })
  }
};

const perfil = async (req,res) =>{ 
    const {usuario} = req;
    res.json(usuario);
}



export { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil };
