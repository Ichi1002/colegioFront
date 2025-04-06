import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { xml2js } from 'xml-js';
import { Country, Course, Student } from '../interface/student.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private url = 'http://localhost:8080/ws';
  private soapRequestPayload: any;

  constructor(private http: HttpClient) {}

  getStudent(studentId: number): Observable<Student> {
    const headers = {
      'Content-Type': 'text/xml',
    };
  
    const options: any = {
      observe: 'body',
      headers,
      responseType: 'text',
    };
  
    this.soapRequestPayload = this.getStudentSoap(studentId);
  
    return this.http.post(this.url, this.soapRequestPayload, options).pipe(
      map((response: any) => {
        const jsonData: any = this.xmlToJson(response);
        const studentData =
          jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns2:getStudentResponse'];

        return {
          id: studentData['ns2:id']['_text'],
          firstName: studentData['ns2:firstName']['_text'],
          lastName: studentData['ns2:lastName']['_text'],
          country: studentData['ns2:country']['_text'],
          email: studentData['ns2:email']['_text'],
          courses: studentData['ns2:course']
          ? Array.isArray(studentData['ns2:course'])
          ? studentData['ns2:course'].map((course: any) => ({
              id: course['ns2:id']?.['_text'] || null,
              courseName: course['ns2:name']?.['_text'] || null,
            }))
          : [
              {
                id: studentData['ns2:course']['ns2:id']?.['_text'] || null,
                courseName: studentData['ns2:course']['ns2:name']?.['_text'] || null,
              },
            ]
        : [],
        };
      })
    );
  }
  

  getAllStudents(): Observable<Student[]> {
    return this.http
      .post(this.url, this.getAllStudentsSoap(), {
        headers: { 'Content-Type': 'text/xml' },
        responseType: 'text',
      })
      .pipe(
        map((response: any) => {          
          const jsonData: any = this.xmlToJson(response);
          let students = jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
            'ns2:getAllStudentsResponse'
          ]['ns2:student']
          if(!jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
            'ns2:getAllStudentsResponse'
          ]['ns2:student'])
          return  
          students = Array.isArray(students) ? students : [students];

          return students.map((student: any) => ({
            id: student['ns2:id']['_text'],
            firstName: student['ns2:firstName']['_text'],
            lastName: student['ns2:lastName']['_text'],
            country: student['ns2:country']['_text'],
            email: student['ns2:email']['_text'],
          }));
        })
      );
  }

  createStudent(form: any) {
    return this.http.post(this.url, this.addStudentSoap(form), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  updateStudent(form: any) {
    return this.http.post(this.url, this.updateStudentSoap(form), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  addCourseToStudent(idStudent:string,idCourse:string) {
    return this.http.post(this.url, this.addCourseToStudentSoap(idStudent,idCourse), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  removeCourseToStudent(idStudent:string,idCourse:string) {
    return this.http.post(this.url, this.removeCourseToStudentSoap(idStudent,idCourse), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  deleteStudent(studentId: string) {
    return this.http.post(this.url, this.deleteStudentSoap(studentId), {
      headers: { 'Content-Type': 'text/xml' },
      responseType: 'text',
    });
  }

  getAllCountry(): Observable<Country[]> {
    return this.http
      .post(this.url, this.getAllCountrySoap(), {
        headers: { 'Content-Type': 'text/xml' },
        responseType: 'text',
      })
      .pipe(
        map((response: any) => {
          const jsonData: any = this.xmlToJson(response);
          return jsonData['SOAP-ENV:Envelope']['SOAP-ENV:Body'][
            'ns2:getCountryListResponse'
          ]['ns2:country'].map((country: any) => ({
            id: country['ns2:id']['_text'],
            countryName: country['ns2:name']['_text'],
            code: country['ns2:code']['_text'],
          }));
        })
      );
  }

  private getStudentSoap(studentId: number) {
    return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
      <soapenv:Header/>
        <soapenv:Body>
          <stud:getStudentRequest>
            <stud:id>${studentId}</stud:id>
          </stud:getStudentRequest>
        </soapenv:Body>
    </soapenv:Envelope>
      `;
  }
  private getAllStudentsSoap() {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
        <soapenv:Header/>
          <soapenv:Body>
            <stud:getAllStudentsRequest/>
          </soapenv:Body>
      </soapenv:Envelope>
      `;
  }
  private addStudentSoap(form: any) {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
         <soapenv:Header/>
         <soapenv:Body>
            <stud:addStudentRequest>
               <stud:firstName>${form.firstName}</stud:firstName>
               <stud:lastName>${form.lastName}</stud:lastName>
               <stud:country>${form.country}</stud:country>
            </stud:addStudentRequest>
         </soapenv:Body>
      </soapenv:Envelope>
    `;
  }
  private updateStudentSoap(form: any) {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
         <soapenv:Header/>
         <soapenv:Body>
            <stud:updateStudentRequest>
               <stud:id>${form.id}</stud:id>
               <stud:firstName>${form.firstName}</stud:firstName>
               <stud:lastName>${form.lastName}</stud:lastName>
               <stud:country>${form.country}</stud:country>
            </stud:updateStudentRequest>
         </soapenv:Body>
      </soapenv:Envelope>
    `;
  }
  private deleteStudentSoap(studentId:string) {
    return `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
           <soapenv:Header/>
           <soapenv:Body>
              <stud:deleteStudentRequest>
                 <stud:id>${studentId}</stud:id>
              </stud:deleteStudentRequest>
           </soapenv:Body>
        </soapenv:Envelope>
    `;
  }
  private getAllCountrySoap() {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
        <soapenv:Header/>
          <soapenv:Body>
            <stud:getCountryListRequest>?</stud:getCountryListRequest>
          </soapenv:Body>
      </soapenv:Envelope>
    `;
  }
  private addCourseToStudentSoap(idStudent:string,idCourse:string) {
    return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
   <soapenv:Header/>
   <soapenv:Body>
      <stud:addStudentToCourseRequest>
         <stud:idStudent>${idStudent}</stud:idStudent>
         <stud:idCourse>${idCourse}</stud:idCourse>
      </stud:addStudentToCourseRequest>
   </soapenv:Body>
</soapenv:Envelope>
    `;
  }
  private removeCourseToStudentSoap(idStudent:string,idCourse:string) {
    return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:stud="http://www.example.com/student">
   <soapenv:Header/>
   <soapenv:Body>
      <stud:removeStudentToCourseRequest>
         <stud:idStudent>${idStudent}</stud:idStudent>
         <stud:idCourse>${idCourse}</stud:idCourse>
      </stud:removeStudentToCourseRequest>
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
