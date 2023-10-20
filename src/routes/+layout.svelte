<script lang="ts">
	import '../app.postcss';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Logo from '$lib/assets/logo.svelte';
	import type { LayoutData } from './$types';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { Toast, storePopup, initializeStores } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { fade } from 'svelte/transition';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();

	// supabase
	export let data: LayoutData;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/');
	};

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<Toast />

<svelte:head>
	<title>D0-t0: Login</title>
</svelte:head>

<div class="flex flex-col h-screen">
	<header class="flex justify-between py-5 px-5 align-middle">
		<a href="/">
			<div class="flex justify-center h-full align-middle">
				<span class="pr-2">
					<Logo />
				</span>
				<h1 class="uppercase h4">Do-to</h1>
			</div>
		</a>
		<div class="flex flex-row items-center">
			{#if session}
				<button
					transition:fade
					type="button"
					class="mr-5 btn variant-ghost-error"
					on:click={handleSignOut}>Logout</button
				>
			{/if}
			<LightSwitch />
		</div>
	</header>

	<main class="relative flex-grow">
		<slot />
	</main>
</div>
