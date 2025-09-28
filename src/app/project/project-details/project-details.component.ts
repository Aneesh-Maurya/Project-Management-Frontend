import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-project-details',
  standalone: false,
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: any;
  projectId:any;
  tasks: any[] = [];
  taskForm!: FormGroup;
  editingTaskIndex: number | null = null;
  searchTerm: string = '';
  filteredTasks: any[] = [];
 

  constructor(private fb: FormBuilder, private taskService:TaskService, private router:ActivatedRoute) { }

  ngOnInit(): void {

   this.getAllTasks();
   
   
    // Static project data
    this.project = {
      title: 'Task Management and Collaboration',
      status: 'active',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-10-15')
    };


    

    // Reactive form
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['',],
      dueDate: ['', Validators.required],
      status: ['todo', Validators.required]
    });
  }



  getAllTasks(){
     this.projectId = this.router.snapshot.paramMap.get('id') || '';
    
    this.taskService.getUserTask(this.projectId).subscribe((res:any)=>{
      this.tasks=res.data;
      this.filteredTasks = [...this.tasks];
    })
  }


  // 🔍 Search
  filterTasks() {
  const term = this.searchTerm?.toLowerCase() || '';
  this.filteredTasks = this.tasks.filter(task =>
    (task.title?.toLowerCase().includes(term) || 
     task.description?.toLowerCase().includes(term) || 
     task.status?.toLowerCase().includes(term))
  );
  
}

 

  openAddTask() {
    this.editingTaskIndex = null;
    this.taskForm.reset({ status: 'todo' });
    const modal = new bootstrap.Modal(document.getElementById('taskModal')!);
    modal.show();
  }

 openEditTask(index: number) {
  this.editingTaskIndex = index;
  const task = this.tasks[index];

  const dueDateStr = task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '';

  this.taskForm.setValue({
    title: task.title || '',
    description: task.description || '',
    dueDate: dueDateStr,
    status: task.status || 'todo'
  });

  const modal = new bootstrap.Modal(document.getElementById('taskModal')!);
  modal.show();
}


saveTask() {
  // Mark all fields as touched to show validation errors
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    return;
  }

  const data = this.taskForm.value;
  data.project = this.projectId; // Add projectId to task data

  if (this.editingTaskIndex !== null) {
    // Update existing task
    const task = this.tasks[this.editingTaskIndex];
    this.taskService.updateTask(task._id, data).subscribe({
      next: () => {
        this.getAllTasks();    // reload task list
        this.closeModal();   // hide modal
      },
      error: (err: any) => console.error(err)
    });
  } else {
    // Add new task
    this.taskService.addTask(data).subscribe({
      next: () => {
        this.getAllTasks();
        this.closeModal();
      },
      error: (err: any) => console.error(err)
    });
  }
}

// Optional: method to close the Bootstrap modal
closeModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal')!);
  modal?.hide();
}

 deleteTask(index: number) {
   const task = this.filteredTasks[index];

  Swal.fire({
    title: 'Are you sure?',
    text: `You won't be able to revert deleting "${task.title}"!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.taskService.deleteTask(task._id).subscribe({
        next: () => {
          this.getAllTasks();
          Swal.fire(
            'Deleted!',
            `"${task.title}" has been deleted.`,
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
}
