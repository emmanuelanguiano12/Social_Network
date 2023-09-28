const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"12345678",
    database:"signup"
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (name, email, password) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]

    db.query(sql, [values], (err, data) => {
        if(err){
            return res.json("Error");
        }
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT id, email, password, imagen FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            // Devuelve el ID del usuario en lugar de "Success"
            return res.json({ status: "Success", idUsuario: data[0].id });
        } else {
            return res.json("Fail");
        }
    });
});

app.post('/getUserData', (req, res) => {
    const idUsuario = req.body.idUsuario;
    const sql = "SELECT name, email, imagen FROM login WHERE id = ?";
    
    db.query(sql, [idUsuario], (err, result) => {
      if (err) {
        return res.json({ status: "Fail" });
      }
      
      if (result.length === 1) {
        const userData = {
          name: result[0].name,
          email: result[0].email,
          imagen: result[0].imagen
        };
        return res.json({ status: "Success", userData });
      } else {
        return res.json({ status: "Fail" });
      }
    });
  });

  app.post("/publicarContenido", (req, res) => {
    const { contenido, idUsuario } = req.body;
    const sql = "INSERT INTO publicaciones (Contenido, idUsuario) VALUES (?, ?)";
  
    db.query(sql, [contenido, idUsuario], (err, result) => {
      if (err) {
        return res.json({ status: "Error" });
      }
  
      return res.json({ status: "Success" });
    });
  });

  app.get('/publicaciones', (req, res) => {
    // Realiza la consulta a la base de datos para obtener todas las publicaciones
    const sql = "SELECT * FROM `publicaciones` ORDER BY idPublicacion DESC";
    db.query(sql, (err, result) => {
      if (err) {
        return res.json({ status: "Error" });
      }
      // Envía las publicaciones al cliente
      return res.json({ status: "Success", publicaciones: result });
    });
  });
  
    
  app.post("/agregarComentario", (req, res) => {
    const { contenido, idUsuario, idPublicacion } = req.body;
    const sql = "INSERT INTO comentarios (Comentario, idUsuario, idPublicacion) VALUES (?, ?, ?)";
  
    db.query(sql, [contenido, idUsuario, idPublicacion], (err, result) => {
      if (err) {
        console.error(err); // Agrega esto para imprimir el error en la consola del servidor
        return res.json({ status: "Error" });
      }
  
      return res.json({ status: "Success" });
    });
  });
  
  app.get("/comentarios/:idPublicacion", (req, res) => {
    const idPublicacion = req.params.idPublicacion;
    const sql = "SELECT c.*, p.Contenido AS contenidoPublicacion FROM comentarios c JOIN publicaciones p ON c.idPublicacion = p.idPublicacion WHERE c.idPublicacion = ?";
  
    db.query(sql, [idPublicacion], (err, result) => {
      if (err) {
        return res.json({ status: "Error" });
      }
  
      return res.json({ status: "Success", comentarios: result });
    });
  });
  

app.listen(8081, () => { 
    console.log('server is running on port 8081');
})