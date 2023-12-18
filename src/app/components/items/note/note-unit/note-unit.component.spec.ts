import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteUnitComponent } from './note-unit.component';

describe('NoteUnitComponent', () => {
  let component: NoteUnitComponent;
  let fixture: ComponentFixture<NoteUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
