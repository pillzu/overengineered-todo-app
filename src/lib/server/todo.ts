import type { SupabaseClient } from "@supabase/supabase-js"
import type { Todo } from "../../ambient"

export async function getTodos(sb: SupabaseClient) {
  const { error: err, data: todos } = await sb.from('todos').select("id, text, completed").order('created_at')
  const res = { message: "", todos }
  if (err) {
    res.message = `Unable to fetch todo's! ${err.message}`
  }
  return res
}

export async function addTodo(sb: SupabaseClient, text: string, user_id: string | undefined) {
  const todo: Todo = {
    text,
    user_id,
    completed: false,
  }
  const res = { message: "", todos: null }

  const {data: {tokens}} = await sb.from('users').select('tokens').single()

  if (tokens === 0) {
    res.message = `Not enough Tokens! Please buy more to continue`
    return res
  }

  const {error: tkErr} = await sb.from('users').update({tokens: tokens - 1}).eq('id', user_id)
  if (tkErr) {
    console.log(tkErr)
    res.message = `Server error while adding todo! Please contact support at team@personagen.app`
    return res
  }



  const { error: err } = await sb.from('todos').insert(todo)
  if (err) {
    res.message = `Unable to add todo! ${err.message}`
  }

  return res
}

export async function removeTodo(sb: SupabaseClient, id: number) {
  const { error: err } = await sb.from('todos').delete().eq('id', id)
  const res = {message: ""}
  if (err) {
    res.message = `Unable to delete todo! ${err.message}`
  }

  return res
}

export async function completeTodo(sb:SupabaseClient, id: number, completed: boolean) {
  const newTodo = {completed: completed}
  const data = await sb.from('todos').update(newTodo).eq('id', id)
  const err = data.error
  const res = {message: ""}
  if (err) {
    res.message = `Unable to complete todo! ${err.message}`
  }

  return res
}
