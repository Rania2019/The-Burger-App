import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-f7dd6.firebaseio.com/'

});

export default instance;