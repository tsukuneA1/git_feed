import { fetchUsers } from "@/lib/api/users";

const Page = async () => {
  const users = await fetchUsers();

  return (
    <div>
      <h1>ユーザー一覧テストページ</h1>
      <p>{JSON.stringify(users, null, 2)}</p>
    </div>
  );
};

export default Page;
