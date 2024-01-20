import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { INote } from 'src/app/model/interfaces/note.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { NoteService } from 'src/app/services/note/note.service';

@Component({
  selector: 'app-modal-note',
  templateUrl: './modal-note.component.html',
  styleUrls: ['./modal-note.component.scss'],
})
export class ModalNoteComponent  implements OnInit {

  idLog: string = 'ModalNoteComponent'
  note: INote
  element: string[] = []

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private noteService: NoteService,
    private logger: LoggerService,
    private alertService: AlertService,
    ) { 
    this.note = this.navParams.get('note')
  }

  ngOnInit() {
    console.log(this.note);
  }

  async onWillDismiss(){
    if(this.note.lists.length > 0 || this.note.title.trim() !== ''){
      this.note.lists.map((l,ind) => l.checks.forEach((x,i) => {delete this.note.lists[ind].checks[i].state}))
      const response = await this.noteService.createOrUpdate(this.note)
      this.logger.log(this.idLog, this.onWillDismiss.name, {info: 'Success', response})
      this.modalController.dismiss(this.note)
    } else {
      this.modalController.dismiss()
    }
  }

  changeState(check: any, value: boolean, indexList: number, indexCheck: number){
    check.state = value
    if(value){
      setTimeout(() => {
        document.getElementById(`state_${indexList}_${indexCheck}`)?.focus()
      }, 1);
    }
    if(check.text.trim() == ''){
      this.note.lists[indexList].checks.splice(indexCheck, 1)
    }
  }

  addElement(indexList: number){
    if(this.element[indexList].trim() != ''){
      this.note.lists[indexList].checks.push({value: false, text: this.element[indexList], state: false})
      this.element[indexList] = ''
    }
  }

  addList(){
    this.note.lists.push({title: '', checks: []})
  }

  async deleteList(indexList: number) {
    try {
      const confirm = await this.alertService.confirm('Desea eliminar esta lista?', 'Si', 'No')
      if(confirm){
        this.note.lists.splice(indexList, 1)
      }
    } catch (error) {
      this.logger.log(this.idLog, this.deleteList.name, {index: 'Error'})      
    }
  }
}
