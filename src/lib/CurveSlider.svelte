<script>
  let { alpha = 1.0, onChange = () => {} } = $props();

  const handleInput = (e) => {
    onChange?.(parseFloat(e.target.value));
  };
</script>

<div class="slider-container">
  <label for="alpha-slider">
    Curve Strength (α): <strong>{alpha.toFixed(2)}</strong>
  </label>
  <input
    id="alpha-slider"
    type="range"
    min="0.2"
    max="2.0"
    step="0.05"
    value={alpha}
    oninput={handleInput}
  />
</div>

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-weight: 500;
    font-size: 14px;
  }

  strong {
    color: #4a90e2;
  }

  input[type="range"] {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4a90e2;
    cursor: pointer;
  }

  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4a90e2;
    cursor: pointer;
    border: none;
  }
</style>
