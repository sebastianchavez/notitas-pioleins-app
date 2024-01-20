import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteListPageRoutingModule } from './note-list-routing.module';

import { NoteListPage } from './note-list.page';
import { ModalNoteModule } from 'src/app/components/modals/modal-note/modal-note.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNoteModule,
    NoteListPageRoutingModule
  ],
  declarations: [NoteListPage]
})
export class NoteListPageModule {}
