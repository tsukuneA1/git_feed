import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AudienceTabs, type Audience } from './AudienceTabs';

const meta: Meta<typeof AudienceTabs> = {
  title: 'Feed/AudienceTabs',
  component: AudienceTabs,
};

export default meta;
type Story = StoryObj<typeof AudienceTabs>;

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Audience>('recommended');
    return (
      <div style={{ padding: 12, maxWidth: 480 }}>
        <AudienceTabs value={value} onChange={setValue} />
        <div style={{ fontSize: 12, color: '#666', marginTop: 12 }}>
          selected: {value}
        </div>
      </div>
    );
  },
};

