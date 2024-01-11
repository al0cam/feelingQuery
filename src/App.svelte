<script lang="ts">
  import { repository } from "./Firebase/Repository";
  import FeelingPicker from "./lib/FeelingPicker.svelte";

  let currentDate = new Date();
  type Feeling = {
    name: string;
    value: number;
  };
</script>

<div class="bg-gray-700 min-h-screen min-w-screen">
  <main
    class="bg-gray-600 m-0 mx-auto flex flex-col justify-center w-4/6 rounded-md"
  >
    <button class="btn btn-primary">Add team</button>
    <FeelingPicker />
  </main>
</div>
