import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadsComponent } from './downloads.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { MockFooterComponent } from '../utils/test-utils.spec';
import { Pipe, PipeTransform } from '@angular/core';
import { DownloadsService } from './downloads.service';
import { of } from 'rxjs';

@Pipe({ name: 'fileSize' })
class FileSizePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

const testDocuments = [
  // This one should be filtered out
  {
    kind: 'storage#object',
    id: 'gweb-room-design.appspot.com/documents//1544527092324082',
    selfLink:
      'https://www.googleapis.com/storage/v1/b/gweb-room-design.appspot.com/o/documents%2F',
    name: 'documents/',
    bucket: 'gweb-room-design.appspot.com',
    generation: '1544527092324082',
    metageneration: '1',
    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    timeCreated: '2018-12-11T11:18:12.323Z',
    updated: '2018-12-11T11:18:12.323Z',
    storageClass: 'STANDARD',
    timeStorageClassUpdated: '2018-12-11T11:18:12.323Z',
    size: '0',
    md5Hash: '1B2M2Y8AsgTpgAmY7PhCfg==',
    mediaLink: 'api_link',
    crc32c: 'AAAAAA==',
    etag: 'CPKtvOXTl98CEAE=',
  },
  {
    kind: 'storage#object',
    id:
      'gweb-room-design.appspot.com/documents/Google_Room_Design_Guide.pdf/1544527109117655',
    selfLink:
      'https://www.googleapis.com/storage/v1/b/gweb-room-design.appspot.com/o/documents%2FGoogle_Room_Design_Guide.pdf',
    name: 'documents/Google_Room_Design_Guide.pdf',
    bucket: 'gweb-room-design.appspot.com',
    generation: '1544527109117655',
    metageneration: '8',
    contentType: 'application/pdf',
    timeCreated: '2018-12-11T11:18:29.117Z',
    updated: '2018-12-11T14:02:15.321Z',
    storageClass: 'STANDARD',
    timeStorageClassUpdated: '2018-12-11T11:18:29.117Z',
    size: '8499364',
    md5Hash: 'qQbGrbLIak7uMXOujVshFA==',
    mediaLink: 'api_link',
    contentLanguage: 'en',
    metadata: {
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      displayName: 'Google Room Design Guide',
      fileType: 'PDF',
    },
    crc32c: 'mVmGZw==',
    etag: 'CNetve3Tl98CEAg=',
  },
];

describe('DownloadsComponent', () => {
  let component: DownloadsComponent;
  let fixture: ComponentFixture<DownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadsComponent, MockFooterComponent, FileSizePipe],
      imports: [
        MaterialDesignModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: DownloadsService,
          useValue: { getDocuments: () => of(testDocuments) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data on init', () => {
    expect(component.downloadAssets).toEqual([
      {
        name: 'Google Room Design Guide',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'PDF',
        size: '8499364',
        link: 'api_link',
      },
    ]);
  });
});
