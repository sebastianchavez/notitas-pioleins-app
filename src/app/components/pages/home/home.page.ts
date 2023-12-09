import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { TypesNote } from 'src/app/common/enums/types-note.enum';
import { INote } from 'src/app/model/interfaces/note.interface';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NoteService } from 'src/app/services/note/note.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  element: string = ''
  idLog: string = 'HomeComponent'
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
  isModalOpen: boolean = false;

  constructor(
    private noteService: NoteService,
    private logger: LoggerService,
    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { 
  }

  setOpen(isOpen: boolean, note?: INote) {
    if(!note){
      this.clearNote()
    } else {
      this.note = note
    }
    this.isModalOpen = isOpen;
  }

  async onWillDismiss() {
    try {
      if(this.note.checks.length > 0 || this.note.title.trim() !== ''){
        this.note.checks.forEach((x,i) => {delete this.note.checks[i].state})
        const response = await this.noteService.createOrUpdate(this.note)
        this.logger.log(this.idLog, this.onWillDismiss.name, {info: 'Success', response})
        this.getNotes()
      }
      this.isModalOpen = false
    } catch (error) {
      this.logger.error(this.idLog, this.onWillDismiss.name, {info: 'Error', error})
    }
  }

  
  ionViewWillEnter(){
    this.userService.user
      .subscribe(res => {
        console.log({res});
        
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
      const alert = await this.alertController.create({
        header: 'Desea eliminar esta nota?',
        buttons: [
          {
            text: 'Si',
            handler: async () => {
              await this.noteService.deleteNote(note)
              const toast = await this.toastController.create({
                message: 'Nota eliminada',
                duration: 1500,
                position: 'bottom',
              });
              await toast.present();
            }
          },
          {
            text: 'No',
            role: 'cancel'
          }
      ],
      });
  
      await alert.present();
    } catch (error) {
      //   this.alertService.alert('Problemas al eliminar nota, por favor intente más tarde', '', 'error')
      this.logger.error(this.idLog, this.deleteNote.name, {info: 'Error', error})
    }
  }

  changeState(check: any, value: boolean, index: number){
    check.state = value
    if(value){
      setTimeout(() => {
        document.getElementById(`state_${index}`)?.focus()
      }, 1);
    }
    if(check.text.trim() == ''){
      this.note.checks.splice(index, 1)
    }
  }

  addElement(){
    if(this.element.trim() != ''){
      this.note.checks.push({value: false, text: this.element, state: false})
      this.element = ''
    }
  }

}
