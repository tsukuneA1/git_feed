import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RightSidebar } from './RightSidebar';
import { MOCK_ACTIVITIES } from '@/features/feed/mock';

const meta: Meta<typeof RightSidebar> = {
  title: 'Feed/RightSidebar',
  component: RightSidebar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof RightSidebar>;

export const Default: Story = {
  args: {
    items: MOCK_ACTIVITIES,
  },
};

export const WithTopics: Story = {
  args: {
    items: MOCK_ACTIVITIES,
    topics: ['Next.js', 'Design', 'API'],
  },
};

