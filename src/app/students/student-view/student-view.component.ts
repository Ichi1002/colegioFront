import { Component } from '@angular/core';
import { Student } from '../../interface/student.interface';
import { StudentsService } from '../students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-view.component.html',
  styleUrl: './student-view.component.css',
})
export class StudentViewComponent {
  id!: any;
  student!: any;

  constructor(
    public studentService: StudentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.id = this.route.snapshot.params['studentId'];

    this.studentService.getStudent(this.id).subscribe((data) => {
      this.student = data;
    });
  }
}
