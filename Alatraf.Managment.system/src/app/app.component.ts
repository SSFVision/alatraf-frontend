import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from "@angular/router";
import { Subscription } from 'rxjs';
export let browserRefresh = false;

@Component({
  selector: 'app-root',
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'Alatraf.Managment.system';

  // mthod 1 to detect page refresh
//  subscription: Subscription;
//   constructor(private router: Router) {
//     this.subscription = router.events.subscribe((event: any) => {
//       if (event instanceof NavigationStart) {
//         browserRefresh = !router.navigated;
//         if (browserRefresh) {
//           console.log('Browser was refreshed or is the initial load');
//           // Perform specific actions here
//         }
//       }
//     });
//   }

//   ngOnDestroy() {
//     this.subscription.unsubscribe();
//   }



// Method 2 to detect page refresh
// ngOnInit(): void {
//     if (sessionStorage.getItem('isReload')) {
//       console.log('Browser was refreshed');
//     } else {
//       console.log('Fresh tab / first load');
//     }

//     sessionStorage.setItem('isReload', 'true');
//   }
}
