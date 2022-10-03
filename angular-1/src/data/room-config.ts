const secondaryImage = {
  src: 'assets/images/demo/demoImage_1200.PNG',
  altText: 'secondary Image',
};

const roomPlannerAssetsPath = 'assets/images/room-planner';

const MeetHardware = {
  chromebase: {
    name: 'Desk 27',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/desk27.png`,
  },
  jamboard: {
    name: 'Board 65',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/board65.png`,
  },
  seriesOneSmall: {
    name: 'Series One Small Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/seriesOneSmallKit.png`,
  },
  seriesOneMedium: {
    name: 'Series One Medium Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/seriesOneMediumKit.png`,
  },
  seriesOneLarge: {
    name: 'Series One Large Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/seriesOneLargeKit.png`,
  },
  asusSmall: {
    name: 'ASUS Small Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/asusSmallMedium.png`,
  },
  asusLarge: {
    name: 'ASUS Large Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/asusLargeKit.png`,
  },
  // TODO
  logitechRallyBarMini: {
    name: 'Logitech Rally Bar Mini',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/logitechRallyBarMiniKit.png`,
  },
  // TODO
  logitechRallyBar: {
    name: 'Logitech Rally Bar',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/logitechRallyBarKit.png`,
  },
  logitechSmall: {
    name: 'Logitech Small Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/logitechSmallKit.png`,
  },
  logitechMedium: {
    name: 'Logitech Medium Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/logitechMediumKit.png`,
  },
  logitechLarge: {
    name: 'Logitech Large Kit',
    image: `${roomPlannerAssetsPath}/secondary-media/kit/logitechLargeKit.png`,
  },
};

// NOTE
// A few of the names have changed around. Many of the "jam" products have been
// switched out but the property names still refer to them. Also "conference" is now "Room Kits"
//
// conference === Room Kits option
// meetOnJam  === Board 65 option
// withJam    === Board 65 tick box
// wihoutJam  === Board 65 unticked
//
// TODO: fix this naming convention so that chromebase, meetOnJam, conference
// withoutJam and withJam use an abstracted naming convention.

