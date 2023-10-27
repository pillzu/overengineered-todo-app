import type { Session, SupabaseClient } from "@supabase/supabase-js"
import type { User } from "../../ambient"

export async function updateUser(sb: SupabaseClient, { first_name, last_name, id }: User) {
	console.log("update user =>", first_name, last_name, id)
	const { error: err, data: user } = await sb.from('users').update({ first_name, last_name }).eq('id', id).select().single()
	const res = { message: "", user }
	if (err) {
		console.log(err)
		res.message = `Unable to update user! Please contact support`
	}

	return res
}

export async function getUser(sb: SupabaseClient, session: Session | null) {
	const { error: err, data: user } = await sb.from('users').select("id, first_name, last_name, tokens").single()
	const res = { message: "", user }
	if (err || !user) {
		console.log(err)
		res.message = `Unable to fetch user! Please contact support`
	}

	// update if information exists in OAuth Login
	if (!(user?.first_name || user?.last_name) && session?.user.user_metadata.name) {
		const updatedUser: User = { ...user }
		const name = session?.user.user_metadata.name.split(" ")
		updatedUser.first_name = name.length > 0 ? name[0] : ""
		updatedUser.last_name = name.length > 1 ? name[1] : ""
		const { message: err, user: us } = await updateUser(sb, updatedUser)
		if (err || !user) {
			console.log(err)
		} else {
			res.user = us
		}
	}

	return res
}
