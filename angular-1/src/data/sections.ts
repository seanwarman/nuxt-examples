/* tslint:disable:no-var-keyword max-line-length prefer-const */
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import { Section, Subsection, Vector } from '../app/sections/section';
import { imagesPath, SectionImages } from '../assets/images';

interface SubsectionsMap {
  [sectionSlug: string]: Subsection[];
}

const placeHolder =
  'assets/images/room-layout/primary-media/roomlayout_test_primary.png';

const modelsPath = 'assets/3dModels';

const tweenCamera = (
  camera: TWEEN.PerspectiveCamera,
  position: Vector,
  rotation: Vector,
  fieldOfView: Number
) => {
  let tweenDuration = 2000;
  let tweenEasing = TWEEN.Easing.Quadratic.InOut;

  // camera position
  let newPosition = new THREE.Vector3(position.x, position.y, position.z);
  new TWEEN.Tween(camera.position)
    .to(newPosition, tweenDuration)
    .easing(tweenEasing)
    .onUpdate(() => {
      camera.updateProjectionMatrix();
    })
    .onComplete(function() {})
    .start();

  // camera rotation
  let newTarget = new THREE.Vector3(rotation.x, rotation.y, rotation.z);
  let cameraClone = new THREE.PerspectiveCamera();
  let qStart = new THREE.Quaternion();
  let qEnd = new THREE.Quaternion();
  let time = { t: 0 };
  new TWEEN.Tween(time)
    .to({ t: 1 }, tweenDuration)
    .easing(tweenEasing)
    .onStart(function() {
      cameraClone.position.copy(position);
      cameraClone.lookAt(newTarget);
      qStart.copy(camera.quaternion);
      qEnd.copy(cameraClone.quaternion);
    })
    .onUpdate(function() {
      THREE.Quaternion.slerp(qStart, qEnd, camera.quaternion, time.t);
    })
    .onComplete(function() {
      camera.quaternion.copy(qEnd);
    })
    .start();

  // camera fov
  let newFOV = { fov: fieldOfView };
  new TWEEN.Tween(camera)
    .to(newFOV, tweenDuration)
    .easing(tweenEasing)
    .onUpdate(function() {
      camera.updateProjectionMatrix();
    })
    .onComplete(function() {})
    .start();
};

// This function basically just calls tweenCamera but it lets you put it
// onto the window and play around with it in the console.
const tweenCameraPartial = currentCamera => (pos, rot, fov) =>
  tweenCamera(
    currentCamera,
    { x: pos[0], y: pos[1], z: pos[2] },
    { x: rot[0], y: rot[1], z: rot[2] },
    fov
  );

const traversePartial = (
  { excludedMeshes, excluded3DObjects, excludedGroups },
  typesToInclude = ['Mesh', 'Object3D']
) => object => {
  if (!typesToInclude.includes(object.type)) {
    return;
  }

  if (!!excludedMeshes && excludedMeshes.includes(object.name)) {
    object.visible = false;
    return;
  }
  if (!!excluded3DObjects && excluded3DObjects.includes(object.name)) {
    object.visible = false;
    return;
  }
  if (!!excludedGroups && excludedGroups.includes(object.parent.name)) {
    object.visible = false;
    return;
  }

  object.visible = true;
};

const updateModelPartial = (tweenerArgs, traverseObj) => (
  currentCamera,
  scene
) => {
  const tweener = tweenCameraPartial(currentCamera);
  tweener(tweenerArgs[0], tweenerArgs[1], tweenerArgs[2]);
  scene.traverse(traversePartial(traverseObj));
};

function contains(target, pattern) {
  var value = 0;
  pattern.forEach(function(word) {
    value = value + target.includes(word);
  });
  return value === 1;
}

