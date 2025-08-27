import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>

      <h1>ホームページ</h1>
      <Link href="/signin">サインインページへ</Link>
      <Button>shadcn/ui test</Button>
    </>
  );
};

export default Home;
