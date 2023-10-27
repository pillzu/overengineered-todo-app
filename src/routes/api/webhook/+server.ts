import { STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { stripe } from "$lib/stripe";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import { createClient } from "@supabase/supabase-js";
import { json, type RequestHandler } from "@sveltejs/kit";
import type Stripe from "stripe";

export const POST: RequestHandler = async ({ request, locals: { supabase: sb } }) => {
	let eventType: string | undefined;
	let event: Stripe.EventBase | undefined;

	if (STRIPE_WEBHOOK_SECRET) {
		const payload = await request.text();
		const signature = request.headers.get('stripe-signature') ?? "";
		try {
			event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
			eventType = event.type;
		} catch (err) {
			console.log(err)
			return json({
				err: err,
			}, {
				status: 500
			});
		}
	} else {
		// data = req.body.data;
		eventType = (await request.formData())?.get('type')?.toString();
	}

	const serverSB = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY)


	switch (eventType) {
		case 'checkout.session.completed': {
			// Payment is successful and the subscription is created.
			// You should provision the subscription and save the customer ID to your database.
			const user = (event as Stripe.CheckoutSessionCompletedEvent)?.data?.object?.metadata?.user


			const { error: err } = await serverSB.rpc('increment', { x: 50, user_id: user })
			if (err) {
				console.log(err)
			}
			break;
		}
		case 'payment_intent.payment_failed':
			// Continue to provision the subscription as payments continue to be made.
			// Store the status in your database and check when a user accesses your service.
			// This approach helps you avoid hitting rate limits.
			console.log('I failed! Do something about this');
			break;
		default:
			// Unhandled event type
			console.log("Idk what the fuck this is => ", eventType);
	}

	return json({
		message: "Success"
	}, {
		status: 200,
	})
}
