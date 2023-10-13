
type Todo = {
  id: number
  text: string
  completed: boolean
}


let todos: Todo[] = [
  {
    id: Date.now(),
    text: "Hello world",
    completed: false,

  }
]

export function getTodos() {
  return todos
}

export function addTodo(text: string) {
  const todo:Todo = {
    text,
    id: Date.now(),
    completed:false,

  }
  todos.push(todo)
}

export function removeTodo(id: number) {
  todos = todos.filter((td) => td.id !== id)
}

export function completeTodo(id: number, complete: boolean) {
  const todo = todos.find((td) => td.id === id)
  console.log(todos, complete)
  if (todo) {
    todo.completed = complete
  }
}

export function clearTodos() {
  todos = []
}
