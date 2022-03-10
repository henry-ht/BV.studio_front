import { NotificationService } from 'src/app/core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from 'src/app/core/services/request.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import {NgxCaptchaModule,ReCaptcha2Component} from 'ngx-captcha';

import { faPaperPlane, faSignInAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  loadPage:boolean = false;
  iconLogin = faSignInAlt;
  iconSent  = faPaperPlane;
  siteKey:any = '6Le81MweAAAAAC_iMGXGAgkEGlUhTWPfjgvMkvHC';
  CreateForm:FormGroup;
  closeResult = '';
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  constructor(private fb: FormBuilder, private request:RequestsService, private noti:NotificationService) {
    this.CreateForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      first_name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]],
      last_name: ['', [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]],
      recaptcha: ['', Validators.required]
    });

  }

  ngOnInit(): void {
  }

  filterEmptyFields(data: any): any {
    let fields:any = {};
    Object.keys(data).forEach(key =>  data[key] != '' && data[key] != null ? fields[key] = data[key] : key);

    return fields;
  }


  isValid() {
    return this.CreateForm.controls;
  }

  onSubmit(){
    this.loadPage = true;
    let fields = this.filterEmptyFields(this.CreateForm.value);

    this.request.save('user', fields)
    .subscribe((data:any)=> {
      if (data.status === 'success') {
        this.clearForm();
      }

      this.printMsj(data);
      this.captchaElem.resetCaptcha();
    }, null, () =>   this.loadPage = false);

  }

  clearForm(){
    this.CreateForm.reset();
  }

  printMsj(body:any){
    for (const key in body['message']) {
      if (Object.prototype.hasOwnProperty.call(body['message'], key)) {
        const element = body['message'][key];
        for (const key in element) {
          if (Object.prototype.hasOwnProperty.call(element, key)) {
            const msj = element[key];
            if(body['status'] == 'error'){
              this.noti.error(msj);
            }else{
              this.noti.warning(msj);
            }
          }
        }
      }
    }
  }

}
