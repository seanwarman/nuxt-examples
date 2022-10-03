import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subsection } from '../section';
import { SubsectionService } from '../subsection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subsection-nav',
  templateUrl: './subsection-nav.component.html',
  styleUrls: ['./subsection-nav.component.scss'],
})
export class SubsectionNavComponent implements OnInit, OnDestroy {
  subsectionSubscription: Subscription;
  @Input() sectionName: string;
  @Input() subsections: Array<Subsection>;
  private sectionSlug: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subsectionService: SubsectionService
  ) {}

  ngOnInit() {
    this.subsectionSubscription = this.subsectionService.subsectionSwiped$.subscribe(
      navObj => {
        const { from, to } = navObj;
        this.navigateToSubsection(from, to);
      }
    );
    this.sectionSlug = this.route.snapshot.data['slug'];
  }

  navigateToSubsection(from: Subsection, to: string): void {
    const currentIndex = this.subsections.findIndex(s => s === from);

    const nextIndex = to === 'previous' ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex < 0 || nextIndex > this.subsections.length - 1) {
      return;
    }

    const nextSubsection = this.subsections[nextIndex];

    this.router.navigate([this.sectionSlug, nextSubsection.slug]);
  }

  ngOnDestroy() {
    this.subsectionSubscription.unsubscribe();
  }
}
