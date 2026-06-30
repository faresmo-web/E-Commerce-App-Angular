import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header-actions',
  imports: [MatButton, MatIcon, MatIconButton, RouterLink],
  templateUrl: './header-actions.html',
  styleUrl: './header-actions.scss',
})
export class HeaderActions {}
