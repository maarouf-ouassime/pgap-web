import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class Alerts {
    // for showing alert: 404:init, 200: success, 500: failure
    statusCode = 404;

    // ---------------------------------------------------------------
    // -- Show alert for succes / failure message.
    // ---------------------------------------------------------------
    showAlert(router: Router, statusCode: number): void {
        window.scrollTo(0, 0);
        this.statusCode = statusCode;
        window.setTimeout(() => {
          router.navigate(['home']);
        }, 2000);
    }

    showAlertModal(modalType: string, statusCode: number, object:any): void {
      this.statusCode = statusCode;
      if (object) {
        object.getAll();
      }
      scroll(0, 0);

      const modal: any = $(modalType);
      if (modal){
        modal.modal('hide');
      }

      window.setTimeout(() => {
           window.location.reload();
        }, 2000);
    }
}
