import {ConfigService} from './config.service';
import {Observable} from 'rxjs';
import {environment} from "../environments/environment";


export class GenerateCrudService<T> {

  /*
  * constructor
  * @param configService
  * @param collectionName: api name
  */
  constructor(protected configService: ConfigService, protected collectionName: string) {
  }

  // create item:
  save(objectT: T[]): Observable<any> {
    return this.configService.save<T>(this.collectionName, objectT);
  }

  // Update item:
  update(objectT: T): Observable<any> {
    return this.configService.update<T>(this.collectionName, objectT);
  }

  // Delete item:
  delete(objectT: T): Observable<any> {
    return this.configService.remove<T>(this.collectionName, objectT);
  }

  // Delete all items:
  deleteAll(objectT: T): Observable<any> {
    return this.configService.removeAll<T>(this.collectionName);
  }

  // Get all items:
  getAll(): Observable<any> {
    return this.configService.findAll<T>(this.collectionName);
  }

  // get One by Id:
  findById(id: string): Observable<any> {
    return this.configService.findById<T>(this.collectionName, id);
  }

  getAllObjectsPaginated(page: number, size: number): Observable<any>;
  // tslint:disable-next-line:unified-signatures
  getAllObjectsPaginated(page: number, size: number, title: string): Observable<any>;
  // tslint:disable-next-line:unified-signatures
  getAllObjectsPaginated(page: number, size: number, id: number): Observable<any>;

  getAllObjectsPaginated(page: number, size: number, titleOrId?: any): Observable<any> {

    if (titleOrId){
      return this.configService.httpClient
        .get<any>(`${environment.urlServerApi}/${this.collectionName}/pagination/${titleOrId}/${page}/${size}`);
    }else {
      return this.configService.httpClient
        .get<any>(`${environment.urlServerApi}/${this.collectionName}/pagination/${page}/${size}`);
    }
  }

}
