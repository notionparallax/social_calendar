<script>
  import { onMount } from "svelte";
  import CalendarVisualization from "./lib/CalendarVisualization.svelte";
  import CodeMirrorInput from "./lib/CodeMirrorInput.svelte";
  import CopyButton from "./lib/CopyButton.svelte";
  import CurveSlider from "./lib/CurveSlider.svelte";
  import ExplanationSection from "./lib/ExplanationSection.svelte";
  import ParameterSpinners from "./lib/ParameterSpinners.svelte";
  import ResultsTable from "./lib/ResultsTable.svelte";
  import { computeIntervals } from "./lib/computeIntervals.js";

  // Default names from different continents
  const DEFAULT_NAMES = [
    "💥Amara",
    "💣Chen",
    "💅Diego",
    "🔨Elena",
    "🦣Hassan",
    "🧪Fiona",
    "🔐Genji",
    "🤖Isla",
    "✨Jamal",
    "🦾Keiko",
  ];

  // State
  let namesText = $state("");
  let alpha = $state(1.0);
  let minDays = $state(14);
  let maxDays = $state(365);
  let totalMeetings = $state(52);
  let debounceTimer;

  // Derived state
  let names = $derived(
    namesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  );

  let intervals = $derived(
    computeIntervals(names, {
      alpha,
      minDays,
      maxDays,
      totalMeetings,
    })
  );

  // URL state management
  function updateURL() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const params = new URLSearchParams();
      if (names.length > 0) {
        params.set("names", names.join(","));
      }
      params.set("alpha", alpha.toString());
      params.set("min", minDays.toString());
      params.set("max", maxDays.toString());
      params.set("total", totalMeetings.toString());

      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newURL);
    }, 500);
  }

  function loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    const urlNames = params.get("names");
    if (urlNames) {
      namesText = urlNames.split(",").join("\n");
    } else {
      namesText = DEFAULT_NAMES.join("\n");
    }

    const urlAlpha = params.get("alpha");
    if (urlAlpha) {
      const parsed = parseFloat(urlAlpha);
      if (!isNaN(parsed) && parsed >= 0.2 && parsed <= 2.0) {
        alpha = parsed;
      }
    }

    const urlMin = params.get("min");
    if (urlMin) {
      const parsed = parseInt(urlMin);
      if (!isNaN(parsed) && parsed >= 1) {
        minDays = parsed;
      }
    }

    const urlMax = params.get("max");
    if (urlMax) {
      const parsed = parseInt(urlMax);
      if (!isNaN(parsed) && parsed > minDays) {
        maxDays = parsed;
      }
    }

    const urlTotal = params.get("total");
    if (urlTotal) {
      const parsed = parseInt(urlTotal);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 365) {
        totalMeetings = parsed;
      }
    }
  }

  onMount(() => {
    loadFromURL();
  });

  // Watch for changes and update URL
  $effect(() => {
    namesText;
    alpha;
    minDays;
    maxDays;
    totalMeetings;
    updateURL();
  });

  // Event handlers
  const handleNamesChange = (value) => {
    namesText = value;
  };

  const handleAlphaChange = (value) => {
    alpha = value;
  };

  const handleMinChange = (value) => {
    minDays = value;
  };

  const handleMaxChange = (value) => {
    maxDays = value;
  };

  const handleTotalChange = (value) => {
    totalMeetings = value;
  };

  // Schedule counts from calendar visualization
  let scheduleCounts = $state({});

  const handleScheduleCounts = (counts) => {
    scheduleCounts = counts;
  };
</script>

<main>
  <header>
    <h1>Social Spacing Calculator</h1>
    <p class="tagline">
      Sustainable intervals for seeing people and doing things
    </p>
  </header>

  <div class="layout">
    <div class="input-section">
      <h2>People (in order of priority)</h2>
      <CodeMirrorInput value={namesText} onChange={handleNamesChange} />
    </div>

    <div class="results-section">
      <h2>Contact Intervals</h2>
      <ResultsTable {intervals} {scheduleCounts} />
      <div class="copy-container">
        <CopyButton {intervals} />
      </div>
    </div>
  </div>

  <CalendarVisualization {intervals} onScheduleCounts={handleScheduleCounts} />

  <div class="parameters-section">
    <h2>Parameters</h2>
    <CurveSlider {alpha} onChange={handleAlphaChange} />
    <ParameterSpinners
      {minDays}
      {maxDays}
      {totalMeetings}
      onMinChange={handleMinChange}
      onMaxChange={handleMaxChange}
      onTotalChange={handleTotalChange}
    />
  </div>

  <ExplanationSection />
</main>

<style>
  main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  header {
    text-align: center;
    margin-bottom: 40px;
  }

  h1 {
    font-size: 32px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
  }

  .tagline {
    color: #666;
    font-size: 16px;
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
  }

  .input-section {
    min-height: 400px;
  }

  .results-section {
    display: flex;
    flex-direction: column;
  }

  .copy-container {
    margin-top: 15px;
  }

  .parameters-section {
    background-color: #f9f9f9;
    padding: 25px;
    border-radius: 8px;
    margin-bottom: 40px;
  }

  .parameters-section h2 {
    margin-top: 0;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .layout {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 24px;
    }
  }
</style>
