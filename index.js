import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDb();

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);



app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
