import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentsService } from '../students.service';
import { Student } from '../../interface/student.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

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
  disable : boolean = false;
  idDeshabilitado!: number;

  constructor(
    private readonly studentService: StudentsService,
    private router: Router,
    private toast: NgToastService
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

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe({
      next: (data: any) => {
        console.log(data);
        
        if(data){
          this.toast.danger(data[0].errorMessage, data[0].courseName, 3000);
          this.disable = true;
        }
        else{
          this.toast.info("Estudiante borrado exitosamente","", 3000);
          setTimeout(()=>window.location.reload(),3000)
          this.idDeshabilitado = id;
        }
      },
      error: (error: any) => {
        this.error = 'Error';
      },
    });
  }
}
