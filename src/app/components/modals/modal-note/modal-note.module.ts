import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalNoteComponent } from './modal-note.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ModalNoteComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ]
})
export class ModalNoteModule { }
