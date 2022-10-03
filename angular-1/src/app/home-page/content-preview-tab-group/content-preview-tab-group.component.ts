import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ContentPreview } from '../../../data/content-previews';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-preview-tab-group',
  templateUrl: './content-preview-tab-group.component.html',
  styleUrls: ['./content-preview-tab-group.component.scss'],
})
export class ContentPreviewTabGroupComponent implements OnInit, OnDestroy {
  appSubscription: Subscription;
  tabs: ContentPreview[];

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appSubscription = this.appService
      .getNavTabs()
      .subscribe(tabs => (this.tabs = tabs));
  }

  ngOnDestroy() {
    this.appSubscription.unsubscribe();
  }
}
