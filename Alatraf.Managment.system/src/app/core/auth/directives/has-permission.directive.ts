import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthFacade } from '../auth.facade';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  private auth = inject(AuthFacade);
  private tpl = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);

  @Input() set appHasPermission(requiredPermission: string) {
    this.vcr.clear();
    if (this.auth.hasPermission(requiredPermission)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
