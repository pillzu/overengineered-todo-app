<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import { fade, fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintInOut, quintOut } from 'svelte/easing';

	const toastStore = getToastStore();

	export let form: ActionData;
	export let data: PageData;

	$: if (form?.success) {
		const t: ToastSettings = {
			message: form?.message,
			background: 'variant-soft-primary',
			hideDismiss: true,
			timeout: 1000
		};
		toastStore.trigger(t);
	} else if (form?.missing) {
		let message = `To-do is missing! Please try again`;
		if (form?.id) {
			message = 'Unable to remove to-do';
		}
		const t: ToastSettings = {
			message,
			background: 'variant-filled-error',
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

<section class="pb-10 mt-40 w-full">
	<div class="grid gap-10 place-items-center w-full text-center content">
		<h1 class="text-6xl text-surface h1">Welcome to dO-t0</h1>
		<p class="font-thin tracking-widest text-surface">
			Your <span class="code">very-own</span> To-Do Manager
		</p>
		<form method="POST" action="?/add" class="md:w-3/4 lg:w-1/2" use:enhance>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim variant-soft-surface">📃</div>
				<input type="text" name="todo" placeholder="What are you working on right now..." />
				<button type="submit" class="variant-soft-primary hover:variant-ghost-tertiary">
					✍️ + Add</button
				>
			</div>
		</form>
		<div class="flex flex-col gap-5 place-items-center px-5 text-left md:w-5/6 lg:w-1/2 min-h-fit">
			{#each data.todos as todo (todo.id)}
				<div
					class={`flex justify-between py-2 px-5 w-full min-w-full align-middle variant-ghost-${
						todo.completed ? 'primary' : 'surface'
					} card`}
					in:fly={{ y: 100, duration: 2000 }}
					out:fade
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
		</div>
	</div>
</section>
