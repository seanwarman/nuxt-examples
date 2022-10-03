import { TestBed } from '@angular/core/testing';

import { DownloadsService } from './downloads.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('DownloadsService', () => {
  const getSpy = jasmine.createSpy('get').and.returnValue(of({ items: [] }));

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: { get: getSpy } }],
    })
  );

  it('should be created', () => {
    const service: DownloadsService = TestBed.get(DownloadsService);
    expect(service).toBeTruthy();
  });

  it('should call http get on `getDocuments`', () => {
    const service: DownloadsService = TestBed.get(DownloadsService);
    service.getDocuments();

    expect(getSpy).toHaveBeenCalledWith(
      'https://www.googleapis.com/storage/v1/b/gweb-room-design.appspot.com/o/?fields=items&prefix=documents'
    );
  });
});
