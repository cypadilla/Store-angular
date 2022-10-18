import { Component } from '@angular/core';
import { FilesService } from './services/files.service';
import { UsersService } from './services/users.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  imgRta = '';

  constructor(
    private usersService:UsersService,
    private filesService:FilesService
  ){ }
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
