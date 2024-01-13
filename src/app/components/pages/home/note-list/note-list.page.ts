import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TypesNote } from 'src/app/common/enums/types-note.enum';
// import { ModalNoteComponent } from 'src/app/components/modals/modal-note/modal-note.component';
import { INote } from 'src/app/model/interfaces/note.interface';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NoteService } from 'src/app/services/note/note.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
})
export class NoteListPage implements OnInit {
  idLog: string = 'NoteListPage'
  user?: IUser
  notes: INote[] = []
  note: INote = {
    title: '',
    checks: [],
    createdAt: Date.now(),
    idUser: '',
    type: TypesNote.TASKLIST,
    updatedAt: Date.now(),
  }

  constructor(
    private noteService: NoteService,
    private logger: LoggerService,
    private userService: UserService,
    private modalController: ModalController,
    private alertService: AlertService
  ) { 
  }

  async openModal(note?: INote) {
    if(!note){
      this.clearNote()
    } else {
      this.note = note
    }
    try {
      // const modal = await this.modalController.create({
      //   component: ModalNoteComponent,
      //   componentProps: {
      //     note: this.note
      //   }
      // })
      // modal.present()

      // const { data, role } = await modal.onWillDismiss()
      // if(data){
      //   this.getNotes()
      // }
    } catch (error) {
      this.logger.error(this.idLog, this.openModal.name, {info: 'Error', error})
    }
  }

  ionViewWillEnter(){
    this.userService.user
      .subscribe(res => {
        if(res){
          this.user = res
          this.getNotes()
        }
      })
  }

  ngOnInit() {
  }

  clearNote(){
    this.note = {
      title: '',
      checks: [],
      createdAt: Date.now(),
      idUser: this.user?.idUser!  ,
      type: TypesNote.TASKLIST,
      updatedAt: Date.now(),
    }
  }

  getNotes(){
    this.noteService.getNotes(this.user?.idUser!)
      .subscribe(res => {
        this.notes = res
        this.logger.log(this.idLog, this.getNotes.name, {info: 'Success', response: res})
      })
  }

  async deleteNote(note: INote){
    try {
      const confirm = await this.alertService.confirm('Desea eliminar esta nota?', 'Si', 'No')
      if(confirm){
        await this.noteService.deleteNote(note)
        // this.alertService.toast('Nota eliminada')
      }
    } catch (error) {
        // this.alertService.alert('Problemas al eliminar nota, por favor intente más tarde', 'Entendido')
      this.logger.error(this.idLog, this.deleteNote.name, {info: 'Error', error})
    }
  }

  
}
