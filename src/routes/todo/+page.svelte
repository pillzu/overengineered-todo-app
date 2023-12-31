<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import { fade, fly, scale } from 'svelte/transition';
	import { page } from '$app/stores';

	import NoData from '$lib/assets/no_data.svelte';

	const paymentSuccess = $page.url.searchParams.get('payment');
	const toastStore = getToastStore();

	export let form: ActionData;
	export let data: PageData;

	let username = data.user.first_name;

	if (paymentSuccess === 'true') {
		let message = `Yay! Your credits should be updated now.`;
		const t: ToastSettings = {
			message,
			background: 'variant-soft-success',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	} else if (paymentSuccess !== null) {
		let message = `Oops! Please contact support if you paid but don't see the merchandise`;
		const t: ToastSettings = {
			message,
			background: 'variant-soft-error',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	}

	$: if (form?.missing) {
		let message = `To-do is missing! Please try again`;
		const t: ToastSettings = {
			message,
			background: 'variant-soft-error',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	} else if (form?.success) {
		const t: ToastSettings = {
			message: form?.message,
			background: 'variant-soft-primary',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	} else if (!form?.success && form?.message) {
		const t: ToastSettings = {
			message: form?.message,
			background: 'variant-soft-error',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	}

	async function completeTodo(id: number, target: EventTarget | null) {
		let formData = new FormData();
		let value = (target as HTMLInputElement).checked;

		formData.append('id', `${id}`);
		formData.append('completed', `${value}`);

		await fetch(`?/complete`, {
			method: 'POST',
			body: formData
		});

		invalidateAll();
	}
</script>

<section class="pb-10 mt-32 w-full">
	<div class="grid gap-10 place-items-center w-full text-center content">
		<h1 class="text-6xl text-surface h1">Welcome to dO-t0</h1>
		<p class="font-thin tracking-widest text-surface">
			{#if username}
				{username}'s
			{:else}
				Your <span class="code">very-own</span>
			{/if} To-Do Manager
		</p>
		<p><b>Credits left: </b> {data.user.tokens}</p>
		<form method="POST" action="?/add" class="md:w-3/4 lg:w-1/2" use:enhance>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim variant-soft-surface">📃</div>
				<input type="text" name="todo" placeholder="What are you working on right now..." />
				<button type="submit" class="variant-soft-primary hover:variant-ghost-tertiary">
					✍️ + Add</button
				>
			</div>
		</form>
		<div class="flex flex-col gap-5 place-items-center px-5 w-full text-left lg:w-1/2">
			{#each data.todos as todo (todo.id)}
				<div
					class={`flex justify-between py-2 px-5  w-full align-middle variant-ghost-${
						todo.completed ? 'primary' : 'surface'
					} card`}
					in:fly={{ y: 40, duration: 1000, delay: 300 }}
					out:fade={{ duration: 500 }}
				>
					<div class="flex justify-between w-5/6">
						<form action="?/complete" method="POST" use:enhance>
							<input type="hidden" name="id" value={todo.id} />
							<input
								type="checkbox"
								name="completed"
								class="checkbox"
								checked={todo.completed}
								on:change={(e) => completeTodo(todo.id, e.target)}
							/>
						</form>
						<p class={`px-5 w-full max-w-full break-all ${todo.completed && 'line-through'}`}>
							{todo.text}
							{#if todo.completed}
								<span class="ml-3 badge variant-ghost-success">Completed</span>
							{/if}
						</p>
					</div>
					<form action="?/remove" method="POST" use:enhance>
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit">❌</button>
					</form>
				</div>
			{/each}
			{#if data.todos.length == 0}
				<p
					class="mb-5 text-xl font-medium text-center text-gray-500"
					in:scale={{ delay: 1000 }}
					out:fly={{ y: 200 }}
				>
					Boom shakalak! Let’s get started by adding your first todo
				</p>
				<div class="h-60 lg:h-100" in:scale={{ delay: 1000 }} out:fade={{ duration: 100 }}>
					<NoData />
				</div>
			{/if}
		</div>
	</div>
</section>
