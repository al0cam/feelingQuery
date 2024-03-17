<script lang="ts">
  import { repository } from "../Firebase/Repository";
  import { teamStore } from "../Stores/TeamStore";

  let date = new Date();
  let teamRef = "";
</script>

<div class="flex flex-col gap-1 w-full">
  <h1 class="text-2xl">Set team</h1>
  <input class="input w-fill" bind:value={teamRef} />
  <button
    class="btn btn-primary"
    on:click={() => repository.setTeamByTeamName(teamRef)}>Set team</button
  >
</div>

<div class="flex flex-col gap-1 w-full">
  <h1 class="text-2xl">Set date</h1>
  <input type="date" class="input w-fill" bind:value={teamRef} />
  <button
    class="btn btn-primary"
    on:click={() => repository.setTeamByTeamName(teamRef)}>Get feelings</button
  >
</div>

<button class="btn btn-primary" on:click={() => repository.getTeams()}
  >Get teams</button
>
<button class="btn btn-primary" on:click={() => repository.getDatesForTeam()}
  >Get dates</button
>

{#if $teamStore && $teamStore.dates != null}
  {#each $teamStore.dates as date}
    <span> {date.date.toLocaleDateString("de-DE")} </span>
  {/each}
{/if}
