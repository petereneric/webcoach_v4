import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebinarsPage } from './webinars.page';

describe('WebinarsPage', () => {
  let component: WebinarsPage;
  let fixture: ComponentFixture<WebinarsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WebinarsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
