import { Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService, NavLink } from '../app.service';
import { SystemImages } from 'src/assets/images';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { WindowService, CustomWindow } from '../window.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent implements OnInit, OnDestroy {
  navLinksSubscription: Subscription;
  navLinks: Array<NavLink> = [];
  headerLogo: string;
  contactSalesUrl: string =
    'https://gsuite.google.com/contact-form/hangouts-meet-hardware/';

  isHandset: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  isDesktop: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 1052px)')
    .pipe(map(result => result.matches));

  private _window: CustomWindow;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private appService: AppService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private windowRef: WindowService
  ) {
    this._window = this.windowRef.nativeWindow;
  }

  ngOnInit() {
    this.getNavSections();
    this.headerLogo = SystemImages.headerImages.googleCloud;
  }

  trackInteraction() {
    this.googleAnalyticsService.eventEmitter('main_contact_sales', null, null);
    this._window.location.href = this.contactSalesUrl;
  }

  getNavSections() {
    this.navLinksSubscription = this.appService.getNavLinks().subscribe(
      s => (this.navLinks = s),
      error => console.log(error) // TODO: add proper error handling
    );

    return this.navLinks;
  }

  ngOnDestroy() {
    this.navLinksSubscription.unsubscribe();
  }
}
