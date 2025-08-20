// @ts-nocheck
/* eslint-disable */
import React from 'react';

const screens = [
  { src: '../../screenshots/home.svg', alt: 'Home' },
  { src: '../../screenshots/graph.svg', alt: 'Graph' },
  { src: '../../screenshots/inventory.svg', alt: 'Inventory' },
  { src: '../../screenshots/list.svg', alt: 'List' },
  { src: '../../screenshots/meds.svg', alt: 'Meds' },
  { src: '../../screenshots/reminders.svg', alt: 'Reminders' },
  { src: '../../screenshots/add.svg', alt: 'Add' },
  { src: '../../screenshots/Emergency.svg', alt: 'Emergency' },
  { src: '../../screenshots/refill.svg', alt: 'Refill' },
  { src: '../../screenshots/Insurance Cost.svg', alt: 'Insurance Cost' },
  { src: '../../screenshots/Post workout.svg', alt: 'Post Workout' },
];

export default function MediTrackMockScreensV2() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {screens.map(({ src, alt }) => (
        <img
          key={src}
          src={src}
          alt={alt}
          style={{ width: '200px', height: 'auto', border: '1px solid #ccc' }}
        />
      ))}
    </div>
  );
}
