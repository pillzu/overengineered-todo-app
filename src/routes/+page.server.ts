import { AuthApiError } from "@supabase/supabase-js";
import { fail, type Actions, redirect } from "@sveltejs/kit";

export const actions: Actions = {
	signin: async function({ request, locals: { supabase: sb } }) {
		const data = await request.formData()
		let email = data.get('email')
		let password = data.get('password')

		if (!email || !password) {
			return fail(401, {
				"success": false,
				"message": "Username or Password is missing! Please try again"
			})
		}

		email = String(email)
		password = String(password)

		const res = await sb.auth.signInWithPassword({
			email,
			password
		})

		if (res.error) {
			if (res.error instanceof AuthApiError && res.error.status === 400) {
				return fail(401, {
					"success": false,
					"message": "Email or Password is invalid! Please try again"
				})
			} else {
				console.log(res.error)
				return fail(500, {
					"success": false,
					"message": "Oops! Server Error Occurred. Please contact support"
				})
			}
		}

		throw redirect(303, "/todo")
	}
}
