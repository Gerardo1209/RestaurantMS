import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomesaComponent } from './tipomesa.component';

describe('TipomesaComponent', () => {
  let component: TipomesaComponent;
  let fixture: ComponentFixture<TipomesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipomesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipomesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
