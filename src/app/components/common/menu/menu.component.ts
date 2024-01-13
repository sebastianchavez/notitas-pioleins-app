import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  idLog: string = 'MenuComponent'

  constructor(
    private router: Router,
    private storageService: StorageService,
    private alertService: AlertService,
    private logger: LoggerService,
  ) { }

  ngOnInit() {}

  goToProfile(){

  }

  async logOut(){
    try {
      const confirm = await this.alertService.confirm('Desea cerrar sesión?', 'Si', 'No')
      if(confirm){
        this.storageService.remove('currentUser')
        this.router.navigateByUrl('/login')
      }
    } catch (error) {
      this.logger.error(this.idLog, this.logOut.name, {info: 'Error', error})
    }
  }
}
