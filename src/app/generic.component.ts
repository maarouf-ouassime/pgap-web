import {ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommunService} from '../services/commun.service';
import {Alerts} from '../utils/alerts';

import {Utils} from '../utils/utils';
import {environment} from "../environments/environment";


export class GenericComponent<T> {

  // List of objects in the dataTable:
  objects: T[];
  // Future instance of DataTable:
  dataTable: any;
  // FormGroup: to init with the model of object:
  objectForm: FormGroup;
  // Saved object Result:
  protected savedObject: T;
  submitted = false;
  currentObject: T;
  showLoader: boolean;
  connectedUser: any;
  mobile: boolean;
  successMessage: string;
  errorMessage: string;
  // error dates : begin > end:
  errorDates: any = { isError: false, errorMessage: '' };
  urlServer = environment.urlServerApi;
  alert: Alerts;
  uploadedFiles;
  utils = new Utils();

  // Constructor:
  constructor(
    protected formBuilder: FormBuilder,
    protected objectService: any,
    protected router: Router,
    protected route: ActivatedRoute,
    protected chRef: ChangeDetectorRef,
    protected communService: CommunService
  ) {
    this.alert = new Alerts();
    this.hasPermissionAccess();
    const width = $(window).width();
    // MOBILE
    this.mobile = width < 640;
    const sessionUser = sessionStorage.getItem('auth-user');
    this.connectedUser = sessionUser ? JSON.parse(sessionUser).user : null;
  }

  // ---------------------------------------------------------------
  // -- Method: get All objects.
  // ---------------------------------------------------------------
  initDataTable(): void {
    $(document).ready( () => {
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable({
        responsive: true,
        retrieve: true,
        paging: true,
        searching: true,
      });
    });
  }

  getAll(): void {
    console.log('invoked: getAll');
    this.objectService.getAll().subscribe(
      data => {
        this.objects = data;
        console.log(data);
        this.initDataTable();
      }, error => {
        console.log('error: ');
        console.log(error);
      });
  }
  getCommunService(): CommunService {
    return this.communService;
  }

  // ---------------------------------------------------------------
  // -- Method findone object
  // ---------------------------------------------------------------
  findObjectById(id): void {
    this.objectService.findById(id).subscribe(
      data => {
        this.currentObject = data;
        // console.log(data);
      }, error => {
        console.log('error');
      });
  }

  // ---------------------------------------------------------------
  // -- Method Save object
  // ---------------------------------------------------------------
  onClearSubmit(): void {
    this.objectForm.reset();
  }

  onSubmit(): void {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.objectForm.invalid) {
      return;
    }

    // appel du service save message:
    this.successMessage = 'created';
    console.log(this.objectForm.getRawValue());
    this.objectService.save(this.objectForm.getRawValue()).subscribe(
      data => {
        this.savedObject = data;
        this.alert.showAlertModal('#addModal', 200, this);

      }, error => {
        console.log('error on saved method');
        console.log(error);
        this.errorMessage = error.error.message;
        console.log(this.errorMessage);
        this.alert.showAlertModal('#addModal', 500, this);
      });
  }

  // ---------------------------------------------------------------
  // -- Method select object to delete
  // ---------------------------------------------------------------
  onDelete(object): void {
    this.currentObject = object;
  }

  // ---------------------------------------------------------------
  // -- Method delete object
  // ---------------------------------------------------------------
  onConfirmDelete(): void {
    this.successMessage = 'deleted';
    this.objectService.delete(this.currentObject).subscribe(
      data => {
        this.alert.showAlertModal('#removeModal', 200, this);
      }, error => {
        this.alert.showAlertModal('#removeModal', 500, this);
      });
  }

  // ---------------------------------------------------------------
  // -- Method select current object to update
  // ---------------------------------------------------------------
  onUpdate(object): void {
    // transform current object to formGroup:
    this.currentObject = object;
    if (this.objectForm) {
      this.objectForm.patchValue(object);
      console.log(this.objectForm.getRawValue());
      console.log(this.currentObject);
    }
  }

  // ---------------------------------------------------------------
  // -- Method confirm update:
  // ---------------------------------------------------------------
  onConfirmUpdate(): void {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.objectForm.invalid) {
      return;
    }
    this.successMessage = 'updated';
    console.log(this.objectForm.getRawValue());
    this.objectService.update(this.objectForm.getRawValue()).subscribe(
      data => {
        this.alert.showAlertModal('#modifyModal', 200, this);
        console.log(data);
      }, error => {
        this.alert.showAlertModal('#modifyModal', 500, this);
      });
  }

  refreshDatatable(): void {
    window.setTimeout( () => {
      window.location.reload();
    }, 0);
  }

  getSavedObject(): T {
    if (this.savedObject) {
      return this.savedObject;
    }
  }

  hasPermissionAccess(): boolean {
    // console.log(this.route.snapshot.data.roles)
    this.connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (this.route && this.route.snapshot.data && this.route.snapshot.data.roles ) {
      if (this.connectedUser && this.route.snapshot.data.roles.includes(this.connectedUser.role.libelle)) {
        return true;
      } else {
        this.router.navigate(['not-found']).then(() => {
          window.location.reload();
        });
        return;
      }
    } else {
      return true;
    }
  }

  compareFn(c1: T, c2: T): boolean {
    // @ts-ignore
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  public fixDouble(value): string {
    const x = +value;
    return x.toFixed(2);
  }

  uploadFile(id): void {
    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0], this.uploadedFiles[0].name);
    this.objectService.uploadFilesDrive(formData, id, this.uploadedFiles[0].name).subscribe(
      data => {
        console.log('UPLOAD is successful ', data);
        window.location.reload();
      },
      error => {
        console.log('error in upload file: ');
      });

  }
}
