import { RequestsService } from 'src/app/core/services/request.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users:any = [];
  loadPage:boolean = false;
  constructor(private request:RequestsService) { }

  ngOnInit(): void {
    this.request.get('user')
    .subscribe((data:any)=> {
      if (data.status === 'success') {
        this.users = data.data;
      }
    }, null, () =>   this.loadPage = false);
  }

}
