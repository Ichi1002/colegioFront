import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { StudentsService } from '../students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Country, Student } from '../../interface/student.interface';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-student-edit',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent {
  form!: FormGroup;
  id!: any;
  student !: Student;
  countryList !: Country[]

  constructor(
    private studentsService: StudentsService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) { }
      

  ngOnInit(): void {
    this.id = this.route.snapshot.params['studentId'];
    this.studentsService.getStudent(this.id).subscribe((data) => {
      this.student = data;
      this.form.patchValue({
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        country: this.student.country,
      });
      
    });

    this.studentsService.getAllCountry().subscribe((data) => {
      this.countryList = data;
    })

    

    this.form = new FormGroup({
      id: new FormControl(this.id, [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    });

  
  }

  get f(){
    return this.form.controls;
  }
      
  submit(){
    this.studentsService.updateStudent(this.form.value).subscribe((data:any) => {
      if(data)
        this.toast.danger(data[0].errorMessage, data[0].courseName, 3000);
      else{
        this.toast.info("Estudiante actualizado exitosamente","", 3000);
        setTimeout(()=>this.router.navigateByUrl('student/index'),3000)
        
      }
    })
  }
}
