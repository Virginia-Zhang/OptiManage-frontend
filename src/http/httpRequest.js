import axios from 'axios';

const AxiosUtil = axios.create({
    baseURL: 'http://localhost:8088',
    timeout: 10000,
    // withCredentials: true
});

const request = {
    // GET method
    get(url, params = {}, config = {}) {
        return AxiosUtil.get(url, { params, ...config });
    },

    // POST method
    post(url, data = {}, config = {}) {
        return AxiosUtil.post(url, data, config);
    },

    // PUT method
    put(url, data, config = {}) {
        return AxiosUtil.put(url, data, config);
    },

    // DELETE method
    delete(url, data, config = {}) {
        return AxiosUtil.delete(url, { data, ...config });
    },
};

export default request;

