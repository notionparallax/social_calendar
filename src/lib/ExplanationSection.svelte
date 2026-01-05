<div class="explanation">
  <h2>How It Works</h2>
  <p>
    This tool helps you determine sustainable intervals for staying in touch
    with people using a <strong>priority curve algorithm</strong>. People at the
    top of your list get contacted more frequently, with the frequency gradually
    decreasing for those lower down.
  </p>
  <p>
    The <strong>curve strength (α)</strong> controls how steep this drop-off is:
  </p>
  <ul>
    <li>
      <strong>Lower values (0.2–0.5):</strong> More equal distribution of contact
      frequency
    </li>
    <li><strong>Medium values (0.8–1.2):</strong> Balanced priority curve</li>
    <li>
      <strong>Higher values (1.5–2.0):</strong> Top people get contacted much more
      often
    </li>
  </ul>

  <h2>How to Use</h2>
  <ol>
    <li>
      <strong>Enter names:</strong> Type one name per line in order of priority (top
      = highest priority)
    </li>
    <li>
      <strong>Reorder:</strong> Use Alt+Arrow keys to move lines up or down
    </li>
    <li>
      <strong>Adjust parameters:</strong>
      <ul>
        <li>
          <strong>Curve Strength:</strong> Drag the slider to change how quickly
          frequency drops off
        </li>
        <li>
          <strong>Min Days:</strong> Minimum interval between contacts (default:
          14 days)
        </li>
        <li>
          <strong>Max Days:</strong> Maximum interval between contacts (default:
          365 days)
        </li>
        <li>
          <strong>Total Meetings/Year:</strong> Target number of social interactions
          per year (default: 52)
        </li>
      </ul>
    </li>
    <li>
      <strong>Copy tasks:</strong> Click "Copy Tasks" to copy Todoist-ready recurring
      tasks
    </li>
    <li>
      <strong>Import to Todoist:</strong> Paste into Todoist task adding window as
      if you were making a single task. It'll recognise that there are multiple lines
      and create separate tasks for each.
    </li>
    <li>
      <strong>Tip:</strong> Mark all tasks as completed on first import to start
      the cycle from today
    </li>
  </ol>

  <p class="note">
    <strong>Note:</strong> This tool works for any recurring activities, not just
    meeting people. Use it for hobbies, habits, maintenance tasks, or anything you
    want to schedule regularly.
  </p>

  <h2>Algorithm Summary</h2>
  <p>For each person at rank <em>i</em>:</p>
  <ol>
    <li><strong>Weight:</strong> w<sub>i</sub> = 1 / i<sup>α</sup></li>
    <li>
      <strong>Frequency:</strong> Normalize weights to target total meetings per
      year
    </li>
    <li>
      <strong>Interval:</strong> Convert frequency to days (365 / frequency)
    </li>
    <li><strong>Clamp:</strong> Ensure intervals stay within min/max bounds</li>
    <li>
      <strong>Renormalize:</strong> Adjust intervals to maintain target total meetings
    </li>
    <li>
      <strong>Round:</strong> Round up (ceiling) for Todoist compatibility
    </li>
  </ol>

  <p class="technical">
    The output uses Todoist's <code>every!</code> format, which schedules based
    on
    <strong>completion date</strong> rather than scheduled date. This means if you
    meet someone later than planned, the next check-in is scheduled relative to when
    you actually met, not the original date.
  </p>
</div>

<style>
  .explanation {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
    line-height: 1.6;
    color: #333;
  }

  h2 {
    color: #2c3e50;
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: 600;
  }

  h2:first-child {
    margin-top: 0;
  }

  p {
    margin-bottom: 15px;
  }

  ul,
  ol {
    margin-bottom: 15px;
    padding-left: 25px;
  }

  li {
    margin-bottom: 8px;
  }

  strong {
    color: #2c3e50;
  }

  code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }

  .note {
    background-color: #fff9e6;
    border-left: 4px solid #ffc107;
    padding: 15px;
    border-radius: 4px;
    margin: 20px 0;
  }

  .technical {
    background-color: #f0f7ff;
    border-left: 4px solid #4a90e2;
    padding: 15px;
    border-radius: 4px;
    margin: 20px 0;
    font-size: 14px;
  }

  sub,
  sup {
    font-size: 0.8em;
  }
</style>
