import {
  Component,
  OnDestroy,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AppService } from '../../app.service';
import { ContentPreview } from '../../../data/content-previews';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-hotspot-drawer',
  templateUrl: './content-hotspot-drawer.component.html',
  styleUrls: ['./content-hotspot-drawer.component.scss'],
})
export class ContentHotspotDrawerComponent implements OnInit, OnDestroy {
  appSubscription: Subscription;
  tabs: ContentPreview[];
  setSelectedTab: number;
  hotspotIndex: number;
  @Input() selectedHotspot: string;
  @Output() hotspotEvent = new EventEmitter<string>();

  constructor(private appService: AppService) {}
  notFirstOrLast(currentTab, totalTabs) {
    if (currentTab < 0 || currentTab > totalTabs - 2) {
      return false;
    }
    return true;
  }
  emitNavigation(navSlug) {
    this.hotspotEvent.emit(navSlug);
  }
  setHotspotIndex(activeHotspot) {
    this.hotspotIndex = this.tabs.findIndex(tab => tab.slug === activeHotspot);
    return this.hotspotIndex;
  }

  ngOnInit() {
    this.appSubscription = this.appService
      .getNavTabs()
      .subscribe(tabs => (this.tabs = tabs));
  }

  ngOnDestroy() {
    this.appSubscription.unsubscribe();
  }
}
