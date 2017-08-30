import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Accounts } from 'meteor/accounts-base';

import template from './reset.component.html';

@Component({
  selector: 'reset',
  providers: [MdSnackBar],
  template
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  error: string;
  token: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private zone: NgZone, private formBuilder: FormBuilder, private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
    });

    this.error = '';
  }

  reset() {
    if (this.resetForm.valid) {
      if(this.resetForm.value.password == this.resetForm.value.passwordConfirm) {
        Accounts.resetPassword(this.token, this.resetForm.value.password, () => { 
          this.router.navigate(['login']);
        });
      }
    }
  }
}
