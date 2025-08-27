import { Github } from "lucide-react";
import { SigninHandler } from "@/components/signin-handler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Github className="h-12 w-12 text-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Sign In</h1>
        <p className="text-muted-foreground">
          サインインが完了すると、あなたの個人用フィードおよび投稿機能が利用可能になります。
        </p>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">サインイン</CardTitle>
          <CardDescription>
            GitHubアカウントを使用してサインイン
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SigninHandler />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない場合は、
              <br />
              GitHubで新しいアカウントを作成してください
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ※ 本アプリはβ版でGithub
              OAuth以外のサインイン方法は提供していません。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TODO: プラポリ用意出来たら有効化 */}
      {/* <div className="text-center space-y-2">
        <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
          <a
            href="https://docs.github.com/ja/site-policy/github-terms/github-terms-of-service"
            className="hover:text-accent underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            利用規約
          </a>
          <a
            href="https://docs.github.com/ja/site-policy/privacy-policies/github-privacy-statement"
            className="hover:text-accent underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            プライバシーポリシー
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default Page;
