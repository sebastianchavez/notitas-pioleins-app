import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user/user.service';
import { LoggerService } from './services/logger/logger.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StorageService } from './services/storage/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {


  idLog: string = 'AppComponent'
  public labels = [];
  constructor(
    private userService: UserService,
    private logger: LoggerService,
    private platform: Platform,
    private storage: StorageService,
  ) {
  }

  async ngOnInit(){
    await this.storage.init()
    await this.getUserData()
  }

  initializeApp(){
    this.platform.ready().then(async () => {
        GoogleAuth.initialize()
        console.log('GoogleAuth init ok');
    })
  }

  async getUserData(){
    try {
      const response = await this.userService.getUserData()
      this.logger.log(this.idLog, this.getUserData.name, {info: 'Success', response})
    } catch (error) {
      this.logger.error(this.idLog, this.getUserData.name, {info: 'Error', error})
    }
  }
}
