import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Todo } from './todo.model';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private readonly afs: AngularFirestore,
    private authService: AuthService
  ) { }

  addTodo(todo) {
    const id = this.afs.createId();
    todo.date = new Date();
    todo.authorId = this.authService.userDetail.uid;
    todo.complete = false;
    console.log(todo, id);
    return this.afs.collection<Todo>('todos').doc(id).set(todo);
  }

  getAllTodos(uid) {
    return this.afs.collection<Todo>('todos', ref => ref.where('authorId', '==', uid)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Todo;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  removeTodo(id) {
    this.afs.collection<Todo>('todos').doc(id).delete();
  }

  updateStateTodo(todo) {
    todo.complete = !todo.complete;
    this.afs.collection<Todo>('todos').doc(todo.id).update(todo);
  }
}
