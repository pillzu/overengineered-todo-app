import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { addTodo, completeTodo, getTodos, removeTodo } from "$lib/server/todo";
import { error } from "console";

export const load: PageServerLoad = async ({ fetch, locals: { supabase: sb} }) => {
	const {message, user} = await fetch("/api/user", {
		method: "GET",
	}).then(res => res.json())

	if (message !== "") {
		throw error(500, {
			message
		});
	}

	const {message:msg, todos } = await getTodos(sb);

	if (msg !== "") {
		throw error(500, {
			msg
		});
	}

	return { todos, user }
}

export const actions: Actions = {

	add: async ({ request, locals: { supabase: sb, getSession } }) => {
		const data = await request.formData()
		const todo = String(data.get('todo'))

		if (!todo) {
			return fail(400, { todo, missing: true })
		}

		const session = await getSession()

		const {message} = await addTodo(sb, todo, session?.user.id);

		if (message !== "") {
			return {success: false, message}
		}

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
