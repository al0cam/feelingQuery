<script lang="ts">
  import { repository } from "../Firebase/Repository";

  let date = new Date();
  let teamRef = "";
</script>

<div class="flex flex-col gap-1 w-full">
  <h1 class="text-2xl">Set team</h1>
  <input class="input w-fill" bind:value={teamRef} />
  <button
    class="btn btn-primary"
    on:click={() => repository.fetchTeamByName(teamRef)}>Set team</button
  >
</div>

<div class="flex flex-col gap-1 w-full">
  <h1 class="text-2xl">Set date</h1>
  <input type="date" class="input w-fill" bind:value={teamRef} />
  <button
    class="btn btn-primary"
    on:click={() => repository.fetchTeamByName(teamRef)}>Get feelings</button
  >
</div>
