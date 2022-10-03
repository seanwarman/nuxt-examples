import type { ProgressBarStep } from './Tz-Progress-Bar.types';

export const exampleSteps = [
  {
    label: 'Your details',
    url: '/details'
  },
  {
    label: 'Delivery',
    url: '/delivery'
  },
  {
    label: 'Payment',
    url: '/payment'
  }
] as Array<ProgressBarStep>;
