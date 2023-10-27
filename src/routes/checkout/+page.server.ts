import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	default: async function({fetch}) {
		const data = await fetch('/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				count: 50
			})
		}).then(data => data.json());

		throw redirect(303, data.url)
	}
}
