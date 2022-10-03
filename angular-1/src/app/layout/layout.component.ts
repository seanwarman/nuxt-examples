import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  isDesktop: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 959px)')
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {
    this.setViewHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setViewHeight();
  }
  ngOnInit() {
    this.setViewHeight();
  }

  public setViewHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  ngAfterViewInit() {}
}
