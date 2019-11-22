import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialEventComponent } from './official-event.component';

describe('OfficialEventComponent', () => {
  let component: OfficialEventComponent;
  let fixture: ComponentFixture<OfficialEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficialEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
