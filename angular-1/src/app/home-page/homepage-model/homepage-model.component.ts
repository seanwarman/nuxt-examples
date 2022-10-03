import {
  Component,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import GLTFLoader from 'three-gltf-loader';
//import GLTFExporter from 'three-gltf-exporter';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import '../../utils/three-outline-shader';
import { UpdateModel, Vector } from '../../sections/section';
import { GoogleAnalyticsService } from '../../google-analytics.service';
import OrbitControls from 'three-orbitcontrols';
import { HotspotData } from '../../../data/homepage-hotspot-data';
import { Observable } from 'rxjs';

console.dir('@FILTER THREE: ', THREE)

@Component({
  selector: 'app-homepage-model',
  templateUrl: './homepage-model.component.html',
  styleUrls: ['./homepage-model.component.scss'],
})
export class HomepageModelComponent implements OnInit, OnChanges, OnDestroy {
  @Output() hotspotEvent = new EventEmitter<string>();
  @Input() selectedHotspot: string;
  @ViewChild('canvas')
  private canvasRef: ElementRef;
  public start: string;

  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  private modelScene: THREE.Scene;
  private animationFrameInt: number;

  public scene: THREE.Scene;
  public effect: THREE.OutlineEffect;
  public fieldOfView: number = 45;
  public nearClippingPane: number = 10;
  public farClippingPane: number = 3000;

  public axesHelper: THREE.AxesHelper = new THREE.AxesHelper(1000000);
  public mouse: THREE.Vector2 = new THREE.Vector2(1, 1);
  public finger: THREE.Vector2 = new THREE.Vector2(1, 1);
  public raycaster: THREE.Raycaster = new THREE.Raycaster();
  public mobileRaycaster: THREE.Raycaster = new THREE.Raycaster();
  public orbitControls: OrbitControls;

  public defaultIcons: Array<THREE.Sprite> = [];
  public interimIcons: Array<THREE.Sprite> = [];
  public activeIcons: Array<THREE.Sprite> = [];
  public halos: Array<THREE.Sprite> = [];
  public pulses: Array<THREE.Sprite> = [];
  public labels: Array<THREE.Sprite> = [];
  public intersectedHotspot: string = '';
  public highlightedHotspot: string = '';
  public activeHotspot: string = '';
  public haloPulsing: boolean = false;
  public pulsePulsing: boolean = false;

  public camStartPosition: Array<number> = [-54, 270, 614];
  public camStartRotation: Array<number> = [0, 120, 0];
  public labelCenterXStart: number = -0.1;
  public labelCenterXEnd: number = -0.18;
  public labelCenterYStart: number = 0.68;
  public labelCenterYEnd: number = 0.68;

  public hotspotModelGroups: Array<string> = [
    'RoomLayout',
    'CameraAndAudio',
    'DisplaysAndExtras',
    'FurnitureAndLighting',
    'Acoustics',
    'services',
    'Drawing',
    //'acousticPanel00',
    //'acousticPanel01',
    //'acousticPanel02',
    //'acousticPanel03',
    // 'stripLight00',
    // 'stripLight01'
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
  }> = HotspotData;

  public loading = false;

  @Input() sectionTitle: string;

  @Input()
  public modelPath: string;

  @Input()
  public updateModel: UpdateModel;

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
    const sceneChildren = gltf.scene.children;
    for (var i = 0; i < sceneChildren.length; i++) {
      if (sceneChildren[i].name.startsWith('anno')) {
        sceneChildren[i].visible = false;
      }
    }

    const modelScene = gltf.scene;
    this.modelScene = modelScene;
    this.scene.add(modelScene);
    this.removeExcludedModels();
    //this.scene.add(this.axesHelper);

    this.loading = false;
    this.canvas.style.position = 'static';
    this.createCamera();
    this.createHotspots(this.hotspotData);
    this.createMouseEventListeners();
    this.updateModel && this.updateModel(this.camera, this.modelScene);
    this.startRendering();
  }

  private setLight(light: THREE.AmbientLight, position: Vector) {
    const { x, y, z } = position;
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  private createLight() {
    this.setLight(new THREE.AmbientLight(0xffffff, 0.6), {
      x: 0,
      y: 140,
      z: 0,
    });
    this.setLight(new THREE.PointLight(0xffffff, 0.7, 2000), {
      x: 0,
      y: 240,
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

  public removeExcludedModels() {
    let excludedModels = [
      'acousticPanel006',
      'acousticPanel007',

      ...this.hotspotModelGroups,
    ];
    this.modelScene.traverse(object => {
      if (excludedModels.includes(object.name)) {
        object.visible = false;
      }
    });
  }

  public tween(
    property: any,
    endValue: object,
    duration: number,
    onCompleteFunction?: any
  ) {
    var tween = new TWEEN.Tween(property)
      .to(endValue, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(function() {
        if (onCompleteFunction) onCompleteFunction();
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
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = spriteWidth;
    canvas.height = spriteHeight;
    context.font = `6.25rem googleSansRegular`;

    // create rounded rectangle
    var x = 0;
    var y = 0;
    var horizontalPadding = 50;
    var verticalPadding = 45;
    var borderRadius = { tl: 20, tr: 20, bl: 20, br: 20 };
    var textWidth = context.measureText(hotspot.text).width;
    var width = textWidth + horizontalPadding * 2;
    var height = 160;
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
    }>
  ) {
    hotspotData.forEach(hotspot => {
      // create pulse
      var pulse = this.createImageSprite(
        `interim-icons/${hotspot.interimIcon}`
      );
      pulse.position.set(hotspot.x, hotspot.y, hotspot.z);
      pulse.name = hotspot.name;
      this.pulses.push(pulse);

      // create halo
      var halo = this.createImageSprite(`halos/${hotspot.halo}`);
      halo.scale.set(20, 20, 1);
      halo.position.set(hotspot.x, hotspot.y, hotspot.z);
      halo.material.opacity = 0;
      halo.name = hotspot.name;
      this.halos.push(halo);

      // create interim icon
      var interimIcon = this.createImageSprite(
        `interim-icons/${hotspot.interimIcon}`
      );
      interimIcon.scale.set(20, 20, 1);
      interimIcon.material.map.minFilter = THREE.LinearFilter;
      interimIcon.position.set(hotspot.x, hotspot.y, hotspot.z);
      interimIcon.name = hotspot.name;
      this.interimIcons.push(interimIcon);

      // create default icon
      var defaultIcon = this.createImageSprite(
        `default-icons/${hotspot.defaultIcon}`
      );
      defaultIcon.scale.set(20, 20, 1);
      defaultIcon.position.set(hotspot.x, hotspot.y, hotspot.z);
      defaultIcon.name = hotspot.name;
      this.defaultIcons.push(defaultIcon);

      // create active icon
      var activeIcon = this.createImageSprite(
        `active-icons/${hotspot.activeIcon}`
      );
      activeIcon.scale.set(20, 20, 1);
      activeIcon.position.set(hotspot.x, hotspot.y, hotspot.z);
      activeIcon.material.opacity = 0;
      activeIcon.name = hotspot.name;
      this.activeIcons.push(activeIcon);

      // create label (sprite dimensions kept to power of two to meet WebGLRenderer specs)
      var spriteWidth = 1024;
      var spriteHeight = 256;
      var labelTexture = new THREE.Texture(
        this.createLabelCanvas(hotspot, spriteWidth, spriteHeight)
      );
      labelTexture.needsUpdate = true;
      var label = new THREE.Sprite(
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

  public transitionCameraAndHotspots(hotspot: any) {
    let tweenDuration = 1500;

    // tween camera position and rotation
    this.tween(
      this.camera.position,
      {
        x: hotspot.cameraPosition.x,
        y: hotspot.cameraPosition.y,
        z: hotspot.cameraPosition.z,
      },
      tweenDuration
    );
    this.tween(
      this.orbitControls.target,
      {
        x: hotspot.cameraRotation.x,
        y: hotspot.cameraRotation.y,
        z: hotspot.cameraRotation.z,
      },
      tweenDuration
    );
    // tween scene rotation
    this.tween(
      this.scene.rotation,
      {
        x: this.scene.rotation.x,
        y: 0,
        z: this.scene.rotation.z,
      },
      tweenDuration
    );
    // tween default icon opacity
    this.defaultIcons.forEach(defaultIcon => {
      if (defaultIcon.name === this.activeHotspot) {
        this.tween(defaultIcon.material, { opacity: 0 }, 300);
      } else if (defaultIcon.material.opacity === 0) {
        this.tween(defaultIcon.material, { opacity: 1 }, 300);
      }
    });
    // tween active icon opacity
    this.activeIcons.forEach(activeIcon => {
      if (activeIcon.name === this.activeHotspot) {
        setTimeout(
          () => this.tween(activeIcon.material, { opacity: 1 }, 300),
          300
        );
      } else if (activeIcon.material.opacity !== 0) {
        this.tween(activeIcon.material, { opacity: 0 }, 300);
      }
    });
    // tween label opacity
    this.labels.forEach(label => {
      if (label.name === this.activeHotspot) {
        this.tween(label.material, { opacity: 0 }, 500);
      }
    });
  }

  public resetCameraAndScenePosition() {
    let tweenDuration = 800;
    this.activeHotspot = '';
    this.hotspotEvent.emit('');
    this.tween(
      this.camera.position,
      {
        x: this.camStartPosition[0],
        y: this.camStartPosition[1],
        z: this.camStartPosition[2],
      },
      tweenDuration
    );
    this.tween(
      this.orbitControls.target,
      {
        x: this.camStartRotation[0],
        y: this.camStartRotation[1],
        z: this.camStartRotation[2],
      },
      tweenDuration
    );
    this.tween(
      this.scene.rotation,
      {
        x: this.scene.rotation.x,
        y: 0,
        z: this.scene.rotation.z,
      },
      tweenDuration
    );

    this.modelScene.traverse(object => {
      if (
        object.name.includes('acousticPanel') &&
        object.material.opacity !== 0
      ) {
        object.material = object.material.clone();
        object.material.transparent = true;
        this.tween(
          object.material,
          { opacity: 0 },
          tweenDuration,
          () => (object.visible = false)
        );
      }
      if (object.name.includes('stripLight') && object.material.opacity === 0) {
        object.material = object.material.clone();
        object.material.transparent = true;
        object.visible = true;
        this.tween(object.material, { opacity: 1 }, tweenDuration);
      }
    });
  }

  public transitionModels(hotspot: any) {
    let tweenDuration = 800;

    this.modelScene.traverse(object => {
      // fade out old models
      if (
        hotspot.modelsOff.includes(object.name) ||
        (this.hotspotModelGroups.includes(object.name) &&
          !hotspot.modelsOn.includes(object.name))
      ) {
        if (object.type !== 'Mesh') {
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
            if (child.type === 'Object3D' || child.type === 'Group') {
              child.children.forEach(mesh => {
                mesh.material = mesh.material.clone();
                mesh.material.transparent = true;
                this.tween(
                  mesh.material,
                  { opacity: 0 },
                  tweenDuration,
                  () => (child.visible = false)
                );
              });
            }
          });
        } else {
          object.material = object.material.clone();
          object.material.transparent = true;
          this.tween(
            object.material,
            { opacity: 0 },
            tweenDuration,
            () => (object.visible = false)
          );
        }
      }
      // fade in new models
      if (hotspot.modelsOn.includes(object.name)) {
        if (object.type !== 'Mesh') {
          object.visible = true;
          object.children.forEach(child => {
            if (child.type === 'Mesh' && child.material.opacity === 0) {
              child.material = child.material.clone();
              child.material.transparent = true;
              child.material.opacity = 0;
              this.tween(child.material, { opacity: 1 }, tweenDuration);
            }
            if (child.type === 'Object3D' || child.type === 'Group') {
              child.visible = true;
              child.children.forEach(mesh => {
                if (mesh.material.opacity === 0) {
                  mesh.material = mesh.material.clone();
                  mesh.material.transparent = true;
                  mesh.material.opacity = 0;
                  this.tween(mesh.material, { opacity: 1 }, tweenDuration);
                }
              });
            }
          });
        } else {
          object.material = object.material.clone();
          object.material.transparent = true;
          object.material.opacity = 0;
          object.visible = true;
          this.tween(object.material, { opacity: 1 }, tweenDuration);
        }
      }

      if (
        object.name.includes('stripLight') &&
        !object.visible &&
        hotspot.name !== 'acoustics'
      ) {
        object.material = object.material.clone();
        object.material.transparent = true;
        object.material.opacity = 0;
        object.visible = true;
        this.tween(object.material, { opacity: 1 }, tweenDuration);
      }
    });
  }

  public createMouseEventListeners() {
    const self = this;
    var mouseDown: boolean = false;
    var dragged: boolean = false;

    function onMouseDown(e) {
      mouseDown = true;
    }

    function onTouchStart(e) {
      // hold the touch start position
      this.start = e.touches[0];

      // clear the position after 2000 mil (could be set for less).
      setTimeout(() => {
        this.start = null;
      }, 2000);
      mouseDown = true;
    }

    function onMouseMove(e) {
      if (mouseDown === true) dragged = true;
      let rect = self.canvas.getBoundingClientRect();
      self.mouse.x =
        ((e.clientX - rect.left) / self.canvas.clientWidth) * 2 - 1;
      self.mouse.y =
        -((e.clientY - rect.top) / self.canvas.clientHeight) * 2 + 1;
    }

    function onTouchMove(e) {
      if (e.changedTouches[0].pageX) {
        const end = e.changedTouches[0],
          dx = Math.pow(this.start.pageX - end.pageX, 2),
          dy = Math.pow(this.start.pageY - end.pageY, 2),
          distance = Math.round(Math.sqrt(dx + dy));

        if (distance <= 20) {
          return;
        }
      }
      if (mouseDown === true) dragged = true;
      let rect = self.canvas.getBoundingClientRect();
      self.mouse.x =
        ((e.clientX - rect.left) / self.canvas.clientWidth) * 2 - 1;
      self.mouse.y =
        -((e.clientY - rect.top) / self.canvas.clientHeight) * 2 + 1;
    }

    function onMouseUp() {
      mouseDown = false;
      if (self.intersectedHotspot.length) {
        self.activeHotspot = self.intersectedHotspot;
        self.hotspotEvent.emit(self.activeHotspot);
        self.hotspotData.forEach(hotspot => {
          if (hotspot.name === self.activeHotspot) {
            self.transitionCameraAndHotspots(hotspot);
            self.transitionModels(hotspot);
          }
        });
      } else {
        if (!dragged) {
          self.resetCameraAndScenePosition();
        }
        dragged = false;
      }
    }
    function onTouchEnd(e) {
      if (!dragged) {
        let rect = self.canvas.getBoundingClientRect();
        self.finger.x =
          ((e.changedTouches[0].clientX - rect.left) /
            self.canvas.clientWidth) *
            2 -
          1;
        self.finger.y =
          -(
            (e.changedTouches[0].clientY - rect.top) /
            self.canvas.clientHeight
          ) *
            2 +
          1;
        self.mobileRaycaster.setFromCamera(self.finger, self.camera);
        let mobileIntersects = self.mobileRaycaster.intersectObjects(
          self.defaultIcons
        );
        if (mobileIntersects.length > 0) {
          self.activeHotspot = mobileIntersects[0].object.name;
          self.hotspotEvent.emit(self.activeHotspot);
          self.hotspotData.forEach(hotspot => {
            if (hotspot.name === self.activeHotspot) {
              self.transitionCameraAndHotspots(hotspot);
              self.transitionModels(hotspot);
            }
          });
        } else {
          self.resetCameraAndScenePosition();
        }
      }
      dragged = false;
    }

    this.canvas.addEventListener('mousemove', onMouseMove, false);
    this.canvas.addEventListener('mousedown', onMouseDown, false);
    this.canvas.addEventListener('mouseup', onMouseUp, false);
    this.canvas.addEventListener('touchmove', onTouchMove, false);
    this.canvas.addEventListener('touchstart', onTouchStart, false);
    this.canvas.addEventListener('touchend', onTouchEnd, false);
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
            var self = this;
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
          var self = this;
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
    this.orbitControls.minZoom = 50;
  }

  public startRendering() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      gammaOutput: true,
      gammaFactor: 2.2,
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

    const component: HomepageModelComponent = this;

    (function render() {
      if (!component.activeHotspot.length) {
        component.scene.rotation.y += 0.0005;
      }
      component.orbitControls.update();
      component.handleIntersects();
      component.animationFrameInt = requestAnimationFrame(render);
      component.render();
      TWEEN.update();
    })();
  }

  public render() {
    const canvas = this.renderer.domElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
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

  ngOnInit(): void {
    this.selectedHotspot = 'loaded';
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { modelPath, updateModel, selectedHotspot } = changes;

    if (modelPath && modelPath.currentValue !== modelPath.previousValue) {
      // Load new model
      this.load();
      return;
    }

    if (updateModel && updateModel.currentValue) {
      // Update model after switching cards
      updateModel.currentValue(this.camera, this.modelScene);
    }

    if (selectedHotspot && selectedHotspot.currentValue === '') {
      this.resetCameraAndScenePosition();
      this.activeHotspot = '';
    } else {
      this.activeHotspot = selectedHotspot.currentValue;
      this.hotspotData.forEach(hotspot => {
        if (hotspot.name === selectedHotspot.currentValue) {
          this.transitionCameraAndHotspots(hotspot);
          this.transitionModels(hotspot);
        }
      });
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameInt);
  }
}
