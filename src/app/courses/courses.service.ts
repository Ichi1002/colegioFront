import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { xml2js } from 'xml-js';
import { Course } from '../interface/student.interface';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private url = 'http://localhost:8080/ws';
  private soapRequestPayload: any;

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http
      .post(this.url, this.getAllCoursesSoap(), {
        headers: { 'Content-Type': 'text/xml' },
        responseType: 'text',
      })
      .pipe(
        map((response: any) => {
          const jsonData: any = this.xmlToJson(response);
          if(!jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
            'ns2:getAllCoursesResponse'
          ]['ns2:course'])
          return  
          let courses = jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
            'ns2:getAllCoursesResponse'
          ]['ns2:course']
          courses = Array.isArray(courses) ? courses : [courses];

          return courses.map((course: any) => ({
            id: course['ns2:id']['_text'],
            courseName: course['ns2:name']['_text'],
          }));
        })
      );
  }

  private getAllCoursesSoap() {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
        <soapenv:Header/>
          <soapenv:Body>
            <stud:getAllCoursesRequest/>
          </soapenv:Body>
      </soapenv:Envelope>
      `;
  }

  getCourse(CourseId: string): Observable<any> {
    const headers = {
      'Content-Type': 'text/xml',
    };

    const options: any = {
      observe: 'body',
      headers,
      responseType: 'text',
    };

    this.soapRequestPayload = this.getCourseSoap(CourseId);

    return this.http.post(this.url, this.soapRequestPayload, options).pipe(
      map((response: any) => {
        const jsonData: any = this.xmlToJson(response);
        let courseData = 
          jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
            'ns2:getCourseResponse'
          ];

        return {
          id: courseData['ns2:id']['_text'],
          courseName: courseData['ns2:name']['_text'],
          student: courseData['ns2:student']
            ? Array.isArray(courseData['ns2:student'])
              ? courseData['ns2:student'].map((course: any) => ({
                  id: course['ns2:id']?.['_text'] || null,
                  firstName: course['ns2:firstName']?.['_text'] || null,
                  lastName: course['ns2:lastName']?.['_text'] || null,
                  email: course['ns2:email']?.['_text'] || null,
                  country: course['ns2:country']?.['_text'] || null,
                }))
              : [
                  {
                    id: courseData['ns2:student']['ns2:id']?.['_text'] || null,
                    firstName:
                    courseData['ns2:student']['ns2:firstName']?.['_text'] ||
                      null,
                    lastName:
                    courseData['ns2:student']['ns2:lastName']?.['_text'] ||
                      null,
                    email:
                    courseData['ns2:student']['ns2:email']?.['_text'] || null,
                    country:
                    courseData['ns2:student']['ns2:country']?.['_text'] ||
                      null,
                  },
                ]
            : [],
        };
      })
    );
  }

  updateCourse(form: any) {
    return this.http.post(this.url, this.updateCourseSoap(form), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  private getCourseSoap(courseId: string) {
    return `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
           <soapenv:Header/>
           <soapenv:Body>
              <stud:getCourseRequest>
                 <stud:id>${courseId}</stud:id>
              </stud:getCourseRequest>
           </soapenv:Body>
        </soapenv:Envelope>
      `;
  }

  private updateCourseSoap(form: any) {
    return `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
           <soapenv:Header/>
           <soapenv:Body>
              <stud:updateCourseRequest>
                 <stud:id>${form.id}</stud:id>
                 <stud:name>${form.courseName}</stud:name>
              </stud:updateCourseRequest>
           </soapenv:Body>
        </soapenv:Envelope>
    `;
  }

  createCourse(form: any) {
    return this.http.post(this.url, this.addCourseSoap(form), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  private addCourseSoap(form: any) {
    return `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
           <soapenv:Header/>
           <soapenv:Body>
              <stud:addCourseRequest>
                 <stud:name>${form.courseName}</stud:name>
              </stud:addCourseRequest>
           </soapenv:Body>
        </soapenv:Envelope>
    `;
  }

  deleteCourse(CourseId: number) {
    return this.http.post(this.url, this.deleteCourseSoap(CourseId), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    })      .pipe(
      map((response: any) => {
        const jsonData: any = this.xmlToJson(response);
        if(!jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
          'ns2:deleteCourseResponse'
        ]['ns2:fault'])
        return  
        let fault = jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
          'ns2:deleteCourseResponse'
        ]['ns2:fault']
        fault = Array.isArray(fault) ? fault : [fault];
        return fault.map((course: any) => ({
          errorMessage: course['ns2:detail']['ns2:errorMessage']['_text'],
          courseName: course['ns2:faultcode']['_text'],
        }));
      })
    );
    
    ;
  }

  private deleteCourseSoap(CourseId:number) {
    return `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
           <soapenv:Header/>
           <soapenv:Body>
              <stud:deleteCourseRequest>
                 <stud:id>${CourseId}</stud:id>
              </stud:deleteCourseRequest>
           </soapenv:Body>
        </soapenv:Envelope>
    `;
  }

  

  private xmlToJson(xml: any): Object {
    return xml2js(xml, {
      compact: true,
      trim: true,
      alwaysChildren: true,
      ignoreInstruction: true,
      ignoreDeclaration: true,
      ignoreAttributes: true,
      ignoreComment: true,
      ignoreCdata: true,
      ignoreDoctype: true,
    });
  }
}
