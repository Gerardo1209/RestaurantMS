import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPlatillosComponent } from './menu-platillos.component';

describe('MenuPlatillosComponent', () => {
  let component: MenuPlatillosComponent;
  let fixture: ComponentFixture<MenuPlatillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPlatillosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPlatillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
