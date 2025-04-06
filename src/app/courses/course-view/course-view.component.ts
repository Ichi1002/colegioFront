import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CoursesService } from '../courses.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-view',
  imports: [CommonModule],
  templateUrl: './course-view.component.html',
  styleUrl: './course-view.component.css',
})
export class CourseViewComponent {
  id!: any;
  course!: any;

  constructor(
    private courseService: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['courseId'];
    this.courseService.getCourse(this.id).subscribe((data: any) => {
      this.course = data;
    });
  }
}
