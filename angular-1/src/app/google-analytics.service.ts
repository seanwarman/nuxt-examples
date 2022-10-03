import { Injectable } from '@angular/core';
declare let gtag: Function;
declare let dataLayer: Object;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor() {}
  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    });
  }

  public dataLayer = dataLayer;
}
