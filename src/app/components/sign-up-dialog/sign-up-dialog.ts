import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EcommerceStore } from '../../Ecommerce-Store';
import { SignInParams, SignUpParams } from '../../models/user';
import { SignInDialog } from '../sign-in-dialog/sign-in-dialog';

@Component({
  selector: 'app-sign-up-dialog',
  imports: [MatButton, MatIcon, MatFormFieldModule, MatInputModule, MatIconModule, MatSuffix, MatPrefix, MatIconButton, ReactiveFormsModule, MatDialogClose],
  templateUrl: './sign-up-dialog.html',
  styleUrl: './sign-up-dialog.scss',
})
export class SignUpDialog {
  fb = inject(NonNullableFormBuilder)
  store = inject(EcommerceStore)
  dialogRef = inject(MatDialogRef)
  data = inject<{checkout: boolean}>(MAT_DIALOG_DATA)
    matDialog = inject(MatDialog)


  signupForm = this.fb.group({
    name:['Fares', Validators.required],
    email:['fares@test.com', Validators.required],
    password:['123456', Validators.required],
    confirmPassword:['123456', Validators.required],
  })

  signUp(){

    if(!this.signupForm.valid){
      this.signupForm.markAllAsTouched()
      return
    }

    const { name, email, password } = this.signupForm.getRawValue()

    this.store.signUp({name, email, password, dialogId: this.dialogRef.id, checkout: this.data?.checkout} as SignUpParams)
  }


  openSignInDialog() {
    this.dialogRef.close();
    this.matDialog.open(SignInDialog, {
      disableClose: true,
      data: {
        checkout: this.data?.checkout,
      }
    })
  }
}
