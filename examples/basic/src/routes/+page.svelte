<script lang="ts">
  import { client } from "$lib/rest";
  let name: string = "";
  let output: string = "Your Ouput is shown here";
  const handleOne = async () => {
    const value = await client.route1();
    console.log({
      value,
      type: typeof value,
    });

    output = String(value);
  };
  const handleTwo = async () => {
    const value = await client.route2({ name });
    console.log({
      value,
      type: typeof value,
    });

    output = value;
  };
</script>

<body
  class="bg-gray-100 flex flex-col items-center justify-center h-screen font-sans"
>
  <!-- Heading aligned to the right -->
  <h1 class="text-center text-5xl text-gray-700 mr-5">Sveltekit-Rest</h1>

  <!-- Buttons -->
  <div class="mt-8 space-x-4">
    <button
      on:click={handleOne}
      class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600"
      >Route 1 (GET)</button
    >
    <button
      on:click={handleTwo}
      class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition duration-300 hover:bg-blue-600"
      >Route 2 (POST)</button
    >
  </div>
  <input type="text" bind:value={name} class="mt-10 p-2 rounded-sm outline outline-blue-600" placeholder="Your Name here"/>
  <!-- Div showing text at the bottom -->
  <div
    class="mt-8 p-4 bg-white border border-gray-300 shadow-md text-center rounded-md"
  >
    {output}
  </div>
</body>
