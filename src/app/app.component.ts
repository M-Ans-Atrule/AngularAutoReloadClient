import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Angular App Change Detection';
  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          const snackBar = this.snackBar.open(
            'A new version is available!', 
            'Update now', 
            {
              duration: 0, // Won't auto-dismiss
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            }
          );

          snackBar.onAction().subscribe(() => {
            window.location.reload();
          });
        });

      // Check periodically for updates
      setInterval(() => {
        this.swUpdate.checkForUpdate();
        console.log('Checking for updates...');
      }, 1000);
    }
  }
}
