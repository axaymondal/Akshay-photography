import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CloudinaryResponse } from '../models/cloudinary.model';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly API_URL = 'http://localhost:5001/api/cloudinary/images';

  constructor(private http: HttpClient) {}

  getImages(): Observable<CloudinaryResponse> {
    return this.http.get<CloudinaryResponse>(this.API_URL);
  }

  getImagesByFolder(folder: string): Observable<CloudinaryResponse> {
    // Since we're using a proxy, we'll use the same endpoint for all requests
    return this.http.get<CloudinaryResponse>(this.API_URL);
  }
} 