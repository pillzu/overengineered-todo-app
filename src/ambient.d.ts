import type { UUID } from "crypto"

type Todo = {
	id?: number
	text: string
	user_id?: string
	completed: boolean
}

type User = {
	id?: string
	first_name?: string
	last_name?: string
	tokens?: number
}
