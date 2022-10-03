import {
  Component,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import GLTFLoader from 'three-gltf-loader';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import '../../utils/three-outline-shader';
import { UpdateModel, Vector } from '../../sections/section';
import { GoogleAnalyticsService } from '../../google-analytics.service';
import OrbitControls from 'three-orbitcontrols';
import { HotspotData } from '../../../data/room-designer-hotspot-data';

@Component({
  selector: 'app-three-d-room-planner',
  templateUrl: './three-d-room-planner.component.html',
  styleUrls: ['./three-d-room-planner.component.scss'],
})
export class ThreeDRoomPlannerComponent implements OnChanges, OnDestroy {
  @Input() public sectionTitle: string;
  @Input() public modelPath: string;
  @Input() public updateModel: UpdateModel;
  @Input() public specification: any;
  @Output() hotspotEvent = new EventEmitter<string>();
  @Output() onModelLoaded = new EventEmitter<boolean>();
  @ViewChild('canvas')
  private canvasRef: ElementRef;

  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  private modelScene: THREE.Scene;
  private animationFrameInt: number;

  public scene: THREE.Scene;
  public effect: THREE.OutlineEffect;
  public fieldOfView = 45;
  public nearClippingPane = 10;
  public farClippingPane = 3000;

  public axesHelper: THREE.AxesHelper = new THREE.AxesHelper(1000000);
  public mouse: THREE.Vector2 = new THREE.Vector2(1, 1);
  public raycaster: THREE.Raycaster = new THREE.Raycaster();
  public orbitControls: OrbitControls;

  public defaultIcons: Array<THREE.Sprite> = [];
  public interimIcons: Array<THREE.Sprite> = [];
  public activeIcons: Array<THREE.Sprite> = [];
  public halos: Array<THREE.Sprite> = [];
  public pulses: Array<THREE.Sprite> = [];
  public labels: Array<THREE.Sprite> = [];
  public intersectedHotspot = '';
  public highlightedHotspot = '';
  public activeHotspot = '';
  public haloPulsing = false;
  public pulsePulsing = false;

  public camStartPosition: Array<number> = [-550, 400, 500];
  public camStartRotation: Array<number> = [-125, 100, 0];
  public labelCenterXStart = -0.1;
  public labelCenterXEnd = -0.18;
  public labelCenterYStart = 0.68;
  public labelCenterYEnd = 0.68;

  public root: THREE.Object3D;
  public sideWallXOffset = 0;
  public sideWallSkirtingBoardXOffset = 0;
  public screenWallZOffset = 0;
  public screenWallSkirtingBoardZOffset = 0;
  public floorXOffset = 0;
  public floorZOffset = 0;
  public roomZOffset = 0;
  public exludeModels = [
    'room3AddJam_Floor',
    'room4AddJam_Floor',
    'room5AddJam_Floor',
    'room6AddJam_Floor',
    'room6AddJam_SideSkirtingBoard',
    'room6AddJam_SideWall',
    'room7AddJam_Floor',
    'room8AddJam_Floor',
    'room9AddJam_Floor',
    'room10AddJam_Floor',
    'room11AddJam_Floor',
    'room12AddJam_Floor',
    'room13AddJam_Floor',
    'room14AddJam_Floor',
    'room16AddJam_Floor',
    'room18AddJam_Floor',
    'room20AddJam_Floor',
  ];
  public visibleModels: Array<string> = [
    'room4_AcousticPanel001',
    'room4_AcousticPanel002',
    'Room4TablesAndChairs',
    'Single48',
    'singleLiteSetupA',
  ];

  public hotspotData: Array<{
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
    camX: number;
    camY: number;
    camZ: number;
  }> = HotspotData;

  public loading = false;

  constructor(
    private elementRef: ElementRef,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.render = this.render.bind(this);
    this.onModelLoadingCompleted = this.onModelLoadingCompleted.bind(this);
    this.sectionTitle;
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private createScene() {
    this.scene = new THREE.Scene();
    const loader = new GLTFLoader();
    loader.load(
      this.modelPath,
      this.onModelLoadingCompleted,
      (event: ProgressEvent) => {
        this.loading = true;
        this.canvas.style.position = 'absolute';
      }
    );
  }

  private onModelLoadingCompleted(gltf) {
    this.modelScene = gltf.scene;
    this.scene.add(this.modelScene);
    this.root = this.modelScene.children[0].children[0];

    this.hideAllButVisibleModelsFromRoot();
    this.hideExcludedModels();
    this.buildNewModels();

    this.loading = false;
    this.canvas.style.position = 'static';

    //     this.updateModel && this.updateModel(this.camera, this.modelScene);
    this.createCamera();
    this.startRendering();
    this.onModelLoaded.emit();
  }

  private setLight(light: THREE.AmbientLight, position: Vector) {
    const { x, y, z } = position;
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  private createLight() {
    this.setLight(new THREE.AmbientLight(0xffffff, 0.65), {
      x: 0,
      y: 0,
      z: 0,
    });
    this.setLight(new THREE.PointLight(0xffffff, 0.4), {
      x: -208.602,
      y: 206.415,
      z: 0,
    });
  }

  private createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.set(...this.camStartPosition);
  }

  private getAspectRatio(): number {
    const height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.elementRef.nativeElement.offsetHeight;
  }

  public trackClick(value: string) {
    this.googleAnalyticsService.eventEmitter(
      '3d_interaction_click',
      null,
      value
    );
  }

  public hideExcludedModels() {
    this.root.traverse(o => {
      if (this.exludeModels.includes(o.name)) o.visible = false;
    });
  }

  public hideAllButVisibleModelsFromRoot() {
    this.root.children.forEach(object => {
      if (!this.visibleModels.includes(object.name)) {
        object.visible = false;
      }
      object.children.forEach(child => {
        if (this.visibleModels.includes(child.name)) {
          object.visible = true;
          object.children.forEach(c => {
            if (c.name.includes('AcousticPanel')) {
              c.visible = true;
            } else {
              c.visible = false;
            }
          });
        }
      });
    });
  }

  public replaceCube(name: string, masterModel: any, cube: any, parent: any) {
    const newModel = masterModel.clone();
    newModel.visible = true;
    newModel.position.set(cube.position.x, cube.position.y, cube.position.z);
    newModel.rotation.set(cube.rotation.x, cube.rotation.y, cube.rotation.z);
    newModel.name = `${name}-from-${cube.name}`;
    parent.add(newModel);
    parent.remove(cube);
  }

  public swapCubeForSearch(cube: any, searchPattern: any) {
    const masterObj = this.root.children.find(object =>
      searchPattern.test(object.name)
    );
    if (!masterObj) {
      console.log('Error, no master object found for: ', searchPattern);
      return;
    }
    this.replaceCube(
      cube.name.slice(cube.name.indexOf('--') + 2),
      masterObj,
      cube,
      cube.parent
    );
  }

  public buildNewModels() {
    // create master room
    const room3 = this.root.children.filter(
      object => object.name === 'Room3'
    )[0];
    const masterRoom = room3.clone();
    masterRoom.visible = true;
    masterRoom.name = 'masterRoom';
    const acousticPanels = masterRoom.children.filter(mesh =>
      mesh.name.includes('AcousticPanel')
    );
    masterRoom.remove(...acousticPanels);
    this.root.add(masterRoom);

    const cubes = this.root.children.reduce((acc, child) => {
      const children = child.children.filter(c => /__cubed__/.test(c.name));
      if (children.length) {
        return [...acc, ...children];
      }
      return acc;
    }, []);

    cubes.forEach(cube => {
      if (/__cubed___Chair/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceChair$/g);
      }
      // TODO fix these names
      // Sorry this is my fault, I renamed the cubes using part of the regex I
      // used to find the original objects, which is why some of these have
      // escaped "^" symbols, just to know this isn't deliberate :)
      if (/__cubed__\^Falcon-Lite/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceFalconLite$/g);
      }
      if (/__cubed__\^Falcon-XL/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceFalconXL$/g);
      }
      if (/__cubed__\^FalconTvMount/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceFalconTvMount$/g);
      }
      if (/__cubed__\^Viking/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceViking$/g);
      }
      if (/__cubed___Houston/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceHouston$/g);
      }
      if (/__cubed___Voyager/.test(cube.name)) {
        return this.swapCubeForSearch(cube, /^referenceVoyager$/g);
      }
    });

    this.root.children.forEach(object => {
      // color acoustic acousticPanels
      const masterPanel = room3.children.filter(
        child => child.name === 'room3_AcousticPanel001'
      )[0];
      const masterPanelMaterial = masterPanel.material.clone();
      this.modelScene.traverse(object2 => {
        if (
          object2.name.includes('AcousticPanel') &&
          !object2.name.includes('room3')
        ) {
          object2.material = masterPanelMaterial;
        }
      });
    });
  }

  public tween(
    property: any,
    endValue: object,
    duration: number,
    onCompleteFunction?: any
  ) {
    const tween = new TWEEN.Tween(property)
      .to(endValue, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(function() {
        if (onCompleteFunction) {
          onCompleteFunction();
        }
      });
    tween.start();
  }

  public createImageSprite(imagePath: string) {
    return new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load(
          `assets/icons/hotspot-icons/${imagePath}`
        ),
        depthWrite: false,
      })
    );
  }

  public createLabelCanvas(
    hotspot: any,
    spriteWidth: number,
    spriteHeight: number
  ) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = spriteWidth;
    canvas.height = spriteHeight;
    context.font = `80px googleSansRegular`;

    // create rounded rectangle
    const x = 0;
    const y = 0;
    const horizontalPadding = 50;
    const verticalPadding = 45;
    const borderRadius = { tl: 20, tr: 20, bl: 20, br: 20 };
    const textWidth = context.measureText(hotspot.text).width;
    const width = textWidth + horizontalPadding * 2;
    const height = 160;
    context.beginPath();
    context.moveTo(x + borderRadius.tl, y);
    context.lineTo(x + width - borderRadius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + borderRadius.tr);
    context.lineTo(x + width, y + height - borderRadius.br);
    context.quadraticCurveTo(
      x + width,
      y + height,
      x + width - borderRadius.br,
      y + height
    );
    context.lineTo(x + borderRadius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - borderRadius.bl);
    context.lineTo(x, y + borderRadius.tl);
    context.quadraticCurveTo(x, y, x + borderRadius.tl, y);
    context.closePath();
    context.fillStyle = hotspot.color;
    context.fill();

    // create text
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = 'white';
    context.fillText(hotspot.text, horizontalPadding, verticalPadding);

    return canvas;
  }

  public createHotspots(
    hotspotData: Array<{
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
      camX: number;
      camY: number;
      camZ: number;
    }>
  ) {
    hotspotData.forEach(hotspot => {
      // create pulse
      const pulse = this.createImageSprite(
        `interim-icons/${hotspot.interimIcon}`
      );
      pulse.position.set(hotspot.x, hotspot.y, hotspot.z);
      pulse.name = hotspot.name;
      this.pulses.push(pulse);

      // create halo
      const halo = this.createImageSprite(`halos/${hotspot.halo}`);
      halo.scale.set(20, 20, 1);
      halo.position.set(hotspot.x, hotspot.y, hotspot.z);
      halo.material.opacity = 0;
      halo.name = hotspot.name;
      this.halos.push(halo);

      // create interim icon
      const interimIcon = this.createImageSprite(
        `interim-icons/${hotspot.interimIcon}`
      );
      interimIcon.scale.set(20, 20, 1);
      interimIcon.position.set(hotspot.x, hotspot.y, hotspot.z);
      interimIcon.name = hotspot.name;
      this.interimIcons.push(interimIcon);

      // create default icon
      const defaultIcon = this.createImageSprite(
        `default-icons/${hotspot.defaultIcon}`
      );
      defaultIcon.scale.set(20, 20, 1);
      defaultIcon.position.set(hotspot.x, hotspot.y, hotspot.z);
      defaultIcon.name = hotspot.name;
      this.defaultIcons.push(defaultIcon);

      // create active icon
      const activeIcon = this.createImageSprite(
        `active-icons/${hotspot.activeIcon}`
      );
      activeIcon.scale.set(20, 20, 1);
      activeIcon.position.set(hotspot.x, hotspot.y, hotspot.z);
      activeIcon.material.opacity = 0;
      activeIcon.name = hotspot.name;
      this.activeIcons.push(activeIcon);

      // create label (sprite dimensions kept to power of two to meet WebGLRenderer specs)
      const spriteWidth = 1024;
      const spriteHeight = 256;
      const labelTexture = new THREE.Texture(
        this.createLabelCanvas(hotspot, spriteWidth, spriteHeight)
      );
      labelTexture.needsUpdate = true;
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: labelTexture,
          depthWrite: false,
        })
      );
      label.position.set(hotspot.x, hotspot.y, hotspot.z);
      label.scale.set(spriteWidth / 10, spriteHeight / 10, 1);
      label.center.set(this.labelCenterXEnd, this.labelCenterYEnd);
      label.name = hotspot.name;
      label.visible = false;
      this.labels.push(label);
    });

    this.scene.add(...this.pulses);
    this.scene.add(...this.halos);
    this.scene.add(...this.defaultIcons);
    this.scene.add(...this.interimIcons);
    this.scene.add(...this.activeIcons);
    this.scene.add(...this.labels);
  }

  public objectVisible(object) {
    if (object.visible && !object.material) {
      return true;
    }
    if (object.visible && object.material) {
      return object.material.opacity === 1;
    }
    return object.visible;
  }

  public transitionModels(models: Array<string>) {
    const tweenDuration = 500;
    let meshGroups = [];

    // find parent objects of included meshes and add to meshGroups (so not included in fade outs)
    this.modelScene.traverse(object => {
      if (
        object.type === 'Mesh' &&
        models.includes(object.name) &&
        object.name !== 'MeetUp'
      ) {
        meshGroups = [...meshGroups, object.parent.name];
      }
    });

    this.root.children.forEach(object => {
      // fade out all old objects except the master room, included models, and included meshGroups
      if (
        object.name !== 'masterRoom' &&
        !models.includes(object.name) &&
        !meshGroups.includes(object.name)
      ) {
        object.children.forEach(child => {
          if (child.type === 'Mesh') {
            child.material = child.material.clone();
            child.material.transparent = true;
            this.tween(
              child.material,
              { opacity: 0 },
              tweenDuration,
              () => (object.visible = false)
            );
          }
          // necissary for chair objects
          if (child.type === 'Object3D') {
            child.children.forEach(mesh => {
              if (!mesh.material) {
                return;
              }
              mesh.material = mesh.material.clone();
              mesh.material.transparent = true;
              this.tween(
                mesh.material,
                { opacity: 0 },
                tweenDuration,
                () => (object.visible = false)
              );
            });
          }
        });
      }

      // fade out MeetUp seperately to prevent conflicts due to being located in root
      if (object.name === 'MeetUp' && !models.includes(object.name)) {
        // console.log('ChromeBase: ', object);
        object.material = object.material.clone();
        object.material.transparent = true;
        this.tween(
          object.material,
          { opacity: 0 },
          tweenDuration,
          () => (object.visible = false)
        );
      }
    });

    setTimeout(() => {
      // room 1 has been updated in model in a funny way, this pulls in
      // a couple of models that get left behind...
      this.modelScene.traverse(object => {
        if (object.name === 'Chromebase1TablesAndChairs') {
          object.children.forEach(child => {
            if (
              child.name ===
              'chromebase1_Chair001-from-__cubed___Chair--chromebase1_Chair001'
            ) {
              child.children.forEach(mesh => {
                mesh.material = mesh.material.clone();
                mesh.material.transparent = true;
                mesh.material.opacity = 0;
                this.tween(mesh.material, { opacity: 1 }, tweenDuration);
              });
            } else if (child.name === 'BookSet004') {
              child.material = child.material.clone();
              child.material.transparent = true;
              child.material.opacity = 0;
              this.tween(child.material, { opacity: 1 }, tweenDuration);
            }
          });
        }

        // fade in new objects
        if (
          models.includes(object.name) &&
          !meshGroups.includes(object.name) &&
          object.name !== 'masterRoom' &&
          !this.objectVisible(object)
        ) {
          object.visible = true;

          // Fade in any root level objects (this is for some of the panels mainly)
          setTimeout(() => {
            if (object.material) {
              object.material = object.material.clone();
              object.material.transparent = true;
              object.material.opacity = 0;
              this.tween(object.material, { opacity: 1 }, tweenDuration);
            }
          }, tweenDuration);

          object.children.forEach(child => {
            if (child.type === 'Mesh') {
              child.material = child.material.clone();
              child.material.transparent = true;
              child.material.opacity = 0;
              this.tween(child.material, { opacity: 1 }, tweenDuration);
            }
            if (child.type === 'Object3D') {
              child.children.forEach(mesh => {
                mesh.material = mesh.material.clone();
                mesh.material.transparent = true;
                mesh.material.opacity = 0;
                this.tween(mesh.material, { opacity: 1 }, tweenDuration);
              });
            }
          });
          // fade in MeetUp seperately as located in root
          if (object.name === 'MeetUp') {
            object.material = object.material.clone();
            object.material.transparent = true;
            object.material.opacity = 0;
            object.visible = true;
            this.tween(object.material, { opacity: 1 }, tweenDuration);
          }
        }

        // fade in new meshes
        if (meshGroups.includes(object.name)) {
          setTimeout(() => {
            object.visible = true;
            object.children.forEach(child => {
              if (models.includes(child.name)) {
                if (
                  !this.visibleModels.includes(child.name) ||
                  (child.name === 'ChromeBase' && child.material.opacity === 0)
                ) {
                  child.material = child.material.clone();
                  child.material.transparent = true;
                  child.material.opacity = 0;
                  child.visible = true;
                  this.tween(child.material, { opacity: 1 }, tweenDuration);
                }
              }
            });
            this.visibleModels = models;
          }, tweenDuration);
        }
      });
    }, tweenDuration);
  }

  public transitionWalls(
    length: number,
    width: number,
    zOffset: number,
    xOffset: number
  ) {
    const tweenDuration = 1000;
    const masterRoom = this.root.children.filter(
      group => group.name === 'masterRoom'
    )[0];
    masterRoom.children.forEach(model => {
      if (model.name === 'room3_SideWall') {
        const scale = length / model.scale.x;
        const newWidth = model.scale.x * scale;
        const newXPosition = -(
          (model.scale.x / 2) * (scale - 1) -
          this.sideWallXOffset
        );
        this.sideWallXOffset = newXPosition;
        this.tween(
          model.scale,
          { x: newWidth, y: model.scale.y, z: model.scale.z },
          tweenDuration
        );
        this.tween(
          model.position,
          {
            x: newXPosition,
            y: model.position.y,
            z: model.position.z - (zOffset - this.roomZOffset),
          },
          tweenDuration
        );
      }
      if (model.name === 'room3_SideSkirtingBoard') {
        const scale = length / model.scale.x;
        const newWidth = model.scale.x * scale;
        const newXPosition = -(
          (model.scale.x / 2) * (scale - 1) -
          this.sideWallSkirtingBoardXOffset
        );
        this.sideWallSkirtingBoardXOffset = newXPosition;
        this.tween(
          model.scale,
          { x: newWidth, y: model.scale.y, z: model.scale.z },
          tweenDuration
        );
        this.tween(
          model.position,
          {
            x: newXPosition,
            y: model.position.y,
            z: model.position.z - (zOffset - this.roomZOffset),
          },
          tweenDuration
        );
      }
      if (model.name === 'room3_ScreenWall') {
        const scale = width / model.scale.x;
        const newWidth = model.scale.x * scale;
        const newZPosition =
          (model.scale.x / 2) * (scale - 1) + this.screenWallZOffset;
        this.screenWallZOffset = newZPosition;
        this.tween(
          model.scale,
          { x: newWidth, y: model.scale.y, z: model.scale.z },
          tweenDuration
        );
        this.tween(
          model.position,
          {
            x: model.position.x,
            y: model.position.y,
            z: newZPosition - zOffset,
          },
          tweenDuration
        );
      }
      if (model.name === 'room3_ScreenSkirtingBoard') {
        const scale = width / model.scale.x;
        const newWidth = model.scale.x * scale;
        const newZPosition =
          (model.scale.x / 2) * (scale - 1) +
          this.screenWallSkirtingBoardZOffset;
        this.screenWallSkirtingBoardZOffset = newZPosition;
        this.tween(
          model.scale,
          { x: newWidth, y: model.scale.y, z: model.scale.z },
          tweenDuration
        );
        this.tween(
          model.position,
          {
            x: model.position.x,
            y: model.position.y,
            z: newZPosition - zOffset,
          },
          tweenDuration
        );
      }
      if (model.name === 'room3_Floor') {
        const lengthScale = length / model.scale.x;
        const widthScale = width / model.scale.z;
        const newLength = model.scale.x * lengthScale;
        const newWidth = model.scale.z * widthScale;
        const newXPosition = -(
          (model.scale.x / 2) * (lengthScale - 1) -
          this.floorXOffset
        );
        const newZPosition =
          (model.scale.z / 2) * (widthScale - 1) + this.floorZOffset;
        this.floorXOffset = newXPosition;
        this.floorZOffset = newZPosition;
        this.tween(
          model.scale,
          { x: newLength, y: model.scale.y, z: newWidth },
          tweenDuration
        );
        this.tween(
          model.position,
          { x: newXPosition, y: model.position.y, z: newZPosition - zOffset },
          tweenDuration
        );
      }
    });
    this.roomZOffset = zOffset;
  }

  public transitionCamera(
    position: { x: number; y: number; z: number },
    rotation: { x: number; y: number; z: number }
  ) {
    const tweenDuration = 1000;
    this.tween(
      this.camera.position,
      {
        x: position.x,
        y: position.y,
        z: position.z,
      },
      tweenDuration
    );
    this.tween(
      this.orbitControls.target,
      {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
      },
      tweenDuration
    );
  }

  public createMouseEventListeners() {
    const self = this;
    let mouseDown = false;
    let dragged = false;

    function onMouseDown() {
      mouseDown = true;
    }

    function onMouseMove(e) {
      if (mouseDown === true) {
        dragged = true;
      }
      const rect = self.canvas.getBoundingClientRect();
      self.mouse.x =
        ((e.clientX - rect.left) / self.canvas.clientWidth) * 2 - 1;
      self.mouse.y =
        -((e.clientY - rect.top) / self.canvas.clientHeight) * 2 + 1;
    }

    function onMouseUp() {
      mouseDown = false;
      if (self.intersectedHotspot.length) {
        self.activeHotspot = self.intersectedHotspot;
      } else {
        // reset camera position and rotation
        if (!dragged) {
          self.activeHotspot = '';
          self.tween(
            self.camera.position,
            {
              x: self.camStartPosition[0],
              y: self.camStartPosition[1],
              z: self.camStartPosition[2],
            },
            800
          );
          self.tween(
            self.orbitControls.target,
            {
              x: self.camStartRotation[0],
              y: self.camStartRotation[1],
              z: self.camStartRotation[2],
            },
            800
          );
        }
        dragged = false;
      }
    }

    this.canvas.addEventListener('mousemove', onMouseMove, false);
    this.canvas.addEventListener('mousedown', onMouseDown, false);
    this.canvas.addEventListener('mouseup', onMouseUp, false);
  }

  public handleIntersects() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.defaultIcons);

    if (intersects.length > 0) {
      this.intersectedHotspot = intersects[0].object.name;
      // if hotspot not already highlighted, display label
      if (this.highlightedHotspot !== this.intersectedHotspot) {
        this.highlightedHotspot = this.intersectedHotspot;
        this.labels.forEach(label => {
          if (label.name === this.highlightedHotspot) {
            // tween label opacity
            label.material.opacity = 0;
            label.visible = true;
            this.tween(label.material, { opacity: 1 }, 800);
            // tween label position
            label.center.set(this.labelCenterXStart, this.labelCenterYStart);
            this.tween(
              label.center,
              { x: this.labelCenterXEnd, y: this.labelCenterYEnd },
              500
            );
          } else {
            label.visible = false;
          }
        });
      }
      // if hotspot not already pulsing, start pulse
      if (!this.pulsePulsing) {
        this.pulsePulsing = true;
        this.pulses.forEach(pulse => {
          if (pulse.name === this.highlightedHotspot) {
            // tween pulse scale
            pulse.scale.set(20, 20, 1);
            this.tween(pulse.scale, { x: 35, y: 35, z: 1 }, 800);
            // tween pulse opacity
            pulse.material.opacity = 0.5;
            const self = this;
            this.tween(
              pulse.material,
              { opacity: 0 },
              800,
              () => (self.pulsePulsing = false)
            );
          }
        });
      }
    } else {
      this.intersectedHotspot = '';
    }

    // if hotspot active and halo not already pulsing, start halo pulse loop
    if (this.activeHotspot.length && !this.haloPulsing) {
      this.haloPulsing = true;
      this.halos.forEach(halo => {
        if (halo.name === this.activeHotspot) {
          const self = this;
          halo.material.opacity = 1;
          halo.scale.set(20, 20, 1);
          // loop halo scale
          this.tween(halo.scale, { x: 35, y: 35, z: 1 }, 800, () => {
            self.tween(
              halo.scale,
              { x: 20, y: 20, z: 1 },
              800,
              () => (self.haloPulsing = false)
            );
          });
        }
      });
    }
  }

  public createOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.maxDistance = 2000;
    this.orbitControls.target.set(...this.camStartRotation);
  }

  public startRendering() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      gammaOutput: true,
      gammaFactor: 2.2,
      // logarithmicDepthBuffer: true
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.elementRef.nativeElement.offsetHeight
    );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = true;
    // custom shader
    this.effect = new THREE.OutlineEffect(this.renderer, {
      defaultThickness: 0.003,
      defaultColor: [0, 0, 0],
      defaultAlpha: 0.2,
      defaultKeepAlive: true,
    });

    cancelAnimationFrame(this.animationFrameInt);

    this.createOrbitControls();

    // transition to selected specifications
    this.transitionWalls(
      this.specification.minRoomSize.length,
      this.specification.minRoomSize.width,
      this.specification.zOffset,
      this.specification.xOffset
    );
    this.transitionModels([
      ...this.specification.includedModels,
      ...this.specification.screen,
    ]);
    this.transitionCamera(
      {
        x: this.specification.camPosition.x,
        y: this.specification.camPosition.y,
        z: this.specification.camPosition.z,
      },
      {
        x: this.specification.camRotation.x - 70,
        y: this.specification.camRotation.y + 50,
        z: this.specification.camRotation.y - 20,
      }
    );

    const component = this;

    (function render() {
      component.orbitControls.update();
      component.handleIntersects();
      component.animationFrameInt = requestAnimationFrame(render);
      component.render();
      TWEEN.update();
    })();
  }

  public render() {
    this.effect.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.camera.aspect = 1;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.elementRef.nativeElement.offsetHeight
    );
    this.render();
  }

  load() {
    this.createScene();
    this.createLight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { modelPath, updateModel, specification } = changes;

    if (specification && !specification.firstChange) {
      const path = specification.currentValue;
      this.transitionModels([...path.includedModels, ...path.screen]);
      this.transitionWalls(
        path.minRoomSize.length,
        path.minRoomSize.width,
        path.zOffset,
        path.xOffset
      );
      this.transitionCamera(
        { x: path.camPosition.x, y: path.camPosition.y, z: path.camPosition.z },
        { x: path.camRotation.x, y: path.camRotation.y, z: path.camRotation.z }
      );
    }

    if (modelPath && modelPath.currentValue !== modelPath.previousValue) {
      // Load new model
      this.load();

      return;
    }

    if (updateModel && updateModel.currentValue) {
      // Update model after switching cards
      updateModel.currentValue(this.camera, this.modelScene);
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameInt);
  }
}
