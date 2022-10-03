import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Card, Subsection } from './section';

interface SwipeNavigation {
  from: Subsection;
  to: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubsectionService {
  private cardSelectedSource = new Subject<Card>();
  private subsectionSwipedSource = new Subject<SwipeNavigation>();

  cardSelected$ = this.cardSelectedSource.asObservable();
  subsectionSwiped$ = this.subsectionSwipedSource.asObservable();

  selectCard(card: Card) {
    this.cardSelectedSource.next(card);
  }

  goFromToSubsection(from: Subsection, to: string) {
    this.subsectionSwipedSource.next({ from, to });
  }
}
