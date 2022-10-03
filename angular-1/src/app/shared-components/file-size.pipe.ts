import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  private units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  static isNotConvertable(bytes: number) {
    return isNaN(parseFloat(String(bytes))) || !isFinite(bytes);
  }

  transform(bytes: number = 0): string {
    if (FileSizePipe.isNotConvertable(bytes)) {
      return '';
    }

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return `${bytes.toFixed(0)} ${this.units[unit]}`;
  }
}
