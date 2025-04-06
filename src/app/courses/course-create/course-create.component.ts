import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../interface/student.interface';
import { CoursesService } from '../courses.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-course-create',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './course-create.component.html',
  styleUrl: './course-create.component.css'
})
export class CourseCreateComponent {
  form!: FormGroup;
  id!: any;
  course !: Course;
  disable : boolean = false;

  constructor(
    private courseService: CoursesService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) { }
      
  ngOnInit(): void {
    this.form = new FormGroup({
      courseName: new FormControl('', [Validators.required])
    });
  }

  get f(){
    return this.form.controls;
  }
      
  submit(){
    this.courseService.createCourse(this.form.value).subscribe((res:any) => {
      this.toast.info("Curso creado exitosamente","", 3000);
      this.disable = true;
      setTimeout(()=>this.router.navigateByUrl('course/index'),3000)
         
    })
  }
}
