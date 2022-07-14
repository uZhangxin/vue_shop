import axios from "axios";

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/login',
        timeout: 5000,
    })
    return instance(config)
}