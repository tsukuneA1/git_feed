import Link from "next/link";

const Home = () => {
  return (
    <>
      <h1>ホームページ</h1>
      <Link href="/signin">サインインページへ</Link>
    </>
  );
};

export default Home;
