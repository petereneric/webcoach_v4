import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestScrollPage } from './test-scroll.page';

describe('TestScrollPage', () => {
  let component: TestScrollPage;
  let fixture: ComponentFixture<TestScrollPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestScrollPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
