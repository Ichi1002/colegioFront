import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../courses/courses.service';
import { Student } from '../../interface/student.interface';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-add-course',
  imports: [CommonModule],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css',
})
export class AddCourseComponent implements OnInit {
  courseList: any[] = [];
  id!: any;
  student!: Student;
  constructor(
    private courseService: CoursesService,
    private studentService: StudentsService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.id = this.route.snapshot.params['studentId'];

    this.courseService.getAllCourses().subscribe((courses) => {
      this.courseList = courses;

      this.studentService.getStudent(this.id).subscribe((student) => {
        this.student = student;
        const assignedCourses = this.student?.courses;
        if (!this.courseList) return;
        this.courseList.forEach((course, index) => {
          if (
            assignedCourses?.some((assigned: any) => assigned.id === course.id)
          ) {
            this.courseList[index].isAssigned = true;
          } else {
            this.courseList[index].isAssigned = false;
          }
        });
      });
    });
  }

  addCourseToStudent(idStudent: number, idCourse: number) {
    this.studentService
      .addCourseToStudent(idStudent, idCourse)
      .subscribe((data) => {
        window.location.reload();
      });
  }

  removeCourseFromStudent(idStudent: number, idCourse: number) {
    this.studentService.removeCourseToStudent(idStudent, idCourse).subscribe(
      (data) => {
        window.location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
