import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPreviewTabGroupComponent } from './content-preview-tab-group.component';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ContentPreviewTabGroupComponent', () => {
  let component: ContentPreviewTabGroupComponent;
  let fixture: ComponentFixture<ContentPreviewTabGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialDesignModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [ContentPreviewTabGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPreviewTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
