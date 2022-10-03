export class VrModel {
  room: room;
  vrObjects: vrObject[];
  vrHotspots: vrHotspot[];
}
export class room {
  name: string;
  modelSrc: string;
  position: string;
  scale: string;
  rotation: string;
}

export class vrObject {
  name: string;
  modelSrc: string;
  position: string;
  scale: string;
  rotation: string;
}

export class vrHotspot {
  name: string;
  color: string;
  position: string;
  scale: string;
  rotation: string;
}
