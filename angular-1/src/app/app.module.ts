import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import 'hammerjs';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MaterialDesignModule } from './material-design/material-design.module';
import { RoomPlannerModule } from './room-planner/room-planner.module';
import { CuberModule } from './cuber/cuber.module';
import { SectionsModule } from './sections/sections.module';
import { HomePageModule } from './home-page/home-page.module';
import { SubsectionComponent } from './sections/subsection/subsection.component';
import { SectionComponent } from './sections/section/section.component';
import { HttpClientModule } from '@angular/common/http';
import { WindowService } from './window.service';

declare var Hammer: any;

export class HammerConfig extends GestureConfig {
  buildHammer(element: HTMLElement) {
    return new GestureConfig({ touchAction: 'pan-y' }).buildHammer(element);
  }
}

@NgModule({
  declarations: [AppComponent, HeaderNavComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    LayoutModule,
    MatCarouselModule,
    MaterialDesignModule,
    RoomPlannerModule,
    CuberModule,
    SectionsModule,
    HomePageModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
    WindowService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [SectionComponent, SubsectionComponent],
})
export class AppModule {}
