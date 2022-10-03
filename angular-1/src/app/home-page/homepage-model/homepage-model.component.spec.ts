import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageModelComponent } from './homepage-model.component';
import { MaterialDesignModule } from '../../material-design/material-design.module';

describe('HomepageModelComponent', () => {
  let component: HomepageModelComponent;
  let fixture: ComponentFixture<HomepageModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageModelComponent],
      imports: [MaterialDesignModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
