import { Component, inject, signal } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { EcommerceStore } from '../../Ecommerce-Store';
import { SignInParams } from '../../models/user';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { SignUpDialog } from '../sign-up-dialog/sign-up-dialog';

@Component({
  selector: 'app-sign-in-dialog',
  imports: [MatButton, MatIcon, MatFormFieldModule, MatInputModule, MatIconModule, MatSuffix, MatPrefix, MatIconButton, ReactiveFormsModule, MatDialogClose],
  templateUrl: './sign-in-dialog.html',
  styleUrl: './sign-in-dialog.scss',
})
export class SignInDialog {
  store = inject(EcommerceStore)
  fb  = inject(NonNullableFormBuilder)
  matDialog = inject(MatDialog)
  data = inject<{checkout: boolean}>(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef)

  passwordVisible = signal<boolean>(false);

  signInForm = this.fb.group({
    email: ['Fares@test.com', Validators.required],
    password: ['123456', Validators.required],
  })
  
  signIn() {
    if(!this.signInForm.valid){
      this.signInForm.markAllAsTouched()
      return
    }

    const {email, password} = this.signInForm.getRawValue();

    this.store.signIn({email, password, checkout: this.data?.checkout, dialogId: this.dialogRef.id} as SignInParams)
  }

  openSignUpDialog() {
    this.dialogRef.close();
    this.matDialog.open(SignUpDialog, {
      disableClose: true,
      data: {
        checkout: this.data?.checkout,
      }
    })
  }
}
