import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryMediaComponent } from './primary-media/primary-media.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { FileSizePipe } from './file-size.pipe';
import { ThreejsModelComponent } from './threejs-model/threejs-model.component';

@NgModule({
  imports: [CommonModule, MaterialDesignModule, RouterModule],
  declarations: [
    PrimaryMediaComponent,
    ThreejsModelComponent,
    FooterComponent,
    PageNotFoundComponent,
    FileSizePipe,
  ],
  exports: [
    PrimaryMediaComponent,
    ThreejsModelComponent,
    FooterComponent,
    PageNotFoundComponent,
    FileSizePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedComponentsModule {}
