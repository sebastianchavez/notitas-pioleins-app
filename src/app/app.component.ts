import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { LoggerService } from './services/logger/logger.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  idLog: string = 'AppComponent'
  public appPages = [
    // { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    // { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = [];
  constructor(
    private userService: UserService,
    private logger: LoggerService,
  ) {
    this.getUserData()
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
