// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { SupabaseClient, Session } from "@supabase/supabase-js";

// and what to do when importing types
declare global {
	declare namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>,
			getSession(): Promise<Session | null>
			session: Session | null,
		}
		interface PageData {
			session: Session | null,
		}
		// interface Error {}
		// interface Platform {}
	}
}
