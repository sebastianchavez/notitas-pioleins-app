import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { TypesNote } from 'src/app/common/enums/types-note.enum';
import { ModalNoteComponent } from 'src/app/components/modals/modal-note/modal-note.component';
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
    description: '',
    lists: [],
    createdAt: Date.now(),
    idUser: '',
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
      const modal = await this.modalController.create({
        component: ModalNoteComponent,
        componentProps: {
          note: this.note
        }
      })
      modal.present()

      const { data, role } = await modal.onWillDismiss()
      if(data){
        this.getNotes()
      }
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
      description: '',
      lists: [],
      createdAt: Date.now(),
      idUser: this.user?.idUser!  ,
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

  getMoreNotes(ev: any){
    this.noteService.getNotes(this.user?.idUser!, this.notes[this.notes.length -1])
      .subscribe(res => {
        this.logger.log(this.idLog, this.getMoreNotes.name, {info: 'Success', response: res})
        res.forEach((x) => {
          this.notes.push(x)
        })
      })
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
