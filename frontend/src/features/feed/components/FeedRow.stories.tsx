import type { Meta, StoryObj } from '@storybook/react';
import { FeedRow } from './FeedRow';
import { MOCK_ACTIVITIES } from '@/features/feed/mock';

const meta: Meta<typeof FeedRow> = {
  title: 'Feed/FeedRow',
  component: FeedRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof FeedRow>;

const article = MOCK_ACTIVITIES.find((a) => a.type === 'article_published')!;
const pkg = MOCK_ACTIVITIES.find((a) => a.type === 'package_published')!;
const qa = MOCK_ACTIVITIES.find((a) => a.type === 'qa_posted')!;

export const Article: Story = {
  name: 'Article published',
  args: { activity: article },
};

export const Package: Story = {
  name: 'Package published',
  args: { activity: pkg },
};

export const QA: Story = {
  name: 'Q&A posted',
  args: { activity: qa },
};

