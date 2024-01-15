<script lang="ts">
  import { DocumentReference } from "firebase/firestore";
  import { repository } from "./Firebase/Repository";
  import FeelingPicker from "./lib/FeelingPicker.svelte";

  let currentDate = new Date();
  let teamRef: string;
</script>

<div class="bg-gray-700 min-h-screen min-w-screen">
  <main
    class="bg-gray-600 m-0 mx-auto flex flex-col gap-2 p-2 justify-center w-4/6 rounded-md"
  >
    <div class="flex flex-col gap-1 w-full">
      <h1 class="text-2xl">Set team</h1>
      <input class="input w-fill" bind:value={teamRef} />
      <button class="btn btn-primary" on:click={() => repository.setTeamRef()}
        >Set team</button
      >
    </div>

    <button
      class="btn btn-primary"
      on:click={() => repository.addTeam("Test_1101-2124")}>Add team</button
    >
    <button
      class="btn btn-primary"
      on:click={() => repository.addDate(currentDate)}>Add todays date</button
    >
    <FeelingPicker />
  </main>
</div>
