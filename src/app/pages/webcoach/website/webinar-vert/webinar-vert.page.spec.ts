import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebinarVertPage } from './webinar-vert.page';

describe('WebinarVertPage', () => {
  let component: WebinarVertPage;
  let fixture: ComponentFixture<WebinarVertPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WebinarVertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
