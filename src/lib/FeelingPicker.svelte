<script lang="ts">
  import { FeelingEnum } from "../Enums/FeelingEnum";
  import { repository } from "../Firebase/Repository";
  import type { Feeling } from "../Models/Feeling";

  let currentDate = new Date();

  let selectedFeelings: Feeling = FeelingEnum[0];
  // $: console.log(selectedFeelings);
</script>

<div class="m-3 flex flex-col gap-4">
  <h1 class="text-4xl">
    How do you feel today? {currentDate.toLocaleDateString("de-DE")}
  </h1>
  <div>
    {#each FeelingEnum as feeling}
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">{feeling.name}</span>
          <input
            type="radio"
            name="radio-10"
            class="radio"
            checked={selectedFeelings === feeling}
            on:change={() => (selectedFeelings = feeling)}
          />
        </label>
      </div>
    {/each}
  </div>
  <button
    class="btn btn-primary"
    on:click={() => repository.addFeelingForDate(selectedFeelings)}
  >
    Submit
  </button>
</div>
