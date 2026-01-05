<script>
  let { intervals = [], onScheduleCounts = () => {} } = $props();

  // Generate a year-long schedule showing all contacts
  let schedule = $derived.by(() => {
    if (intervals.length < 2) return [];

    // Create an array representing each week of the year
    const weekSchedule = Array.from({ length: 52 }, () => []);

    // For each person, calculate which weeks they should be contacted
    intervals.forEach((interval) => {
      const daysInterval = interval.days; // Use precise days, not rounded
      // Get first character properly (handles emojis and multi-byte chars)
      const firstChar = Array.from(interval.name)[0] || interval.name.charAt(0);

      // Start at day 0 and add contacts at each interval
      let currentDay = daysInterval;
      while (currentDay <= 365) {
        const weekIndex = Math.floor((currentDay - 1) / 7);
        if (weekIndex >= 0 && weekIndex < 52) {
          weekSchedule[weekIndex].push(firstChar);
        }
        currentDay += daysInterval;
      }
    });

    // Convert each week to show ALL people
    return weekSchedule.map((week) => {
      if (week.length === 0) return "";
      // Show all people in this week (e.g., "AC" if Amara and Chen)
      return week.join("");
    });
  });

  let scheduleText = $derived(schedule.join(""));

  // Count occurrences of each character in the schedule
  let characterCounts = $derived.by(() => {
    const counts = {};
    // Use Array.from to properly handle emojis and multi-byte characters
    Array.from(scheduleText).forEach((char) => {
      counts[char] = (counts[char] || 0) + 1;
    });
    return counts;
  });

  // Notify parent of character counts whenever they change
  $effect(() => {
    onScheduleCounts?.(characterCounts);
  });

  let filledCount = $derived(schedule.filter((char) => char !== "·").length);

  // Calculate actual total meetings using precise days
  let totalMeetings = $derived(
    intervals.reduce(
      (sum, interval) => sum + Math.floor(365 / interval.days),
      0
    )
  );
</script>

{#if intervals.length >= 2}
  <div class="calendar-viz">
    <h3>52-Week Schedule Preview</h3>
    <p class="description">
      Each character represents one week. Letters show the first initial of who
      you'll contact that week.
    </p>
    <div class="schedule">
      {scheduleText}
    </div>
    <p class="stats">
      {filledCount} of 52 weeks scheduled · ~{totalMeetings} total meetings this
      year
    </p>
  </div>
{/if}

<style>
  .calendar-viz {
    background-color: #f0f7ff;
    border: 1px solid #d0e4f7;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 20px;
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
  }

  .description {
    margin: 0 0 15px 0;
    font-size: 13px;
    color: #666;
  }

  .schedule {
    font-family: "Courier New", monospace;
    font-size: 16px;
    line-height: 1.8;
    letter-spacing: 0.15em;
    background-color: white;
    padding: 15px;
    border-radius: 4px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    color: #2c3e50;
    border: 1px solid #e0e0e0;
  }

  .stats {
    margin: 10px 0 0 0;
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }
</style>
