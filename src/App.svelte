<script lang="ts">
  import { notificationStore } from "./Stores/NotificationStore";
  import NotificationToast from "./lib/NotificationToast.svelte";
  import DisplayFeelings from "./lib/DisplayFeelings.svelte";
  import AddFeelings from "./lib/AddFeelings.svelte";
  import type { Tab } from "./Models/Tab";

  let tabs: Tab[] = [
    {
      title: "Add feelings",
      componentName: AddFeelings,
    },
    {
      title: "Display feelings",
      componentName: DisplayFeelings,
    },
  ];

  let currentTab = 0;
</script>

<div class="bg-gray-700 min-h-screen min-w-screen">
  <main
    class="bg-gray-600 m-0 mx-auto flex flex-col gap-2 p-2 justify-center w-4/6 rounded-md"
  >
    <!-- Navbar -->
    <div role="tablist" class="tabs tabs-lifted">
      {#each tabs as tab, i}
        <button
          role="tab"
          aria-selected={i === currentTab}
          class={`tab ${i === currentTab ? "tab-active" : ""}`}
          on:click={() => (currentTab = i)}
        >
          {tab.title}
        </button>
      {/each}
    </div>
    <!-- Navbar end -->
    <span class="text-6xl mx-auto">WORK IN PROGRESS</span>
    {#if tabs[currentTab].componentName}
      <svelte:component this={tabs[currentTab].componentName} />
    {/if}
  </main>
</div>
<!-- Toast notification system -->
<div class="toast toast-top toast-end max-w-sm">
  {#each $notificationStore as notification, index}
    <NotificationToast {notification} {index} />
  {/each}
</div>
