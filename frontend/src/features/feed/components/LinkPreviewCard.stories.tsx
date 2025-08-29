import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinkPreviewCard } from './LinkPreviewCard';

const meta: Meta<typeof LinkPreviewCard> = {
  title: 'Feed/LinkPreviewCard',
  component: LinkPreviewCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof LinkPreviewCard>;

export const Default: Story = {
  args: {
    url: 'https://example.com/llm-prompts',
    preview: {
      title: 'LLM Prompt Engineering Best Practices',
      siteName: 'Example Blog',
      siteUrl: 'https://example.com',
      imageUrl:
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
    },
  },
};

