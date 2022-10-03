import * as THREE from 'three';

abstract class AbstractSection {
  slug: string;
  title: string;
  icon: string;
}

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export type UpdateModel = (
  currentCamera: THREE.PerspectiveCamera,
  scene: THREE.Scene
) => void;

export interface Card {
  id: string;
  title: string;
  heroImage: string;
  heroAltText: string;
  thumbnail: string;
  icon?: string;
  body: string;
  hint?: string;
  hintLink?: object;
  hintIcon?: string;
  infoImage?: string;
  updateModel?: UpdateModel;
  link?: object;
}

export interface Subsection extends AbstractSection {
  cards: Card[];
  '3dModel'?: string;
}

export interface Section extends AbstractSection {
  children: Subsection[];
}
