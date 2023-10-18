<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const toastStore = getToastStore();

	async function signInWithGithub() {
		const { error: err } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: window.location.origin + '/auth/callback'
			}
		});

		if (err !== null) {
			const t: ToastSettings = {
				message: 'Failed to login: ' + err.message,
				background: 'variant-soft-primary',
				hideDismiss: true,
				timeout: 1000
			};
			toastStore.trigger(t);
		}
	}
</script>

<section class="grid place-content-center w-full h-full">
	{#if !session}
		<button type="button" class="btn variant-ghost-primary" on:click={signInWithGithub}
			>Sign in using Github</button
		>
	{:else}
		<button type="button" class="btn variant-ghost-tertiary" on:click={() => goto('/todo')}
			>Go to Dashboard</button
		>
	{/if}
</section>
