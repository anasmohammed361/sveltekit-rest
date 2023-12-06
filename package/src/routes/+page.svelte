<script lang="ts">
	import type { PageServerData } from './$types.js';
	import { client } from './chumma.js';

	let arr: any = [];
	export let data: PageServerData;
	console.log(data);
	const users = client.users({ name: 'Kirthevasen' });
</script>

{#each arr as a}
	<li>{a?.name}</li>
{/each}

{#if $users.isLoading}
	Loading
{:else if $users.isSetteled}
	Data {$users.data?.name}
{:else if $users.isError}
	Error {$users.error?.message}
{/if}

<button
	on:click={async () => {
		console.log(await $users.refetch());
	}}>Refetch users</button
>

<p>SVELTEKIT-REST</p>

<button
	on:click={async () => {
		console.log(await client.users({ name: 'Kirthevasen' }));
	}}>Click me</button
>
