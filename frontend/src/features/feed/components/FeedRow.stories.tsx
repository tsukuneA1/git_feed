import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_ACTIVITIES } from "@/features/feed/mock";
import { FeedRow } from "./FeedRow";

const meta: Meta<typeof FeedRow> = {
  title: "Feed/FeedRow",
  component: FeedRow,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FeedRow>;

const article =
  MOCK_ACTIVITIES.find((a) => a.type === "article_published") ??
  MOCK_ACTIVITIES[0];
const pkg =
  MOCK_ACTIVITIES.find((a) => a.type === "package_published") ??
  MOCK_ACTIVITIES[0];
const qa =
  MOCK_ACTIVITIES.find((a) => a.type === "qa_posted") ?? MOCK_ACTIVITIES[0];
const release =
  MOCK_ACTIVITIES.find((a) => a.type === "release_published") ??
  MOCK_ACTIVITIES[0];
const deploy =
  MOCK_ACTIVITIES.find((a) => a.type === "site_deployed") ?? MOCK_ACTIVITIES[0];
const community =
  MOCK_ACTIVITIES.find((a) => a.type === "community_posted") ??
  MOCK_ACTIVITIES[0];
const push =
  MOCK_ACTIVITIES.find((a) => a.type === "push") ?? MOCK_ACTIVITIES[0];
const pr =
  MOCK_ACTIVITIES.find((a) => a.type === "pull_request_opened") ??
  MOCK_ACTIVITIES[0];
const issue =
  MOCK_ACTIVITIES.find((a) => a.type === "issue_opened") ?? MOCK_ACTIVITIES[0];

export const Article: Story = {
  name: "Article published",
  args: { activity: article },
};

export const Package: Story = {
  name: "Package published",
  args: { activity: pkg },
};

export const QA: Story = {
  name: "Q&A posted",
  args: { activity: qa },
};

export const Release: Story = {
  name: "Release published",
  args: { activity: release },
};

export const Deploy: Story = {
  name: "Site deployed",
  args: { activity: deploy },
};

export const CommunityPost: Story = {
  name: "Community posted",
  args: { activity: community },
};

export const PushWork: Story = {
  name: "Push (work item)",
  args: { activity: push },
};

export const PROpened: Story = {
  name: "Pull request opened",
  args: { activity: pr },
};

export const IssueOpened: Story = {
  name: "Issue opened",
  args: { activity: issue },
};
