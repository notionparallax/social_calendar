<script>
  let { intervals = [], scheduleCounts = {} } = $props();

  let isEmpty = $derived(intervals.length === 0);
  let tooFew = $derived(intervals.length === 1);

  // Get first character for each person to match with schedule counts
  const getFirstChar = (name) => {
    return Array.from(name)[0] || name.charAt(0);
  };
</script>

<div class="table-container">
  {#if isEmpty || tooFew}
    <p class="message">Add at least 2 names to calculate intervals</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Interval (days)</th>
          <th>In Schedule</th>
          <th>365 ÷ Interval</th>
        </tr>
      </thead>
      <tbody>
        {#each intervals as interval, index}
          <tr>
            <td>{interval.name}</td>
            <td>{interval.roundedDays}</td>
            <td>{scheduleCounts[getFirstChar(interval.name)] || 0}</td>
            <td>{Math.floor(365 / interval.roundedDays)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .message {
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f7f7f7;
    font-weight: 600;
    color: #333;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }

  td:first-child {
    font-weight: 500;
    color: #666;
  }

  td:nth-child(3),
  td:nth-child(4) {
    font-family: monospace;
  }
</style>
