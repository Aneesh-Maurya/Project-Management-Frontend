import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = 'https://project-management-backend-kwuy.onrender.com/api/v1/tasks';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('UserInfo')
      ? JSON.parse(sessionStorage.getItem('UserInfo') || '{}').accessToken
      : '';

    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserTask(projectId: any) {
    return this.http.get(`${this.url}/get-task-details/${projectId}`, { headers: this.headers });
  }

  updateTask(projectid: any, data: any) {
    return this.http.put(`${this.url}/update-task/${projectid}`, data, { headers: this.headers });
  }

  addTask(data: any) {

    return this.http.post(`${this.url}/create-task`, data, { headers: this.headers });
  }

  deleteTask(projectid: any) {
    return this.http.delete(`${this.url}/delete-task/${projectid}`, { headers: this.headers });
  }
}
