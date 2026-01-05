<script>
  let { intervals = [] } = $props();

  let buttonText = $state("Copy for Todoist");
  let timeoutId;

  const copyToClipboard = async () => {
    if (intervals.length < 2) return;

    const todoistFormat = intervals
      .map((interval) => `${interval.name} every! ${interval.roundedDays} days`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(todoistFormat);

      buttonText = "Copied!";

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        buttonText = "Copy for Todoist";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  let disabled = $derived(intervals.length < 2);
</script>

<button
  onclick={copyToClipboard}
  {disabled}
  class:copied={buttonText === "Copied!"}
>
  {buttonText}
</button>

<style>
  button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: #4a90e2;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #357abd;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  button.copied {
    background-color: #5cb85c;
  }
</style>
