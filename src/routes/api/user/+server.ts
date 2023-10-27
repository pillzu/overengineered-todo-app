import { getUser } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals: { supabase: sb, getSession } }) => {
	const session = await getSession();
	const user = await getUser(sb, session);
	return json(user);
}
