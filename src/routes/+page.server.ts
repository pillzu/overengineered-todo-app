import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { addTodo, completeTodo, getTodos, removeTodo } from "$lib/server/database";

export async function load() {
	const todos = getTodos();
	return { todos }
}

export const actions: Actions = {

	add: async ({ request }) => {
		const data = await request.formData()
		const todo = String(data.get('todo'))

		if (!todo) {
			return fail(400, { todo, missing: true })
		}

		addTodo(todo);

		return { success: true, message:"Todo added successfully" }

	},

	remove: async ({ request }) => {
		const data = await request.formData()
		const id = Number(data.get('id'))

		if (!id) {
			return fail(500, { id, missing: true })
		}

		removeTodo(id)
		return { success: true, message:"Todo removed successfully" }
	},

	complete: async({request}) => {
		const data = await request.formData()

		const id = Number(data.get('id'))
		const completed = data.get('completed') === 'true'

		completeTodo(id, completed)

		return {success: true, message: "Todo completed successfully"}
	}
}
