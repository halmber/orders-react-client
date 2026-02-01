import axios from 'axios';
import storage, { keys } from '../storage';

axios.interceptors.request.use((params) => {
  const token = storage.getItem(keys.TOKEN);
  if (token) {
    params.headers.setAuthorization(`Bearer ${token}`);
  }
  return params;
});

const addAxiosInterceptors = ({ onSignOut }) => {
  axios.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const data = error?.response?.data;

      const isInvalidToken = Array.isArray(data)
        ? data.some((e) => e?.code === 'INVALID_TOKEN')
        : data?.code === 'INVALID_TOKEN';

      if (isInvalidToken) {
        onSignOut();
      }

      throw data;
    },
  );
};

export { addAxiosInterceptors };

export default axios;
