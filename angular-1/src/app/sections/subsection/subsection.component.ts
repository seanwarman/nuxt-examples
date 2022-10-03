import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card, Subsection } from '../section';
import { SubsectionService } from '../subsection.service';
import { SectionService } from '../section.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from '../../google-analytics.service';

@Component({
  selector: 'app-subsection',
  templateUrl: './subsection.component.html',
  styleUrls: ['./subsection.component.scss'],
})
export class SubsectionComponent implements OnInit, OnDestroy {
  sectionSubscription: Subscription;
  subsectionSubscription: Subscription;
  routeSubscription: Subscription;
  subsection: Subsection;
  selectedCardId: string;

  constructor(
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private subsectionService: SubsectionService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.subsectionSubscription = this.subsectionService.cardSelected$.subscribe(
      card => (this.selectedCardId = card.id)
    );

    this.sectionSubscription = this.sectionService.currentSubsection$.subscribe(
      (subsection: Subsection) => {
        this.subsection = subsection;
        const topCard = document.getElementById('containerTop');
        topCard.scrollIntoView();
        const firstCard = subsection.cards[0];
        if (firstCard) {
          this.subsectionService.selectCard(firstCard);
        }
      }
    );

    this.routeSubscription = this.route.url.subscribe(p => {
      const parentSlug = this.route.snapshot.parent.data.slug;
      const slug = p[0] && p[0].path;
      if (slug) {
        this.sectionService.getSubsection(parentSlug, slug);
      }
    });
  }

  swipe(to: string) {
    this.subsectionService.goFromToSubsection(this.subsection, to);
  }

  select(card: Card): void {
    this.subsectionService.selectCard(card);
    this.googleAnalyticsService.eventEmitter(
      'sub_section_card_clicked',
      null,
      null
    );
  }

  ngOnDestroy() {
    this.subsectionSubscription.unsubscribe();
    this.sectionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
