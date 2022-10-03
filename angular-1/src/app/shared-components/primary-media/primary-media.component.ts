import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SystemImages } from 'src/assets/images';

export interface Image {
  src: string;
  altText: string;
}

@Component({
  selector: 'app-primary-media',
  templateUrl: './primary-media.component.html',
  styleUrls: ['./primary-media.component.scss'],
})
export class PrimaryMediaComponent implements OnInit, OnChanges {
  @Input() primaryImageValue: Image;
  @Input() secondaryImage?: Image;

  toggleIcon: string;
  isVr: boolean;

  selectedImage: {
    defaultSrc: string;
    altText: string;
    smImagePath: string;
    mdImagePath: string;
    lgImagePath: string;
  };

  static getRendition(defaultImage: string, size: string): string {
    const sizeRegex = /(.*_@)(\d*?)(_.*|)(\.jpg|.png)/g;

    if (defaultImage.match(sizeRegex)) {
      return defaultImage.replace(sizeRegex, `$1${size}$3$4`);
    }

    return defaultImage;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const {
      primaryImageValue: { currentValue },
    } = changes;

    if (currentValue) {
      this.selectImage(currentValue);
    }
  }

  ngOnInit() {
    this.toggleIcon = SystemImages.primaryMedia.toggleIcon;
    this.isVr = false;
  }

  selectImage(image: Image): void {
    const smImagePath = PrimaryMediaComponent.getRendition(image.src, '300');
    const mdImagePath = PrimaryMediaComponent.getRendition(image.src, '600');
    const lgImagePath = PrimaryMediaComponent.getRendition(image.src, '960');

    this.selectedImage = {
      defaultSrc: image.src,
      altText: image.altText,
      smImagePath,
      mdImagePath,
      lgImagePath,
    };
  }

  toggleImages(): void {
    this.selectedImage.defaultSrc === this.primaryImageValue.src
      ? (this.selectImage(this.secondaryImage), (this.isVr = true))
      : (this.selectImage(this.primaryImageValue), (this.isVr = false));
  }
}
