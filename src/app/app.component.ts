import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

/**
 * Root component of the application.
 * Hosts the global RouterOutlet for route views, along with global Toast and Confirmation dialogs.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, ConfirmDialog],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TaskFlow - To-Do Task Management';
}
