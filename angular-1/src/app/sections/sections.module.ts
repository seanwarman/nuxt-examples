import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubsectionComponent } from './subsection/subsection.component';
import { CardComponent } from './card/card.component';
import { SectionComponent } from './section/section.component';
import { SubsectionNavComponent } from './subsection-nav/subsection-nav.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { AppRoutingModule } from '../app-routing.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    AppRoutingModule,
    SharedComponentsModule,
    LayoutModule,
  ],
  declarations: [
    SubsectionComponent,
    CardComponent,
    SectionComponent,
    SubsectionNavComponent,
  ],
  exports: [
    SubsectionComponent,
    CardComponent,
    SectionComponent,
    SubsectionNavComponent,
  ],
})
export class SectionsModule {}
