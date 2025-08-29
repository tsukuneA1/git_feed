import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecommendedInterests } from './RecommendedInterests';

const meta = {
  title: 'Feed/RecommendedInterests',
  component: RecommendedInterests,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RecommendedInterests>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    interests: ['Next.js', 'Design', 'API'],
  },
};

export const Empty: Story = {
  args: {
    interests: [],
  },
};
