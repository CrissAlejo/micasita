import AxiosMockAdapter from 'axios-mock-adapter';
import axios_old from './axios';

const axiosMockAdapter = new AxiosMockAdapter(axios_old, { delayResponse: 0 });

export default axiosMockAdapter;
