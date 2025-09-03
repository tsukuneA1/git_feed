import type { Meta, StoryObj } from "@storybook/react";
import { QnaComposer } from "./QnaComposer";

const meta: Meta<typeof QnaComposer> = {
  title: "Feed/QnaComposer",
  component: QnaComposer,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof QnaComposer>;

export const Default: Story = {
  args: {
    users: ["alice", "rails", "vercel"],
    onPost: (p) => console.log("post", p),
  },
};
