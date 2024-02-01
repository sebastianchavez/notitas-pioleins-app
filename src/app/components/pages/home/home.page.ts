import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/model/interfaces/user.interface';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 
  profile: IUser = {
    createdAt: Date.now(),
    email: '',
    name: '',
    profileImage: '',
    state: '',
    typeAuthentication: '',
    updatedAt: Date.now()
  }
  constructor(
    private userService: UserService,
    private storageService: StorageService,
  ){
    this.userService.user
    .subscribe(res => {
      if(res){
        this.profile = res
      }
    })
  }

  ngOnInit(): void {
    
  }

}
