import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectServicesService } from '../../services/project-services.service';
import { Router } from '@angular/router';
declare var bootstrap: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  projects: any[] = [];
  projectForm!: FormGroup;
  editingProjectIndex: number | null = null;
  loading = false;

  // Summary
  totalProjects = 0;
  activeProjects = 0;
  completedProjects = 0;

  constructor(private fb: FormBuilder, private projectService: ProjectServicesService,private router:Router) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['active']
    });

    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getUserProjects().subscribe({
      next: (res: any) => {
        this.projects = res.data || [];
        this.loading = false;

        // Update summary
        this.totalProjects = res.count;
        this.activeProjects = this.projects.filter(p => p.status === 'active').length;
        this.completedProjects = this.projects.filter(p => p.status === 'completed').length;
      },
      error: (err) => { 
        console.error(err);
        this.loading = false;
      }
    });
  }

  openAddProject() {
    this.editingProjectIndex = null;
    this.projectForm.reset({ status: 'active' });
    const modal = new bootstrap.Modal(document.getElementById('projectModal')!);
    modal.show();
  }

  openEditProject(index: number) {
    this.editingProjectIndex = index;
    const project = this.projects[index];
    this.projectForm.setValue({
      title: project.title,
      description: project.description,
      status: project.status
    });
    const modal = new bootstrap.Modal(document.getElementById('projectModal')!);
    modal.show();
  }

 saveProject() {
  if (this.projectForm.invalid) {
    this.projectForm.markAllAsTouched();
    return;
  }

  const data = this.projectForm.value;

  if (this.editingProjectIndex !== null) {
    // update existing project
    const project = this.projects[this.editingProjectIndex];
    this.projectService.updateProject(project._id, data).subscribe({
      next: () => {
        this.loadProjects();
        this.closeModal();
      },
      error: (err: any) => console.error(err)
    });
  } else {
    // add new project
    
    this.projectService.addProject(data).subscribe({
      next: () => {
        this.loadProjects();
        this.closeModal();
      },
      error: (err: any) => console.error(err)
    });
  }
}

private closeModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById('projectModal')!
  );
  modal?.hide();
}

 deleteProject(index: number) {
  const project = this.projects[index];

  Swal.fire({
    title: 'Are you sure?',
    text: `You won't be able to revert deleting "${project.title}"!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.projectService.deleteProject(project._id).subscribe({
        next: () => {
          this.loadProjects();
          Swal.fire(
            'Deleted!',
            `"${project.title}" has been deleted.`,
            'success'
          );
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'Something went wrong while deleting.', 'error');
        }
      });
    }
  });
}

  viewProjectDetails(projectid:any){
       this.router.navigate(['project-detalis',projectid]);
  }
}
