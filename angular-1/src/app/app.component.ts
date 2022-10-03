import { Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { AppService } from './app.service';
import { delay, startWith, tap } from 'rxjs/operators';
import { Route, Router, NavigationEnd } from '@angular/router';
import { Sections } from '../data/sections';
import { SubsectionComponent } from './sections/subsection/subsection.component';
import { SectionComponent } from './sections/section/section.component';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { GoogleAnalyticsService } from './google-analytics.service';
import { WindowService } from './window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
@NgModule({
  providers: [GoogleAnalyticsService, WindowService],
})
export class AppComponent implements OnInit, OnDestroy {
  themeSubscription: Subscription;
  currentTheme: string;
  sidenavService: Subscription;
  constructor(private router: Router, private appService: AppService) {
    // Instantiates Google Tag Manager using an environment variable.
    // Analytics account is setup at GTAG.
    const script = document.createElement('script');
    script.async = true;
    script.innerText = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${environment.gtagID}')`;
    document.head.prepend(script);

    // Add the sections paths dynamically
    const redirectToIntroduction: Array<Route> = [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'introduction',
      },
    ];
    for (const section of Sections) {
      const childPaths = section.children.map(sub => ({
        path: sub.slug,
        component: SubsectionComponent,
      }));

      this.router.config.unshift({
        path: section.slug,
        component: SectionComponent,
        data: { slug: section.slug },
        children: redirectToIntroduction.concat(childPaths),
      });
    }
  }

  ngOnInit() {
    this.themeSubscription = this.appService.currentTheme$
      .pipe(
        startWith(''),
        delay(0),
        tap(theme => (this.currentTheme = theme))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
