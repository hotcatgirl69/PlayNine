<script lang="ts">
  export let title = "";
  export let show = false;
  export let onClose = () => {};

  function close(event: MouseEvent | KeyboardEvent) {
    if (
      event.type === "click" ||
      (event instanceof KeyboardEvent && event.key === "Escape")
    ) {
      onClose();
    }
  }
</script>

<div
  class={`modal ${show ? "show" : ""}`}
  on:click={close}
  on:keydown={close}
  role="dialog"
  aria-labelledby="modal-title"
  aria-hidden={!show}
>
  <div
    class="modal-content"
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="dialog"
    tabindex="0"
  >
    <h2 id="modal-title">{title}</h2>

    <slot></slot>

    <button class="close-btn" on:click={close} aria-label="Close modal"
      >×</button
    >
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    opacity: 0;
    transition:
      visibility 0s,
      opacity 0.2s ease-in-out;
  }

  .modal.show {
    visibility: visible;
    opacity: 1;
  }

  .modal-content {
    position: relative;
    background-color: #333333;
    color: #fff;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    width: 300px;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #f44336;
  }
</style>
