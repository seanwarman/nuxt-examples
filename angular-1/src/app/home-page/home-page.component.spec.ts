import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { MockFooterComponent } from '../utils/test-utils.spec';
import { MockContentHotspotDrawerComponent } from '../utils/test-utils.spec';
import { HomepageModelComponent } from '../utils/test-utils.spec';
import { Component } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-content-preview-tab-group',
  template: '<p></p>',
})
export class MockContentPreviewTabGroupComponent {}

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageComponent,
        MockContentPreviewTabGroupComponent,
        MockFooterComponent,
        MockContentHotspotDrawerComponent,
        HomepageModelComponent,
      ],
      imports: [MaterialDesignModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
