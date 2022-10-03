import { Injectable } from '@angular/core';

export interface CustomWindow extends Window {
  __custom_globals: string;
}

function getWindow(): any {
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  get nativeWindow(): CustomWindow {
    return getWindow();
  }
}
