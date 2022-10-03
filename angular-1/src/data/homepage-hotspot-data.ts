export const HotspotData: Array<{
  name: string;
  text: string;
  color: string;
  defaultIcon: string;
  interimIcon: string;
  activeIcon: string;
  halo: string;
  x: number;
  y: number;
  z: number;
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  cameraRotation: {
    x: number;
    y: number;
    z: number;
  };
  modelsOn: Array<string>;
  modelsOff: Array<string>;
}> = [
  {
    name: 'camera-and-audio',
    text: 'Camera & Audio',
    color: '#e94233',
    defaultIcon: 'icon-hotspot-camera-audio-red-01-default@3x.png',
    interimIcon: 'icon-hotspot-camera-audio-red-01-interim@3x.png',
    activeIcon: 'icon-hotspot-camera-audio-red-01-active@3x.png',
    halo: 'icon-hotspot-camera-audio-red-01-active-halo@3x.png',
    x: -5,
    y: 113,
    z: -160,
    cameraPosition: {
      x: -100,
      y: 175,
      z: 350,
    },
    cameraRotation: {
      x: 100,
      y: 100,
      z: 0,
    },
    modelsOn: ['CameraAndAudio', 'defaultChairs', 'acousticDefault'],
    modelsOff: ['defaultCameraAndAudio'],
  },
  {
    name: 'displays-and-extras',
    text: 'Displays & Extras',
    color: '#0d9cab',
    defaultIcon: 'icon-hotspot-displays-extras-teal-01-default@3x.png',
    interimIcon: 'icon-hotspot-displays-extras-teal-01-interim@3x.png',
    activeIcon: 'icon-hotspot-displays-extras-teal-01-active@3x.png',
    halo: 'icon-hotspot-room-designer-teal-01-active-halo@3x.png',
    x: -230,
    y: 150,
    z: 50,
    cameraPosition: {
      x: 100,
      y: 200,
      z: 500,
    },
    cameraRotation: {
      x: 50,
      y: 100,
      z: 0,
    },
    modelsOn: [
      'DisplaysAndExtras',
      'defaultCameraAndAudioSetup',
      'defaultChairs',
      'defaultCameraAndAudio',
    ],
    modelsOff: [],
  },
  {
    name: 'room-layout',
    text: 'Room Layout',
    color: '#31a750',
    defaultIcon: 'icon-hotspot-room-layout-green-01-default@3x.png',
    interimIcon: 'icon-hotspot-room-layout-green-01-interim@3x.png',
    activeIcon: 'icon-hotspot-room-layout-green-01-active@3x.png',
    halo: 'icon-hotspot-room-layout-green-01-active-halo@3x.png',
    x: 90,
    y: 20,
    z: 200,
    cameraPosition: {
      x: 0,
      y: 280,
      z: 800,
    },
    cameraRotation: {
      x: 150,
      y: 100,
      z: 100,
    },
    modelsOn: [
      'RoomLayout',
      'defaultChairs',
      'defaultCameraAndAudioSetup',
      'acousticDefault',
      'defaultCameraAndAudio',
    ],
    modelsOff: [],
  },
  {
    name: 'furniture-lighting',
    text: 'Furniture & Lighting',
    color: '#fbbc05',
    defaultIcon: 'icon-hotspot-furniture-lighting-yellow-01-default@3x.png',
    interimIcon: 'icon-hotspot-furniture-lighting-yellow-01-interim@3x.png',
    activeIcon: 'icon-hotspot-furniture-lighting-yellow-01-active@3x.png',
    halo: 'icon-hotspot-furniture-lighting-yellow-01-active-halo@3x.png',
    x: 110,
    y: 70,
    z: 80,
    cameraPosition: {
      x: 400,
      y: 200,
      z: 150,
    },
    cameraRotation: {
      x: 0,
      y: 70,
      z: -100,
    },
    modelsOn: [
      'FurnitureAndLighting',
      'defaultCameraAndAudioSetup',
      'acousticDefault',
      'defaultCameraAndAudio',
    ],
    modelsOff: ['defaultChairs'],
  },
  {
    name: 'acoustics',
    text: 'Acoustics',
    color: '#3d85f2',
    defaultIcon: 'icon-hotspot-acoustics-blue-01-default@3x.png',
    interimIcon: 'icon-hotspot-acoustics-blue-01-interim@3x.png',
    activeIcon: 'icon-hotspot-acoustics-blue-01-active@3x.png',
    halo: 'icon-hotspot-acoustics-blue-01-active-halo@3x.png',
    x: -230,
    y: 200,
    z: 180,
    cameraPosition: {
      x: 300,
      y: 800,
      z: -150,
    },
    cameraRotation: {
      x: -150,
      y: 0,
      z: -100,
    },
    modelsOn: [
      'Acoustics',
      'defaultCameraAndAudioSetup',
      'defaultChairs',
      'acousticPanel00',
      'acousticPanel01',
      'acousticPanel02',
      'acousticPanel03',
      'defaultCameraAndAudio',
    ],
    modelsOff: ['stripLight00', 'stripLight01', 'acousticDefault'],
  },
  {
    name: 'services',
    text: 'Services',
    color: '#681da7',
    defaultIcon: 'icon-hotspot-services-purple-01-default@3x.png',
    interimIcon: 'icon-hotspot-services-purple-01-interim@3x.png',
    activeIcon: 'icon-hotspot-services-purple-01-active@3x.png',
    halo: 'icon-hotspot-services-purple-01-active-halo@3x.png',
    x: 110,
    y: 115,
    z: -160,
    cameraPosition: {
      x: 300,
      y: 160,
      z: 150,
    },
    cameraRotation: {
      x: 0,
      y: 50,
      z: -250,
    },
    modelsOn: [
      'services',
      'defaultCameraAndAudioSetup',
      'defaultChairs',
      'acousticDefault',
      'defaultCameraAndAudio',
    ],
    modelsOff: [],
  },
  {
    name: 'room-planner',
    text: 'Room Designer',
    color: '#0d9cab',
    defaultIcon: 'icon-hotspot-displays-extras-teal-01-default@3x.png',
    interimIcon: 'icon-hotspot-displays-extras-teal-01-interim@3x.png',
    activeIcon: 'icon-hotspot-room-designer-teal-01-active@3x.png',
    halo: 'icon-hotspot-room-designer-teal-01-active-halo@3x.png',
    x: -10,
    y: 90,
    z: 0,
    cameraPosition: {
      x: -30,
      y: 150,
      z: 150,
    },
    cameraRotation: {
      x: 40,
      y: 60,
      z: 0,
    },
    modelsOn: [
      'Drawing',
      'defaultCameraAndAudioSetup',
      'defaultChairs',
      'acousticDefault',
      'defaultCameraAndAudio',
    ],
    modelsOff: [],
  },
];
