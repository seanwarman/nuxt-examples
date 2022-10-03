import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared-components/page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RoomPlannerComponent } from './room-planner/room-planner.component';
import { CuberComponent } from './cuber/cuber.component';

// static routes (the dynamic are defined in the AppComponent)
export const routes: Routes = [
  // Lazily loaded modules
  {
    path: 'room-planner',
    component: RoomPlannerComponent,
  },
  {
    path: 'downloads',
    loadChildren: './downloads/downloads.module#DownloadsModule',
  },
  {
    path: 'email-collection',
    loadChildren:
      './email-collection/email-collection.module#EmailCollectionModule',
  },
  {
    path: 'cuber',
    component: CuberComponent,
  },
  { path: '', component: HomePageComponent },
  { path: '**', component: PageNotFoundComponent },
];
