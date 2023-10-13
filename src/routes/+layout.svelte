<script lang="ts">
	import '../app.postcss';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Logo from '$lib/assets/logo.svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { Toast, storePopup, initializeStores } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
</script>

<Toast />

<div class="flex flex-col h-screen">
	<header class="flex justify-between py-5 px-5 align-middle">
		<div class="flex justify-center h-full align-middle">
			<span class="pr-2">
				<Logo />
			</span>
			<h1 class="uppercase h4">Do-to</h1>
		</div>
		<LightSwitch />
	</header>

	<main class="relative flex-grow">
		<slot />
	</main>
</div>
