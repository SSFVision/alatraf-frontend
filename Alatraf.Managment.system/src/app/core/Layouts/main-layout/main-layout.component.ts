import { Component } from '@angular/core';
import { GlobalLoaderComponent } from "../../../shared/components/global-loader/global-loader.component";
import { SidebarComponent } from "../../../layout/sidebar/sidebar.component";
import { HeaderComponent } from "../../../layout/header/header.component";
import { ToastContainerComponent } from "../../../shared/components/toast-container/toast-container.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  imports: [GlobalLoaderComponent, SidebarComponent, HeaderComponent, ToastContainerComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
