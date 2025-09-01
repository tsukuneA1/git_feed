import Axios, { type AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = AXIOS_INSTANCE({
    ...config,
  }).then(({ data }) => data);

  return promise;
};

export default customInstance;
