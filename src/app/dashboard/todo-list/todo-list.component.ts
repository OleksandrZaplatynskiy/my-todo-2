import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Priority } from '../todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  subscription;
  labelPriority = Priority;
  todos;

  constructor(
    private todoService: TodoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.subscription = this.todoService.getAllTodos(user.uid).subscribe(res => {
        this.todos = res;
        console.log(res);
      });
    })
  }

  removeTodo(id) {
    this.todoService.removeTodo(id);
  }

  updateStateTodo(todo) {
    this.todoService.updateStateTodo(todo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
