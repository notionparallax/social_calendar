<script>
  let {
    minDays = 14,
    maxDays = 365,
    totalMeetings = 52,
    onMinChange = () => {},
    onMaxChange = () => {},
    onTotalChange = () => {},
  } = $props();

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value < maxDays) {
      onMinChange?.(value);
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > minDays) {
      onMaxChange?.(value);
    }
  };

  const handleTotalChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 365) {
      onTotalChange?.(value);
    }
  };
</script>

<div class="parameters">
  <div class="parameter">
    <label for="minDays">Min Days:</label>
    <input
      id="minDays"
      type="number"
      min="1"
      max={maxDays - 1}
      step="1"
      value={minDays}
      oninput={handleMinChange}
    />
  </div>

  <div class="parameter">
    <label for="maxDays">Max Days:</label>
    <input
      id="maxDays"
      type="number"
      min={minDays + 1}
      step="1"
      value={maxDays}
      oninput={handleMaxChange}
    />
  </div>

  <div class="parameter">
    <label for="totalMeetings">Total Meetings/Year:</label>
    <input
      id="totalMeetings"
      type="number"
      min="1"
      max="365"
      step="1"
      value={totalMeetings}
      oninput={handleTotalChange}
    />
  </div>
</div>

<style>
  .parameters {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .parameter {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  label {
    font-weight: 500;
    font-size: 14px;
  }

  input[type="number"] {
    width: 80px;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  input[type="number"]:focus {
    outline: none;
    border-color: #4a90e2;
  }
</style>
