import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { addTodo, completeTodo, getTodos, removeTodo } from "$lib/server/database";
import { error } from "console";

export const load: PageServerLoad = async ({ locals: { supabase: sb, getSession } }) => {
	const { message, todos } = await getTodos(sb);

	if (message !== "") {
		throw error(500, {
			message
		});
	}

	return { todos }
}

export const actions: Actions = {

	add: async ({ request, locals: { supabase: sb, getSession } }) => {
		const data = await request.formData()
		const todo = String(data.get('todo'))

		if (!todo) {
			return fail(400, { todo, missing: true })
		}

		const session = await getSession()

		await addTodo(sb, todo, session?.user.id);

		return { success: true, message: "Todo added successfully" }

	},

	remove: async ({ request, locals: { supabase: sb } }) => {
		const data = await request.formData()
		const id = Number(data.get('id'))

		if (!id) {
			return fail(500, { id, missing: true })
		}

		const res = await removeTodo(sb, id)

		if (res.message) {
			return fail(500, {
				message: res.message,
			});
		}

		return { success: true, message: "Todo removed successfully" }
	},

	complete: async ({ request, locals: {supabase:sb} }) => {
		const data = await request.formData()

		const id = Number(data.get('id'))
		const completed = data.get('completed') === 'true'

		await completeTodo(sb, id, completed)

		return { success: true, message: "Todo completed successfully" }
	}
}
