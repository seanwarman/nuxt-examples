import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './card.component';
import { MaterialDesignModule } from '../../material-design/material-design.module';
import { SubsectionService } from '../subsection.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

export const mockedCard = {
  id: 'space-efficiency',
  title: 'Space Efficiency',
  thumbnail: '',
  heroImage: 'https://via.placeholder.com/300',
  heroAltText: 'some Alt text',
  body: `Body text`,
  hint: 'Hint text',
  link: {
    label: 'Room Designer',
    url: 'https://www.nomensa.com',
  },
};

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('SubsectionService', [
      'goFromToSubsection',
    ]);

    TestBed.configureTestingModule({
      declarations: [CardComponent],
      imports: [
        MaterialDesignModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [{ provide: SubsectionService, useValue: spy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.card = mockedCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
