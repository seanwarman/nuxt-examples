import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MaterialDesignModule } from './material-design/material-design.module';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-nav',
  template: '<ng-content fixedInViewport="false"></ng-content>',
})
class HeaderNavStubComponent {}

describe('AppComponent', () => {
  let router: Router;
  let config: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialDesignModule],
      declarations: [AppComponent, HeaderNavStubComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    router = TestBed.get(Router);
    config = spyOn(router, 'config').and.returnValue([]);

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should register dynamic routes', () => {
    expect(router.config.map(r => r.path)).toEqual([
      'services',
      'acoustics',
      'furniture-lighting',
      'room-layout',
      'displays-and-extras',
      'camera-and-audio',
    ]);
  });
});
