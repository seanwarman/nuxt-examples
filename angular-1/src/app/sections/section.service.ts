import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Section, Subsection } from './section';
import { Sections, Subsections } from '../../data/sections';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private currentSubsectionSource = new Subject<Subsection>();
  public currentSubsection$ = this.currentSubsectionSource.asObservable();

  constructor() {}

  getSection(slug: string): Observable<Section> {
    let section: Section | undefined;

    section = Sections.find(s => s.slug === slug);

    if (!section) {
      return throwError('Section not found');
    }

    return of(section);
  }

  getSubsection(parentSlug: string, slug: string) {
    let subsection: Subsection | undefined;

    subsection = Subsections[parentSlug].find(s => s.slug === slug);

    if (!subsection) {
      return throwError('Subsection not found');
    }

    this.currentSubsectionSource.next(subsection);
  }
}
