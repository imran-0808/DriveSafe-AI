import axios from "axios";

/*
 Central API file  .
 Aage jaakar yahin se saare backend calls honge
*/
const API = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL:"https://drivesafe-ai.onrender.com",
});

export default API;