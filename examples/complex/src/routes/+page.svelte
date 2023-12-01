<script lang="ts">
  import { client } from "$lib/rest";
  let value: string = "";
  let output: string = "Your Output is shown here";
  const handleGroupOneRouteOne = async () => {
    output = await client.groupOneRouter.one({ name :value});
  };
  const handleGroupOneRouteTwo = async () => {
    output = await client.groupOneRouter.two(1);
  };
  const handleGroupTwoRouteOne = async () => {
    output = await client.groupTwoRouter.one({ name :value});
  };
  const handleGroupTwoRouteTwo = async () => {
    output = await client.groupTwoRouter.two(2);
  };
</script>

<main
  class="bg-gray-100 flex flex-col items-center justify-center h-screen font-sans"
>
  <!-- Heading aligned to the right -->
  <h1 class="text-center text-5xl text-gray-700 mr-5">Sveltekit-Rest</h1>

  <!-- Buttons -->
  <section class="mt-8 space-x-4 flex gap-10">
    <div class="Group 1 border-2 p-10 rounded-xl border-blue-600 ">
      <h1 class="text-center text-3xl pb-10">Group 1</h1>
    <div class="flex gap-10"> 
        <button on:click={handleGroupOneRouteOne} class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600">Route one</button>
        <button on:click={handleGroupOneRouteTwo} class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600">Route Two</button>
    </div>
    </div>
    <div class="Group 2  border-2 p-10 rounded-xl border-blue-600 ">
      <h1 class="text-center text-3xl pb-10 ">Group 2</h1>  
    <div class="flex gap-10"> 
        <button on:click={handleGroupTwoRouteOne} class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600">Route one</button>
        <button on:click={handleGroupTwoRouteTwo} class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600">Route Two</button>
    </div>
    </div>
  </section>
  <input
    type="text"
    bind:value
    class="mt-10 p-2 rounded-sm outline outline-blue-600"
    placeholder="Type you Input Here"
  />
  <!-- Div showing text at the bottom -->
  <div
    class="mt-8 p-4 bg-white border border-gray-300 shadow-md text-center rounded-md"
  >
    {output}
  </div>
</main>
