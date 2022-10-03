import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import GLTFExporter from 'three-gltf-exporter';
import { Component, OnInit } from '@angular/core';

const exporter = new GLTFExporter();
const loader = new GLTFLoader();

@Component({
  selector: 'app-cuber',
  templateUrl: './cuber.component.html',
  styleUrls: ['./cuber.component.scss'],
})
export class CuberComponent implements OnInit {
  ngOnInit() {
    loader.load(
      '../../assets/3dModels/cubing/RoomDesigner.gltf',
      this.run(this.cuber)
    );
  }

  public run(cuber) {
    return ({ scene }) => {
      cuber(scene, /_Chair/, '#95eaea');
      cuber(scene, /^Falcon-Lite$|^FalconLite$/, '#ef6969');
      cuber(scene, /^Falcon-XL/, '#b5ef69');
      cuber(scene, /^FalconTvMount/, '#5f7ded');
      cuber(scene, /^Viking|\d\dViking/, '#a45fed');
      cuber(scene, /_Houston/, '#edd65f');
      cuber(scene, /_Voyager/, '#5fed99');

      exporter.parse(
        scene,
        gltf => console.log('gltf: ', gltf),
        error => console.error(error)
      );
    };
  }

  public cuber(scene, search, color) {
    const items = [];
    const dimensions = 0.1;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(dimensions, dimensions, dimensions),
      new THREE.MeshBasicMaterial({ color })
    );

    scene.add(cube);
    scene.traverse(o => search.test(o.name) && items.push(o));
    items.forEach(c => {
      const newCube = cube.clone();
      newCube.name = '__cubed__' + search + '--' + c.name;
      newCube.position.set(c.position.x, c.position.y, c.position.z);
      newCube.rotation.set(c.rotation.x, c.rotation.y, c.rotation.z);
      c.parent.add(newCube);
      c.parent.remove(c);
    });
  }
}
