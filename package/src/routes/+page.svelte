<script lang="ts">
    import { client } from "./chumma.js";
</script>

<button on:click={() => {
    client.user();
}}>
    Click me
</button>