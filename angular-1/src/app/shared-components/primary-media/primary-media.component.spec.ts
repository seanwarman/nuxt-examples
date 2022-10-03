import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockThreejsModel } from '../../utils/test-utils.spec';

import { PrimaryMediaComponent } from './primary-media.component';
import { MaterialDesignModule } from '../../material-design/material-design.module';

const primaryImageValue = {
  src: 'assets/images/castle/4person_@1200.png',
  altText: 'primary Image',
};
const secondaryImage = {
  src: 'assets/images/demo/4person_@1200_jamboard.png',
  altText: 'secondary Image',
};
const selectedPrimaryImage = {
  defaultSrc: 'assets/images/castle/4person_@1200.png',
  altText: 'primary Image',
  smImagePath: 'assets/images/castle/4person_@300.png',
  mdImagePath: 'assets/images/castle/4person_@600.png',
  lgImagePath: 'assets/images/castle/4person_@960.png',
};
const selectedSecondaryImage = {
  defaultSrc: 'assets/images/demo/4person_@1200_jamboard.png',
  altText: 'secondary Image',
  smImagePath: 'assets/images/demo/4person_@300_jamboard.png',
  mdImagePath: 'assets/images/demo/4person_@600_jamboard.png',
  lgImagePath: 'assets/images/demo/4person_@960_jamboard.png',
};

describe('PrimaryMediaComponent', () => {
  let component: PrimaryMediaComponent;
  let fixture: ComponentFixture<PrimaryMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrimaryMediaComponent, MockThreejsModel],
      imports: [MaterialDesignModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly process default image path', () => {
    expect(
      PrimaryMediaComponent.getRendition(
        'assets/images/castle/4person_@1200.png',
        '300'
      )
    ).toEqual('assets/images/castle/4person_@300.png');

    expect(
      PrimaryMediaComponent.getRendition(
        'assets/images/castle/4person_@1200.jpg',
        '300'
      )
    ).toEqual('assets/images/castle/4person_@300.jpg');
  });

  it('should properly fall back if no renditions found', () => {
    expect(
      PrimaryMediaComponent.getRendition(
        'assets/images/castle/4person.jpg',
        '300'
      )
    ).toEqual('assets/images/castle/4person.jpg');
  });
  it('should select an image passed', () => {
    expect(component.selectedImage).toEqual(undefined);

    component.selectImage(primaryImageValue);

    expect(component.selectedImage).toEqual(selectedPrimaryImage);
  });

  it('should toggle selected images', () => {
    component.primaryImageValue = primaryImageValue;
    component.secondaryImage = secondaryImage;

    component.selectImage(primaryImageValue);
    component.toggleImages();

    expect(component.selectedImage).toEqual(selectedSecondaryImage);
  });
});
