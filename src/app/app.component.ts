import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  imgParent = '';
  showImg = true;
  imgRta = '';

  constructor(
    private usersService:UsersService,
    private filesService:FilesService,
    private authService:AuthService,
    private tokenService:TokenService
  ){ }

  ngOnInit(){
    const token = this.tokenService.getToken();
    if(token){
      this.authService.profile()
      .subscribe()
    }
  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  downloadPDF(){
    this.filesService.getFile('mypdf','/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file){
      this.filesService.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location;
      })
    }
  }

}
