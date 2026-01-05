/**
 * Computes sustainable intervals for staying in touch with people
 * based on ranking and a priority curve.
 * 
 * @param {string[]} names - Array of names (order = rank)
 * @param {Object} options - Configuration options
 * @param {number} options.alpha - Curve strength (0.2 to 2.0)
 * @param {number} options.minDays - Minimum interval in days
 * @param {number} options.maxDays - Maximum interval in days
 * @param {number} options.totalMeetings - Total opportunities per year (default 52)
 * @returns {Array<{name: string, days: number, roundedDays: number}>}
 */
export function computeIntervals(names, options) {
    const { alpha, minDays, maxDays, totalMeetings = 52 } = options;

    if (!names || names.length === 0) {
        return [];
    }

    if (names.length === 1) {
        return [{
            name: names[0],
            days: minDays,
            roundedDays: minDays
        }];
    }

    const n = names.length;

    // Step 1: Compute weights w_i = 1 / i^alpha
    const weights = names.map((_, i) => 1 / Math.pow(i + 1, alpha));

    // Step 2: Normalize to get frequency per year (before clamping)
    const sumWeights = weights.reduce((sum, w) => sum + w, 0);
    let frequencies = weights.map(w => totalMeetings * (w / sumWeights));

    // Step 3: Convert to intervals (days)
    let intervals = frequencies.map(f => 365 / f);

    // Step 4 & 5: Iteratively clamp and redistribute
    const maxIterations = 20;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let changed = false;
        let totalFrequencyUsed = 0;
        let lockedIndices = new Set();

        // Check which intervals are hitting limits
        intervals.forEach((interval, i) => {
            if (interval <= minDays) {
                intervals[i] = minDays;
                lockedIndices.add(i);
                totalFrequencyUsed += 365 / minDays;
                changed = true;
            } else if (interval >= maxDays) {
                intervals[i] = maxDays;
                lockedIndices.add(i);
                totalFrequencyUsed += 365 / maxDays;
                changed = true;
            }
        });

        if (!changed) {
            break;
        }

        // Calculate remaining frequency budget for unlocked people
        const remainingFrequency = totalMeetings - totalFrequencyUsed;
        const unlockedWeights = weights
            .map((w, i) => lockedIndices.has(i) ? 0 : w)
            .reduce((sum, w) => sum + w, 0);

        // Redistribute to unlocked people
        if (unlockedWeights > 0) {
            intervals.forEach((interval, i) => {
                if (!lockedIndices.has(i)) {
                    const adjustedFrequency = remainingFrequency * (weights[i] / unlockedWeights);
                    intervals[i] = 365 / adjustedFrequency;
                }
            });
        }
    }

    // Final clamp to ensure bounds
    intervals = intervals.map(d => Math.max(minDays, Math.min(maxDays, d)));

    // Step 6: Create result objects
    return names.map((name, i) => ({
        name,
        days: intervals[i],
        roundedDays: Math.ceil(intervals[i])
    }));
}
