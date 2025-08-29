import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecommendedUsers } from './RecommendedUsers';

const meta: Meta<typeof RecommendedUsers> = {
  title: 'Feed/RecommendedUsers',
  component: RecommendedUsers,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof RecommendedUsers>;

export const Default: Story = {
  args: {
    users: [
      { username: 'vercel', avatarUrl: 'https://avatars.githubusercontent.com/u/14985020?v=4' },
      { username: 'rails', avatarUrl: 'https://avatars.githubusercontent.com/u/4223?v=4' },
      { username: 'biomejs', avatarUrl: 'https://avatars.githubusercontent.com/u/112236211?v=4' },
    ],
  },
};

