import { env } from "$env/dynamic/private";
import { stripe } from "$lib/stripe";
import { json, type RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async ({ request, locals: {getSession} }) => {
	const data = await request.json();
	const count = data.count

	const lineItems = [{
		price_data: {
			currency: "USD",
			product_data: {
				name: "50 todo Credits",
			},
			unit_amount: count * 100,
		},
		quantity: 1,
	}]

	const user = (await getSession())?.user.id ?? "User not found"

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: "payment",
		success_url: `${env.BASE}/todo?payment=true`,
		cancel_url: `${env.BASE}/todo?payment=false`,
		phone_number_collection: {
			enabled: true
		},
		metadata: {
			user
		}
	})

	return json({
		url: session.url
	})
}
