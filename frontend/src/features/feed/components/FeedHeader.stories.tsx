import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FeedHeader } from './FeedHeader';

const meta: Meta<typeof FeedHeader> = {
  title: 'Feed/FeedHeader',
  component: FeedHeader,
};

export default meta;
type Story = StoryObj<typeof FeedHeader>;

export const Default: Story = {
  args: {
    username: 'tsukune149',
  },
};

