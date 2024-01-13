import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteListPage } from './note-list.page';

describe('NoteListPage', () => {
  let component: NoteListPage;
  let fixture: ComponentFixture<NoteListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoteListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
