import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvalidPage } from './invalid.page';

describe('InvalidPage', () => {
  let component: InvalidPage;
  let fixture: ComponentFixture<InvalidPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InvalidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
