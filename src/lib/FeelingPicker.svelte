<script lang="ts">
  import { repository } from "../Firebase/Repository";

  let currentDate = new Date();
  type Feeling = {
    name: string;
    value: number;
  };

  let feelings: Feeling[] = [
    { name: "Very kul", value: 6 },
    { name: "Kul", value: 5 },
    { name: "Ok", value: 4 },
    { name: "Meh", value: 3 },
    { name: "Kinda Down", value: 2 },
    { name: "Down", value: 1 },
  ];

  let selectedFeeligns: Feeling;
  $: console.log(selectedFeeligns);
</script>

<div class="m-3 flex flex-col gap-4">
  <h1 class="text-4xl">
    How do you feel today? {currentDate.toLocaleDateString("de-DE")}
  </h1>
  <div>
    {#each feelings as feeling}
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">{feeling.name}</span>
          <input
            type="radio"
            name="radio-10"
            class="radio"
            on:change={() => (selectedFeeligns = feeling)}
          />
        </label>
      </div>
    {/each}
  </div>
  <button
    class="btn btn-primary"
    on:click={() => repository.addFeeling(selectedFeeligns.value)}
  >
    Submit
  </button>
</div>
