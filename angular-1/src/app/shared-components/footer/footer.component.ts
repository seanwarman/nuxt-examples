import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SystemImages } from 'src/assets/images';
import { AppService, NavLink } from '../../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() footerWidth;
  appSubscription: Subscription;
  navLinks: NavLink[];
  googleImage: string;
  charcoalImage: string;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.googleImage = SystemImages.footerImages.googleCloud;
    this.charcoalImage = SystemImages.footerImages.charcoalBlue;
    this.appSubscription = this.appService
      .getNavLinks()
      .subscribe(s => (this.navLinks = s));
  }

  ngOnDestroy(): void {
    this.appSubscription.unsubscribe();
  }

  isFullWidth(): boolean {
    return this.footerWidth === 'full';
  }
}
