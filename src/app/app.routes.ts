import { Routes } from '@angular/router';
import { CourseIndexComponent } from './courses/course-index/course-index.component';
import { CourseViewComponent } from './courses/course-view/course-view.component';
import { CourseCreateComponent } from './courses/course-create/course-create.component';
import { CourseEditComponent } from './courses/course-edit/course-edit.component';
import { StudentIndexComponent } from './students/student-index/student-index.component';
import { StudentViewComponent } from './students/student-view/student-view.component';
import { StudentCreateComponent } from './students/student-create/student-create.component';
import { StudentEditComponent } from './students/student-edit/student-edit.component';
import { AddCourseComponent } from './students/add-course/add-course.component';


export const routes: Routes = [
    { path: '', redirectTo: '/student/index', pathMatch: 'full' },
    
    { path: 'course', redirectTo: 'course/index', pathMatch: 'full'},
    { path: 'course/index', component: CourseIndexComponent },
    { path: 'course/:courseId/view', component: CourseViewComponent },
    { path: 'course/create', component: CourseCreateComponent },
    { path: 'course/:courseId/edit', component: CourseEditComponent }, 
   
    { path: 'student', redirectTo: 'student/index', pathMatch: 'full'},
    { path: 'student/index', component: StudentIndexComponent },
    { path: 'student/:studentId/view', component: StudentViewComponent },
    { path: 'student/create', component: StudentCreateComponent },
    { path: 'student/:studentId/edit', component: StudentEditComponent } ,
    { path: 'student/:studentId/addCourse', component: AddCourseComponent } ,
];
