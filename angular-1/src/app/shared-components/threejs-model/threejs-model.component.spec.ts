import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreejsModelComponent } from './threejs-model.component';
import { MaterialDesignModule } from '../../material-design/material-design.module';

describe('ThreejsModelComponent', () => {
  let component: ThreejsModelComponent;
  let fixture: ComponentFixture<ThreejsModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThreejsModelComponent],
      imports: [MaterialDesignModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreejsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
