import axios from "axios";
import { apiBaseURL } from "./ApiBase";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true; //permiso para post y delete, no solo get

export const client = axios.create({
  baseURL: `${apiBaseURL}`,
});
export default client;

//RTL testing front
