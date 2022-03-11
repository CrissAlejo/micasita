import axios from 'axios';

//const axiosInstance = axios.create({ baseURL: `http://127.0.0.1:8000/api` });
const axiosInstance = axios.create({baseURL: `https://apiism.g2g.ec/api`});

axiosInstance.interceptors.response.use(
    response => {
        return response
    },

    error => {
        Promise.reject((error.response && error.response.data) || 'Something went wrong')
    }


);

export { axiosInstance };