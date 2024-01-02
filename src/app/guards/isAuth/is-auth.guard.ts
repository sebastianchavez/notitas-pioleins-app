import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService)
  const router = inject(Router)

  return userService.getStatus()
    .then((isLogin) => {
      if(isLogin){
        return true
      } else {
        router.navigateByUrl('/login')
        return false
      }
    })
    .catch(error => {
        router.navigateByUrl('/login')
        return false
    })
};
