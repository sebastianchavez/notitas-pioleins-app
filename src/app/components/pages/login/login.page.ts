import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  idLog: string = 'LoginPage'

  constructor(
    private router: Router,
    private logger: LoggerService,
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

  async login(){
    try {
      const response = await this.userService.login()
      this.router.navigateByUrl('/home')
      this.logger.log(this.idLog, this.login.name, {info: 'Success', response})
    } catch (error) {
      this.logger.error(this.idLog, this.login.name, {info: 'Error', error})
    }
  }
}
