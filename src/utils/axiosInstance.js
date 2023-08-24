import axios from "axios";

function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

function getTokenFromCookie() {
  const token = getCookie("token");

  if (token) {
    console.log("Token encontrado en la cookie:", token);
  } else {
    console.log("Token no encontrado en la cookie.");
  }

  return token;
}

// Crea una instancia de Axios con los interceptores configurados
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  function (config) {
    // Obtiene el token de la cookie
    const token = getTokenFromCookie();

    // Agrega el token al encabezado de autorización si está presente
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
