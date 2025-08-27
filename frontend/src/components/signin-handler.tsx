"use client";

import { Github } from "lucide-react";
import { Button } from "./ui/button";

export const SigninHandler = () => {
  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      size="lg"
    >
      <Github className="mr-2 h-5 w-5" />
      GitHubでサインイン
    </Button>
  );
};
