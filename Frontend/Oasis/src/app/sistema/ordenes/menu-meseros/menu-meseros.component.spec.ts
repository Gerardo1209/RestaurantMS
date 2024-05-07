import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMeserosComponent } from './menu-meseros.component';

describe('MenuMeserosComponent', () => {
  let component: MenuMeserosComponent;
  let fixture: ComponentFixture<MenuMeserosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuMeserosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuMeserosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
