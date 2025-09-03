import { UsersApi, Configuration } from "../generated";

const config = new Configuration({
  basePath: "http://localhost:3000",
});

const usersApi = new UsersApi(config);

export const fetchUsers = async () => {
  const res = await usersApi.usersGet();
  return res.data;
};
