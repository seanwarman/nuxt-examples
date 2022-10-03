import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, pluck } from 'rxjs/operators';
import { GOOGLE_STORAGE_API_URL } from '../utils/const';

export interface DownloadableDocument {
  kind: string;
  id: string;
  selfLink: string;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  timeCreated: string;
  updated: string;
  storageClass: string;
  timeStorageClassUpdated: string;
  size: string;
  md5Hash: string;
  mediaLink: string;
  crc32c: string;
  etag: string;
  metadata?: { description: string; displayName: string; fileType: string };
}

@Injectable({
  providedIn: 'root',
})
export class DownloadsService {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  getDocuments() {
    return this.http
      .get<{ items: Array<DownloadableDocument> }>(
        `${GOOGLE_STORAGE_API_URL}/o/?fields=items&prefix=documents`
      )
      .pipe(
        catchError(this.handleError),
        pluck('items')
      );
  }
}
