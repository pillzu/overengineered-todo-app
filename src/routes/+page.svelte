<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { ActionData, PageData } from './$types.js';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	export let form: ActionData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const toastStore = getToastStore();

	$: if (form?.message) {
		const t: ToastSettings = {
			message: form?.message,
			background: 'variant-soft-error',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	}

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
				timeout: 2000
			};
			toastStore.trigger(t);
		}
	}
</script>

<section class="grid place-content-center w-full h-full">
	{#if !session}
		<div
			class="flex flex-col justify-center p-10 rounded-xl shadow-lg md:w-20 full variant-glass-tertiary lg:w-[32rem]"
			in:fade={{ delay: 1000 }}
			out:fade
		>
			<button type="button" class="mb-10 btn variant-ghost-primary" on:click={signInWithGithub}
				>Sign in using Github</button
			>
			<form action="?/signin" method="POST" class="flex flex-col justify-center" use:enhance>
				<p>Email</p>
				<div class="mt-2 mb-5 input-group input-group-divider grid-cols-[1fr_auto]">
					<input type="email" placeholder="Enter Email..." name="email" />
					<div class="input-group-shim">✉️</div>
				</div>
				<p>Password</p>
				<div class="mt-2 mb-10 input-group input-group-divider grid-cols-[1fr_auto]">
					<input type="password" placeholder="Enter Password..." name="password" />
					<div class="input-group-shim">🗝️</div>
				</div>
				<button type="submit" class="self-center p-2 w-11/12 btn variant-ghost-secondary"
					>Login</button
				>
			</form>
		</div>
	{:else}
		<button
			type="button"
			class="btn variant-ghost-tertiary"
			in:fade={{ delay: 750 }}
			out:fade
			on:click={() => goto('/todo')}>Go to Dashboard</button
		>
	{/if}
</section>
