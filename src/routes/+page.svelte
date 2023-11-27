<script lang="ts">
	import { client } from './thisx';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button
	on:click={async () => {
		const result = await client.hi({ from: 'Kirthevasen' });
		console.log(result);
	}}>Click me</button
>
