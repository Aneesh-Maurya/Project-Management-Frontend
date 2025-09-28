import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSignupService } from '../services/login-signup.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-signup-and-login',
  standalone: false,
  templateUrl: './signup-and-login.component.html',
  styleUrl: './signup-and-login.component.css'
})
export class SignupAndLoginComponent {
  activeTab: 'login' | 'signup' = 'login';

  currentImage: string = 'https://thumbs.dreamstime.com/b/project-management-diagram-virtual-screen-business-finance-technology-concept-project-management-diagram-virtual-screen-130068869.jpg';
  currentTitle: string = 'Manage Projects Smarter';
  currentDesc: string = 'Stay organized, track tasks, and collaborate effectively with your team.';

  constructor(private loginService: LoginSignupService, private router: Router) { }

  switchTab(tab: 'login' | 'signup') {
    this.activeTab = tab;

    if (tab === 'login') {
      this.currentImage = 'https://thumbs.dreamstime.com/b/project-management-diagram-virtual-screen-business-finance-technology-concept-project-management-diagram-virtual-screen-130068869.jpg';
      this.currentTitle = 'Manage Projects Smarter';
      this.currentDesc = 'Stay organized, track tasks, and collaborate effectively with your team.';
    } else {
      this.currentImage = 'https://futuramo.com/blog/wp-content/uploads/2024/01/person-using-ai-tool-job.jpg';
      this.currentTitle = 'Collaborate and Track Projects';
      this.currentDesc = 'Join our platform to assign tasks, manage deadlines, and work efficiently with your team.';
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });


  // Custom Validator Function
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }
  login() {

    if (this.loginForm.invalid) {
      this.loginForm.controls['email'].markAllAsTouched()
      this.loginForm.controls['password'].markAllAsTouched()
    } else {
      // this.ele.nativeElement.querySelector('#spinner').style.visibility = 'visible';
      this.loginService.login(this.loginForm.value).subscribe(
        (res: any) => {
          if (res.length != 0) {
            console.log(res)
            // this.ele.nativeElement.querySelector('#spinner').style.visibility = 'hidden';

            this.clearform()
            sessionStorage.setItem('UserInfo', JSON.stringify(
              {
                accessToken: res.accessToken
              }
            ));
            this.router.navigate(['/dashboard']);
          } else {
            this.clearform()
            // this.ele.nativeElement.querySelector('#spinner').style.visibility = 'hidden';
            Swal.fire({ text: 'Incorrect username or password.' })
          }
        },
        (err: any) => {
          if (err.status === 404) {
            Swal.fire({
              icon: 'error',
              title: 'Unauthorized',
              text: 'Incorrect username or password.'
            });
          } else if (err.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: 'Something went wrong, please try again later.'
            });
          } else if (err.status === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Network Error',
              text: 'Please check your internet connection and try again.'
            });
          }else if (err.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Unauthorized',
              text: 'Incorrect username or password.'
            });
          }
        }
      );
    }

  }


  signup() {
    if (this.signupForm.invalid) {
      this.signupForm.controls['name'].markAllAsTouched()
      this.signupForm.controls['email'].markAllAsTouched()
      this.signupForm.controls['password'].markAllAsTouched()
      this.signupForm.controls['confirmPassword'].markAllAsTouched()
    } else {
      const signupData = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      }
      this.loginService.signup(signupData).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Registered Successfully',
            text: res.message || 'You can now login to your account!'
          });
          this.signupForm.reset();
        },
        error: (err: any) => {
          if (err.status === 409) {
            Swal.fire({
              icon: 'warning',
              title: 'User Exists',
              text: err.error.message || 'This email is already registered.'
            });
          } else if (err.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Missing Fields',
              text: err.error.message || 'Please fill in all required fields.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: err.error.message || 'Something went wrong. Try again later.'
            });
          }
        }
      });
    }
  }



  clearform() {
    this.loginForm.value.email = '',
      this.loginForm.value.password = ''
    this.loginForm.reset();
  }


}
