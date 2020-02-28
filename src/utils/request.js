import axios from 'axios'
import RequestConfig from './request_conf.js';

const service = axios.create({
    baseURL: RequestConfig.HOST_NAME, // api的base_url     process.env.BASE_API   RequestConfig.test.HOST_NAME
    timeout: 60000 // request timeout
});

export default service