import { RoomPlannerImages, SectionImages } from '../assets/images';

export interface ContentPreview {
  label: string;
  primaryImage: string;
  icon: string;
  body: string;
  slug: string;
  firstSubsection?: string;
  learnIcon: string;
  designIcon: string;
}

export const contentPreviews: ContentPreview[] = [
  {
    slug: 'camera-and-audio',
    label: 'Camera & Audio',
    firstSubsection: 'camera',
    primaryImage: SectionImages.cameraAndAudio.contentPreviewHero,
    icon: SectionImages.cameraAndAudio.icons.sectionIcon,
    designIcon: SectionImages.cameraAndAudio.icons.designIcon,
    learnIcon: SectionImages.cameraAndAudio.icons.learnIcon,
    body: `We've tuned and tweaked the hardware. Now, position it correctly to
     unlock the best performance.`,
  },
  {
    slug: 'displays-and-extras',
    label: 'Displays & Extras',
    firstSubsection: 'screen',
    primaryImage: SectionImages.displaysAndExtras.contentPreviewHero,
    icon: SectionImages.displaysAndExtras.icons.sectionIcon,
    designIcon: SectionImages.displaysAndExtras.icons.designIcon,
    learnIcon: SectionImages.displaysAndExtras.icons.learnIcon,
    body: `Correctly sizing displays is a key part of the conference experience.
      Plus, get some hints and tips on using the Series One Board 65 and Desk 27,
      developed in collaboration with Avocor,
      in your space.`,
  },
  {
    slug: 'room-layout',
    label: 'Room layout',
    firstSubsection: 'viewing-area',
    primaryImage: SectionImages.roomLayout.contentPreviewHero,
    icon: SectionImages.roomLayout.icons.sectionIcon,
    designIcon: SectionImages.roomLayout.icons.designIcon,
    learnIcon: SectionImages.roomLayout.icons.learnIcon,
    body: `Following a few spatial guidelines can make a huge difference for remote and in-room participants.`,
  },
  {
    slug: 'furniture-lighting',
    label: 'Furniture and lighting',
    firstSubsection: 'lighting',
    primaryImage: SectionImages.furnitureLighting.contentPreviewHero,
    icon: SectionImages.furnitureLighting.icons.sectionIcon,
    designIcon: SectionImages.furnitureLighting.icons.designIcon,
    learnIcon: SectionImages.furnitureLighting.icons.learnIcon,
    body: `Make your meeting room look and feel inviting with simple decorative and lighting tips. Appropriate lighting helps both local and remote participants have a great experience.`,
  },
  {
    slug: 'acoustics',
    label: 'Acoustics',
    firstSubsection: 'separation',
    primaryImage: SectionImages.acoustics.contentPreviewHero,
    icon: SectionImages.acoustics.icons.sectionIcon,
    designIcon: SectionImages.acoustics.icons.designIcon,
    learnIcon: SectionImages.acoustics.icons.learnIcon,
    body: `Poor acoustics is a common downfall of video conferencing spaces. The right allowance of acoustic finishes can help make speech clear and audible, and adequate isolation helps avoid interruptions.`,
  },
  {
    slug: 'services',
    label: 'Services',
    firstSubsection: 'air-handling',
    primaryImage: SectionImages.services.contentPreviewHero,
    icon: SectionImages.services.icons.sectionIcon,
    designIcon: SectionImages.services.icons.designIcon,
    learnIcon: SectionImages.services.icons.learnIcon,
    body: `Make sure power is provisioned for the right places, and ensure ventilation systems don't cause unwanted noise pickup on your microphones.`,
  },
  {
    slug: 'room-planner',
    label: 'Room Designer',
    primaryImage: RoomPlannerImages.contentPreviewHero,
    icon: RoomPlannerImages.icons.mainIcon,
    designIcon: SectionImages.services.icons.designIcon,
    learnIcon: SectionImages.services.icons.learnIcon,
    body: `Need to size up your room? All the best practices in this guide are used to help you pick the equipment and recommended room size for the occupancy you need.`,
  },
];
