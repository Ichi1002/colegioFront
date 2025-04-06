import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { StudentsService } from '../students.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Country } from '../../interface/student.interface';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-student-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.css',
  standalone: true,
})
export class StudentCreateComponent {
  form!: FormGroup;
  countryList!: Country[];
  disable : boolean = false;
  constructor(
    private studentsService: StudentsService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
    });

    this.studentsService.getAllCountry().subscribe((data) => {
      this.countryList = data;
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.studentsService
      .createStudent(this.form.value)
      .subscribe((data: any) => {
        if (data)
          this.toast.danger(data[0].errorMessage, data[0].courseName, 3000);
        else {
          this.disable = true;
          this.toast.info('Estudiante creado exitosamente', '', 3000);
          setTimeout(() => this.router.navigateByUrl('student/index'), 3000);
        }
      });
  }
}
