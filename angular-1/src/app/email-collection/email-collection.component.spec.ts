import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailCollectionComponent } from './email-collection.component';

describe('EmailCollectionComponent', () => {
  let component: EmailCollectionComponent;
  let fixture: ComponentFixture<EmailCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailCollectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
