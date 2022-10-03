import {
  Component,
  ElementRef,
  HostListener,
  Input,
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

@Component({
  selector: 'app-threejs-model',
  templateUrl: './threejs-model.component.html',
  styleUrls: ['./threejs-model.component.scss'],
})
export class ThreejsModelComponent implements OnChanges, OnDestroy {
  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private modelScene: THREE.Scene;
  private animationFrameInt: number;

  public scene: THREE.Scene;
  public effect: THREE.OutlineEffect;
  public fieldOfView = 45;
  public nearClippingPane = 10;
  public farClippingPane = 1600;

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

    // var axesHelper = new THREE.AxesHelper(1000000);
    // this.scene.add(axesHelper);

    this.loading = false;
    this.canvas.style.position = 'static';
    this.createCamera();
    this.updateModel && this.updateModel(this.camera, this.modelScene);
    this.startRendering();
  }

  private setLight(light: THREE.AmbientLight, position: Vector) {
    const { x, y, z } = position;
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  private createLight() {
    this.setLight(new THREE.AmbientLight(0xffffff, 0.6), { x: 0, y: 0, z: 0 });
    this.setLight(new THREE.PointLight(0xffffff, 0.4, 2000), {
      x: 0,
      y: 240,
      z: 0,
    });
    this.setLight(new THREE.PointLight(0xffffff, 0.4, 2000), {
      x: 0.58,
      y: 194,
      z: -435,
    });
    this.setLight(new THREE.PointLight(0xffffff, 0.4, 2000), {
      x: 713,
      y: 247,
      z: 0,
    });
    this.setLight(new THREE.PointLight(0xffffff, 0.4, 2000), {
      x: 262,
      y: 0,
      z: -794,
    });
  }

  private createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPane,
      this.farClippingPane
    );

    // Set position and look at
    this.camera.position.x = 0;
    this.camera.position.y = 150;
    this.camera.position.z = 250;

    this.camera.lookAt(new THREE.Vector3(0, 45, 0));
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

    const component: ThreejsModelComponent = this;

    (function render() {
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
    const { modelPath, updateModel } = changes;

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
