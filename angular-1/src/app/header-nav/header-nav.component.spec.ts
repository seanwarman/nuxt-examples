import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderNavComponent } from './header-nav.component';
import { WindowService } from '../window.service';
import { of } from 'rxjs';

describe('HeaderNavComponent', () => {
  let component: HeaderNavComponent;
  let fixture: ComponentFixture<HeaderNavComponent>;

  const breakPointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

  const observibleTrue = breakPointSpy.observe.and.returnValue(
    of({ match: true })
  );
  const observibleFalse = breakPointSpy.observe.and.returnValue(
    of({ match: false })
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderNavComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MaterialDesignModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: breakPointSpy,
        },
        WindowService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderNavComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should display top tabs on desktop', () => {
    component.isHandset = observibleFalse;
    component.isDesktop = observibleTrue;

    const header: HTMLElement = fixture.nativeElement;
    const sideNav = header.querySelector('mat-sidenav');
    const topNav = header.querySelector('nav');

    expect(topNav.getAttribute('class')).toContain('hidden');
    expect(sideNav.getAttribute('class')).not.toContain('hidden');
  });

  it('should display sidenav on mobile', () => {
    component.isHandset = observibleTrue;
    component.isDesktop = observibleFalse;
    const header: HTMLElement = fixture.nativeElement;
    const sideNav = header.querySelector('mat-sidenav');
    const topNav = header.querySelector('nav');

    expect(sideNav.getAttribute('class')).not.toContain('hidden');
    expect(topNav.getAttribute('class')).toContain('hidden');
  });
});
