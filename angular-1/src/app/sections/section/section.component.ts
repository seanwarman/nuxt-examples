import { Component, OnDestroy, OnInit } from '@angular/core';
import { Section, Subsection, UpdateModel } from '../section';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { SectionService } from '../section.service';
import { SubsectionService } from '../subsection.service';
import { Image } from '../../shared-components/primary-media/primary-media.component';
import { delay, startWith, tap } from 'rxjs/operators';
import * as THREE from 'three';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit, OnDestroy {
  getSectionSubscription: Subscription;
  currentSectionSubscription: Subscription;
  subsectionSubscription: Subscription;
  routeSubscription: Subscription;

  section: Section;
  primaryImageValue: Image;
  modelPath?: string;
  updateModel?: UpdateModel;
  sectionTitle?: string;

  constructor(
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private appService: AppService,
    private subsectionService: SubsectionService
  ) {}

  ngOnInit() {
    this.subsectionSubscription = this.subsectionService.cardSelected$
      .pipe(
        startWith({
          heroImage: '',
          heroAltText: '',
          updateModel: (camera: THREE.PerspectiveCamera) => {},
        }),
        delay(0),
        tap(card => {
          this.primaryImageValue = {
            src: card.heroImage,
            altText: card.heroAltText,
          };

          this.updateModel = card.updateModel;
        })
      )
      .subscribe();

    this.currentSectionSubscription = this.sectionService.currentSubsection$
      .pipe(
        startWith(null),
        delay(0),
        tap()
      )
      .subscribe((subsection: Subsection) => {
        this.modelPath = subsection && subsection['3dModel'];
      });

    this.routeSubscription = this.route.data.subscribe(val => {
      const { slug } = val;

      this.appService.setCurrentTheme(slug);
      this.getSection(slug);
    });
  }

  ngOnDestroy() {
    this.subsectionSubscription.unsubscribe();
    this.getSectionSubscription.unsubscribe();
    this.currentSectionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  getSection(slug: string): void {
    this.getSectionSubscription = this.sectionService
      .getSection(slug)
      .subscribe(
        s => (this.section = s),
        error => console.log(error) // TODO: add proper error handling
      );
  }
}
