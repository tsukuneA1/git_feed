import { UsersApi, Configuration } from "../generated";

const config = new Configuration({
  basePath: "http://localhost:3000",
});

const usersApi = new UsersApi(config);

export const fetchUsers = async () => {
  console.log(usersApi.configuration.basePath);
  const res = await usersApi.usersGet();
  return res.data;
};
