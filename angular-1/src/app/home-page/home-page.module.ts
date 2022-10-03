import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { ContentPreviewTabGroupComponent } from './content-preview-tab-group/content-preview-tab-group.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomepageModelComponent } from './homepage-model/homepage-model.component';
import { ContentHotspotDrawerComponent } from './content-hotspot-drawer/content-hotspot-drawer.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MaterialDesignModule,
    SharedComponentsModule,
    RouterModule,
    FlexLayoutModule,
  ],
  declarations: [
    ContentPreviewTabGroupComponent,
    HomepageModelComponent,
    ContentHotspotDrawerComponent,
    HomePageComponent,
  ],
})
export class HomePageModule {}
