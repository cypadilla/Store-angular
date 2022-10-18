import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface File {
  originalName: string;
  filename: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private API_URL = `${environment.API_URL}/api/files`;
  constructor(
    private http: HttpClient
  ) { }

  getFile(name: string, url:string , type: string){
    return this.http.get(url, { responseType: 'blob'})
    .pipe(
      tap(content => {
        const blob = new Blob([content], {type});
        saveAs(blob,name);
      }),
      map(()=> true)
    );
  }

  uploadFile(file:Blob){
    const dto = new FormData();
    dto.append('file',file);
    return this.http.post<File>( `${this.API_URL}/upload`,dto,{
      // Depende de como el backend quiera manipular los datos
      // headers:{
      //   'Content-type': 'multipart/form-data'
      // }
    })
  }
}
