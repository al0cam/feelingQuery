<script lang="ts">
  import { repository } from "../Firebase/Repository";
  import FeelingPicker from "./FeelingPicker.svelte";

  export let teamRef: string = "";
  let currentDate = new Date();
</script>

<div class="flex flex-col gap-1 w-full">
  <h1 class="text-2xl">Set team</h1>
  <input class="input w-fill" bind:value={teamRef} />
  <button
    class="btn btn-primary"
    on:click={() => repository.fetchTeamByName(teamRef)}>Set team</button
  >
  <!-- TODO: write code that generates toast messages for success, error and warning -->
</div>

<button
  class="btn btn-primary"
  on:click={() => repository.addTeam("Test_1101-2124")}>Add team</button
>
<button class="btn btn-primary" on:click={() => repository.addDate(currentDate)}
  >Add todays date</button
>
<FeelingPicker />
