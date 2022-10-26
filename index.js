import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDb();

//Configurar Cors
const whitelist = ['http://127.0.0.1:5173'];

const corsOptions = {
  origin: function(origin, callback){
    if(whitelist.includes(origin)){
      callback(null, true) 
    }else{
      callback(new Error('Error de cors'));
    }
  }
}

app.use(cors(corsOptions));
//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);



app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
