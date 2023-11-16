import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountSecurityPage } from './account-security.page';

describe('AccountSecurityPage', () => {
  let component: AccountSecurityPage;
  let fixture: ComponentFixture<AccountSecurityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AccountSecurityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