export const NewRoomConfigMap = {
  1: {
    primaryImage: {
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/1person_phonebooth.png`,
        altText: '1 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/1person_meetonjam.png`,
        altText: '1 Person - Board 65',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      chromebase: {
        camPosition: {
          x: -350,
          y: 200,
          z: 350,
        },
        camRotation: {
          x: -100,
          y: 150,
          z: 0,
        },
        xOffset: 0,
        zOffset: -0.925,
        minRoomSize: {
          length: 2.3,
          width: 1.8,
        },
        includedModels: [
          'Chromebase1_AcousticPanel001',
          'Chromebase1_Desk',
          'Chromebase1TablesAndChairs',
          'Chromebase1',
          'Tall_LAmp001',
        ],
        screenSize: 'Desk 27',
        roomDescription:
          'Typical small huddle room setups using the Chromebase',
        microphoneNumber: null,
        table: {
          length: 0.9,
          width: 1.2,
        },
        occupancy: 1,
        primaryHardware: [MeetHardware.chromebase],
        logitech: null,
        jamboard: false,
        acousticWallTreatment: 7.0,
      },
      meetOnJam: {
        camPosition: {
          x: -350,
          y: 200,
          z: 350,
        },
        camRotation: {
          x: -100,
          y: 150,
          z: 0,
        },
        xOffset: 0,
        zOffset: -0.29,
        minRoomSize: {
          length: 2.5,
          width: 3,
        },
        includedModels: [
          'MeetOnJam1_AcousticPanel',
          'MeetOnJam1TablesAndChairs',
          'MeetOnJam',
          'MeetUpBoard65Stand',
        ],
        screenSize: 'Board 65',
        roomDescription: 'Typical huddle room setups using the Jamboard',
        microphoneNumber: 0,
        table: {
          length: 1.05,
          width: 1.2,
        },
        primaryHardware: [MeetHardware.jamboard],
        occupancy: 1,
        logitech: 'Small room kit',
        jamboard: true,
        acousticWallTreatment: 11.4,
      },
    },
    screens: {
      single: ['Desk027'],
      dual: [],
    },
  },
  2: {
    primaryImage: {
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/2person_phonebooth.png`,
        altText: '2 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/2person_meetonjam.png`,
        altText: '2 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      chromebase: {
        camPosition: {
          x: -400,
          y: 300,
          z: 400,
        },
        camRotation: {
          x: -100,
          y: 150,
          z: 0,
        },
        xOffset: 0,
        zOffset: -0.63,
        minRoomSize: {
          length: 2.3,
          width: 2.3,
        },
        includedModels: [
          'Chromebase2_AcousticPanel',
          'Chromebase2TablesAndChairs',
          'ChromeBase',
        ],
        screenSize: 'Desk 27',
        roomDescription:
          'Typical small huddle room setups using the Chromebase',
        microphoneNumber: 0,
        table: {
          length: 0.8,
          width: 1.7,
        },
        occupancy: 2,
        primaryHardware: [MeetHardware.chromebase],
        logitech: null,
        jamboard: false,
        acousticWallTreatment: 7.6,
      },
      meetOnJam: {
        camPosition: {
          x: -400,
          y: 300,
          z: 400,
        },
        camRotation: {
          x: -100,
          y: 150,
          z: 0,
        },
        xOffset: 0,
        zOffset: -0.29,
        minRoomSize: {
          length: 3,
          width: 3,
        },
        includedModels: [
          'MeetOnJam2_AcousticPanel',
          'MeetOnJam2TablesAndChairs',
          'MeetOnJam',
          'MeetUpBoard65Stand',
        ],
        screenSize: 'Board 65',
        roomDescription: 'Typical huddle room setups using the Jamboard',
        microphoneNumber: 0,
        table: {
          length: 1.05,
          width: 1.2,
        },
        occupancy: 2,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: true,
        primaryHardware: [MeetHardware.jamboard],
        acousticWallTreatment: 11.4,
      },
    },
    screens: {
      single: ['Desk027'],
      dual: [],
    },
  },
  3: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/3person_Single_jamboard.png`,
        altText: '3 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/3person_Dual.png`,
        altText: '3 Person - Dualscreen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/3person_Dual_jamboard.png`,
        altText: '3 Person - Dualscreen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/3person_Single.png`,
        altText: '3 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/3person_meetonjam.png`,
        altText: '3 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -500,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -100,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0,
          minRoomSize: {
            length: 3.55,
            width: 3.6,
          },
          includedModels: [
            'room3_AcousticPanel001',
            'room3_AcousticPanel002',
            'Room3TablesAndChairs',
          ],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 1.05,
            width: 1.2,
          },
          occupancy: 3,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],
          secondaryHardware: [],
          logitech: 'Small room kit',
          jamboard: false,
          acousticWallTreatment: 11.4,
        },
        withJam: {
          camPosition: {
            x: -700,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -100,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.5,
          minRoomSize: {
            length: 3.55,
            width: 4.1,
          },
          includedModels: ['Room3AddJam', 'Room3TablesAndChairs'],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 1.05,
            width: 1.2,
          },
          occupancy: 3,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],

          logitech: 'Small room kit',
          jamboard: true,
          acousticWallTreatment: 12.3,
        },
      },
      meetOnJam: {
        camPosition: {
          x: -500,
          y: 400,
          z: 500,
        },
        camRotation: {
          x: -100,
          y: 100,
          z: 0,
        },
        xOffset: 0,
        zOffset: 0.02,
        minRoomSize: {
          length: 3.55,
          width: 3.6,
        },
        includedModels: [
          'MeetOnJam3_AcousticPanel',
          'MeetOnJam3TablesAndChairs',
          'MeetOnJam',
          'MeetUp',
          'MeetUpBoard65Wall',
        ],
        screenSize: 'Board 65',
        roomDescription: 'Typical huddle room setups using the Jamboard',
        microphoneNumber: 0,
        table: {
          length: 1.05,
          width: 1.2,
        },
        occupancy: 3,
        primaryHardware: [MeetHardware.jamboard],
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 11.4,
      },
    },
    screens: {
      single: ['Single48', 'singleLiteSetupA'],
      dual: ['Dual48', 'singleLiteSetupA'],
    },
  },
  4: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/4person_Single_jamboard.png`,
        altText: '4 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/4person_Dual.png`,
        altText: '4 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/4person_Dual_jamboard.png`,
        altText: '4 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/4person_Single.png`,
        altText: '4 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/4person_meetonjam.png`,
        altText: '4 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -550,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -125,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0,
          minRoomSize: {
            length: 3.9,
            width: 3.6,
          },
          includedModels: [
            'room4_AcousticPanel001',
            'room4_AcousticPanel002',
            'Room4TablesAndChairs',
          ],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 1.4,
            width: 1.2,
          },
          occupancy: 4,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],
          logitech: 'Small room kit',
          jamboard: true,
          acousticWallTreatment: 13,
        },
        withJam: {
          camPosition: {
            x: -750,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -100,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.5,
          minRoomSize: {
            length: 3.9,
            width: 4.1,
          },
          includedModels: ['Room4AddJam', 'Room4TablesAndChairs'],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 1.4,
            width: 1.2,
          },
          occupancy: 4,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],

          logitech: 'Small room kit',
          jamboard: true,
          acousticWallTreatment: 13,
        },
      },
      meetOnJam: {
        camPosition: {
          x: -550,
          y: 400,
          z: 500,
        },
        camRotation: {
          x: -125,
          y: 100,
          z: 0,
        },
        xOffset: 0,
        zOffset: 0.02,
        minRoomSize: {
          length: 3.9,
          width: 3.6,
        },
        includedModels: [
          'MeetOnJam4_AcousticPanel',
          'MeetOnJam4TablesAndChairs',
          'MeetOnJam',
          'MeetUp',
          'MeetUpBoard65Wall',
        ],
        screenSize: 'Board 65',
        roomDescription: 'Typical huddle room setups using the Jamboard',
        microphoneNumber: 0,
        table: {
          length: 1.4,
          width: 1.2,
        },
        occupancy: 4,
        primaryHardware: [MeetHardware.jamboard],
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 13,
      },
    },
    screens: {
      single: ['Single48', 'singleLiteSetupA'],
      dual: ['Dual48', 'singleLiteSetupA'],
    },
  },
  5: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/5person_Single_jamboard.png`,
        altText: '5 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/5person_Dual.png`,
        altText: '5 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/5person_Dual_jamboard.png`,
        altText: '5 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/5person_Single.png`,
        altText: '5 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/5person_meetonjam.png`,
        altText: '5 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -600,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -150,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0,
          minRoomSize: {
            length: 4.25,
            width: 3.6,
          },
          includedModels: [
            'room5_AcousticPanel001',
            'room5_AcousticPanel002',
            'Room5TablesAndChairs',
          ],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.1,
            width: 1.4,
          },
          occupancy: 5,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],

          logitech: 'Small room kit',
          jamboard: false,
          acousticWallTreatment: 13.7,
        },
        withJam: {
          camPosition: {
            x: -800,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -100,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.5,
          minRoomSize: {
            length: 4.25,
            width: 4.1,
          },
          includedModels: ['Room5AddJam', 'Room5TablesAndChairs'],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.1,
            width: 1.4,
          },
          occupancy: 5,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],
          logitech: 'Small room kit',
          jamboard: true,
          acousticWallTreatment: 14.9,
        },
      },
      meetOnJam: {
        camPosition: {
          x: -600,
          y: 400,
          z: 500,
        },
        camRotation: {
          x: -150,
          y: 100,
          z: 0,
        },
        xOffset: 0,
        zOffset: 0.02,
        minRoomSize: {
          length: 4.25,
          width: 3.6,
        },
        includedModels: [
          'MeetOnJam5_AcousticPanel',
          'MeetOnJam5TablesAndChairs',
          'MeetOnJam',
          'MeetUp',
          'MeetUpBoard65Wall',
        ],
        screenSize: 'Board 65',
        roomDescription: 'Typical huddle room setups using the Board 65',
        microphoneNumber: 0,
        table: {
          length: 1.4,
          width: 1.2,
        },
        occupancy: 5,
        primaryHardware: [MeetHardware.jamboard],
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 13,
      },
    },
    screens: {
      single: ['Single48', 'singleLiteSetupA'],
      dual: ['Dual48', 'singleLiteSetupA'],
    },
  },
  6: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/6person_Single_jamboard.png`,
        altText: '6 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/6person_Dual.png`,
        altText: '6 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/6person_Dual_jamboard.png`,
        altText: '6 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/6person_Single.png`,
        altText: '6 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/6person_meetonjam.png`,
        altText: '6 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -650,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -175,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0,
          minRoomSize: {
            length: 4.6,
            width: 3.8,
          },
          includedModels: [
            'room6_AcousticPanel001',
            'room6_AcousticPanel002',
            'room6_AcousticPanel003',
            'Room6TablesAndChairs',
          ],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.1,
            width: 1.4,
          },
          occupancy: 6,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],

          logitech: 'Small room kit',
          jamboard: false,
          acousticWallTreatment: 13.7,
        },
        withJam: {
          camPosition: {
            x: -850,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -125,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.64,
          minRoomSize: {
            length: 4.6,
            width: 4.3,
          },
          includedModels: ['Room6AddJam', 'Room6TablesAndChairs'],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.1,
            width: 1.4,
          },
          occupancy: 6,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechSmall,
            MeetHardware.seriesOneSmall,
          ],

          logitech: 'Small room kit',
          jamboard: true,
          acousticWallTreatment: 14.9,
        },
      },
      meetOnJam: {
        camPosition: {
          x: -600,
          y: 400,
          z: 500,
        },
        camRotation: {
          x: -150,
          y: 100,
          z: 0,
        },
        xOffset: 0,
        zOffset: 0.14,
        minRoomSize: {
          length: 4.6,
          width: 3.8,
        },
        includedModels: [
          'MeetOnJam6_AcousticPanel',
          'MeetOnJam6_AcousticPanel2',
          'MeetOnJam6TablesAndChairs',
          'MeetUpBoard65Wall',
        ],
        screenSize: 'Board 65',
        roomDescription: 'Typical huddle room setups using the Board 65',
        microphoneNumber: 0,
        table: {
          length: 2.1,
          width: 1.4,
        },
        occupancy: 6,
        primaryHardware: [MeetHardware.jamboard],
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 14.9,
      },
    },
    screens: {
      single: ['Single48', 'singleLiteSetupA'],
      dual: ['Dual48', 'singleLiteSetupA'],
    },
  },
  7: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/7person_Single_jamboard.png`,
        altText: '7 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/7person_Dual.png`,
        altText: '7 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/7person_Dual_jamboard.png`,
        altText: '7 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/7person_Single.png`,
        altText: '7 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/7person_meetonjam.png`,
        altText: '7 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -700,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -200,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0,
          minRoomSize: {
            length: 4.95,
            width: 3.8,
          },
          includedModels: [
            'room7_AcousticPanel001',
            'room7_AcousticPanel002',
            'room7_AcousticPanel003',
            'Room7TablesAndChairs',
          ],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.45,
            width: 1.4,
          },
          occupancy: 7,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],
          logitech: 'Medium room kit',
          jamboard: false,
          acousticWallTreatment: 14.4,
        },
        withJam: {
          camPosition: {
            x: -900,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -150,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.6,
          minRoomSize: {
            length: 4.95,
            width: 4.3,
          },
          includedModels: ['Room7AddJam', 'Room7TablesAndChairs'],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.45,
            width: 1.4,
          },
          occupancy: 7,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],

          logitech: 'Medium room kit',
          jamboard: true,
          acousticWallTreatment: 15.6,
        },
      },
    },
    screens: {
      single: ['Single48', 'singleLiteSetupA'],
      dual: ['Dual48', 'singleLiteSetupA'],
    },
  },
  8: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/8person_Single_jamboard.png`,
        altText: '8 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/8person_Dual.png`,
        altText: '8 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/8person_Dual_jamboard.png`,
        altText: '8 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/8person_Single.png`,
        altText: '8 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/8person_meetonjam.png`,
        altText: '8 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -750,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -225,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.1,
          minRoomSize: {
            length: 5.3,
            width: 3.8,
          },
          includedModels: [
            'room8_AcousticPanel001',
            'room8_AcousticPanel002',
            'room8_AcousticPanel003',
            'Room8TablesAndChairs',
          ],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.8,
            width: 1.4,
          },
          occupancy: 8,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],

          logitech: 'Medium room kit',
          jamboard: false,
          acousticWallTreatment: 15.1,
        },
        withJam: {
          camPosition: {
            x: -950,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -175,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.6,
          minRoomSize: {
            length: 5.3,
            width: 4.3,
          },
          includedModels: ['Room8AddJam', 'Room8TablesAndChairs'],
          screenSize: '48"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 2.8,
            width: 1.4,
          },
          occupancy: 8,
          primaryHardware: [
            MeetHardware.logitechRallyBarMini,
            MeetHardware.asusSmall,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],
          logitech: 'Medium room kit',
          jamboard: true,
          acousticWallTreatment: 16.4,
        },
      },
    },
    screens: {
      single: ['Single48', 'singleLiteSetupA'],
      dual: ['Dual48', 'singleLiteSetupA'],
    },
  },
  9: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/9person_Single_jamboard.png`,
        altText: '9 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/9person_Dual.png`,
        altText: '9 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/9person_Dual_jamboard.png`,
        altText: '9 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/9person_Single.png`,
        altText: '9 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/9person_meetonjam.png`,
        altText: '9 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -800,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -250,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.1,
          minRoomSize: {
            length: 5.95,
            width: 3.8,
          },
          includedModels: [
            'room9_AcousticPanel001',
            'room9_AcousticPanel002',
            'room9_AcousticPanel003',
            'room9_AcousticPanel004',
            'Room9TablesAndChairs',
          ],
          screenSize: '55"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 3.15,
            width: 1.4,
          },
          occupancy: 9,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],

          logitech: 'Medium room kit',
          jamboard: false,
          acousticWallTreatment: 16.3,
        },
        withJam: {
          camPosition: {
            x: -1000,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -200,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.6,
          minRoomSize: {
            length: 5.95,
            width: 4.3,
          },
          includedModels: ['Room9AddJam', 'Room9TablesAndChairs'],
          screenSize: '55"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 3.15,
            width: 1.4,
          },
          occupancy: 9,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],

          logitech: 'Medium room kit',
          jamboard: true,
          acousticWallTreatment: 17.8,
        },
      },
    },
    screens: {
      single: ['Single55', 'singleLiteSetupB'],
      dual: ['Dual55', 'singleLiteSetupB'],
    },
  },
  10: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/10person_Single_jamboard.png`,
        altText: '10 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/10person_Dual.png`,
        altText: '10 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/10person_Dual_jamboard.png`,
        altText: '10 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/10person_Single.png`,
        altText: '10 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/10person_meetonjam.png`,
        altText: '10 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -850,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -275,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.1,
          minRoomSize: {
            length: 6.3,
            width: 3.8,
          },
          includedModels: [
            'room10_AcousticPanel001',
            'room10_AcousticPanel002',
            'room10_AcousticPanel003',
            'room10_AcousticPanel004',
            'Room10TablesAndChairs',
          ],
          screenSize: '55"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 3.5,
            width: 1.4,
          },
          occupancy: 10,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],

          logitech: 'Medium room kit',
          jamboard: false,
          acousticWallTreatment: 17.0,
        },
        withJam: {
          camPosition: {
            x: -1050,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -225,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.6,
          minRoomSize: {
            length: 6.3,
            width: 4.3,
          },
          includedModels: ['Room10AddJam', 'Room10TablesAndChairs'],
          screenSize: '55"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 3.5,
            width: 1.4,
          },
          occupancy: 10,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneMedium,
          ],

          logitech: 'Medium room kit',
          jamboard: true,
          acousticWallTreatment: 18.5,
        },
      },
    },
    screens: {
      single: ['Single55', 'singleLiteSetupB'],
      dual: ['Dual55', 'singleLiteSetupB'],
    },
  },
  11: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/11person_Single_jamboard.png`,
        altText: '11 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/11person_Dual.png`,
        altText: '11 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/11person_Dual_jamboard.png`,
        altText: '11 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/11person_Single.png`,
        altText: '11 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/11person_meetonjam.png`,
        altText: '11 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -900,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -325,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.1,
          minRoomSize: {
            length: 6.65,
            width: 3.8,
          },
          includedModels: [
            'room11_AcousticPanel001',
            'room11_AcousticPanel002',
            'room11_AcousticPanel003',
            'room11_AcousticPanel004',
            'Room11TablesAndChairs',
          ],
          screenSize: '55"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 3.85,
            width: 1.4,
          },
          occupancy: 11,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Medium room kit',
          jamboard: false,
          acousticWallTreatment: 17.6,
        },
        withJam: {
          camPosition: {
            x: -1100,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -250,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.6,
          minRoomSize: {
            length: 6.65,
            width: 4.3,
          },
          includedModels: ['Room11AddJam', 'Room11TablesAndChairs'],
          screenSize: '55"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 3.85,
            width: 1.4,
          },
          occupancy: 11,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechMedium,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Medium room kit',
          jamboard: true,
          acousticWallTreatment: 19.3,
        },
      },
    },
    screens: {
      single: ['Single55', 'singleXLSetupA'],
      dual: ['XLSetupDual55'],
    },
  },
  12: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/12person_Single_jamboard.png`,
        altText: '12 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/12person_Dual.png`,
        altText: '12 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/12person_Dual_jamboard.png`,
        altText: '12 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/12person_Single.png`,
        altText: '12 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/12person_meetonjam.png`,
        altText: '12 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -950,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -375,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.3,
          minRoomSize: {
            length: 7.2,
            width: 4.2,
          },
          includedModels: [
            'room12_AcousticPanel001',
            'room12_AcousticPanel002',
            'room12_AcousticPanel003',
            'room12_AcousticPanel004',
            'Room12ChairsAndTables',
          ],
          screenSize: '65"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 4.2,
            width: 1.6,
          },
          occupancy: 12,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: false,
          acousticWallTreatment: 20.1,
        },
        withJam: {
          camPosition: {
            x: -1150,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -275,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.7,
          minRoomSize: {
            length: 7.2,
            width: 4.6,
          },
          includedModels: ['Room12AddJam', 'Room12ChairsAndTables'],
          screenSize: '65"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 4.2,
            width: 1.6,
          },
          occupancy: 12,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: true,
          acousticWallTreatment: 21.6,
        },
      },
    },
    screens: {
      single: ['Single65', 'singleXLSetupA'],
      dual: ['Dual65', 'XLSetupB'],
    },
  },
  13: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/13person_Single_jamboard.png`,
        altText: '13 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/13person_Dual.png`,
        altText: '13 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/13person_Dual_jamboard.png`,
        altText: '13 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/13person_Single.png`,
        altText: '13 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/13person_meetonjam.png`,
        altText: '13 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -1000,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -400,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.3,
          minRoomSize: {
            length: 7.55,
            width: 4.2,
          },
          includedModels: [
            'room13_AcousticPanel001',
            'room13_AcousticPanel002',
            'room13_AcousticPanel003',
            'room13_AcousticPanel004',
            'Room13ChairsAndTables',
          ],
          screenSize: '65"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 4.55,
            width: 1.6,
          },
          occupancy: 13,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: false,
          acousticWallTreatment: 20.9,
        },
        withJam: {
          camPosition: {
            x: -1200,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -300,
            y: 70,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.7,
          minRoomSize: {
            length: 7.55,
            width: 4.6,
          },
          includedModels: ['Room13AddJam', 'Room13ChairsAndTables'],
          screenSize: '65"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 0,
          table: {
            length: 4.55,
            width: 1.6,
          },
          occupancy: 13,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: true,
          acousticWallTreatment: 22.4,
        },
      },
    },
    screens: {
      single: ['Single65', 'singleXLSetupA'],
      dual: ['Dual65', 'XLSetupB'],
    },
  },
  14: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/14person_Single_jamboard.png`,
        altText: '14 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/14person_Dual.png`,
        altText: '14 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/14person_Dual_jamboard.png`,
        altText: '14 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/14person_Single.png`,
        altText: '14 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/14person_meetonjam.png`,
        altText: '14 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -1050,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -425,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.3,
          minRoomSize: {
            length: 7.9,
            width: 4.2,
          },
          includedModels: [
            'room14_AcousticPanel001',
            'room14_AcousticPanel002',
            'room14_AcousticPanel003',
            'room14_AcousticPanel004',
            'room14_AcousticPanel005',
            'Room14TablesAndChairs',
          ],
          screenSize: '75"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 1,
          table: {
            length: 4.9,
            width: 1.6,
          },
          occupancy: 14,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: false,
          acousticWallTreatment: 21.6,
        },
        withJam: {
          camPosition: {
            x: -1250,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -325,
            y: 50,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.7,
          minRoomSize: {
            length: 7.9,
            width: 4.6,
          },
          includedModels: ['Room14AddJam', 'Room14TablesAndChairs'],
          screenSize: '75"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 1,
          table: {
            length: 4.9,
            width: 1.6,
          },
          occupancy: 14,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: true,
          acousticWallTreatment: 23.2,
        },
      },
    },
    screens: {
      single: ['Single75', 'singleXLSetupA'],
      dual: ['XLSetupDual75', 'XLSetupB'],
    },
  },
  16: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/16person_Single_jamboard.png`,
        altText: '16 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/16person_Dual.png`,
        altText: '16 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/16person_Dual_jamboard.png`,
        altText: '16 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/16person_Single.png`,
        altText: '16 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/16person_meetonjam.png`,
        altText: '16 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -1100,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -450,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.4,
          minRoomSize: {
            length: 8.25,
            width: 4.4,
          },
          includedModels: [
            'room16_AcousticPanel001',
            'room16_AcousticPanel002',
            'room16_AcousticPanel003',
            'room16_AcousticPanel004',
            'room16_AcousticPanel005',
            'Room16TablesAndChairs',
          ],
          screenSize: '75"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 1,
          table: {
            length: 5.25,
            width: 1.8,
          },
          occupancy: 16,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: false,
          acousticWallTreatment: 23.2,
        },
        withJam: {
          camPosition: {
            x: -1300,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -350,
            y: 30,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.8,
          minRoomSize: {
            length: 8.25,
            width: 4.8,
          },
          includedModels: ['Room16AddJam', 'Room16TablesAndChairs'],
          screenSize: '75"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 1,
          table: {
            length: 5.25,
            width: 1.8,
          },
          occupancy: 16,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: true,
          acousticWallTreatment: 24.8,
        },
      },
    },
    screens: {
      single: ['Single75', 'singleXLSetupA'],
      dual: ['XLSetupDual75', 'XLSetupB'],
    },
  },
  18: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/18person_Single_jamboard.png`,
        altText: '18 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/18person_Dual.png`,
        altText: '18 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/18person_Dual_jamboard.png`,
        altText: '18 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/18person_Single.png`,
        altText: '18 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/18person_meetonjam.png`,
        altText: '18 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -1150,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -525,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.7,
          minRoomSize: {
            length: 9.15,
            width: 5,
          },
          includedModels: [
            'room18_AcousticPanel001',
            'room18_AcousticPanel002',
            'room18_AcousticPanel003',
            'room18_AcousticPanel004',
            'room18_AcousticPanel005',
            'room18_AcousticPanel006',
            'Room18TablesAndChairs',
          ],
          screenSize: '85"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 1,
          table: {
            length: 5.95,
            width: 2,
          },
          occupancy: 18,
          primaryHardware: [
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: false,
          acousticWallTreatment: 27.9,
        },
        withJam: {
          camPosition: {
            x: -1350,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -375,
            y: 10,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.9,
          minRoomSize: {
            length: 9.15,
            width: 5.2,
          },
          includedModels: ['Room18AddJam', 'Room18TablesAndChairs'],
          screenSize: '85"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 1,
          table: {
            length: 5.95,
            width: 2,
          },
          occupancy: 18,
          primaryHardware: [
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: true,
          acousticWallTreatment: 28.8,
        },
      },
    },
    screens: {
      single: ['Single85', 'singleXLSetupA'],
      dual: ['XLSetupDual85', 'XLSetupB'],
    },
  },
  20: {
    primaryImage: {
      jamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/20person_Single_jamboard.png`,
        altText: '20 Person - Jamboard',
      },
      dualScreen: {
        src: `${roomPlannerAssetsPath}/primary-media/20person_Dual.png`,
        altText: '20 Person - Dual Screen',
      },
      dualScreenJamboard: {
        src: `${roomPlannerAssetsPath}/primary-media/20person_Dual_jamboard.png`,
        altText: '20 Person - Dual Screen + Jamboard',
      },
      default: {
        src: `${roomPlannerAssetsPath}/primary-media/20person_Single.png`,
        altText: '20 Person',
      },
      meetOnJam: {
        src: `${roomPlannerAssetsPath}/primary-media/20person_meetonjam.png`,
        altText: '20 Person - Meet on Jam',
      },
    },
    secondaryImage: secondaryImage,
    roomSetup: {
      conference: {
        withoutJam: {
          camPosition: {
            x: -1200,
            y: 400,
            z: 500,
          },
          camRotation: {
            x: -575,
            y: 100,
            z: 0,
          },
          xOffset: 0,
          zOffset: 0.7,
          minRoomSize: {
            length: 9.85,
            width: 5,
          },
          includedModels: [
            'room20_AcousticPanel001',
            'room20_AcousticPanel002',
            'room20_AcousticPanel003',
            'room20_AcousticPanel004',
            'room20_AcousticPanel005',
            'room20_AcousticPanel006',
            'Room20TablesAndChairs',
          ],
          screenSize: '85"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 2,
          table: {
            length: 6.65,
            width: 2,
          },
          occupancy: 20,
          primaryHardware: [
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],
          logitech: 'Large room kit',
          jamboard: false,
          acousticWallTreatment: 29.6,
        },
        withJam: {
          camPosition: {
            x: -1400,
            y: 400,
            z: 300,
          },
          camRotation: {
            x: -400,
            y: 0,
            z: -100,
          },
          xOffset: 0,
          zOffset: 0.9,
          minRoomSize: {
            length: 9.85,
            width: 5.2,
          },
          includedModels: ['Room20AddJam', 'Room20TablesAndChairs'],
          screenSize: '85"',
          roomDescription:
            'Typical meeting room setups using the Google Meet Hardware kits.',
          microphoneNumber: 2,
          table: {
            length: 6.65,
            width: 2,
          },
          occupancy: 20,
          primaryHardware: [
            MeetHardware.logitechRallyBar,
            MeetHardware.asusLarge,
            MeetHardware.logitechLarge,
            MeetHardware.seriesOneLarge,
          ],

          logitech: 'Large room kit',
          jamboard: true,
          acousticWallTreatment: 30.6,
        },
      },
    },
    screens: {
      single: ['Single85', 'singleXLSetupA'],
      dual: ['XLSetupDual85', 'XLSetupB'],
    },
  },
};

export const RoomConfigMap = {
  1: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/1person_jamsolo.png`,
        altText: '1 Person - Jamsolo',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/1person_phonebooth.png`,
        altText: '1 Person - Phonebooth',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 2.5,
          width: 3,
        },
        screenSize: 'Jamboard',
        microphoneNumber: null,
        table: null,
        occupancy: 1,
        hardware: 'Jamboard',
        logitech: null,
        jamboard: true,
        acousticWallTreatment: 8.5,
      },
      false: {
        minRoomSize: {
          length: 2.5,
          width: 1.7,
        },
        screenSize: 'Chromebase',
        microphoneNumber: null,
        table: {
          length: 0.8,
          width: 1.2,
        },
        occupancy: 1,
        hardware: 'Asus Chromebase',
        logitech: null,
        jamboard: false,
        acousticWallTreatment: 7.0,
      },
    },
  },
  2: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/2person_jamsolo.png`,
        altText: '2 Person - Jamsolo',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/2person_phonebooth.png`,
        altText: '2 Person - Phonebooth',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 3,
          width: 3,
        },
        screenSize: 'Jamboard',
        microphoneNumber: null,
        table: {
          length: 0.8,
          width: 0.8,
        },
        occupancy: 2,
        hardware: 'Jamboard',
        logitech: null,
        jamboard: true,
        acousticWallTreatment: 9.5,
      },
      false: {
        minRoomSize: {
          length: 2.3,
          width: 2.3,
        },
        screenSize: 'Chromebase',
        microphoneNumber: null,
        table: {
          length: 0.8,
          width: 1.7,
        },
        occupancy: 2,
        hardware: 'Asus Chromebase',
        logitech: null,
        jamboard: false,
        acousticWallTreatment: 7.6,
      },
    },
  },
  3: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/3person_jamboard.png`,
        altText: '3 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/3person.png`,
        altText: '3 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 3.55,
          width: 4.1,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 1.05,
          width: 1.2,
        },
        occupancy: 3,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: true,
        acousticWallTreatment: 12.3,
      },
      false: {
        minRoomSize: {
          length: 3.55,
          width: 3.6,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 1.05,
          width: 1.2,
        },
        occupancy: 3,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 11.4,
      },
    },
  },
  4: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/4person_jamboard.png`,
        altText: '4 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/4person.png`,
        altText: '4 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 3.9,
          width: 4.1,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 1.4,
          width: 1.2,
        },
        occupancy: 4,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: true,
        acousticWallTreatment: 13,
      },
      false: {
        minRoomSize: {
          length: 3.9,
          width: 3.6,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 1.4,
          width: 1.2,
        },
        occupancy: 4,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 12,
      },
    },
  },
  5: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/5person_jamboard.png`,
        altText: '5 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/5person.png`,
        altText: '5 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 4.25,
          width: 4.1,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 1.75,
          width: 1.2,
        },
        occupancy: 5,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: true,
        acousticWallTreatment: 13.7,
      },
      false: {
        minRoomSize: {
          length: 4.25,
          width: 3.6,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 1.75,
          width: 1.2,
        },
        occupancy: 5,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 12.7,
      },
    },
  },
  6: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/6person_jamboard.png`,
        altText: '6 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/6person.png`,
        altText: '6 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 4.6,
          width: 4.3,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 2.1,
          width: 1.4,
        },
        occupancy: 6,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: true,
        acousticWallTreatment: 14.9,
      },
      false: {
        minRoomSize: {
          length: 4.6,
          width: 3.8,
        },
        screenSize: '48"',
        microphoneNumber: 1,
        table: {
          length: 2.1,
          width: 1.4,
        },
        occupancy: 6,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Small room kit',
        jamboard: false,
        acousticWallTreatment: 13.7,
      },
    },
  },
  7: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/7person_jamboard.png`,
        altText: '7 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/7person.png`,
        altText: '7 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 4.95,
          width: 4.3,
        },
        screenSize: '48"',
        microphoneNumber: 2,
        table: {
          length: 2.45,
          width: 1.4,
        },
        occupancy: 7,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Medium room kit',
        jamboard: true,
        acousticWallTreatment: 15.6,
      },
      false: {
        minRoomSize: {
          length: 4.95,
          width: 3.8,
        },
        screenSize: '48"',
        microphoneNumber: 2,
        table: {
          length: 2.45,
          width: 1.4,
        },
        occupancy: 7,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Medium room kit',
        jamboard: false,
        acousticWallTreatment: 14.4,
      },
    },
  },
  8: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/8person_jamboard.png`,
        altText: '8 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/8person.png`,
        altText: '8 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 5.3,
          width: 4.3,
        },
        screenSize: '48"',
        microphoneNumber: 2,
        table: {
          length: 2.8,
          width: 1.4,
        },
        occupancy: 8,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Medium room kit',
        jamboard: true,
        acousticWallTreatment: 16.4,
      },
      false: {
        minRoomSize: {
          length: 5.3,
          width: 3.8,
        },
        screenSize: '48"',
        microphoneNumber: 2,
        table: {
          length: 2.8,
          width: 1.4,
        },
        occupancy: 8,
        hardware: 'Standard kit - (HuddlyGo camera)',
        logitech: 'Medium room kit',
        jamboard: false,
        acousticWallTreatment: 15.1,
      },
    },
    primaryHardware: [MeetHardware.seriesOneSmall],
  },
  9: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/9person_jamboard.png`,
        altText: '9 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/9person.png`,
        altText: '9 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 5.95,
          width: 4.3,
        },
        screenSize: '55"',
        microphoneNumber: 2,
        table: {
          length: 3.15,
          width: 1.4,
        },
        occupancy: 9,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Medium room kit',
        jamboard: true,
        acousticWallTreatment: 17.8,
      },
      false: {
        minRoomSize: {
          length: 5.95,
          width: 3.8,
        },
        screenSize: '55"',
        microphoneNumber: 2,
        table: {
          length: 3.15,
          width: 1.4,
        },
        occupancy: 9,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Medium room kit',
        jamboard: false,
        acousticWallTreatment: 16.3,
      },
    },
  },
  10: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/10person_jamboard.png`,
        altText: '10 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/10person.png`,
        altText: '10 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 6.3,
          width: 4.3,
        },
        screenSize: '55"',
        microphoneNumber: 2,
        table: {
          length: 3.5,
          width: 1.4,
        },
        occupancy: 10,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Medium room kit',
        jamboard: true,
        acousticWallTreatment: 18.5,
      },
      false: {
        minRoomSize: {
          length: 6.3,
          width: 3.8,
        },
        screenSize: '55"',
        microphoneNumber: 2,
        table: {
          length: 3.5,
          width: 1.4,
        },
        occupancy: 10,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Medium room kit',
        jamboard: false,
        acousticWallTreatment: 17.0,
      },
    },
  },
  11: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/11person_jamboard.png`,
        altText: '11 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/11person.png`,
        altText: '11 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 6.65,
          width: 4.3,
        },
        screenSize: '55"',
        microphoneNumber: 2,
        table: {
          length: 3.85,
          width: 1.4,
        },
        occupancy: 11,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Medium room kit',
        jamboard: true,
        acousticWallTreatment: 19.3,
      },
      false: {
        minRoomSize: {
          length: 6.65,
          width: 3.8,
        },
        screenSize: '55"',
        microphoneNumber: 2,
        table: {
          length: 3.85,
          width: 1.4,
        },
        occupancy: 11,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Medium room kit',
        jamboard: false,
        acousticWallTreatment: 17.6,
      },
    },
  },
  12: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/12person_jamboard.png`,
        altText: '12 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/12person.png`,
        altText: '12 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 7.2,
          width: 4.6,
        },
        screenSize: '65"',
        microphoneNumber: 3,
        table: {
          length: 4.2,
          width: 1.6,
        },
        occupancy: 12,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: true,
        acousticWallTreatment: 21.6,
      },
      false: {
        minRoomSize: {
          length: 7.2,
          width: 4.2,
        },
        screenSize: '65"',
        microphoneNumber: 3,
        table: {
          length: 4.2,
          width: 1.6,
        },
        occupancy: 12,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: false,
        acousticWallTreatment: 20.1,
      },
    },
  },
  13: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/13person_jamboard.png`,
        altText: '13 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/13person.png`,
        altText: '13 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 7.55,
          width: 4.6,
        },
        screenSize: '65"',
        microphoneNumber: 3,
        table: {
          length: 4.55,
          width: 1.6,
        },
        occupancy: 13,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: true,
        acousticWallTreatment: 22.4,
      },
      false: {
        minRoomSize: {
          length: 7.55,
          width: 4.2,
        },
        screenSize: '65"',
        microphoneNumber: 3,
        table: {
          length: 4.55,
          width: 1.6,
        },
        occupancy: 13,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: false,
        acousticWallTreatment: 20.9,
      },
    },
  },
  14: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/14person_jamboard.png`,
        altText: '14 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/14person.png`,
        altText: '14 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 7.9,
          width: 4.6,
        },
        screenSize: '75"',
        microphoneNumber: 3,
        table: {
          length: 4.9,
          width: 1.6,
        },
        occupancy: 14,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: true,
        acousticWallTreatment: 23.2,
      },
      false: {
        minRoomSize: {
          length: 7.9,
          width: 4.2,
        },
        screenSize: '75"',
        microphoneNumber: 3,
        table: {
          length: 4.9,
          width: 1.6,
        },
        occupancy: 14,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: false,
        acousticWallTreatment: 21.6,
      },
    },
  },
  16: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/16person_jamboard.png`,
        altText: '16 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/16person.png`,
        altText: '16 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 8.25,
          width: 4.8,
        },
        screenSize: '75"',
        microphoneNumber: 3,
        table: {
          length: 5.25,
          width: 1.8,
        },
        occupancy: 16,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: true,
        acousticWallTreatment: 24.8,
      },
      false: {
        minRoomSize: {
          length: 8.25,
          width: 4.4,
        },
        screenSize: '75"',
        microphoneNumber: 3,
        table: {
          length: 5.25,
          width: 1.8,
        },
        occupancy: 16,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: false,
        acousticWallTreatment: 23.2,
      },
    },
  },
  18: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/18person_jamboard.png`,
        altText: '18 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/18person.png`,
        altText: '18 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 9.15,
          width: 5.2,
        },
        screenSize: '85"',
        microphoneNumber: 4,
        table: {
          length: 5.95,
          width: 2,
        },
        occupancy: 18,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: true,
        acousticWallTreatment: 28.8,
      },
      false: {
        minRoomSize: {
          length: 9.15,
          width: 5,
        },
        screenSize: '85"',
        microphoneNumber: 4,
        table: {
          length: 5.95,
          width: 2,
        },
        occupancy: 18,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: false,
        acousticWallTreatment: 27.9,
      },
    },
  },
  20: {
    primaryImage: [
      {
        src: `${roomPlannerAssetsPath}/primary-media/20person_jamboard.png`,
        altText: '20 Person - Jamboard',
      },
      {
        src: `${roomPlannerAssetsPath}/primary-media/20person.png`,
        altText: '20 Person',
      },
    ],
    secondaryImage: secondaryImage,
    jamboard: {
      true: {
        minRoomSize: {
          length: 9.85,
          width: 5.2,
        },
        screenSize: '85"',
        microphoneNumber: 4,
        table: {
          length: 6.65,
          width: 2,
        },
        occupancy: 20,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: true,
        acousticWallTreatment: 30.6,
      },
      false: {
        minRoomSize: {
          length: 9.85,
          width: 5,
        },
        screenSize: '85"',
        microphoneNumber: 4,
        table: {
          length: 6.65,
          width: 2,
        },
        occupancy: 20,
        hardware: 'Large kit - (Logitech PTZ Pro2 camera)',
        logitech: 'Large room kit',
        jamboard: false,
        acousticWallTreatment: 29.6,
      },
    },
  },
};
