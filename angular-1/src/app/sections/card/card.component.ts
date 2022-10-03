import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { Card, Subsection } from '../section';
import { SubsectionService } from '../subsection.service';
import { SystemImages } from 'src/assets/images';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  @Input() selected: boolean;
  @Input() subsection: Subsection;

  arrowIcon: string;

  constructor(
    private http: HttpClient,
    private subsectionService: SubsectionService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'arrow-forward',
      sanitizer.bypassSecurityTrustResourceUrl(
        SystemImages.cardImages.arrowIcon
      )
    );
  }

  ngOnInit() {
    this.arrowIcon = SystemImages.cardImages.arrowIcon;
  }

  swipe(to: string) {
    this.subsectionService.goFromToSubsection(this.subsection, to);
  }

  isLinkExternal(link: string) {
    if (link.startsWith('http')) {
      return true;
    } else {
      return false;
    }
  }
}
