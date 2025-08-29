import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActivityBadge } from './ActivityBadge';
import type { ActivityType } from '@/features/feed/types';

const meta: Meta<typeof ActivityBadge> = {
  title: 'Feed/ActivityBadge',
  component: ActivityBadge,
};

export default meta;
type Story = StoryObj<typeof ActivityBadge>;

const kinds: ActivityType[] = [
  'push',
  'pull_request_opened',
  'issue_opened',
  'starred_repo',
  'forked_repo',
  'followed_user',
  'release_published',
  'qa_posted',
  'article_published',
  'package_published',
  'site_deployed',
  'repo_tagged',
  'milestone_reached',
  'directory_shared',
  'community_posted',
  'community_commented',
];

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {kinds.map((k) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ActivityBadge type={k} />
          <span style={{ fontSize: 12, color: '#666' }}>{k}</span>
        </div>
      ))}
    </div>
  ),
};

