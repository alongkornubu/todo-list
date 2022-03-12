// dashboard.page.ts
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthenticateService } from '../services/authentication.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userEmail: string;
  stytxt='text-decoration:line-through;';
  form2;
  public form= new Observable<any[]>();
  style='opacity:0;';
  d = new Date(); //date for now
  //date to object
  task={
    taskName: '',
    taskTime: `${this.d.getHours()}:${this.d.getMinutes()}`,
    taskIsChecked:false
  };

  dt=`${this.d.getDate()}/${this.d.getMonth()+1}/${this.d.getFullYear()}`;
  variable=true;
  constructor(
    private navCtrl: NavController,
    private authService: AuthenticateService,

  ) { }

  ngOnInit() {
   
    this.form2=this.authService.getallTasksArechecked();
 
   this.form=this.authService.getallTasks();

    this.authService.userDetails().subscribe(res => {
      if (res !== null) {
        this.userEmail = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });
  }

// logout
  logout() {
    this.authService.logoutUser()
      .then(res => {
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
       // console.log(error);
      });
  }
// task time
  submit(){
    this.authService.addTask(this.task.taskName,this.task.taskTime,false);
    this.task.taskName='';
  }

  submitTask(){
    this.variable=false;
   this.style='opacity:1;';
  }

  submitTaskAnnuler(){
    this.variable=true;
    this.style='opacity:0;';
  }
//updata task
update(id: any,checked: any){
  this.authService.updateTask(id,checked);
}
// task done
doneClick(){
this.form=this.form2;
}
//all task todos
todoClick(){
  this.form=this.authService.getallTasks();;
}
}
