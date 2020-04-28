import axios from 'axios';

const defaultInstance = axios.create({
    baseURL: 'https://my-react-hooks-example.firebaseio.com/',
});

export default defaultInstance;