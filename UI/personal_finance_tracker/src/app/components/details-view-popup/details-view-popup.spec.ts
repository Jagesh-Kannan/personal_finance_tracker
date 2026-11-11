import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsViewPopup } from './details-view-popup';

describe('DetailsViewPopup', () => {
  let component: DetailsViewPopup;
  let fixture: ComponentFixture<DetailsViewPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsViewPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsViewPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
