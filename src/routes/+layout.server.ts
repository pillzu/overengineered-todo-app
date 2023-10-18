import type { Session } from "@supabase/supabase-js"

export const load = async ({ locals: { getSession } }): Promise<{ session: Session }> => {
	return {
		session: await getSession(),
	}

}
