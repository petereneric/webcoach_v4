import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebinarIntroPage } from './webinar-intro.page';

describe('WebinarIntroPage', () => {
  let component: WebinarIntroPage;
  let fixture: ComponentFixture<WebinarIntroPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WebinarIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
