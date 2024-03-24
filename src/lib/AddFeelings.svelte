<script lang="ts">
  import { repository } from "../Firebase/Repository";
  import FeelingPicker from "./FeelingPicker.svelte";

  export let teamName: string = "Ok";
</script>

<div class="flex flex-col gap-1 w-full">
  <h1 class="text-2xl">Team name</h1>
  <input class="input w-fill" bind:value={teamName} />
  <div class="flex flex-row gap-2">
    <button
      class="btn btn-primary flex-auto w-0"
      on:click={() => repository.getTeamByName(teamName)}>Set team</button
    >
    <button
      class="btn btn-primary flex-auto w-0"
      on:click={() => repository.addTeam(teamName)}>Add new team</button
    >
  </div>
</div>
<FeelingPicker />
