import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ContentHotspotDrawerComponent } from './content-hotspot-drawer.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ContentHotspotDrawerComponent', () => {
  let component: ContentHotspotDrawerComponent;
  let fixture: ComponentFixture<ContentHotspotDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialDesignModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [ContentHotspotDrawerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentHotspotDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
