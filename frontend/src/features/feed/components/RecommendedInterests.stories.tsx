import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RecommendedInterests } from './RecommendedInterests';

const meta: Meta<typeof RecommendedInterests> = {
  title: 'Feed/RecommendedInterests',
  component: RecommendedInterests,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof RecommendedInterests>;

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

