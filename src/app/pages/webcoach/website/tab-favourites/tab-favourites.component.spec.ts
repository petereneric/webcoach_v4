import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFavouritesComponent } from './tab-favourites.component';

describe('TabFavouritesComponent', () => {
  let component: TabFavouritesComponent;
  let fixture: ComponentFixture<TabFavouritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabFavouritesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
