import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Sections } from '../data/sections';
import { ContentPreview, contentPreviews } from '../data/content-previews';

export interface NavLink {
  title: string;
  slug: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private themeSource: Subject<string> = new Subject<string>();

  public currentTheme$ = this.themeSource.asObservable();

  setCurrentTheme(name: string) {
    this.themeSource.next(name);
  }

  getNavLinks(): Observable<Array<NavLink>> {
    const sectionLinks = Sections.map(s => ({
      title: s.title,
      slug: `/${s.slug}`,
    }));
    const roomPlannerLink = {
      title: 'Room Designer',
      slug: '/room-planner',
    };
    const navLinks = [...sectionLinks, roomPlannerLink];

    return of(navLinks);
  }

  getNavTabs(): Observable<Array<ContentPreview>> {
    return of(contentPreviews);
  }
}
