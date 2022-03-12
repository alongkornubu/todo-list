// authentication.service.ts
import { Injectable } from '@angular/core';

import { AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
userId;
email;
tasksCollectionRef: AngularFirestoreCollection<any>;
  constructor(
    private afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
  ) { }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });

  }
  //fonction pour le reset du password Oublié
forgotpassword(){
this.afAuth.sendPasswordResetEmail(this.email).then(()=> {
  console.log('email send');
}).catch((error)=>{
  console.log(error);
});
}
//fonction pour signIn de l'utilisateur
  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            resolve(res);
            this.userId=res.user.uid;
            this.email=res.user.email;
          },
          err => reject(err));
    });
  }
//fonction pour logOut de l'utilisateur
  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then((res) => {
            console.log('LOG Out');
            resolve(res);
          }).catch((error) => {
            reject();
          });
      }
    });
  }
//fonction pour ajouter une tache par un utilisateur
  addTask(
    taskName: string,
    taskTime: string,
    isChecked: boolean
  ){ return new Promise<void> ((resolve, reject) => {
    const id = this.firestore.createId();

    return this.firestore.doc(`${this.userId}/${id}`).set({
      id,
      taskName,
      taskTime,
      isChecked
    }).then((res) => {

      resolve(res);
    }).catch((error) => {
      reject();
    });
  });
}

//fonction pour récuperer tous les tache d'un utilisateur
getallTasks(): Observable<any[]> {
  return this.firestore.collection<any>(`${this.userId}`).valueChanges();
}

//fonction pour récuperer tous les tache d'un utilisateur
getallTasksArechecked(): Observable<any[]>{
  return this.firestore.collection<any>(`${this.userId}`,
  ref => ref.where('isChecked','==',true)).valueChanges();

}
//pour récupérer les détails d'un utilisateur
  userDetails() {
    return this.afAuth.user;
  }

  // récupérer une seule tache d'un utilsateur
  getTaskDetail(taskId: string): Observable<any> {
    return this.firestore.collection(`${this.userId}`).doc(taskId).valueChanges();
  }


  // Update du tache si elle est checked or non
  updateTask(taskId: string,bol: boolean) {
    this.firestore.collection(`${this.userId}`).doc(taskId)
    .update({ isChecked:bol});
  }
}

