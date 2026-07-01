import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from "@angular/router";
import { MatBadge} from '@angular/material/badge';
import { EcommerceStore } from '../../Ecommerce-Store';


@Component({
  selector: 'app-header-actions',
  imports: [MatButton, MatIcon, MatIconButton, RouterLink, MatBadge],
  templateUrl: './header-actions.html',
  styleUrl: './header-actions.scss',
})
export class HeaderActions {
  store = inject(EcommerceStore)

  
}
