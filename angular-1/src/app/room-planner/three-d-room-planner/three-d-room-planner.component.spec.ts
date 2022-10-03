import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDRoomPlannerComponent } from './three-d-room-planner.component';

describe('ThreeDRoomPlannerComponent', () => {
  let component: ThreeDRoomPlannerComponent;
  let fixture: ComponentFixture<ThreeDRoomPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeDRoomPlannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeDRoomPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
