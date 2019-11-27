import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartUpdateActionsComponent } from './chart-update-actions.component';

describe('ChartUpdateActionsComponent', () => {
  let component: ChartUpdateActionsComponent;
  let fixture: ComponentFixture<ChartUpdateActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartUpdateActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartUpdateActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