export const Subsections: SubsectionsMap = {
  'camera-and-audio': [
    {
      title: 'Introduction',
      slug: 'introduction',
      icon: SectionImages.cameraAndAudio.icons.sectionIcon,
      cards: [
        {
          id: 'introduction',
          title: 'Introduction',
          heroImage: SectionImages.cameraAndAudio.contentPreviewHero,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `
            We've tuned and tweaked the hardware. Now, position
            it correctly to unlock the best performance.
          `,
        },
      ],
    },
    {
      title: 'Camera',
      slug: 'camera',
      icon: SectionImages.cameraAndAudio.camera.subNavIcon,
      '3dModel': `${modelsPath}/cameraAndAudio/HuddleRoomA_CameraAndAudio.gltf`,
      cards: [
        {
          id: 'mounting-height',
          title: 'Mounting height',
          heroImage: placeHolder,
          heroAltText: 'Mounting height',
          thumbnail:
            SectionImages.cameraAndAudio.camera.mountingHeight.thumbnail,
          body: `
            Mount the camera as close to seated eye level as possible. When placing
            the camera on top of the screen, the combination is usually optimal with
            the lens at ~1400mm (55") from the floor. This usually puts the bottom
            of the screen at around 800mm (30") from the floor.
          `,
          hint: `
            Cameras mounted at a high angle is a very common problem for conferencing. Remote participants can be made to feel detached from discussion. It’s better to have everyone looking straight into the camera.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -100,
              y: 200,
              z: 600,
            };
            const targetRotation = {
              x: 0,
              y: 120,
              z: 0,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'viking',
                'anno_equipment_camera_mountingHeight',
              ];
              let excludedMeshes = [
                'acousticPanel02',
                'acousticPanel00',
                '1mPlane003',
              ];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = ['dualScreenSetup', 'mountingPosition'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'mounting-position',
          title: 'Mounting position',
          heroImage: placeHolder,
          heroAltText: 'Mounting position',
          thumbnail:
            SectionImages.cameraAndAudio.camera.mountingPosition.thumbnail,
          body: `
            The mounting options allow the Google Meet cameras to be set up
            in a variety of ways to suit any conferencing setup or screen
            solution. The camera is best mounted central to the screen, so
            that the room occupants appear to be addressing the remote
            participants.
          `,
          hint: `
            As detailed in the 'field of view' section, it's important to consider the camera view to ensure all room occupants are in shot.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 174.1,
              y: 139.5,
              z: 141.7,
            };
            const targetRotation = {
              x: 0,
              y: 80,
              z: -60,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['viking'];
              let excludedMeshes = [
                'anno_equipment_camera_mountingHeight',
                '1mPlane003',
                'acousticPanel02',
                'acousticPanel00',
              ];
              let included3DObjects = ['mountingPosition'];
              let excluded3DObjects = ['dualScreenSetup', 'singleScreenSetup'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'on-top-of-screen',
          title: 'On top of screen',
          heroImage: placeHolder,
          heroAltText: 'On top of screen',
          thumbnail:
            SectionImages.cameraAndAudio.camera.onTopOfScreen.thumbnail,
          body: `
            In either dual- or single- screen setups, the camera can be mounted on top of the screen using the screen mount bracket.
          `,
          hint: `
            All-in-one products such as the Logitech Rally Bar can work well above or below the screens, but remember to consider the lens height in relation to a seated person's eye height.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 110,
              y: 140,
              z: 120,
            };
            const targetRotation = {
              x: 30,
              y: 110,
              z: -60,
            };
            const fieldOfView = 39.4;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['viking'];
              let excludedMeshes = [
                'anno_equipment_camera_mountingHeight',
                '1mPlane003',
                'acousticPanel02',
                'acousticPanel00',
              ];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = ['dualScreenSetup', 'mountingPosition'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'wall-mounting',
          title: 'Wall mounting',
          heroImage: placeHolder,
          heroAltText: 'Wall mounting',
          thumbnail: SectionImages.cameraAndAudio.camera.wallMounting.thumbnail,
          body: `
            The wall mount allows the camera to be positioned below or in between screens
            if dual screens are used.
          `,
          hint: `
           The Huddly Go or IQ cameras also work really well above the screen for the ASUS kit.
           The Logitech PTZ Pro 2 (ASUS large room kit) or Logitech Rally is usually used with larger screens,
           and tends to work better mounted underneath the screen using the mounting systems available.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 110,
              y: 140,
              z: 120,
            };
            const targetRotation = {
              x: 30,
              y: 110,
              z: -60,
            };
            const fieldOfView = 39.4;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [];
              let excludedMeshes = [
                'viking',
                'anno_equipment_camera_mountingHeight',
                '1mPlane003',
                'acousticPanel02',
                'acousticPanel00',
              ];
              let included3DObjects = ['dualScreenSetup'];
              let excluded3DObjects = ['singleScreenSetup', 'mountingPosition'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'digital-zoom',
          title: 'Zoom',
          heroImage: placeHolder,
          heroAltText: 'Digital Zoom',
          thumbnail: null,
          body: `
            The Series One Smart Camera XL features a 20 megapixel resolution which can achieve a 4.3x lossless digital zoom at 720p output resolution, which allows participants to fill the shot even when 5m away from the camera.
            <br><br>
            Digital zoom is also available in the ASUS and Logitech Rally product lines.
           `,
          hint: `
            Designed with Google AI built in, the Google Meet Series One Room Kit cameras can automatically detect meeting participants and focus in on them, making conversations more natural.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 57,
              y: 184,
              z: -231,
            };
            const targetRotation = {
              x: -154,
              y: 15,
              z: 234,
            };
            const fieldOfView = 60;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'viking',
                '1mPlane003',
                'acousticPanel02',
                'acousticPanel00',
              ];
              let excludedMeshes = ['anno_equipment_camera_mountingHeight'];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = ['dualScreenSetup', 'mountingPosition'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Field of view',
      slug: 'field-of-view',
      icon: SectionImages.cameraAndAudio.fieldOfView.subNavIcon,
      '3dModel': `${modelsPath}/cameraAndAudio/StandardRoomA_CameraAndAudio.gltf`,
      cards: [
        {
          id: 'which-camera',
          title: 'Which camera?',
          heroImage: placeHolder,
          heroAltText: 'Which camera?',
          thumbnail: null,
          body: `
            The wide field of view of the Series One Smart Camera, HuddlyIQ, Logitech Rally Bar Mini or MeetUp camera works best in smaller rooms of up to 6 people. Larger rooms are better served with the optical zoom of the Series One Smart Camera XL, Logitech Rally Bar or Logitech Rally camera.
          `,
          hint: `
            Continue below for more information on each of the Google Meet cameras, or head to the
            Room Designer section for more guidance on selecting the right hardware kit for your room size.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-100, 1500, -200], [150, -500, -200], 30],
            {
              excluded3DObjects: [
                //   'card_WhichCamera',
                'card_SeriesOneSmartCamera',
                'card_SeriesOneSmartCameraXL',
                'card_Logitechmeetup',
                'card_LogitechRally',
                'card_LogitechRallybarMini',
                'card_LogitechPTZPro2',
                'card_LogitechRallyBar',
                'card_HuddlyGo',
              ],
            }
          ),
        },
        {
          id: 'series-one-small-medium',
          title: 'Series One Smart Camera',
          heroImage: placeHolder,
          heroAltText: 'Series One Smart Camera',
          thumbnail: null,
          body: `
            Developed in partnership with Lenovo, the Series One Google Meet hardware kits, for small and medium rooms, feature the Series One Smart Camera. Place participants within the 120 degree horizontal field of view.
          `,
          hint: `
            This camera has a great wide angle, but sitting at least ~1m (40") from the camera is recommended.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial([[0, 400, -900], [0, -200, 0], 40], {
            excluded3DObjects: [
              // 'card_SeriesOneSmartCamera',
              'card_WhichCamera',
              'card_SeriesOneSmartCameraXL',
              'card_Logitechmeetup',
              'card_LogitechRally',
              'card_LogitechRallybarMini',
              'card_LogitechPTZPro2',
              'card_LogitechRallyBar',
              'card_HuddlyGo',
            ],
            excludedMeshes: [
              '1mPlane004_(1)',
              'acousticPanel00',
              'acousticPanel04',
            ],
          }),
        },
        {
          id: 'asus-starter',
          title: 'Huddly Camera',
          heroImage: placeHolder,
          heroAltText: 'Huddly Camera',
          thumbnail: null,
          body: `
            The ASUS small and medium room kits feature the HuddlyIQ camera. Place participants within the 120 degree horizontal field of view.
          `,
          hint: `
            The Huddly IQ camera has a great wide angle, but it's best to have seated occupants atleast -1m (40") from the camera for best coverage.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial([[0, 400, -900], [0, -200, 0], 38], {
            excluded3DObjects: [
              // 'card_HuddlyGo',
              'card_SeriesOneSmartCamera',
              'card_SeriesOneSmartCameraXL',
              'card_Logitechmeetup',
              'card_LogitechRally',
              'card_LogitechRallybarMini',
              'card_LogitechPTZPro2',
              'card_LogitechRallyBar',
              'card_WhichCamera',
            ],
            excludedMeshes: [
              '1mPlane004_(1)',
              'acousticPanel00',
              'acousticPanel04',
            ],
          }),
        },
        {
          id: 'logitech-small-room',
          title: 'Logitech MeetUp',
          heroImage: placeHolder,
          heroAltText: 'Logitech MeetUp',
          thumbnail: null,
          body: `
            The Logitech small room bundle for Google Meet features the Logitech MeetUp. Place participants within the 113 degree horizontal field of view of the Logitech MeetUp camera.
          `,
          link: {
            label: 'Take a look at the Logitech site for more information',
            url: 'https://www.logitech.com/product/google-rooms',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial([[0, 400, -900], [0, -200, 0], 38], {
            excluded3DObjects: [
              //   'card_Logitechmeetup',
              'card_SeriesOneSmartCamera',
              'card_SeriesOneSmartCameraXL',
              'card_WhichCamera',
              'card_LogitechRally',
              'card_LogitechRallybarMini',
              'card_LogitechPTZPro2',
              'card_LogitechRallyBar',
              'card_HuddlyGo',
            ],
            excludedMeshes: [
              '1mPlane004_(1)',
              'acousticPanel00',
              'acousticPanel04',
            ],
          }),
        },
        {
          id: 'series-one-large-room',
          title: 'Logitech Rally Bar Mini',
          heroImage: placeHolder,
          heroAltText: 'Logitech Rally Bar Mini',
          thumbnail: null,
          body: `
            Place participants within the 113 degree horizontal field of view of the Logitech Rally Bar Mini. The motorised pan and tilt feature of the built-in camera also widens the total horizontal room coverage to around 163 degrees.
          `,
          link: {
            label: `
              Take a look at the Logitech site for more information
            `,
            url:
              'https://www.logitech.com/products/video-conferencing/room-solutions/rallybarmini.960-001340.html',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial([[0, 400, -900], [0, -200, 0], 38], {
            excluded3DObjects: [
              //   'card_LogitechRallybarMini',
              'card_SeriesOneSmartCamera',
              'card_SeriesOneSmartCameraXL',
              'card_Logitechmeetup',
              'card_LogitechRally',
              'card_WhichCamera',
              'card_LogitechPTZPro2',
              'card_LogitechRallyBar',
              'card_HuddlyGo',
            ],
            excludedMeshes: [
              '1mPlane004_(1)',
              'acousticPanel00',
              'acousticPanel04',
            ],
          }),
        },
        {
          id: 'asus-large-room',
          title: 'Series One Smart Camera XL',
          heroImage: placeHolder,
          heroAltText: 'Series One Smart Camera XL',
          thumbnail: null,
          body: `
            Developed in partnership with Lenovo, the Google Meet Series One Room Kits for large rooms features the Series One Smart Camera XL. Place participants within the 95 degree horizontal field of view.
          `,
          hint: `
            The controls built into Google Meet allow you to automatically adjust the video image to frame the occupants in the room.The 4.3x lossless digital zoom on the Series One Smart Camera XL enables this in larger rooms where the occupants might be further away.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-1.475, 405.392, 414.657], [-5, 120, 0], 38],
            {
              excluded3DObjects: [
                //   'card_SeriesOneSmartCameraXL',
                'card_SeriesOneSmartCamera',
                'card_WhichCamera',
                'card_Logitechmeetup',
                'card_LogitechRally',
                'card_LogitechRallybarMini',
                'card_LogitechPTZPro2',
                'card_LogitechRallyBar',
                'card_HuddlyGo',
              ],
            }
          ),
        },
        {
          id: 'logitech-rally-bar',
          title: 'Logitech Rally Bar',
          heroImage: placeHolder,
          heroAltText: 'Logitech Rally Bar',
          thumbnail: null,
          body: `
            Place participants within the 82 degree horizontal field of view of the Logitech Rally Bar. The motorised pan and tilt of the built-in camera also widens the total horizontal room coverage to around 132 degrees.
          `,
          link: {
            label: 'Take a look at the Logitech site for more information',
            url:
              'https://www.logitech.com/products/video-conferencing/room-solutions/rallybar.960-001312.html',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-1.475, 405.392, 414.657], [-5, 120, 0], 38],
            {
              excluded3DObjects: [
                //   'card_LogitechRallyBar',
                'card_SeriesOneSmartCamera',
                'card_SeriesOneSmartCameraXL',
                'card_Logitechmeetup',
                'card_LogitechRally',
                'card_LogitechRallybarMini',
                'card_LogitechPTZPro2',
                'card_WhichCamera',
                'card_HuddlyGo',
              ],
            }
          ),
        },
        {
          id: 'logitech-ptz-pro',
          title: 'Logitech PTZ Pro2',
          heroImage: placeHolder,
          heroAltText: 'Logitech PTZ Pro2',
          thumbnail: null,
          body: `
            The ASUS large kit features the Logitech PTZ Pro2 camera. Place participants within the 82 degree horizontal field of view.
          `,
          hint: `
            Allowing ~1.3m (50") from the camera to the first participants is a good starting point for this field of view.
          `,
          link: {
            label:
              'Take a look at the Logitech site for more information on the Pro2 camera',
            url: 'https://www.logitech.com/product/conferencecam-ptz-pro2 ',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-1.475, 405.392, 414.657], [-5, 120, 0], 38],
            {
              excluded3DObjects: [
                //   'card_LogitechPTZPro2',
                'card_SeriesOneSmartCamera',
                'card_SeriesOneSmartCameraXL',
                'card_Logitechmeetup',
                'card_LogitechRally',
                'card_LogitechRallybarMini',
                'card_WhichCamera',
                'card_LogitechRallyBar',
                'card_HuddlyGo',
              ],
            }
          ),
        },
        {
          id: 'logitech-rally',
          title: 'Logitech Rally',
          heroImage: placeHolder,
          heroAltText: 'Logitech Rally',
          thumbnail: null,
          body: `
            The Logitech medium and large room bundles for Google Meet feature the Logitech Rally PTZ camera. Place participants within the 82 degree horizontal field of view . The large range of motorised pan-tilt-zoom feature also significantly widens the range of coverage in the room.
          `,
          link: {
            label: 'Take a look at the Logitech site for more information',
            url: 'https://www.logitech.com/product/google-rooms',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-1.475, 405.392, 414.657], [-5, 120, 0], 38],
            {
              excluded3DObjects: [
                'card_LogitechRallyBar',
                'card_SeriesOneSmartCamera',
                'card_SeriesOneSmartCameraXL',
                'card_Logitechmeetup',
                // 'card_LogitechRally',
                'card_LogitechRallybarMini',
                'card_LogitechPTZPro2',
                'card_WhichCamera',
                'card_HuddlyGo',
              ],
            }
          ),
        },
      ],
    },
    {
      title: 'Audio bars',
      slug: 'audio-bars',
      icon: SectionImages.cameraAndAudio.smartAudioBar.subNavIcon,
      '3dModel': `${modelsPath}/cameraAndAudio/StandardRoomB_CameraAndAudio.gltf`,
      cards: [
        {
          id: 'series-one-smart-audio-bar',
          title: 'Series One Smart Audio Bar',
          heroImage: placeHolder,
          heroAltText: 'Series One Smart Audio Bar',
          thumbnail:
            SectionImages.cameraAndAudio.smartAudioBar.smartAudioBar.thumbnail,
          body: `
            The Smart Audio Bar from the  Series One Room Kit by Lenovo can provide clear microphone coverage for users up to 4m (13') away. To ensure the loudspeaker output is clear, a user should ideally not be more than 6m away from a single audiobar. In good acoustic conference room conditions, the Smart Audio Bar output can achieve 65 dBA SPL at 10m (33').
          `,
          hint: `
            The Smart Audio Bar provides an all-in-one microphone and loudspeaker setup. With Google AI built in and an onboard tensor processing unit (TPU), TrueVoice processing works to eliminate distracting noises from anywhere in the room, even from multiple sources.
           `,
          link: {
            label: 'Take a look at TrueVoice noise cancellation in action here',
            url: 'https://www.youtube.com/watch?v=zDU7r9NsD4o)',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -500,
              y: 600,
              z: 200,
            };
            const targetRotation = {
              x: 150,
              y: 0,
              z: -100,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'anno_camera&audio_AudiobarCoverage',
                'singleVikingHighlighted',
              ];
              let excludedMeshes = [
                'anno_camera&audio_AudiobarCoverage001',
                'anno_camera&audio_AudiobarCoverage002',
                'anno_equipment_speakerMics_spacing',
                'anno_equipment_speakerMics_coverage',
                'stripLight',
                'wall_default00',
                'acousticPanel_default00',
                'acousticPanel_default01',
                'acousticPanel_default02',
                'dualVikingHighlighted',
                'singleVikingDefault',
              ];
              let included3DObjects = [
                'SingleScreenSetup',
                'SingleCoverage',
                'VoyagerDefault',
              ];
              let excluded3DObjects = [
                'DualScreenSetup',
                'DualCoverage',
                'VoyagerHighlighted',
                'voyagerMicPodsHighlighted',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'add-on-audio-bar',
          title: 'Series One Add-on Audio Bar',
          heroImage: placeHolder,
          heroAltText: 'Series One Add-on Audio Bar',
          thumbnail: null,
          body: `
            For larger or wider rooms, the Series One large kit includes a secondary Smart Audio Bar to increase the loudspeaker coverage. To ensure the loudspeaker output is clear, a user should ideally not be more than 10m away from the dual Smart Audio Bar setup.
          `,
          hint: `
            The expansion micpods used in the Series One medium and large kits provide increased microphone coverage for larger rooms.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -500,
              y: 600,
              z: 200,
            };
            const targetRotation = {
              x: 150,
              y: 0,
              z: -100,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'anno_camera&audio_AudiobarCoverage001',
                'anno_camera&audio_AudiobarCoverage002',
                'dualVikingHighlighted',
              ];
              let excludedMeshes = [
                'anno_camera&audio_AudiobarCoverage',
                'anno_equipment_speakerMics_spacing',
                'anno_equipment_speakerMics_coverage',
                'singleVikingHighlighted',
                'dualVikingDefault',
              ];
              let included3DObjects = [
                'DualScreenSetup',
                'DualCoverage',
                'VoyagerDefault',
              ];
              let excluded3DObjects = [
                'SingleScreenSetup',
                'SingleCoverage',
                'VoyagerHighlighted',
                'voyagerMicPodsHighlighted',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        // {
        //   id: 'series-one-truevoice',
        //   title: 'Series One TrueVoice™',
        //   heroImage:
        //     SectionImages.cameraAndAudio.smartAudioBar.trueVoice.defaultHero,
        //   heroAltText: 'Series One TrueVoice™',
        //   thumbnail: null,
        //   body: `
        //     The Smart Audio bar provides an all in one microphone and loudspeaker setup.
        //     With Google AI built in and an onboard tensor processing unit (TPU), TrueVoice
        //     processing works to elimate distracting noises from anywhere in the room,
        //     even from multiple sources.
        //   `,
        //   hint: '',
        //   link: {
        //     label: `Take a look at TrueVoice noise cancellation in action here`,
        //     url: 'https://www.youtube.com/watch?v=zDU7r9NsD4o',
        //   },
        //   hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
        //   updateModel: null,
        // },
        {
          id: 'mounting-position',
          title: 'Mounting position',
          heroImage: placeHolder,
          heroAltText: 'Mounting position',
          thumbnail: null,
          body: `
            In typical configurations using the Smart Audio Bar, it is best placed below the screens using wall mounting brackets.`,
          hint: `
            In setups with dual screens, an additional Audio Bar usually provides the best match for the setup and symmetry in the room.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 150,
              z: 250,
            };
            const targetRotation = {
              x: 200,
              y: 100,
              z: 0,
            };
            const fieldOfView = 45;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['singleVikingHighlighted'];
              let excludedMeshes = [
                'anno_camera&audio_AudiobarCoverage',
                'anno_equipment_speakerMics_spacing',
                'anno_equipment_speakerMics_coverage',
                'dualVikingHighlighted',
                'singleVikingDefault',
              ];
              let included3DObjects = ['SingleScreenSetup', 'VoyagerDefault'];
              let excluded3DObjects = [
                'DualScreenSetup',
                'SingleCoverage',
                'DualCoverage',
                'VoyagerHighlighted',
                'voyagerMicPodsHighlighted',
              ];
              let includedGroups = ['voyagerMicPodsHighlighted'];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'logitech-rally-bar-mini',
          title: 'Logitech Rally Bar mini',
          heroImage:
            SectionImages.cameraAndAudio.smartAudioBar.rallyBarMini.defaultHero,
          heroAltText: 'Logitech Rally Bar mini',
          thumbnail: null,
          body: `
            With a built-in camera, the Logitech Rally Bar Mini provides an all-in-one solution to cover smaller rooms with clear microphone coverage for users up to 4.5m (15')  away.
          `,
          hint: '',
          link: {
            label:
              'Take a look at the Logitech site for more information about the Rally Bar',
            url:
              'https://www.logitech.com/products/video-conferencing/room-solutions/rallybarmini.960-001340.html',
          },
          updateModel: null,
        },
        {
          id: 'logitech-rally-bar',
          title: 'Logitech Rally Bar',
          heroImage:
            SectionImages.cameraAndAudio.smartAudioBar.rallyBar.defaultHero,
          heroAltText: 'Logitech Rally Speakers',
          thumbnail: null,
          body: `
            With a larger built-in camera providing an 5 x optical and 3 x digital zoom, the Logitech Rally Bar provides an all-in-one solution to cover larger rooms. The Rally Bar provides clear microphone coverage for users up to 4.5m (15') away, Rally Bar mic pods can expand coverage for larger groups.
          `,
          hint: '',
          link: {
            label:
              'Take a look at the Logitech site for more information about the Rally Bar',
            url:
              'https://www.logitech.com/products/video-conferencing/room-solutions/rallybar.960-001312.html ',
          },
          updateModel: null,
        },
        {
          id: 'logitech-rally',
          title: 'Logitech Rally Speakers',
          heroImage:
            SectionImages.cameraAndAudio.smartAudioBar.specialFeatures
              .defaultHero,
          heroAltText: 'Logitech Rally Speakers',
          thumbnail: null,
          body: `
            When using the Logitech Rally Camera as part of the medium and large room kits, the Rally speakers provide audio output for the room, typically mounted below the screen. The medium kit features a single Rally speaker. The large room kit comes with an additional Rally speaker to help fill larger rooms with clear, crisp audio.
          `,
          hint: '',
          updateModel: null,
        },
      ],
    },
    {
      title: 'Micpods',
      slug: 'micpods',
      icon: SectionImages.cameraAndAudio.micpod.subNavIcon,
      '3dModel': `${modelsPath}/cameraAndAudio/StandardRoomB_CameraAndAudio.gltf`,
      cards: [
        {
          id: 'coverage',
          title: 'Coverage',
          heroImage: placeHolder,
          heroAltText: 'Coverage',
          thumbnail: SectionImages.cameraAndAudio.micpod.coverage.thumbnail,
          body: `
            Micpods are featured in the Series One and Logitech medium and large kits. For best audio quality when using the micpods, ensure users are no further than 1500mm (60") away from a unit.
          `,
          hint: `
            Note when using the ASUS speakermic or Logitech Rally micpods, refer to the room planner for more information on recommended quantity.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 400,
              z: 300,
            };
            const targetRotation = {
              x: 0,
              y: 50,
              z: 0,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_equipment_speakerMics_coverage'];
              let excludedMeshes = [
                'anno_equipment_speakerMics_spacing',
                'anno_camera&audio_AudiobarCoverage',
                'stripLight',
                'curtainRail',
                'glazing',
                'singleVikingHighlighted',
                'dualVikingHighlighted',
              ];
              let included3DObjects = [
                'voyagerMicPodsHighlighted',
                'DualScreenSetup',
              ];
              let excluded3DObjects = [
                'SingleScreenSetup',
                'SingleCoverage',
                'DualCoverage',
                'voyagerMicPods',
              ];
              let includedGroups = [];
              let excludedGroups = [, 'voyagerMicPods'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
            });
          },
        },
        {
          id: 'spacing',
          title: 'Spacing',
          heroImage: placeHolder,
          heroAltText: 'Spacing',
          thumbnail: SectionImages.cameraAndAudio.micpod.spacing.thumbnail,
          body: `
            When using more than one expansion micpod, it's best to space them evenly between all participants. A good general rule is to ensure each micpod is no more than 2000mm (80") apart.
          `,
          hint: `
            Each room is different. The key is even coverage for all participants, Try different positions to get the setup that works best for the room.
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -200,
              y: 300,
              z: 300,
            };
            const targetRotation = {
              x: 30,
              y: 20,
              z: -50,
            };
            const fieldOfView = 50;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_equipment_speakerMics_spacing'];
              let excludedMeshes = [
                'anno_equipment_speakerMics_coverage',
                'anno_camera&audio_AudiobarCoverage',
                'stripLight',
                'curtainRail',
                'glazing',
                'singleVikingHighlighted',
                'dualVikingHighlighted',
              ];
              let included3DObjects = [
                'DualScreenSetup',
                'voyagerMicPodsHighlighted',
              ];
              let excluded3DObjects = [
                'SingleScreenSetup',
                'SingleCoverage',
                'DualCoverage',
                'voyagerMicPods',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'series-one-micpod',
          title: 'Series One Micpod',
          heroImage:
            SectionImages.cameraAndAudio.micpod.specialFeatures.defaultHero,
          heroAltText: 'Series One Micpod',
          thumbnail: null,
          body: `
            The Series One Smart Audio Bar by Lenovo works well on its own for typical rooms of up to 6 people. The micpods included with the Series One medium and large kits reinforce the microphone coverage for larger setups.
          `,
          hint: `
            The recommended quantity of Series One micpods is based on the following guidelines:- <br>
            Up to 10 people: +1 micpod (medium kit)<br>
            Up to 16 people: +2 micpods (large kit)<br>
            Up to 20 people: +3 micpods (large kit +1)<br>
            Up to 24 people: +4 micpods (large kit +2)<br>
          `,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'asus-speakermic',
          title: 'ASUS Speakermic',
          heroImage:
            SectionImages.cameraAndAudio.micpod.asusSpeakerMic.defaultHero,
          heroAltText: 'ASUS Speakermic',
          thumbnail: null,
          body: `
            The ASUS kits for Google Meet include the speakmic, providing 360
            degree microphone and sound output coverage. The mic coverage
            extends to up to 6m (20’) away. The speakermic connects via USB C
            and comes with a magnetic table mount for secure placement on tables.
          `,
          link: {
            label: `Take a look at the ASUS site for more information`,
            url:
              'https://www.asus.com/Commercial-Mini-PCs/ASUS-Google-Meet-hardware-kit',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'logitech-kits',
          title: 'Logitech Micpod',
          heroImage:
            SectionImages.cameraAndAudio.micpod.logitechKits.defaultHero,
          heroAltText: 'Logitech Micpod',
          thumbnail: null,
          body: `
            Logitech provides packaged solutions specifically for Google Meet. These are available in small, medium, and large configurations. The medium and large kits feature the Logitech micpods, Microphones are located in the MeetUp camera bar in the small kit. Micpods can also be added to the Logitech Rally Bar and Rally Bar Mini to expand coverage.
          `,
          link: {
            label: `Take a look at the Logitech site for more information`,
            url: 'https://www.logitech.com/product/google-rooms',
          },
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: null,
        },
      ],
    },
    {
      title: 'Accessories',
      slug: 'accessories',
      icon: SectionImages.cameraAndAudio.accessories.subNavIcon,
      cards: [
        {
          id: 'camera-mounting',
          title: 'Series One Room Kit mounting',
          heroImage:
            SectionImages.cameraAndAudio.accessories.cameraMounting.defaultHero,
          heroAltText: 'Series One Room Kit mounting',
          thumbnail: null,
          body: `
            The Series One Room Kits are designed with complete ease of installation in mind. All kits come with an array of mounting accessories, such as wall and screen mounts for the Series One Smart Cameras, and inbuilt magnetic mounting as part of the Smart Audio Bar and Meet Compute system mounts.
          `,
          link: {
            label: `Take a look at the Series One product pages for more information on mounting options.`,
            url: 'https://meetingdevices.withgoogle.com/seriesone',
          },
          hint: null,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'stands',
          title: 'Series One stands',
          heroImage:
            SectionImages.cameraAndAudio.accessories.hecklerStands.defaultHero,
          heroAltText: 'Series One stands',
          thumbnail: null,
          body: `
            Google has partnered with selected manufacturers to provide mobile stands and bespoke mounting solutions for the Google Meet hardware. Take a look at the following product pages for more information.
            <br><br>
            <a target="_blank" href="https://www.ashtonbentley.com/vc-platforms/google-cloud-partner">Ashton Bentley</a>
            <br>
            <a target="_blank" href="https://hecklerdesign.com/products/heckler-av-cart-for-google-meet ">Hecklerdesign</a>
            <br>
            <a target="_blank" href="https://www.legrandav.com/resources/industry-collaborations/google_workspace">Legrand AV</a>
            <br>
            <a target="_blank" href="https://www.salamandercommercial.com/google-meet/">Salamander</a>
            <br>
            <a target="_blank" href="https://urben.webflow.io/partners/google">Urben</a>
          `,
          hint: null,
          hintIcon: SectionImages.cameraAndAudio.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'logitech-kits',
          title: 'Logitech kit mounting',
          heroImage:
            SectionImages.cameraAndAudio.accessories.logitechKits.defaultHero,
          heroAltText: 'Logitech kit mounting',
          thumbnail: null,
          body: `
            Multiple mounting solutions for Google Meet hardware kits from Logitech are available and can be used for the camera, touch controller, compute system, micpods, cameras, Rally Bar and Rally speaker mounting.
          `,
          link: {
            label: 'Take a look at our store for more information',
            url: 'https://meetingdevices.withgoogle.com/#products',
          },
          updateModel: null,
        },
        {
          id: 'asus-kit-mounting',
          title: 'ASUS kit mounting',
          heroImage:
            SectionImages.cameraAndAudio.accessories.asusKits.defaultHero,
          heroAltText: 'ASUS kit mounting',
          thumbnail: null,
          body: `Multiple mounting solutions for Google Meet hardware kits from ASUS are
            available and can be used for compute system and speakermic mounting.
           `,
          link: {
            label: 'Take a look at our store for more information',
            url: 'https://meetingdevices.withgoogle.com/#products',
          },
          updateModel: null,
        },
      ],
    },
  ],
  'displays-and-extras': [
    {
      title: 'Introduction',
      slug: 'introduction',
      icon: SectionImages.displaysAndExtras.icons.sectionIcon,
      cards: [
        {
          id: 'introduction',
          title: 'Introduction',
          heroImage: SectionImages.displaysAndExtras.contentPreviewHero,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `
            Correctly sizing displays is a key part of the conference experience. Plus, get some hints and tips on using the Series One Board 65 and Desk 27, developed in collaboration with Avocor, in your space.
          `,
        },
      ],
    },
    {
      title: 'Screen',
      slug: 'screen',
      icon: SectionImages.displaysAndExtras.screen.subNavIcon,
      '3dModel': `${modelsPath}/displaysAndExtras/HuddleRoomA_DisplaysAndExtras.gltf`,
      cards: [
        {
          id: 'screen-size',
          title: 'Screen size',
          heroImage: placeHolder,
          heroAltText: 'Screen size',
          thumbnail:
            SectionImages.displaysAndExtras.screen.screenSize.thumbnail,
          body: `
            As described in the room layout section, the room size and viewing distances
            are key to selecting the best screen size. The screen height should be at
            least an 8th of the distance from the screen to the farthest viewer, with the
            closest viewer no closer than 1.5x the screen height from the screen.
          `,
          hint: `
            Head to the Room Designer section for a full breakdown of recommended screen size vs occupancy.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -50,
              y: 150,
              z: 400,
            };
            const targetRotation = {
              x: 0,
              y: 60,
              z: 0,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['48InchScreen_highlighted'];
              let excludedMeshes = [
                'anno_displaysAndExtras_screens_viewerDistances',
                'acousticPanel00',
                'acousticPanel02',
              ];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = ['dualScreenSetup'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'viewer-distance',
          title: 'Viewer distance',
          heroImage: placeHolder,
          heroAltText: 'Viewer distance',
          thumbnail: null,
          body: `
            As a starting point, here are some typical screen sizes and corresponding closest and furthest viewer distances:
            <br><br>48" Screen: 0.9 - 4.8m (3.0' - 15.7')
            <br>55" Screen: 1.0 - 5.5m (3.3' - 18.0')
            <br>65" Screen: 1.2 - 6.5m (3.9' - 21.3')
            <br>75" Screen: 1.4 - 7.5m (4.6' - 24.6')
            <br>85" Screen: 1.6 - 8.5m (5.2' - 27.9')
          `,
          hint: `
            Note - the screen size is measured diagonally. Dimensions are assumed from
            the display screen surface. Head to the Viewing Area section for more information.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 400,
              y: 150,
              z: 100,
            };
            const targetRotation = {
              x: 0,
              y: 70,
              z: -50,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'acousticPanel01',
                'acousticPanel03',
                '48InchScreen_highlighted',
                'anno_displaysAndExtras_screens_viewerDistances',
              ];
              let excludedMeshes = ['glazing', 'lowpolyPeopleCasualWoman1'];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = [
                'dualScreenSetup',
                '48InchScreen_dual_highlighted',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'screen-location',
          title: 'Screen location',
          heroImage: placeHolder,
          heroAltText: 'Screen location',
          thumbnail:
            SectionImages.displaysAndExtras.screen.screenLocation.thumbnail,
          body: `
            Screens should be mounted centrally to the table. The screen height should allow for comfortable viewing. As a guide. keep the bottom of the screen less than 1100mm (44") from the floor.
          `,
          hint: `
            Take a look at the camera section for guidance on camera height. When mounting the camera on or below the screen,  you may need  to find a compromise between screen height and camera height.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 600,
              y: 150,
              z: 300,
            };
            const targetRotation = {
              x: 0,
              y: 60,
              z: -50,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [];
              let excludedMeshes = [
                'anno_displaysAndExtras_screens_viewerDistances',
              ];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = [
                'dualScreenSetup',
                'dualScreenHighlighted',
              ];
              let includedGroups = [];
              let excludedGroups = ['48InchScreen_dual_highlighted'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'dual-vs-single-screens',
          title: 'Dual vs Single screens',
          heroImage: placeHolder,
          heroAltText: 'Dual vs Single screens',
          thumbnail:
            SectionImages.displaysAndExtras.screen.dualVsSingleScreens
              .thumbnail,
          body: `
            Single screens work well for everyone in the room. Dual screens can also be used, but care should be taken to ensure both screens can be seen by all participants.
          `,
          hint: `
            Remember to use suitable mounts for the size and weight of the screens you wish to use.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 2.842,
              y: 116,
              z: 307,
            };
            const targetRotation = {
              x: -8.7,
              y: 80.13,
              z: 0.18,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['48InchScreen_dual_highlighted'];
              let excludedMeshes = [
                '48InchScreen_highlighted',
                'anno_displaysAndExtras_screens_viewerDistances',
              ];
              let included3DObjects = [
                'dualScreenHighlighted',
                'dualScreenSetup',
              ];
              let excluded3DObjects = ['singleScreenSetup'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'which-screen',
          title: 'Which screen?',
          heroImage: placeHolder,
          heroAltText: 'Which screen?',
          thumbnail: null,
          body: `
            Head to the room planner for a full overview of recommended screen size to occupancy. As a starting point:
            <br><br>Up to 8 people: 48" Screen
            <br>Up to 11 people: 55" Screen
            <br>Up to 16 people: 75" Screen
            <br>Up to 20 people: 85" Screen
          `,
          hint: null,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 2.842,
              y: 116,
              z: 307,
            };
            const targetRotation = {
              x: -8.7,
              y: 100.13,
              z: 0.18,
            };
            const fieldOfView = 25;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [];
              let excludedMeshes = [
                '48InchScreen_highlighted',
                'anno_displaysAndExtras_screens_viewerDistances',
              ];
              let included3DObjects = [
                'dualScreenSetup',
                'dualScreenHighlighted',
              ];
              let excluded3DObjects = ['singleScreenSetup'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Compute',
      slug: 'compute',
      icon: SectionImages.displaysAndExtras.compute.subNavIcon,
      '3dModel': `${modelsPath}/displaysAndExtras/StandardRoomB_DisplaysAndExtras.gltf`,
      cards: [
        {
          id: 'meet-compute-system',
          title: 'Meet Compute System',
          heroImage:
            SectionImages.displaysAndExtras.compute.meetComputeSystem
              .defaultHero,
          heroAltText: 'Meet Compute System',
          thumbnail: null,
          body: `
            The Meet Compute System, features an inbuilt intel i7 processor, single sided ports
            for easy installation, and is designed specifically for Google Meet.
            The Meet Compute System that comes with Series One kits uses power-over-ethernet to
            supply power to its components.
          `,
          hint: `
            It's ideal to have a wired network connection for the Google Meet Compute System.
            A wired network connection usually results in better performance than connecting to wireless.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'mounting',
          title: 'Mounting',
          heroImage: placeHolder,
          heroAltText: 'Mounting',
          thumbnail: null,
          body: `
            The Google Meet Compute System can be mounted on the rear side of the display screens,
            in a cabinet below the screens if you have one, or alternatively on or under the table.
            Wall and table top mounts are available to facilitate different mounting options.
          `,
          hint: null,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -150,
              y: 200,
              z: 400,
            };
            const targetRotation = {
              x: 100,
              y: 80,
              z: 0,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              var excludedMeshes = ['anno_displaysAndExtras_screen'];
              var includedMeshes = [
                'anno_displaysAndExtras_compute',
                'anno_displaysAndExtras_table',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'wiring',
          title: 'Wiring',
          heroImage: placeHolder,
          heroAltText: 'Wiring',
          thumbnail: null,
          body: `
            You only need a single power supply for the Series One Room Kits. The power supply feeds the Series One Meet Compute System, and from here, a single ethernet cable supplies data and power (PoE) to each of the the Series One components. Remember to consider cable routes and also power supplies for other equipment such as the screens.
          `,
          hint: `
            For other Meet hardware kits you may also need to consider different
            cabling and power supplies. Refer to the services section for more information.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -50,
              y: 200,
              z: 250,
            };
            const targetRotation = {
              x: 200,
              y: 120,
              z: 0,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var excludedMeshes = ['anno_displaysAndExtras_table'];
              var includedMeshes = [
                'anno_displaysAndExtras_compute',
                'anno_displaysAndExtras_screen',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Control',
      slug: 'control',
      icon: SectionImages.displaysAndExtras.control.subNavIcon,
      cards: [
        {
          id: 'touch-controller',
          title: 'Touch controller',
          heroImage:
            SectionImages.displaysAndExtras.control.meetTouchController
              .defaultHero,
          heroAltText: 'Meet touch controller',
          thumbnail: null,
          body: `
            Google Meet hardware medium and large configurations feature a touch screen controller to control meetings and adjust meeting settings.
          `,
          hint: `
            The Series One touch controller is available with a free standing mount or it can be wall mounted.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'remote-control',
          title: 'Remote control',
          heroImage:
            SectionImages.displaysAndExtras.control.remoteControl.defaultHero,
          heroAltText: 'Remote control',
          thumbnail: null,
          body: `
            The remote control is a more affordable option and ideal for flexible spaces or work from home set-ups. The remote control is available as part of both the ASUS and Series One Small room kits.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: null,
        },
        // commenting out as this is likely to be added back-in in the near future
        // {
        //   id: 'other-products',
        //   title: 'Other products',
        //   heroImage:
        //     SectionImages.displaysAndExtras.control.otherProducts.defaultHero,
        //   heroAltText: 'Other products',
        //   thumbnail: null,
        //   body: `
        //     The Google Meet Asus kits also feature the a touch screen,
        //     but a remote control solution is also availbe with the ASUS starter kits.
        //   `,
        //   hint: null,
        //   link: {
        //     label: `Take a look at the Logitech site for more information on the tap
        //     controller for use with the available logitech solutions.`,
        //     url: 'https://www.logitech.com/product/google-rooms',
        //   },
        //   hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
        //   updateModel: null,
        // },
      ],
    },
    {
      title: 'Board 65',
      slug: 'board-65',
      icon: SectionImages.displaysAndExtras.jamboard.subNavIcon,
      '3dModel': `${modelsPath}/displaysAndExtras/JamSoloA_DisplaysAndExtras.gltf`,
      cards: [
        {
          id: 'series-one-board-65',
          title: 'Series One Board 65',
          heroAltText: 'Series One Board 65',
          thumbnail: SectionImages.displaysAndExtras.jamboard.jamzone.thumbnail,
          body: `
            The Series One Board 65 by Avocor is a premium all-in-one touchscreen Google Meet device designed for team collaboration with Jamboard app capabilities built right in. The 65” UHD LCD screen delivers crystal clear visuals that let you see faces and content almost as if you were in the same room. Start meetings or whiteboarding sessions with just a tap on the ultra-responsive touchscreen.
          `,
          link: {
            label:
              'Find out more about the Series One Board 65 on the Google Meet Hardware site.',
            url: 'https://meetingdevices.withgoogle.com/seriesoneboard65/',
          },
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          heroImage:
            SectionImages.displaysAndExtras.jamboard.seriesOneBoard65
              .defaultHero,
          updateModel: null,
        },
        {
          id: 'the-jamzone',
          title: 'The Jamzone',
          heroImage: placeHolder,
          heroAltText: 'The Jamzone',
          thumbnail: null,
          body: `The recommended clear space around the Series One Board 65 to allow effective collaboration is a semicircle of radius 1.5m (60”) in front of the Board.`,
          hint: `
            The Series One Board 65 is a premium all-in-one touchscreen Google Meet device designed for team collaboration with Jamboard app capabilities built right in. The 65” UHD LCD screen delivers crystal clear visuals that let you see faces and content almost as if you were in the same room. Start meetings or whiteboarding sessions with just a tap on the ultra-responsive touchscreen.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-300, 290, -90], [100, 50, 0], 35],
            {
              excludedMeshes: [
                'acousticPanel003',
                'anno_displaysAndExtras_jamBoard_jamCam',
                'MeetupCam',
                'huddlyGoCamera_default',
                'TouchTablet',
                'SpeakerMic',
                'Table',
              ],
              excluded3DObjects: ['chairGroup'],
            }
          ),
        },
        {
          id: 'joining-meetings-board-65',
          title: 'Joining Meetings',
          heroImage: placeHolder,
          heroAltText: 'Joining Meetings',
          thumbnail: null,
          body: `
            The Series One Board 65 can be used in 2 - 6 person huddle and collaboration spaces. The built-in audio and video features make it perfect for adding video conferencing to  huddle and small-to-medium rooms and collaboration spaces.
          `,
          hint: `The Board 65 can also be paired with other Google Meet Hardware, so that it can also be used in larger conference rooms as a secondary meeting device and provide digital whiteboard space. Head to the Room designer for some examples `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: updateModelPartial([[-400, 290, 0], [100, 50, 0], 35], {
            excluded3DObjects: [
              'acousticPanel003',
              'sofaGroup',
              'anno_displaysAndExtras_jamBoard_jamCam',
              'lowpolyPeopleCasualMan2',
            ],
          }),
        },
        {
          id: 'built-in-camera-board-65',
          title: 'Built In Camera',
          heroImage: placeHolder,
          heroAltText: 'Built In Camera',
          thumbnail: null,
          body: `
            The Board 65 camera has a wide 110 degree horizontal field of view and 75 degree vertical field of view, with a fixed 18 degree downtilt. The 12 megapixel camera provides PTZ (pan, tilt, zoom) effects digitally, so within this field of view, participants are framed clearly and automatically using powerful Google AI.
          `,
          hint: `
            When using the Board 65 with a stand, in a meeting room setup, seated participants should be at least 1.5m (5') back from the board. Note that coverage should be checked for different board mounting heights.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: updateModelPartial(
            [[-300, 400, 250], [0, 100, 20], 40],
            {
              excluded3DObjects: ['chairGroup'],
              excludedMeshes: [
                'acousticPanel003',
                'anno_displaysAndExtras_jamboard_jamZone',
                'MeetupCam',
                'huddlyGoCamera_default',
                'TouchTablet',
                'SpeakerMic',
                'Table',
              ],
            }
          ),
        },
        {
          id: 'wall-mounting',
          title: 'Wall mounting',
          heroAltText: 'Wall mounting',
          thumbnail: null,
          body: `
            The Board 65 can be wall mounted which is very effective in maximizing
            space in rooms where the board has a dedicated location.
          `,
          hint: `
            Be sure to consider mounting height, especially when using the built
            in camera. Coverage for seated users tends to work best with the
            bottom of the board at 1m (3’ 3”) from the floor level. But you may
            also want to consider height of the screen for touch screen
            accessibility.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          heroImage:
            SectionImages.displaysAndExtras.jamboard.wallMounting.defaultHero,
          updateModel: null,
        },
        {
          id: 'floor-stand',
          title: 'Floor stand',
          heroImage:
            SectionImages.displaysAndExtras.jamboard.floorStand.defaultHero,
          heroAltText: 'Floor stand',
          thumbnail: null,
          body: `
            In addition to wall mounting, the Board 65 can be placed on an optional mobile stand, effortlessly moving from space to space. Board 65 is thoughtfully designed to make meeting and whiteboarding comfortable and inclusive for all.
          `,
          hint: `
            The mobile stand can offer great flexibility for more dynamic workshop
            and collaboration spaces.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: null,
        },
      ],
    },
    {
      title: 'Desk 27',
      slug: 'desk-27',
      icon: SectionImages.displaysAndExtras.desk27.subNavIcon,
      '3dModel': `${modelsPath}/displaysAndExtras/PhoneBoothA_DisplaysAndExtras.gltf`,
      cards: [
        {
          id: 'series-one-desk-27',
          title: 'Series One Desk 27',
          thumbnail: null,
          heroAltText: 'Series One Desk 27',
          body: `
            The Series One Desk 27, developed in collaboration with Avocor, is a premium all-in-one touchscreen Google Meet device, desk monitor and laptop docking station with Jamboard app capabilities built right in.
            <br>
            <br>
            The 27” Quad HD LCD screen delivers crystal clear visuals that let you see faces and content almost as if you were in the same room. Start meetings or whiteboarding sessions with just a tap on the ultra-responsive touchscreen.
          `,
          link: {
            label: `
              Google Meet hardware site
            `,
            url: 'https://meetingdevices.withgoogle.com/seriesonedesk27/',
          },
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          heroImage:
            SectionImages.displaysAndExtras.desk27.seriesOneDesk27.defaultHero,
          updateModel: null,
        },
        {
          id: 'joining-meetings-desk-27',
          title: 'Joining Meetings',
          heroImage: placeHolder,
          heroAltText: 'Joining Meetings',
          thumbnail: null,
          body: `
            With a 5MP camera, 8 onboard mics and Google AI, the Desk 27 is ideal as your personal video conferencing device in the office and at home, or for 1-2 person shared spaces and hot desking.
          `,
          hint: `
            With just a USB C connection, you can connect the Desk 27 camera, microphones, speaker, power and control to your laptop.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: updateModelPartial([[0, 200, 400], [0, 50, -200], 40], {
            excluded3DObjects: [
              'anno_displayAndExtras_phoneBooth_chromeBaseCam',
              'desk27Arm',
              '1mPlane03',
              'acousticPanel00',
            ],
          }),
        },
        {
          id: 'built-in-camera-desk-27',
          title: 'Built In Camera',
          heroImage: placeHolder,
          heroAltText: 'Built In Camera',
          thumbnail: null,
          body: `
            The 5 megapixel camera provides PTZ (pan, tilt, zoom) effects digitally so participants are framed clearly and automatically using powerful Google AI. Place participants within the 100 degree horizontal field of view.
          `,
          updateModel: updateModelPartial(
            [[-400, 300, 100], [400, -90, -200], 30],
            {
              excluded3DObjects: ['desk27Arm', '1mPlane03', 'acousticPanel00'],
            }
          ),
        },
        {
          id: 'mounting-desk-27',
          title: 'Mounting',
          heroImage: placeHolder,
          heroAltText: 'Mounting',
          thumbnail: null,
          body: `
            The Desk 27 comes with a stand, but the VESA 100 x 100 mounting option allows it to be used with industry-standard VESA mounting brackets.
          `,
          hint: `
            Mounting on an adjustable arm from the desk is a great setup and allows users to adjust to their comfort.
          `,
          hintIcon: SectionImages.displaysAndExtras.icons.hintIcon,
          updateModel: updateModelPartial([[0, 190, 400], [50, 30, -200], 30], {
            excluded3DObjects: [
              'desk27Stand',
              'anno_displayAndExtras_phoneBooth_chromeBaseCam',
              '1mPlane03',
              'acousticPanel00',
            ],
          }),
        },
      ],
    },
  ],
  'room-layout': [
    {
      title: 'Introduction',
      slug: 'introduction',
      icon: SectionImages.roomLayout.icons.mobileIcon,
      cards: [
        {
          id: 'introduction',
          title: 'Introduction',
          heroImage: SectionImages.roomLayout.contentPreviewHero,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `
            Following a few simple guidelines to best arrange the room for video conferencing can make a huge difference for remote and in-room participants.
          `,
        },
      ],
    },
    {
      title: 'Viewing area',
      slug: 'viewing-area',
      icon: `${imagesPath}/room-layout/icons/icon_viewingarea_green_01.svg`,
      '3dModel': `${modelsPath}/roomLayout/StandardRoomA_RoomLayout.gltf`,
      cards: [
        {
          id: 'good-viewing-area',
          title: 'Good viewing area',
          heroImage: `${imagesPath}/room-layout/primary-media/roomlayout_viewingArea_01_what'sMyGVA.svg`,
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_viewingarea_02_goodviewingarea.svg`,
          heroAltText: 'Good viewing area',
          body: `
            Keeping seating within the good viewing area or "GVA" ensures everyone can be seen on camera and has a comfortable view of the screens. To calculate the "GVA," we use the horizontal camera field of view, along with the minimum and maximum viewing distances to the screens.
          `,
          hint: `This is a common challenge when designing conferencing rooms. Room capacity might become a trade off, but a poor view can really diminish the experience and effectiveness of video conferencing!`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 900,
              z: -650,
            };
            const targetRotation = {
              x: 0,
              y: -1400,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'anno_roomLayout_viewingArea_goodViewingArea',
                'screenWall_default',
                'glazing',
              ];
              var excludedMeshes = [
                'stripLight00',
                'stripLight01',
                'acousticPanel00',
                'acousticPanel04',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_closestViewer',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_highlight',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'camera-view',
          title: 'Camera view',
          heroImage: placeHolder,
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_viewingarea_02_cameraview.svg`,
          heroAltText: 'Camera view',
          body: `It is important that everyone can be seen on camera to pick up facial expressions and gestures. The closest participants should be placed to ensure they are within the cameras HFOV (Horizontal Field of View).`,
          hint: `
            The field of views for Google Meet cameras are detailed in the camera and audio section
          `,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 500,
              z: -1000,
            };
            const targetRotation = {
              x: 0,
              y: -200,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'anno_roomLayout_viewingArea_cameraView110',
                'screenWall_default',
                'glazing',
              ];
              var excludedMeshes = [
                'stripLight',
                'acousticPanel00',
                'acousticPanel04',
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_closestViewer',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_highlight',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'furthest-viewer',
          title: 'Furthest viewer',
          heroImage: placeHolder,
          heroAltText: 'Furthest viewer',
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_viewingarea_02_furthestviewer.svg`,
          body: `To ensure comfortable viewing of images and content, the distance from the farthest viewer to the screen should be no more than 8x the screen height.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -300,
              y: 150,
              z: -750,
            };
            const targetRotation = {
              x: 400,
              y: 0,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'anno_roomLayout_viewingArea_furthestViewer',
                'screenWall_default',
              ];
              var excludedMeshes = [
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_closestViewer',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_highlight',
                'glazing',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'closest-viewer',
          title: 'Closest viewer',
          heroImage: placeHolder,
          heroAltText: 'Closest viewer',
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_viewingarea_02_closestviewer.svg`,
          body: `For comfort, the closest viewer should be no closer than 1.5x the screen height.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -130,
              y: 150,
              z: -680,
            };
            const targetRotation = {
              x: 180,
              y: 0,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'anno_roomLayout_viewingArea_closestViewer',
                'screenWall_default',
              ];
              var excludedMeshes = [
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_highlight',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'viewer-angle',
          title: 'Viewer angle',
          heroImage: placeHolder,
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_viewingarea_02_viewingangle.svg`,
          heroAltText: 'Viewer angle',
          body: `The horizontal viewing angle to the screen should not exceed 45 degrees. This is measured from the perpendicular of the outer screen edge.`,
          hint: `The camera view rule will generally over rule this, but be careful of steeper angles in smaller rooms.`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 500,
              z: -680,
            };
            const targetRotation = {
              x: 0,
              y: -300,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_default',
              ];
              var excludedMeshes = [
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_closestViewer',
                'screenWall_highlight',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'what-is-my-gva',
          title: `What's my GVA?`,
          heroImage: `${imagesPath}/room-layout/primary-media/roomlayout_viewingArea_01_what'sMyGVA.svg`,
          thumbnail: null,
          heroAltText: `What's my GVA?`,
          body: `Head to the room designer section for 'Good Viewing Area' examples over a range of occupancies using Google Meet hardware.`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          link: {
            label:
              'PDF and .dwg versions of room designer illustrations are available to download',
            url: '/downloads',
          },
          updateModel: null,
        },
      ],
    },
    {
      title: 'Space planning',
      slug: 'space-planning',
      icon: `${imagesPath}/room-layout/icons/icon_spaceplanning_green_01.svg`,
      '3dModel': `${modelsPath}/roomLayout/StandardRoomA_RoomLayout.gltf`,
      cards: [
        {
          id: 'orientation',
          title: 'Orientation',
          heroImage: placeHolder,
          heroAltText: 'Orientation',
          thumbnail: null,
          body: `
            Orienting the room lengthwise with the screen wall on the short side of the room will provide the best capacity. The wall should be a flat, even surface.
          `,
          hint: `Small rooms can be an exception. Using the wide Huddly GO field of view can suit having the screen on the longer side.`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 900,
              z: -1000,
            };
            const targetRotation = {
              x: 0,
              y: -500,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = ['screenWall_highlight'];
              var excludedMeshes = [
                'acousticPanel00',
                'acousticPanel04',
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_closestViewer',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_default',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'clearance-space',
          title: 'Clearance space',
          heroImage: placeHolder,
          heroAltText: 'Clearance space',
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_spaceplanning_02_clearancespace.svg`,
          body: `Accessibility for all users is important. A turning circle of at least 1500mm (60") is required for wheelchair access. Assuming a door at the rear - this almost always makes the minimum distance between the table and rear wall 1500mm (60").`,
          hint: `Take a look in the room designer section to see how this relates
           to minimum room sizes.`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -800,
              y: 250,
              z: -700,
            };
            const targetRotation = {
              x: 1200,
              y: -100,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'screenWall_default',
                'anno_roomLayout_spacePlanning_clearanceSpace',
              ];
              var excludedMeshes = [
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_accessWay',
                'anno_roomLayout_viewingArea_closestViewer',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_highlight',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'access-way',
          title: 'Access way',
          heroImage: placeHolder,
          heroAltText: 'Access way',
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_spaceplanning_02_accessway.svg`,
          body: `Ensure easy access around seats. We recommend at least 1200mm (48") clearance around fixed furniture to ensure good accessibility.`,
          hint: `You might need to increase this when featuring a jamboard at the
           side of the room.`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 100,
              y: 170,
              z: -900,
            };
            const targetRotation = {
              x: -50,
              y: -50,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [
                'screenWall_default',
                'anno_roomLayout_spacePlanning_accessWay',
              ];
              var excludedMeshes = [
                'anno_roomLayout_viewingArea_goodViewingArea',
                'anno_roomLayout_viewingArea_cameraView110',
                'anno_roomLayout_viewingArea_furthestViewer',
                'anno_roomLayout_spacePlanning_clearanceSpace',
                'anno_roomLayout_entrance_doorLocation',
                'anno_roomLayout_viewingArea_closestViewer',
                'anno_roomLayout_viewingArea_viewerAngle',
                'screenWall_highlight',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Entrance',
      slug: 'entrance',
      icon: `${imagesPath}/room-layout/icons/icon_entrance_green_01.svg`,
      '3dModel': `${modelsPath}/roomLayout/HuddleRoomA_RoomLayout.gltf`,
      cards: [
        {
          id: 'door-location',
          title: 'Door location',
          heroImage: placeHolder,
          heroAltText: 'Door location',
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_accessandvisibility_02_entrance.svg`,
          body: `
            Remember to consider how remote participants see people enter and leave the room.
            It's good practice to position the door in camera view so that everyone on the
            call can see who's left or entered the meeting room.
          `,
          hint: `This usually makes the rear of the room the best entrance location.`,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -113.438,
              y: 410.989,
              z: 537.411,
            };
            const targetRotation = {
              x: 20,
              y: 90,
              z: 0,
            };
            const fieldOfView = 38.5;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = ['anno_roomLayout_entrance_doorLocation'];
              var excludedMeshes = ['acousticPanel02', 'acousticPanel00'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'visibility-and-privacy',
          title: 'Visibility and Privacy',
          heroImage: placeHolder,
          heroAltText: 'Visibility and privacy',
          thumbnail: `${imagesPath}/room-layout/secondary-media/roomlayout_accessandvisibility_02_visibility_and_privacy.svg`,
          body: `
            It's good practice to allow people to see when a room is busy and avoid interruptions.
            However you may consider using obscured sections of glass to maintain privacy of
            participants and screen content. Blinds or drapes can be added for full privacy.
          `,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 655.689,
              y: 163.833,
              z: 1.411,
            };
            const targetRotation = {
              x: 0,
              y: 150,
              z: 0,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var includedMeshes = [];
              var excludedMeshes = ['anno_roomLayout_entrance_doorLocation'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Smaller',
      slug: 'smaller',
      icon: `${imagesPath}/room-layout/icons/icon_smaller_green_01.svg`,
      '3dModel': `${modelsPath}/roomLayout/OfficeSpaceB.gltf`,
      cards: [
        {
          id: 'micro-huddle',
          title: 'Phone rooms',
          heroImage: placeHolder,
          heroAltText: 'Phone rooms',
          thumbnail: null,
          body: `
            The Series One Desk 27 is an ideal video conferencing solution for maximising space in 1-2 person desk spaces, such as phone rooms or privacy spaces.
          `,
          hint: `
            Remember to consider space for accessibility, as described in the space planning section. It's easy to forget turning circles in smaller spaces.
          `,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const tweener = tweenCameraPartial(currentCamera);
            tweener([1600, 200.713, -1423.412], [1100, 19.43, 175.89], 25.5);

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }
              var exludedMeshes = [
                'anno',
                'acousticPanel02',
                'acousticPanel00',
                'acousticPanel004',
                'acousticPanel005',
                'acousticPanel006',
                'acousticPanel007',
                'acousticPanel01_(1)',
                'acousticPanel02',
                'acousticPanel03',
              ];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }
              var includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'acousticPanel008',
                'acousticPanel01',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'jamboard',
          title: 'Collaborative team space',
          heroImage: placeHolder,
          heroAltText: 'Collaborative team space',
          thumbnail: null,
          body: `
            The Series One Board 65 is perfectly suited to more flexible space types. The optional stand provides flexibility to move the device to wherever videoconferencing and whiteboarding are needed for team collaboration.
          `,
          link: {
            label: `
              Find out more about the Series One Board 65 on the meet hardware site
            `,
            url: 'https://meetingdevices.withgoogle.com/seriesoneboard65/',
          },
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const tweener = tweenCameraPartial(currentCamera);
            tweener([1100, 200.713, -1423.412], [600, 19.43, 175.89], 25.5);

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }
              var exludedMeshes = [
                'anno',
                'acousticPanel02',
                'acousticPanel00',
                'acousticPanel008',
                'acousticPanel01',
                'acousticPanel006',
                'acousticPanel007',
                'acousticPanel01_(1)',
                'acousticPanel02',
                'acousticPanel03',
              ];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }
              var includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'acousticPanel004',
                'acousticPanel005',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'huddle-room',
          title: 'Huddle space',
          heroImage: placeHolder,
          heroAltText: 'Huddle space',
          thumbnail: null,
          body: `
            The Series One Board 65 can provide an excellent all in one video conferencing solution for smaller 2-5 person huddle spaces.
          `,
          hint: `
            Wall mounting the Board 65 can be ideal to maximise usable space in the room.
          `,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const tweener = tweenCameraPartial(currentCamera);
            tweener([650, 200.713, -1423.412], [150, 19.43, 175.89], 25.5);

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }
              var exludedMeshes = [
                'anno',
                'acousticPanel00',
                'acousticPanel008',
                'acousticPanel01',
                'acousticPanel004',
                'acousticPanel005',
                'acousticPanel01_(1)',
                'acousticPanel02',
                'acousticPanel03',
              ];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }
              var includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'acousticPanel006',
                'acousticPanel007',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'small-meeting-room',
          title: 'Small meeting room',
          heroImage: placeHolder,
          heroAltText: 'Small meeting room',
          thumbnail: null,
          body: `
            Series One Google Meet hardware kit for small rooms brings immersive
            experiences with crystal-clear audio and video for rooms with up to 6
            people. It comes with a Smart Audio Bar, Smart Camera, remote control,
            and Series One Meet compute system.
          `,
          link: {
            label: `
              Take a look at the Room Designer to refine the requirements for your space
            `,
            url: '/room-planner',
          },
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const tweener = tweenCameraPartial(currentCamera);
            tweener([200, 200.713, -1423.412], [-300, 19.43, 175.89], 25.5);

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }
              var exludedMeshes = [
                'anno',
                'acousticPanel00',
                'acousticPanel008',
                'acousticPanel01',
                'acousticPanel004',
                'acousticPanel005',
                'acousticPanel006',
                'acousticPanel007',
              ];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }
              var includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'acousticPanel01_(1)',
                'acousticPanel02',
                'acousticPanel03',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Larger',
      slug: 'larger',
      icon: `${imagesPath}/room-layout/icons/icon_larger_green_01.svg`,
      '3dModel': `${modelsPath}/roomLayout/OfficeSpaceC.gltf`,
      cards: [
        {
          id: 'medium-meeting-room',
          title: 'Medium meeting room',
          heroImage: placeHolder,
          heroAltText: 'Medium meeting room',
          thumbnail: null,
          body: `
            The Series One Google Meet hardware kit for medium rooms is designed for spaces with 6-10 seats. It comes with a Smart Audio Bar, Smart Camera, touch controller, Mic pod, and Series One Meet compute system.
            <br><br>
            The Logitech medium room options for Google Meet feature the Rally camera. ASUS kits feature the speakermic.
          `,
          link: {
            label: `
              Take a look at the Room Designer to refine the requirements for your space
            `,
            url: '/room-planner',
          },
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -320.438,
              y: 410.989,
              z: 227.411,
            };
            const targetRotation = {
              x: 60,
              y: 90,
              z: 0,
            };
            const fieldOfView = 38.5;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let excludedMeshes = ['anno'];
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              let includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'acousticPanel_default011',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'large-meeting-room',
          title: 'Large meeting room',
          heroImage: placeHolder,
          heroAltText: 'Large meeting room',
          thumbnail: null,
          body: `
            Series One Google Meet hardware kit for large rooms is designed for space with 11+ seats. It comes with a Smart Audio Bar, add-on Audio Bar, Smart Camera XL, touch controller, 2 x micpod, and Series One Meet compute system. Additional micpods can be added to the system for larger setups.
            <br><br>
            The Logitech large room options for Google Meet feature the Rally camera for covering larger spaces.
          `,
          link: {
            label: `
              Take a look at the Room Designer to refine the requirements for your space
            `,
            url: '/room-planner',
          },
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 1305.322,
              y: 327.34,
              z: 286.681,
            };
            const targetRotation = {
              x: 902.81,
              y: 84.54,
              z: 25.47,
            };
            const fieldOfView = 40.5;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }
              var exludedMeshes = ['anno'];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }
              var includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'acousticPanel_default011',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'add-a-jamboard',
          title: 'Digital whiteboarding',
          heroImage: placeHolder,
          heroAltText: 'Digital whiteboarding',
          thumbnail: null,
          body: `
            The Series One Board 65 can also be used as an additional device in conference rooms, to provide digital whiteboard for the meeting with additional content still able to be shared in the meeting.
          `,
          hint: `
            Placing the Board 65 at the side of the room is usually best for space, but make sure users at the Board are still in the main room camera view.
          `,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 883.322,
              y: 289.34,
              z: 258.681,
            };
            const targetRotation = {
              x: 877,
              y: 152.24,
              z: 0,
            };
            const fieldOfView = 36.5;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let excludedMeshes = ['anno'];
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              let includedMeshes = [
                'anno_roomLayout_entrance_doorLocation',
                'Jamboard',
              ];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Office & other',
      slug: 'office-and-other',
      icon: `${imagesPath}/room-layout/icons/icon_officeandother_green_01.svg`,
      '3dModel': `${modelsPath}/roomLayout/OfficeSpaceA.gltf`,
      cards: [
        {
          id: 'personal-desk',
          title: 'Personal desk',
          heroImage: placeHolder,
          heroAltText: 'Personal desk',
          thumbnail: null,
          body: `
            The Series One Desk 27 is perfect for integrating high quality video conferencing into a personal office setup giving you high definition video and high fidelity audio, while keeping video conferencing separate to your computer.
          `,
          hint: null,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 100,
              y: 200,
              z: 1000,
            };
            const targetRotation = {
              x: -100,
              y: 0,
              z: 0,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              var includedMeshes = [];
              var excludedMeshes = ['BookSet'];
              let included3DObjects = ['execOfficeSetup'];
              let excluded3DObjects = ['kioskSetup'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'home-setup',
          title: 'Home working',
          heroImage: placeHolder,
          heroAltText: 'Home working',
          thumbnail: null,
          body: `
            The Series One Desk 27 can also make an ideal addition home office setups.
            Bring high quality video conferencing and touchscreen capability to your
            home working setup, whilst not taking up too much space.
          `,
          hint: null,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 86.34,
              y: 151.534,
              z: -729.597,
            };
            const targetRotation = {
              x: -607.37,
              y: 56.71,
              z: 169.39,
            };
            const fieldOfView = 38.5;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              var includedMeshes = [];
              var excludedMeshes = [];
              let included3DObjects = ['execOfficeSetup', 'BookSet'];
              let excluded3DObjects = ['kioskSetup'];
              let includedGroups = ['GoogleCombined001'];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'standalone',
          title: 'Standalone',
          heroImage: placeHolder,
          heroAltText: 'Standalone',
          thumbnail: null,
          body: `
            As a compact, and easy to operate all in one unit, the Desk 27 can
            also be used for other applications where remote video conferencing
            is needed. Such as an unstaffed reception desk.
          `,
          hint: null,
          hintIcon: SectionImages.roomLayout.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -99.696,
              y: 141.125,
              z: 1014.079,
            };
            const targetRotation = {
              x: -32.59,
              y: 2.33,
              z: 0.11,
            };
            const fieldOfView = 40;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              var includedMeshes = [];
              var excludedMeshes = [];
              let included3DObjects = ['kioskSetup', 'BookSet'];
              let excluded3DObjects = ['execOfficeSetup'];
              let includedGroups = [];
              let excludedGroups = ['GoogleCombined001'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
  ],
  'furniture-lighting': [
    {
      title: 'Introduction',
      slug: 'introduction',
      icon: SectionImages.furnitureLighting.icons.sectionIcon,
      cards: [
        {
          id: 'introduction',
          title: 'Introduction',
          heroImage: SectionImages.furnitureLighting.contentPreviewHero,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `Make your meeting room look and feel inviting with simple decorative and lighting tips. Appropriate lighting helps both local and remote participants have a great experience.`,
        },
      ],
    },
    {
      title: 'Lighting',
      slug: 'lighting',
      icon: `${imagesPath}/furniture-lighting/icons/icon_lighting_yellow_01.svg`,
      '3dModel': `${modelsPath}/furnitureAndLighting/JamboardA_fAndL.gltf`,
      cards: [
        {
          id: 'face-background-ratio',
          title: 'Face to Background Ratio',
          heroImage: placeHolder,
          heroAltText: 'Face to Background Ratio',
          thumbnail: null,
          body: `A light ratio of 2:1 hitting participants' faces vs the background directly behind their face is desirable.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 229.696,
              y: 144.029,
              z: 348.899,
            };
            const targetRotation = {
              x: -19.51,
              y: 143.92,
              z: 40.46,
            };
            const fieldOfView = 42.83;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [
                'anno_fAndL_lighting_faceToBackgroundRatio',
              ];
              let excludedMeshes = [
                'anno_fAndL_finishes_lightSurfaces',
                'acousticPanel01',
                'acousticPanel006',
                'acousticPanel005',
                'acousticPanel007',
              ];
              let includedGroups = ['wallPlanes'];
              let excludedGroups = ['wallStripes'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'face-light-level',
          title: 'Face Light Level',
          heroImage: placeHolder,
          heroAltText: 'Face Light Level',
          thumbnail: null,
          body: `Average vertical illumination on participants' faces should be around
           400 lux. Avoid levels any higher than 500 lux on people's faces and ensure
           luminaires are low glare.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 124.345,
              y: 121.982,
              z: 251.95,
            };
            const targetRotation = {
              x: -10.91,
              y: 82.32,
              z: -1.36,
            };
            const fieldOfView = 50;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [];
              let excludedMeshes = [
                'anno_fAndL_finishes_lightSurfaces',
                'anno_fAndL_lighting_faceToBackgroundRatio',
              ];
              let includedGroups = ['wallPlanes'];
              let excludedGroups = ['wallStripes'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'general-light-level',
          title: 'General Light Level',
          heroImage: placeHolder,
          heroAltText: 'General Light Level',
          thumbnail: null,
          body: `Good visual comfort and uniformity is paramount, below are some general guide parameters: <br />
            Target uniformity ~0.6Uo<br />
            Colour temperature ~4500 kelvin.<br />
            Colour rendering index (CRI) ~80+`,
          hint: `Lighting level on the working plane should still be within CIBSE guidelines.`,
          hintIcon: SectionImages.furnitureLighting.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 795.714,
              y: 109.59,
              z: 0,
            };
            const targetRotation = {
              x: 3.24,
              y: 150.17,
              z: -13.2,
            };
            const fieldOfView = 32;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [];
              let excludedMeshes = [
                'anno_fAndL_finishes_lightSurfaces',
                'anno_fAndL_lighting_faceToBackgroundRatio',
              ];
              let includedGroups = ['wallPlanes'];
              let excludedGroups = ['wallStripes'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Finishes',
      slug: 'finishes',
      icon: `${imagesPath}/furniture-lighting/icons/icon_finishes_yellow_01.svg`,
      '3dModel': `${modelsPath}/furnitureAndLighting/JamboardA_fAndL.gltf`,
      cards: [
        {
          id: 'light-surfaces',
          title: 'Light surfaces',
          heroImage: placeHolder,
          heroAltText: 'Light Surfaces',
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_finishes_02_light_surfaces.svg`,
          body: `Tables with light-coloured surfaces help illuminate participant faces and boost the face to background light ratio. Ideally table surface should be ~50% reflective`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 159.259,
              y: 173.039,
              z: 346.108,
            };
            const targetRotation = {
              x: -11.84,
              y: 46.32,
              z: 5.31,
            };
            const fieldOfView = 38.55;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_fAndL_finishes_lightSurfaces'];
              let excludedMeshes = [
                'acousticPanel005',
                'acousticPanel006',
                'acousticPanel007',
                'anno_fAndL_lighting_faceToBackgroundRatio',
              ];
              let included3DObjects = ['singleScreenSetup'];
              let excluded3DObjects = [];
              let includedGroups = ['wallPlanes'];
              let excludedGroups = ['wallStripes'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'room-graphics',
          title: 'Room graphics',
          heroImage: placeHolder,
          heroAltText: 'Room graphics',
          body: `Avoid very bright surfaces or intricate patterns, especially any striped patterns falling in the camera shot. It can distract remote participants.`,
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_finishes_02_room_graphics.svg`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 101.533,
              y: 171.901,
              z: -249.776,
            };
            const targetRotation = {
              x: -174.91,
              y: 27.45,
              z: 177.65,
            };
            const fieldOfView = 58.95;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['acousticPanel'];
              let excludedMeshes = [
                'anno_fAndL_lighting_faceToBackgroundRatio',
                'anno_fAndL_finishes_lightSurfaces',
              ];
              let included3DObjects = [];
              let excluded3DObjects = [];
              let includedGroups = ['wallStripes'];
              let excludedGroups = ['wallPlanes'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'wall-color',
          title: 'Wall colour',
          heroImage: placeHolder,
          heroAltText: 'Wall colour',
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_finishes_02_wall_colour.svg`,
          body: `Neutral and light, subtle colours are the most effective for camera, but avoid white washed walls where possible, as it can reduce colour appearance on camera.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 660.74,
              y: 171.6,
              z: -201.3,
            };
            const targetRotation = {
              x: -166.42,
              y: 70.41,
              z: 167.18,
            };
            const fieldOfView = 38.55;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['acousticPanel'];
              let excludedMeshes = [
                'glazing',
                'anno_fAndL_lighting_faceToBackgroundRatio',
                'anno_fAndL_finishes_lightSurfaces',
              ];
              let includedGroups = ['wallPlanes'];
              let excludedGroups = ['wallStripes'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Windows',
      slug: 'windows',
      icon: `${imagesPath}/furniture-lighting/icons/icon_windows_yellow_01.svg`,
      '3dModel': `${modelsPath}/furnitureAndLighting/StandardRoomB_fAndL_Windows.gltf`,
      cards: [
        {
          id: 'external-windows',
          title: 'External Windows',
          heroImage: placeHolder,
          heroAltText: 'External Windows',
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_windows_02_external_windows.svg`,
          body: `Blinds or curtains should be provided on all external windows to control the room light levels and prevent glare, which can affect camera performance.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -157.7,
              y: 144.8,
              z: 531.181,
            };
            const targetRotation = {
              x: -2,
              y: 73.99,
              z: -0.65,
            };
            const fieldOfView = 41;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
          },
        },
        {
          id: 'interal-windows',
          title: 'Internal Windows',
          heroImage: placeHolder,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `Blinds or curtains should also be considered on all internal glass
           walls or windows. It ensures privacy can be achieved and improves acoustics.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -169.92,
              y: 142.36,
              z: -129.87,
            };
            const targetRotation = {
              x: -80,
              y: 100,
              z: 10,
            };
            const fieldOfView = 50.53;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
          },
        },
      ],
    },
    {
      title: 'Furniture',
      slug: 'furniture',
      icon: `${imagesPath}/furniture-lighting/icons/icon_furniture_yellow-circle_01.svg`,
      '3dModel': `${modelsPath}/furnitureAndLighting/StandardRoomB_fAndL_Windows.gltf`,
      cards: [
        {
          id: 'table-depth',
          title: 'Table Depth',
          heroImage: placeHolder,
          heroAltText: 'Table Depth',
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_furniture_02_table_depth.svg`,
          body: `Table legs should not restrict seating or leg movement. Generally a depth of at least 750mm (30") should be provided for each user.`,
          hint: `Consider adding laptop chargers and easy access power strips to tables`,
          hintIcon: SectionImages.furnitureLighting.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -511.9,
              y: 106.6,
              z: -58.2,
            };
            const targetRotation = {
              x: 10,
              y: 32,
              z: -40,
            };
            const fieldOfView = 29.39;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var exludedMeshes = [
                'acousticPanel01',
                'acousticPanel03',
                'anno',
              ];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }

              var includedMeshes = ['glazing', 'curtainRail'];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'table-length',
          title: 'Table Length',
          heroImage: placeHolder,
          heroAltText: 'Table Length',
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_furniture_02_table_length.svg`,
          body: `As a 'fixed' element of furniture the table should comply to clearances described in the room layout section. Generally each user should have a seatway of at least 700mm (28").`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 0,
              y: 337.5,
              z: 249.8,
            };
            const targetRotation = {
              x: 30,
              y: 0,
              z: 0,
            };
            const fieldOfView = 60.53;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              var exludedMeshes = [
                'curtainRail',
                'glazing',
                'acousticPanel01',
                'acousticPanel03',
              ];
              if (contains(object.name, exludedMeshes)) {
                object.visible = false;
              }

              var includedMeshes = [];
              if (contains(object.name, includedMeshes)) {
                object.visible = true;
                return;
              }
            });
          },
        },
        {
          id: 'table-shape',
          title: 'Table Shape',
          heroImage: `${imagesPath}/furniture-lighting/primary-media/furnitureandlighting_furniture_01_tableshape.svg`,
          heroAltText: 'Table Shape',
          body: `
            The table should help participants orient around the screen. For larger rooms, tapering the table can improve sightlines to the camera.
          `,
          hint: `Remember to consider access around the table  ideally at least 1200mm (48").`,
          hintIcon: SectionImages.furnitureLighting.icons.hintIcon,
          thumbnail: ``,
          updateModel: null,
        },
        {
          id: 'chair-types',
          title: 'Chair Types',
          heroImage: `${imagesPath}/furniture-lighting/primary-media/furnitureandlighting_furniture_01_chair_types.svg`,
          heroAltText: 'Chair Types',
          body: `Chair features such as height and armrest adjustment will improve participant comfort. Take care to ensure there is 1200mm (48") circulation space around fixed furniture for ease of access.`,
          hint: `Bigger chairs, especially with larger backs may require a little more clearance space for circulation`,
          hintIcon: SectionImages.furnitureLighting.icons.hintIcon,
          thumbnail: ``,
          updateModel: null,
        },
      ],
    },
    {
      title: 'Joinery & boards',
      slug: 'joinery-and-boards',
      icon: `${imagesPath}/furniture-lighting/icons/icon_joinery_and_boards_yellow_01.svg`,
      '3dModel': `${modelsPath}/furnitureAndLighting/StandardRoomB_fAndL_JoineryAndBoards.gltf`,
      cards: [
        {
          id: 'writing-surfaces',
          title: 'Writing surfaces',
          heroImage: placeHolder,
          heroAltText: 'Writing surfaces',
          thumbnail: null,
          body: `
            It is best to place a writing surface in the view of the camera. If using a sidewall,
            try to keep it within the camera field of view.
          `,
          hint: `
            Be wary of impacting room acoustics: Large whiteboards and glass walls or windows in the same room can limit available space for acoustic absorption.
          `,
          hintIcon: SectionImages.furnitureLighting.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -360,
              y: 200,
              z: 380,
            };
            const targetRotation = {
              x: -50,
              y: 100,
              z: 0,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['Cabinet_Main', '1mWhiteBoard_highlighted'];
              let excludedMeshes = ['1mWhiteBoard_highlighted'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'cabinet',
          title: 'Cabinet',
          heroImage: placeHolder,
          heroAltText: 'Cabinet',
          thumbnail: `${imagesPath}/furniture-lighting/secondary-media/furnitureandlighting_joinery_boards_02_cabinet.svg`,
          body: `
            To keep cabling neat and easy to install, a slim cabinet underneath the
            screens can be an ideal addition.
          `,
          hint: null,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 100,
              y: 200,
              z: 380,
            };
            const targetRotation = {
              x: 200,
              y: 100,
              z: 0,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['Cabinet Highlighted'];
              let excludedMeshes = [
                'Cabinet_Main',
                '1mWhiteBoard_highlighted',
                'curtain',
              ];
              let includedGroups = ['1mWhiteBoard_default'];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'table-boxes',
          title: 'Table boxes',
          heroImage: placeHolder,
          heroAltText: 'Table boxes',
          thumbnail: null,
          body: `
            To keep table tops clearer, a table box integrated into the joinery is a great
            way to hide power adapters and cables.
          `,
          hint: null,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -4,
              y: 200,
              z: 360,
            };
            const targetRotation = {
              x: 0,
              y: 100,
              z: -10,
            };
            const fieldOfView = 22;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [];
              let excludedMeshes = ['1mWhiteBoard_highlighted'];
              let includedGroups = ['1mWhiteBoard_default'];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
  ],
  acoustics: [
    {
      title: 'Introduction',
      slug: 'introduction',
      icon: SectionImages.acoustics.icons.sectionIcon,
      cards: [
        {
          id: 'introduction',
          title: 'Introduction',
          heroImage: SectionImages.acoustics.contentPreviewHero,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `Poor acoustics is a common downfall of video conferencing spaces. The right allowance of acoustic finishes can help make speech clear and audible, and adequate isolation helps avoid interruptions.`,
        },
      ],
    },
    {
      title: 'Separation',
      slug: 'separation',
      icon: `${imagesPath}/acoustics/icons/icon_separation_blue_01.svg`,
      '3dModel': `${modelsPath}/acoustics/StandardRoomA_Acoustics.gltf`,
      cards: [
        {
          id: 'wall-rating',
          title: 'Wall Rating',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_separation_01_wallrating.svg`,
          heroAltText: 'Wall rating',
          thumbnail: null,
          body: `The ability of a partition to prevent sound transfer from an adjacent space is measured as an NIC rating. Where louder or more noise sensitive spaces adjoin a meeting room the wall will require a higher NIC rating.`,
          hint: `The Noise isolation Class (NIC) rating is a single-number rating
           that describes the degree of airborne sound separation between two adjacent
            spaces afforded by a partition, door, and window or floor-ceiling assembly.
             You may also see (STC) sound transmission class used which is the same
              principle but a lab rating which is typically 5 points higher than NIC.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
        },
        {
          id: 'between-meeting-rooms',
          title: 'Between Meeting Rooms',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_separation_01_betweenmeetingrooms.svg`,
          heroAltText: 'Between meeting rooms',
          thumbnail: null,
          body: `Walls between meeting rooms should be at least <b>NIC 45</b>.`,
        },
        {
          id: 'walls-with-a-door',
          title: 'Walls with a Door',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_separation_01_wallswithadoor.svg`,
          heroAltText: 'Walls with a door',
          thumbnail: null,
          body: `Walls with a door that are less than 4.5m from work areas should be at least <b>NIC 30</b><br />
            <br />
            Walls with a door that are more than 4.5m from work areas should be at least <b>NIC 25</b>`,
          hint: `Where a door features in a wall, the highest achievable rating is limited
           by the rating of the door, so there is little value in rating the wall any higher.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
        },
        {
          id: 'walls-without-a-door',
          title: 'Walls Without a Door',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_separation_01_wallswithoutadoor.svg`,
          heroAltText: 'Walls without a door',
          thumbnail: null,
          body: `Walls without a door that are less than 4.5m from work areas should be at least <b>NIC 35</b><br />
          <br />
          Walls without a door that are more than 4.5m from work areas should be at least <b>NIC 30</b>`,
        },
        {
          id: 'wall-height',
          title: 'Wall Height',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_acousticseparation_01_wall_height.svg`,
          heroAltText: 'Wall Height',
          thumbnail: null,
          body: `Partitions should be full height. Half height partitions can create a noise path between the rooms and introduce unwanted noise from adjacent spaces.`,
        },
        {
          id: 'glazing',
          title: 'Glazing',
          heroImage: placeHolder,
          heroAltText: 'Glazing',
          thumbnail: `${imagesPath}/acoustics/secondary-media/acoustics_acousticseparation_02_glazing.svg`,
          body: `Glazing is great for open plan office spaces, but it can increase reverberance. Try to limit glazing to the wall with the entry door, and avoid placing glazing between meeting rooms.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 500,
              y: 200,
              z: -300,
            };
            const targetRotation = {
              x: -1000,
              y: -100,
              z: -600,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['anno_acoustics_noise_Glazing'];
              let excludedMeshes = [
                'anno_acoustics_noise_Doors',
                'acousticPanel01',
                'acousticPanel02',
                'acousticPanel03',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'doors',
          title: 'Doors',
          heroImage: placeHolder,
          heroAltText: 'Doors',
          thumbnail: `${imagesPath}/acoustics/secondary-media/acoustics_acousticseparation_02_doors.svg`,
          body: `Doors are generally a acoustic weak link as the gaps allow sound to flank around and under the door. Insulated metal doors are preferred, followed by solid wood doors. Generally swing doors perform better than sliding doors. Perimeter acoustic seals will aid the sound separation performance and should be considered for any meeting room.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 500,
              y: 200,
              z: -700,
            };
            const targetRotation = {
              x: -1000,
              y: -100,
              z: -100,
            };
            const fieldOfView = 35;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['anno_acoustics_noise_Doors'];
              let excludedMeshes = [
                'anno_acoustics_noise_Glazing',
                'acousticPanel',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Adjacencies',
      slug: 'adjacencies',
      icon: `${imagesPath}/acoustics/icons/icon_adjacencies_blue_01.svg`,
      cards: [
        {
          id: 'what-noise',
          title: 'What is That Noise?',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_adjacencies_01_whatisthatnoise.svg`,
          heroAltText: 'What is That Noise?',
          thumbnail: null,
          body: `Be strategic about adjacencies, think about where meeting rooms are in relation to predictably noisy and other noise sensitive spaces, including vertically! Noisy spaces above and below meeting rooms are a common problem.`,
        },
        {
          id: 'duct-routing',
          title: 'Duct Routing',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_adjacencies_01_ductrouting.svg`,
          heroAltText: 'Duct Routing',
          thumbnail: null,
          body: `Short ductwork between spaces are a common cause of unwanted sound
           transmission. When designing new spaces consider duct routing to
            minimize this concern.`,
        },
        {
          id: 'back-equiptment',
          title: 'Back to Back Equipment',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_adjacencies_01_backtobackequipment.svg`,
          heroAltText: 'Back to Back Equipment',
          thumbnail: null,
          body: `Avoid positioning adjacent meeting rooms 'back to back' (screen wall to screen wall). This increases risk of noise transfer between meeting rooms.`,
          hint: `Bad adjacencies or inadequate acoustic
           separation risks a lack of privacy, and frequent noise
           interruptions. Even small distracting noises can be
           enough to throw attention away from the task at hand!`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
        },
      ],
    },
    {
      title: 'Reverb',
      slug: 'reverb',
      icon: `${imagesPath}/acoustics/icons/icon_reverberation-time_blue_01.svg`,
      '3dModel': `${modelsPath}/acoustics/StandardRoomB_Acoustics.gltf`,
      cards: [
        {
          id: 'whats-that',
          title: 'Sorry, What Was that?',
          heroImage: placeHolder,
          heroAltText: 'Sorry, What Was That?',
          thumbnail: null,
          body: `To make sure participants on each side of the call are clearly heard the room needs to provide a good level of speech intelligibility. The key is to control reverberation time and eliminate any unwanted reflections.`,
          hint: `Speech intelligibility can be measured and is most commonly seen as
           Speech transmission index (STI). Reverberation time and background noise
            are two key components to a good STI.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -321.419,
              y: 148.999,
              z: -166.41,
            };
            const targetRotation = {
              x: -81.53,
              y: 120.74,
              z: -100.53,
            };
            const fieldOfView = 40.98;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_acoustics_reverb_sorryWhatWasThat'];
              let excludedMeshes = [
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_default00',
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel_highlighted',
              ];
              let included3DObjects = ['acousticPanel_default'];
              let excluded3DObjects = [];
              let includedGroups = [];
              let excludedGroups = ['acousticPanel_highlighted'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'target-reverberation',
          title: 'Target RT Time',
          heroImage: placeHolder,
          heroAltText: 'Target RT Time',
          thumbnail: null,
          body: `The following are suggested target reverberation times for meeting rooms:<br />
          <br />
          Small rooms (up to 8 people): RT60 of 0.45s<br />
          Medium rooms (up to 11 people): RT60 of 0.6s<br />
          Larger rooms (up to 20 people): RT60 of 0.7s`,
          hint: `Reverberation Time (RT) is a measure of the rate of decay of sound, helping us quantify how lively or reverberant a room is. RT60 is the time in seconds for a sound to decay by 60dB. A long RT time can hinder speech communication between occupants in the room and for remote participants.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -322.213,
              y: 164.077,
              z: -173.459,
            };
            const targetRotation = {
              x: -14.88,
              y: 130.45,
              z: -101.37,
            };
            const fieldOfView = 38.63;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_acoustics_noise_targetRTTime'];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel_highlighted',
              ];
              let included3DObjects = ['acousticsPanel_default'];
              let excluded3DObjects = [];
              let includedGroups = [];
              let excludedGroups = ['acousticsPanel_highlighted'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'reverberation-solutions',
          title: 'Solutions',
          heroImage: placeHolder,
          heroAltText: 'Solutions',
          thumbnail: null,
          body: `To achieve these targets, acoustic treatment in the room will be required.
           In existing spaces this might be limited to adapting the wall and floor finishes.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -454.755,
              y: 138.681,
              z: 359.996,
            };
            const targetRotation = {
              x: -2.34,
              y: 92.92,
              z: -60.34,
            };
            const fieldOfView = 35.98;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['acousticPanel_highlighted'];
              let excludedMeshes = [
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_default00',
                'wall_highlighted00',
                'wall_highlighted01',
                'glazing',
                'acousticPanel_highlighted00',
                'acousticPanel_highlighted01',
                'acousticPanel_default',
              ];
              let included3DObjects = [];
              let excluded3DObjects = ['acousticsPanel_default'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'room-shaping',
          title: 'Room Shaping',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_reverb_01_roomshaping.svg`,
          heroAltText: 'Room shaping',
          thumbnail: null,
          body: `You can look to take advantage of unusually shaped spaces, such as angled, or non parallel walls as they can provide acoustic benefits.`,
        },
      ],
    },
    {
      title: 'Finishes',
      slug: 'acoustic-finishes',
      icon: `${imagesPath}/acoustics/icons/icon_finishes_blue_01.svg`,
      '3dModel': `${modelsPath}/acoustics/StandardRoomB_Acoustics.gltf`,
      cards: [
        {
          id: 'wall-treatment',
          title: 'Wall Treatment',
          heroImage: placeHolder,
          heroAltText: 'Wall Treatment',
          thumbnail: `${imagesPath}/acoustics/secondary-media/acoustics_acousticfinishes_02_wall_treatment.svg`,
          body: `The total area of acoustic wall treatment should equal atleast 50% of the total floor area of the room plus an additional 5m2, using treatment with an NRC of at least 0.7.`,
          hint: `NRC (Noise reduction coefficient) is a measure of how much sound energy is absorbed when striking a surface. Measured from 0-1, a good benchmark is to allow for at least 50mm (2") thick treatment for the walls to achieve NRC 0.7.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -218.139,
              y: 1214.508,
              z: 522.285,
            };
            const targetRotation = {
              x: -23.21,
              y: 26.88,
              z: -26.28,
            };
            const fieldOfView = 37;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['acousticPanel_highlighted'];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel_default',
                'stripLight',
              ];
              let includedGroups = ['acousticsPanel_highlighted'];
              let excludedGroups = ['acousticsPanel_default'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'adjacent-walls',
          title: 'Adjacent Walls',
          heroImage: placeHolder,
          heroAltText: 'Adjacent Walls',
          thumbnail: `${imagesPath}/acoustics/secondary-media/acoustics_acousticfinishes_02_adjacent_walls.svg`,
          body: `Acoustic treatment on wall areas should ideally feature
             on two adjacent walls to reduce the risk of parallel
            reflections forming between two opposite reflective
             surfaces.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 264.042,
              y: 647.394,
              z: 603.139,
            };
            const targetRotation = {
              x: -32.74,
              y: 50.76,
              z: 12.44,
            };
            const fieldOfView = 35.98;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel_default',
              ];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'acousticPanel_highlighted',
              ];
              let includedGroups = ['acousticsPanel_default'];
              let excludedGroups = ['acousticsPanel_highlighted'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'treatment-location',
          title: 'Treatment Location',
          heroImage: placeHolder,
          heroAltText: 'Treatment Location',
          thumbnail: `${imagesPath}/acoustics/secondary-media/acoustics_finishes_02_treatmentlocation.svg`,
          body: `Wall treatment should ideally start just below seated head height approximately 1m (40") from the floor, continuing to ceiling level.`,
          hint: `Multiple treatment options exist for walls that should be considered. Some options include felt, fabric wrapped panels, pinnable soft treatments, stretched fabric systems with concealed absorption. This will all depend on the desired look and feel for the room.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -516.849,
              y: 125.976,
              z: 109.009,
            };
            const targetRotation = {
              x: -80.62,
              y: 120.03,
              z: -98.5,
            };
            const fieldOfView = 39.43;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['acousticPanel_highlighted'];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_highlighted00',
                'wall_highlighted01',
                'wall_default00',
                'acousticPanel_default00',
                'acousticPanel_default01',
                'acousticPanel_default02',
                'acousticPanel_highlighted00',
                'acousticPanel_highlighted01',
                'acousticPanel_highlighted02',
              ];
              let includedGroups = ['acousticsPanel_highlighted'];
              let excludedGroups = ['acousticsPanel_default'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'ceiling-treatment',
          title: 'Ceiling Treatment',
          heroImage: placeHolder,
          heroAltText: 'Ceiling Treatment',
          thumbnail: null,
          body: `Ideally the entire ceiling should feature acoustic
             treatment to at least NRC 0.7. Suspended ceilings (ACT),
             are the most common solution, but other solutions such
            as suspended fabric wrapped panels or an acoustic
             spray treatment could also be considered.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -703.511,
              y: 52.212,
              z: -348.489,
            };
            const targetRotation = {
              x: 157.64,
              y: 185,
              z: 160.41,
            };
            const fieldOfView = 35.98;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['ceiling_highlighted'];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'acousticsPanel',
                'acousticPanel',
                'wall_default00',
                'wall_default01',
                'wall_highlighted00',
                'wall_highlighted01',
              ];
              let includedGroups = [];
              let excludedGroups = [
                'acousticsPanel_default',
                'acousticsPanel_highlighted',
              ];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'floor-treatment',
          title: 'Floor Treatment',
          heroImage: placeHolder,
          heroAltText: 'Floor Treatment',
          thumbnail: null,
          body: `Soft flooring, such as carpet or carpet tile, is the preferred floor finish for all meeting rooms. Hard floor finishes are a common culprit for poor acoustics in meeting spaces. Area rugs and soft furnishings should be considered in rooms where carpet is not feasible.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -352.93,
              y: 331.544,
              z: 523.604,
            };
            const targetRotation = {
              x: -29,
              y: -16.89,
              z: -13.69,
            };
            const fieldOfView = 35.98;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [
                'floor_highlighted',
                'wall_default01',
                'acousticPanel_default',
              ];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'ceiling_highlighted',
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel_highlighted',
              ];
              let includedGroups = ['acousticsPanel_default'];
              let excludedGroups = ['acousticsPanel_highlighted'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Noise',
      slug: 'background-noise',
      icon: `${imagesPath}/acoustics/icons/icon_noise_blue_01.svg`,
      '3dModel': `${modelsPath}/acoustics/StandardRoomB_Acoustics.gltf`,
      cards: [
        {
          id: 'true-voice',
          title: 'TrueVoice',
          heroImage: placeHolder,
          heroAltText: 'TrueVoice',
          thumbnail: null,
          body: `
            Ensuring good acoustic properties in the room is still the backbone for achieving an audible, and successful meeting room. The Series One hardware does go a step further utilising Google AI and onboard tensor processing units. TrueVoice (Multi-channel noise cancellation) eliminates distracting noises from anywhere in the room, even from multiple sources.
          `,
          hint: null,
          link: {
            label: 'Take a look at TrueVoice noise cancellation in action here',
            url: 'https://www.youtube.com/watch?v=zDU7r9NsD4o',
          },
          hintIcon: SectionImages.acoustics.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -321.419,
              y: 148.999,
              z: -166.41,
            };
            const targetRotation = {
              x: -81.53,
              y: 120.74,
              z: -100.53,
            };
            const fieldOfView = 40.98;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_acoustics_reverb_sorryWhatWasThat'];
              let excludedMeshes = [
                'anno_acoustics_noise_targetRTTime',
                'anno_acoustics_noise_backgroundNoise',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_default00',
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel_highlighted',
              ];
              let included3DObjects = ['acousticPanel_default'];
              let excluded3DObjects = [];
              let includedGroups = [];
              let excludedGroups = ['acousticPanel_highlighted'];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.name, included3DObjects)) {
                object.visible = true;
              }
              if (contains(object.name, excluded3DObjects)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'background-noise',
          title: 'Background Noise',
          heroImage: placeHolder,
          heroAltText: 'Background Noise',
          thumbnail: null,
          body: `Speech intelligibility is key for a good meeting room environment,
           to ensure easy communication. Aside from reverberation, a low background
            noise is another key ingredient to good speech intelligibility.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -504.662,
              y: 163.576,
              z: -602.216,
            };
            const targetRotation = {
              x: -178.14,
              y: 110.97,
              z: -179.27,
            };
            const fieldOfView = 35.43;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = ['anno_acoustics_noise_backgroundNoise'];
              let excludedMeshes = [
                'anno_acoustics_reverb_sorryWhatWasThat',
                'anno_acoustics_noise_targetRTTime',
                'floor_highlighted',
                'ceiling_highlighted',
                'wall_highlighted00',
                'wall_highlighted01',
                'acousticPanel',
                'wall_default00',
                'wall_default01',
              ];
              let included3DObjects = [];
              let excluded3DObjects = ['acousticsPanel_default'];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'small-and-medium-rooms',
          title: 'Small & Medium Rooms',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_noise_01_smallandmediumrooms.svg`,
          heroAltText: 'Small & Medium Rooms',
          thumbnail: null,
          body: `A noise criterion rating of <b>NC 30</b> is recommended for small and medium sized rooms.`,
          hint: `Background noise is measured by using single number rating (In this case
             NC rating) that describes the steady state background noise levels within a space due to
            mechanical, electrical and plumbing systems. The lower the rating the quieter the room.
             This criteria will most directly inform the design of the mechanical services system.`,
          hintIcon: SectionImages.acoustics.icons.hintIcon,
          updateModel: null,
        },
        {
          id: 'larger-rooms',
          title: 'Larger Rooms',
          heroImage: `${imagesPath}/acoustics/primary-media/acoustics_noise_01_largerrooms.svg`,
          heroAltText: 'Larger rooms',
          thumbnail: null,
          body: `A noise criterion rating of <b>NC 25</b> is recommended for larger sized rooms.`,
          updateModel: null,
        },
      ],
    },
  ],
  services: [
    {
      title: 'Introduction',
      slug: 'introduction',
      icon: SectionImages.services.icons.sectionIcon,
      cards: [
        {
          id: 'introduction',
          title: 'Introduction',
          heroImage: SectionImages.services.contentPreviewHero,
          heroAltText: 'introduction image',
          thumbnail: null,
          body: `Make sure power is provisioned for the right places,
          and ensure ventilation systems don't cause unwanted noise pickup on your microphones.`,
        },
      ],
    },
    {
      title: 'Air Handling',
      slug: 'air-handling',
      icon: `${imagesPath}/services/icons/icon_ducts-air-handling_purple_01.svg`,
      '3dModel': `${modelsPath}/services/StandardRoomA_Services.gltf`,
      cards: [
        {
          id: 'equipment',
          title: 'Mechanical Equipment',
          heroImage: placeHolder,
          heroAltText: 'Mechanical Equipment',
          thumbnail: null,
          body: `
            While dependent on the size of the equipment and individual constraints, aim to allow for the following distances from HVAC units (Heating, Ventilation and Air conditioning units) to diffusers in the meeting room:
            <br /><br />Variable air volume systems -
            <br /><b>4.5m (15') from unit to first diffuser.</b>
            <br /><br />Fan Coil unit systems -<br />
            <br /><b>6m (20') from unit to first diffuser.</b>
          `,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 640.4,
              y: 101,
              z: 0,
            };
            const targetRotation = {
              x: -50,
              y: 130,
              z: 0,
            };
            const fieldOfView = 30;

            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
                'acousticPanel',
              ];
              let excludedMeshes = [
                'curtain',
                'glazing',
                'curtainRail',
                'anno_services_powerAndCabling_diffuserLocations',
                'anno_services_powerAndCabling_mAndELoad',
                'anno_services_powerAndCabling_cableRoutes',
                'anno_services_powerAndCabling_power',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'ventilation-rates',
          title: 'Ventilation Rates',
          heroImage: placeHolder,
          heroAltText: 'Ventilation Rates',
          thumbnail: `${imagesPath}/services/secondary-media/services_ductsandairhandling_02_air_velocity.svg`,
          body: `Consider air velocities and diffuser selection to minimise noise from HVAC systems as much as possible. Cost is always a factor, but ensuring a low background noise in meeting rooms will massively help the speech intelligibility in the room.`,
          hint: `We recommend an increase from the ASHRAE 62.1 rates. 30 Cubic feet per metre of outside air per person should be provided to conferencing rooms.`,
          hintIcon: SectionImages.services.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 640.4,
              y: 101,
              z: 221,
            };
            const targetRotation = {
              x: 30,
              y: 150,
              z: 0,
            };

            const fieldOfView = 30;

            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
              ];
              let excludedMeshes = [
                'anno_services_powerAndCabling_diffuserLocations',
                'anno_services_powerAndCabling_mAndELoad',
                'anno_services_powerAndCabling_cableRoutes',
                'anno_services_powerAndCabling_power',
                'glazing',
                'curtain',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'thermal-control',
          title: 'Thermal Control',
          heroImage: placeHolder,
          heroAltText: 'Thermal Control',
          thumbnail: null,
          body: `Providing local temperature control to the room is useful to ensure occupants remain comfortable, irrespective of surrounding conditions.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -106.9,
              y: 165.2,
              z: 509,
            };
            const targetRotation = {
              x: 0,
              y: 170,
              z: 0,
            };

            const fieldOfView = 30;

            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (!['Mesh', 'Object3D'].includes(object.type)) {
                return;
              }

              let includedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
                'glazing',
                'curtain',
                'curtainRail',
              ];
              let excludedMeshes = [
                'anno_services_powerAndCabling_diffuserLocations',
                'anno_services_powerAndCabling_mAndELoad',
                'anno_services_powerAndCabling_cableRoutes',
                'anno_services_powerAndCabling_power',
                'acousticPanel00',
                'acousticPanel04',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'diffuser-locations',
          title: 'Diffuser Locations',
          heroImage: placeHolder,
          heroAltText: 'Diffuser Locations',
          thumbnail: `${imagesPath}/services/secondary-media/services_ductsandairhandling_02_diffuser_locations.svg`,
          body: `Avoid locating intake or extract (supply/return) ductwork above or near sensitive conferencing microphones. Unwanted noise from air flow on microphones can cause disruptive noise on the video call.`,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: 280,
              y: 237,
              z: 240,
            };
            const targetRotation = {
              x: 20,
              y: 120,
              z: 0,
            };
            const fieldOfView = 30;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [
                'anno_services_powerAndCabling_diffuserLocations',
              ];
              let excludedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
                'anno_services_powerAndCabling_mAndELoad',
                'anno_services_powerAndCabling_cableRoutes',
                'anno_services_powerAndCabling_power',
                'glazing',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
      ],
    },
    {
      title: 'Power & Cabling',
      slug: 'power-cabling',
      icon: `${imagesPath}/services/icons/icon_power-cabling_purple_01.svg`,
      '3dModel': `${modelsPath}/services/StandardRoomA_Services.gltf`,
      cards: [
        {
          id: 'power',
          title: 'Power over ethernet',
          heroImage: placeHolder,
          heroAltText: 'Power over ethernet',
          thumbnail: `${imagesPath}/services/secondary-media/services_powerandcabling_02_power.svg`,
          body: `
            Using the Series One meeting room kits, only the Meet Compute System requires
            AC power, other system components are connected using the included,
            color-coded ethernet cables to reduce clutter, cost, and installation time.
            An Add-on Audio Bar and additional Mic Pods are daisy chained to make expanding
            the system as easy as possible. Don't forget that other devices in the room may
            still need power such as the display screens.
          `,
          hint: `
            You may also want to consider power to the table for convenience outlets
            feeding users laptops and devices.
          `,
          hintIcon: SectionImages.services.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -300,
              y: 124,
              z: -32.9,
            };
            const targetRotation = {
              x: 200,
              y: 50,
              z: -310,
            };

            const fieldOfView = 32.5;

            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );
            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['anno_services_powerAndCabling_power'];
              let excludedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
                'anno_services_powerAndCabling_mAndELoad',
                'anno_services_powerAndCabling_cableRoutes',
                'anno_services_powerAndCabling_diffuserLocations',
                'acousticPanel',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'heat-load',
          title: 'Heat load',
          heroImage: placeHolder,
          heroAltText: 'Heat load',
          thumbnail: null,
          body: `
            Typical maximum equipment load for dual screen rooms
            <br>- 0.5kW / 1705 BTU/h
          `,
          hint: `
            This estimate does not account for occupancy heat load, and peak heat load
            may be greater than this for short periods of time.
          `,
          hintIcon: SectionImages.services.icons.hintIcon,
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -96,
              y: 165,
              z: 246.5,
            };
            const targetRotation = {
              x: 0,
              y: 110,
              z: 0,
            };
            const fieldOfView = 36;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = ['anno_services_powerAndCabling_mAndELoad'];
              let excludedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
                'anno_services_powerAndCabling_power',
                'anno_services_powerAndCabling_cableRoutes',
                'anno_services_powerAndCabling_diffuserLocations',
                'acousticPanel',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'cable-routes',
          title: 'Cable routes',
          heroImage: placeHolder,
          heroAltText: 'Cable routes',
          thumbnail: null,
          body: `
            Don't forget to consider cable routes, especially where they might be visible
            or cause a trip hazard! most setups using Google Meet Hardware kits will need
            a cable route considered between the table and the screens. Achieving a concealed
            route via the wall or a cabinet below the screens will help keep the install
            neat. If the table doesn't stretch to the wall, then also don't forget a route
            over, or even better, under the floor.
          `,
          link: {
            label:
              'If using the Logitech room solutions, take a look on the Logitech site for more guidance on cabling requirements.',
            url: 'https://www.logitech.com/product/google-rooms',
          },
          updateModel: (
            currentCamera: THREE.PerspectiveCamera,
            scene: THREE.Scene
          ) => {
            const targetPosition = {
              x: -427,
              y: 136,
              z: -31.9,
            };
            const targetRotation = {
              x: 0,
              y: 90,
              z: -140,
            };
            const fieldOfView = 36;
            tweenCamera(
              currentCamera,
              targetPosition,
              targetRotation,
              fieldOfView
            );

            scene.traverse(object => {
              if (object.type !== 'Mesh') {
                return;
              }

              let includedMeshes = [
                'anno_services_powerAndCabling_cableRoutes',
              ];
              let excludedMeshes = [
                'anno_services_airHandling_mechanicalEquipment',
                'anno_services_powerAndCabling_power',
                'anno_services_powerAndCabling_mAndELoad',
                'anno_services_powerAndCabling_diffuserLocations',
                'acousticPanel',
              ];
              let includedGroups = [];
              let excludedGroups = [];

              if (contains(object.name, includedMeshes)) {
                object.visible = true;
              }
              if (contains(object.name, excludedMeshes)) {
                object.visible = false;
              }
              if (contains(object.parent.name, includedGroups)) {
                object.visible = true;
              }
              if (contains(object.parent.name, excludedGroups)) {
                object.visible = false;
              }
            });
          },
        },
        {
          id: 'cable-types',
          title: 'Cable types',
          heroImage: `${imagesPath}/services/primary-media/Services_power_infrastructure.png`,
          heroAltText: 'Cable types',
          thumbnail: null,
          body: `
            When using the Series One equipment remember that it benefits from upgrading to CAT5
            cabling and PoE from the Meet Compute system for all devices. This is important to
            consider especially if you are upgrading from an install with USB based devices and cabling.
          `,
          hint: `
            For the ASUS and Logitech bundles, we recommend using the cables included; however,
            we realize that doesn't cover all room types so please use the approved cables from the
            Google Help Center.
          `,
          hintIcon: SectionImages.services.icons.hintIcon,
          updateModel: null,
        },
      ],
    },
  ],
};

export const Sections: Section[] = [
  {
    slug: 'camera-and-audio',
    title: 'Camera & Audio',
    icon: SectionImages.cameraAndAudio.icons.sectionIcon,
    children: Subsections['camera-and-audio'],
  },
  {
    slug: 'displays-and-extras',
    title: 'Displays & Extras',
    icon: SectionImages.displaysAndExtras.icons.sectionIcon,
    children: Subsections['displays-and-extras'],
  },
  {
    slug: 'room-layout',
    title: 'Room Layout',
    icon: SectionImages.roomLayout.icons.sectionIcon,
    children: Subsections['room-layout'],
  },
  {
    slug: 'furniture-lighting',
    title: 'Furniture & Lighting',
    icon: SectionImages.furnitureLighting.icons.sectionIcon,
    children: Subsections['furniture-lighting'],
  },
  {
    slug: 'acoustics',
    title: 'Acoustics',
    icon: SectionImages.acoustics.icons.sectionIcon,
    children: Subsections['acoustics'],
  },
  {
    slug: 'services',
    title: 'Services',
    icon: SectionImages.services.icons.sectionIcon,
    children: Subsections['services'],
  },
];
