<script lang="ts">
  import type { Notification } from "../Models/Notification";
  import { notificationStore } from "../Stores/NotificationStore";
  import CancelIcon from "../assets/CancelIcon.svg";

  export let notification: Notification = {
    type: "success",
    message: "Message was a complete success",
    time: new Date(),
    timeout: 2000,
  };
  export let index: number;

  let typeClass = "";
  let buttonClass = "";

  $: {
    if (notification.type === "success") {
      typeClass = "alert-success";
      buttonClass = "btn-success";
    } else if (notification.type === "error") {
      typeClass = "alert-error";
      buttonClass = "btn-error";
    } else if (notification.type === "warning") {
      typeClass = "alert-warning";
      buttonClass = "btn-warning";
    } else {
      typeClass = "alert-info";
      buttonClass = "btn-info";
    }
  }
</script>

<div
  class={`alert p-2 pl-3 m-0 max-w-sm flex flex-row items-start text-justify whitespace-normal ${typeClass}`}
>
  <span class="toast-title break-all text-wrap h-sm self-center"
    >{notification.message}</span
  >
  <button
    class={`btn btn-square shadow-none ${buttonClass}`}
    on:click={() => notificationStore.removeNotification(notification, index)}
  >
    <img src={CancelIcon} alt="Remove icon" class="w-full h-full p-2" />
  </button>
</div>
