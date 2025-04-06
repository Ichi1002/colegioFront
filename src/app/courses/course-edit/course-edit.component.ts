import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Course } from '../../interface/student.interface';
import { CoursesService } from '../courses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-course-edit',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './course-edit.component.html',
  styleUrl: './course-edit.component.css'
})
export class CourseEditComponent {
  form!: FormGroup;
  id!: any;
  course !: Course;
  disable : boolean = false;
  constructor(
    private courseService: CoursesService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService,
  ) { }
      

  ngOnInit(): void {
    this.id = this.route.snapshot.params['courseId'];
    this.courseService.getCourse(this.id).subscribe((data) => {
      this.course = data;
      this.form.patchValue({
        courseName: this.course.courseName
      });
      
    });
 
    this.form = new FormGroup({
      id: new FormControl(this.id, [Validators.required]),
      courseName: new FormControl('', [Validators.required])
    });
  }

  get f(){
    return this.form.controls;
  }
      
  submit(){
    this.courseService.updateCourse(this.form.value).subscribe((res:any) => {
      this.toast.info("Curso actualizado exitosamente","", 3000);
      this.disable = true;
      setTimeout(()=>this.router.navigateByUrl('course/index'),3000)
    })
  }
}
