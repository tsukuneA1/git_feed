type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { username } = await params;
  return <h1>{username}のユーザーページ</h1>;
};

export default Page;
