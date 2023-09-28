import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Home() {
  const location = useLocation();
  const idUsuario = location.state.idUsuario;
  const [userData, setUserData] = useState({
    name: "",
    imagen: ""
  });
  const [contenido, setContenido] = useState("");
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});

  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState({});



  useEffect(() => {
    // Realizar la consulta a la base de datos para obtener los datos del usuario
    axios.post('http://localhost:8081/getUserData', { idUsuario })
      .then(res => {
        if (res.data.status === "Success") {
          setUserData(res.data.userData);
        } else {
          alert("No se pudieron obtener los datos del usuario");
        }
      })
      .catch(err => console.log(err));

    // Realizar una solicitud al servidor para obtener todas las publicaciones
    axios.get('http://localhost:8081/publicaciones')
      .then(res => {
        if (res.data.status === "Success") {
          setPublicaciones(res.data.publicaciones, res.data.idPublicacion);
        } else {
          alert("No se pudieron obtener las publicaciones");
        }
      })
      .catch(err => console.log(err));


// Función para obtener los comentarios por publicación
const obtenerComentariosPorPublicacion = (idPublicacion) => {
  axios.get(`http://localhost:8081/comentarios/${idPublicacion}`)
    .then((res) => {
      if (res.data.status === "Success") {
        // Actualiza el estado de los comentarios por publicación
        setComentariosPorPublicacion((prevState) => ({
          ...prevState,
          [idPublicacion]: res.data.comentarios,
        }));
              
      } else {
        alert("No se pudieron obtener los comentarios");
      }
    })
    .catch((err) => console.log(err));
};

const obtenerComentarios = async () => {
  for (const publicacion of publicaciones) {
    await obtenerComentariosPorPublicacion(publicacion.idPublicacion);
  }
};

obtenerComentarios();

// Realizar una solicitud para obtener los comentarios por cada publicación
publicaciones.forEach((publicacion) => {
  obtenerComentariosPorPublicacion(publicacion.idPublicacion);
});
}, [idUsuario]);

  // Función para manejar el envío del contenido
  const handlePublicarClick = () => {
    // Realizar una solicitud para guardar el contenido
    axios.post('http://localhost:8081/publicarContenido', {
      idUsuario,
      contenido
    })
      .then(res => {
        if (res.data.status === "Success") {
          // Actualizar la lista de publicaciones después de guardar
          setPublicaciones([...publicaciones, { contenido }]);
          // Limpiar el textarea
          setContenido("");
        } else {
          alert("No se pudo publicar el contenido");
        }
      })
      .catch(err => console.log(err));
  };

  const handleComentarioChange = (e, idPublicacion) => {
    const nuevoValor = e.target.value;
    setComentarios((prevComentarios) => ({
      ...prevComentarios,
      [idPublicacion]: nuevoValor,
    }));
  };
  
  const handleAgregarComentario = (idPublicacion) => {
    const contenido = comentarios[idPublicacion] || ""; // Obtén el contenido del comentario
    axios
      .post("http://localhost:8081/agregarComentario", {
        idUsuario,
        idPublicacion,
        contenido,
      })
      .then((res) => {
        if (res.data.status === "Success") {
          // Realiza alguna lógica aquí si es necesario, como actualizar la lista de comentarios
          // Limpia el contenido del comentario después de agregarlo
          setComentarios((prevComentarios) => ({
            ...prevComentarios,
            [idPublicacion]: "", // Limpia el comentario después de agregarlo
          }));
        } else {
          alert("No se pudo agregar el comentario");
        }
      })
      .catch((err) => console.log(err));
  };
  
  


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          {/* Información del perfil */}
          <div className="card">
            <div className="card-body">
              <img
                src={userData.imagen}
                className="card-img-top avatar" // Aplica la clase "avatar"
                alt="Imagen de perfil"
              />
              <p className="card-text">Bienvenido: <b>{userData.name}</b></p>
              <p className="card-text">ID de Usuario: {idUsuario}</p>
            </div>
          </div>
        </div>
        <div className="col">
          {/* Información del perfil */}
          <div className="card">
            <div className="card-body">
              <textarea
                cols={108}
                className="textareaposts"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
              ></textarea>
              <button className="btn btn-primary" onClick={handlePublicarClick}>
                Publicar
              </button><br/><br/>
              <h5 className="card-title">Publicaciones</h5>
              <ul className="list-group">
                {publicaciones.map((publicacion) => (
                  <li className="list-group-item" key={publicacion.idPublicacion}>
                    {publicacion.Contenido}<br/><br/>
                    <div class="border border-primary rounded">
                      <h6>Comentarios:</h6>
                      <ul>
                        {comentariosPorPublicacion[publicacion.idPublicacion]?.map((comentario) => (
                          <li key={comentario.idComentario}>{comentario.Comentario}</li>
                        ))}
                      </ul>
                    </div><br/>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Agrega un comentario"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={comentarios[publicacion.idPublicacion] || ""}
                        onChange={(e) => handleComentarioChange(e, publicacion.idPublicacion)}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleAgregarComentario(publicacion.idPublicacion)}
                        >
                          Agregar
                        </button>
                      </div>
                    </div> 
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          {/* Resto de la página */}
        </div>
      </div>
    </div>
  );
}

export default Home;
