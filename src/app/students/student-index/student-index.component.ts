import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentsService } from '../students.service';
import { Student } from '../../interface/student.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-index',
  imports: [CommonModule, RouterModule],
  templateUrl: './student-index.component.html',
  styleUrl: './student-index.component.css',
  standalone: true,
})
export class StudentIndexComponent implements OnInit {
  studentList!: Student[];
  error!: string;

  constructor(
    private readonly studentService: StudentsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: any) => {    
        this.studentList = data;
      },
      error: (error: any) => {
        console.log(error);
        this.error = 'Error';
      },
    });
  }

  deleteStudent(id: string) {
    this.studentService.deleteStudent(id).subscribe({
      next: (data: any) => {
        window.location.reload();
      },
      error: (error: any) => {
        this.error = 'Error';
      },
    });
  }
}
