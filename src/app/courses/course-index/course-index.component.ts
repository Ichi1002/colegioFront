import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoursesService } from '../courses.service';
import { Course } from '../../interface/student.interface';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-course-index',
  imports: [CommonModule, RouterModule],
  templateUrl: './course-index.component.html',
  styleUrl: './course-index.component.css',
})
export class CourseIndexComponent {
  courseList!: Course[];
  error!: string;
  idDeshabilitado!: number;

  constructor(
    private readonly courseService: CoursesService,
    private router: Router,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data: any) => {
        this.courseList = data;
      },
      error: (error: any) => {
        this.error = 'Error';
      },
    });
  }

  deleteCourse(id: number) {
    this.courseService.deleteCourse(id).subscribe({
      next: (data: any) => {
        if (data)
          this.toast.danger(data[0].errorMessage, data[0].courseName, 3000);
        else {
          this.toast.info('Curso borrado exitosamente', '', 3000);
          setTimeout(() => window.location.reload(), 3000);
          this.idDeshabilitado = id;
        }
      },
      error: (error: any) => {},
    });
  }
}
