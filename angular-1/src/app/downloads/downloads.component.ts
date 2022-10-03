import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DownloadableDocument, DownloadsService } from './downloads.service';
import { SystemImages } from '../../assets/images';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '../google-analytics.service';

interface Downloadable {
  name: string;
  description: string;
  type: string;
  size: string;
  link: string;
}

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
})
export class DownloadsComponent implements OnInit, OnDestroy {
  downloadsSubscription: Subscription;
  downloadAssets: Array<Downloadable>;
  footerWidth: string;
  downloadIcon: string;
  lockIcon: object;
  downloadEnabled: boolean;

  static serializeDocument(document: DownloadableDocument): Downloadable {
    return {
      name: document.metadata.displayName,
      description: document.metadata.description,
      type: document.metadata.fileType,
      size: document.size,
      link: document.mediaLink,
    };
  }

  constructor(
    private downloadsService: DownloadsService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    iconRegistry.addSvgIcon(
      'lock',
      sanitizer.bypassSecurityTrustResourceUrl(SystemImages.homeImages.lockIcon)
    );

    iconRegistry.addSvgIcon(
      'lock-open',
      sanitizer.bypassSecurityTrustResourceUrl(
        SystemImages.homeImages.lockOpenIcon
      )
    );
  }

  ngOnInit() {
    this.getDownloadAssets();
    this.footerWidth = 'full';
    this.downloadIcon = SystemImages.homeImages.downloadIcon;
    this.downloadEnabled = this.route.snapshot.queryParamMap.get('signed')
      ? true
      : false;
  }

  trackDownloads(id: any): void {
    if (this.downloadEnabled) {
      this.googleAnalyticsService.eventEmitter(
        'download_resource',
        null,
        `${this.downloadAssets[id].name}`
      );
    } else {
      this.googleAnalyticsService.eventEmitter(
        'download_resource_locked',
        null,
        `${this.downloadAssets[id].name}`
      );
    }
  }

  getDownloadAssets(): void {
    this.downloadsSubscription = this.downloadsService
      .getDocuments()
      .subscribe((docs: Array<DownloadableDocument>) => {
        this.downloadAssets = docs
          .filter(d => d.metadata && parseInt(d.size, 10) > 0)
          .map(DownloadsComponent.serializeDocument);
      });
  }

  ngOnDestroy() {
    this.downloadsSubscription.unsubscribe();
  }
}
