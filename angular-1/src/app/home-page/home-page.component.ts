import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SystemImages } from 'src/assets/images';
import { MatDrawer } from '@angular/material';
import { HomepageModelComponent } from './homepage-model/homepage-model.component';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  downloadIcon: string;
  footerWidth: string;
  public openedDraw = '';
  public display = 'flex';
  @ViewChild('drawer') public sidedraw: MatDrawer;
  @ViewChild('header') public headerContainer: ViewChild;
  @ViewChild(HomepageModelComponent) child: HomepageModelComponent;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.setViewHeight();
  }
  isDesktop: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 959px)')
    .pipe(map(result => result.matches));

  public isDesktopView = this.isDesktop.subscribe(
    event => (this.isDesktopView = event)
  );

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setViewHeight();
  }

  public setViewHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  ngOnInit() {
    this.footerWidth = 'full';
    this.openedDraw = 'loaded';
    this.downloadIcon = SystemImages.homeImages.downloadIcon;
    this.setViewHeight();
  }

  hotspotEvent(event) {
    this.openedDraw = event;
    if (this.openedDraw === '') {
      this.sidedraw.close();
    } else if (!this.isDesktopView) {
      setTimeout(() => {
        this.sidedraw.open();
      }, 1000);
    } else {
      this.sidedraw.open();
    }
    return event;
  }

  transitionEnd(e: Event) {
    if (this.openedDraw !== '') {
      this.display = 'none';
    }
  }

  transitionStart(e: Event) {
    if (this.openedDraw === '') {
      this.display = 'flex';
    }
  }
}
