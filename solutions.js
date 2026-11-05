/* Animated walkthroughs of specific practice problems.
   Each solution has the same shape as an algorithm (fields/random/run/code/legend)
   so the normal player can run it. Statements are short paraphrases, not the original text. */
(function () {
  const { A, G, rnd, randArr, uniq, pick } = window.ALGO_DATA.H;
  const S = (arr, o = {}, aux = null) => { const s = A(arr, o); if (aux) s.aux = aux; return s; };
  const listF = (label, min, max, lo, hi, key = 'arr') => ({ key, label, type: 'list', min, max, lo, hi });
  const SOL = [];

  /* ---------- 1. Two Sum ---------- */
  SOL.push({
    slug: 'two-sum', title: 'Two Sum', diff: 'Easy', algo: 'linear-search',
    statement: 'Given an array of numbers and a target, return the positions of two numbers that add up to the target.',
    approach: ['Checking every pair costs O(n²). Instead, remember every number you have already seen in a hash map (value → index).', 'For each number x, the partner you need is target − x. Look it up in the map in O(1).', 'If it is there, you are done. If not, store x and move on. One pass → O(n).'],
    time: 'O(n)', space: 'O(n)',
    code: ['seen = {}   // value → index', 'for i from 0 to n-1:', '  need = target - a[i]', '  if need in seen: return [seen[need], i]', '  seen[a[i]] = i', 'return no pair'],
    fields: [listF('Array', 3, 12, 1, 99), { key: 'target', label: 'Target', type: 'num' }],
    legend: [['active', 'Current number'], ['found', 'The pair']],
    random() { const arr = uniq(8, 1, 25); const i = rnd(0, 6), j = rnd(i + 1, 7); return { arr, target: arr[i] + arr[j] }; },
    run({ arr, target }) {
      const st = [], seen = new Map(), info = `target = ${target}`;
      const P = (line, msg, cls = {}, ptrs = {}) => st.push({ line, msg, s: S(arr, { mode: 'cells', cls, ptrs, info }, { title: 'seen (value → index)', items: [...seen].map(([v, i]) => `${v}→${i}`) }) });
      P(0, 'Start with an empty map of numbers we have already seen.');
      for (let i = 0; i < arr.length; i++) {
        const need = target - arr[i];
        P(2, `a[${i}] = ${arr[i]}. To reach ${target} we need ${target} − ${arr[i]} = ${need}. Have we seen ${need}?`, { [i]: 'active' }, { i });
        if (seen.has(need)) { const j = seen.get(need); P(3, `Yes! ${need} is at index ${j}. ${need} + ${arr[i]} = ${target} → answer [${j}, ${i}].`, { [i]: 'found', [j]: 'found' }, { i, j }); return st; }
        seen.set(arr[i], i);
        P(4, `No. Remember ${arr[i]} (index ${i}) for later numbers.`, { [i]: 'active' }, { i });
      }
      P(5, 'Reached the end — no two numbers add up to the target.');
      return st;
    },
  });

  /* ---------- 2. 3Sum ---------- */
  SOL.push({
    slug: '3sum', title: '3Sum', diff: 'Medium', algo: 'two-pointers',
    statement: 'Find all unique triples in the array whose three numbers add up to 0.',
    approach: ['Sort the array. Sorting lets us use two pointers and makes duplicates sit next to each other.', 'Fix the first number a[i]. Now we need two numbers to its right that add up to −a[i] — that is exactly the sorted pair-sum problem.', 'Use lo = i+1 and hi = n−1. Sum too small → lo++. Too big → hi−−. Zero → save the triple, move both.', 'Skip repeated values (for i and for lo) so the same triple is not reported twice.'],
    time: 'O(n²)', space: 'O(1) extra',
    code: ['sort(a)', 'for i from 0 to n-3:', '  if i > 0 and a[i] == a[i-1]: continue     // skip duplicates', '  lo = i + 1; hi = n - 1', '  while lo < hi:', '    sum = a[i] + a[lo] + a[hi]', '    if sum == 0: save triple; lo++; hi--; skip equal lo values', '    elif sum < 0: lo++      // need a bigger sum', '    else: hi--              // need a smaller sum'],
    fields: [listF('Array', 3, 10, -9, 9)],
    legend: [['active', 'Fixed number a[i]'], ['compare', 'lo and hi'], ['found', 'Triple that sums to 0']],
    random() { return { arr: Array.from({ length: 8 }, () => rnd(-5, 5)) }; },
    run({ arr }) {
      const st = [], a = arr.slice().sort((x, y) => x - y), n = a.length, res = [];
      const P = (line, msg, v, cls = {}, ptrs = {}) => st.push({ line, msg, s: S(v, { mode: 'cells', cls, ptrs, info: 'goal: a[i] + a[lo] + a[hi] = 0' }, { title: 'Triples found', items: res.map(t => `[${t}]`) }) });
      P(0, 'This is the original array. Step 1: sort it.', arr);
      P(0, 'Sorted. Now fix one number at a time and search for a pair to its right.', a);
      for (let i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] === a[i - 1]) { P(2, `a[${i}] = ${a[i]} is the same as the one before — skip it (would repeat triples).`, a, { [i]: 'swap' }, { i }); continue; }
        if (a[i] > 0) { P(1, `a[${i}] = ${a[i]} is positive and everything to the right is bigger, so no triple can sum to 0. Stop.`, a, { [i]: 'swap' }, { i }); break; }
        let lo = i + 1, hi = n - 1;
        while (lo < hi) {
          const s = a[i] + a[lo] + a[hi], cls = { [i]: 'active', [lo]: 'compare', [hi]: 'compare' }, txt = `${a[i]} + ${a[lo]} + ${a[hi]} = ${s}`;
          if (s === 0) {
            res.push([a[i], a[lo], a[hi]]); cls[i] = cls[lo] = cls[hi] = 'found';
            P(6, `${txt} ✔ Save the triple, then move both pointers inward.`, a, cls, { i, lo, hi });
            lo++; hi--; while (lo < hi && a[lo] === a[lo - 1]) lo++;
          } else if (s < 0) { P(7, `${txt} is below 0 → too small, move lo right for a bigger number.`, a, cls, { i, lo, hi }); lo++; }
          else { P(8, `${txt} is above 0 → too big, move hi left for a smaller number.`, a, cls, { i, lo, hi }); hi--; }
        }
      }
      P(1, `Done — ${res.length} unique triple${res.length === 1 ? '' : 's'} found.`, a);
      return st;
    },
  });

  /* ---------- 3. Container With Most Water ---------- */
  SOL.push({
    slug: 'container-with-most-water', title: 'Container With Most Water', diff: 'Medium', algo: 'two-pointers',
    statement: 'Each number is the height of a vertical line. Choose two lines that, together with the x-axis, hold the most water.',
    approach: ['Water held = (distance between the lines) × (height of the shorter line).', 'Start with the widest container: lo at the left end, hi at the right end.', 'Moving the taller line inward cannot help: width shrinks and the height is still capped by the shorter line. So always move the pointer at the shorter line, hoping for a taller one.', 'Track the best area. One pass → O(n).'],
    time: 'O(n)', space: 'O(1)',
    code: ['lo = 0; hi = n - 1; best = 0', 'while lo < hi:', '  area = min(h[lo], h[hi]) * (hi - lo)', '  best = max(best, area)', '  move the pointer at the shorter line inward'],
    fields: [listF('Heights', 3, 12, 1, 20)],
    legend: [['compare', 'Current two lines'], ['sorted', 'Best pair so far'], ['found', 'Final best pair']],
    random() { return { arr: randArr(9, 1, 14) }; },
    run({ arr }) {
      const h = arr, n = h.length, st = []; let lo = 0, hi = n - 1, best = 0, bl = 0, bh = 0;
      const P = (line, msg, cls = {}) => { const c = {}; if (best > 0) { c[bl] = 'sorted'; c[bh] = 'sorted'; } Object.assign(c, cls); st.push({ line, msg, s: A(h, { cls: c, ptrs: { lo, hi }, dim: lo < hi ? [lo, hi] : null, info: `best area so far = ${best}` }) }); };
      P(0, 'Start with the widest possible container: first and last line.', { [lo]: 'compare', [hi]: 'compare' });
      while (lo < hi) {
        const w = hi - lo, mh = Math.min(h[lo], h[hi]), area = mh * w, cur = { [lo]: 'compare', [hi]: 'compare' };
        P(2, `Width = ${hi} − ${lo} = ${w}. Height is limited by the shorter line: min(${h[lo]}, ${h[hi]}) = ${mh}. Area = ${area}.`, cur);
        if (area > best) { best = area; bl = lo; bh = hi; P(3, `${area} beats the previous best — remember this pair.`, cur); }
        if (h[lo] < h[hi]) { P(4, `Line ${lo} (${h[lo]}) is the shorter one. Moving ${hi} inward could never raise the height, so move lo right.`, cur); lo++; }
        else { P(4, `Line ${hi} (${h[hi]}) is the shorter (or equal) one, so move hi left.`, cur); hi--; }
      }
      P(1, `Pointers met. The largest container holds ${best} units of water.`, { [bl]: 'found', [bh]: 'found' });
      return st;
    },
  });

  /* ---------- 4. Valid Palindrome ---------- */
  SOL.push({
    slug: 'valid-palindrome', title: 'Valid Palindrome', diff: 'Easy', algo: 'two-pointers',
    statement: 'A palindrome reads the same forwards and backwards. Decide whether the given word is one. (Here: letters only; the real problem also ignores spaces and punctuation.)',
    approach: ['Compare the first and last letters.', 'If they differ, it cannot be a palindrome.', 'If they match, move both pointers toward the middle and repeat.', 'If the pointers meet without a mismatch, it is a palindrome. O(n) time, O(1) space.'],
    time: 'O(n)', space: 'O(1)',
    code: ['lo = 0; hi = n - 1', 'while lo < hi:', '  if s[lo] != s[hi]: return false', '  lo++; hi--', 'return true'],
    fields: [{ key: 's', label: 'Word', type: 'text', max: 10 }],
    legend: [['compare', 'Letters being compared'], ['found', 'Matching pair'], ['swap', 'Mismatch']],
    random() { return { s: pick(['RACECAR', 'LEVEL', 'ABCBA', 'HELLO', 'NOON', 'ABCDA', 'MADAM', 'ABBA']) }; },
    run({ s }) {
      const a = s.split(''), n = a.length, st = []; let lo = 0, hi = n - 1; const ok = {};
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: A(a, { mode: 'cells', cls: { ...ok, ...cls }, ptrs: { lo, hi }, dim: lo < hi ? [lo, hi] : null, info: `word = "${s}"` }) });
      P(0, 'Put one pointer at each end of the word.');
      while (lo < hi) {
        if (a[lo] !== a[hi]) { P(2, `'${a[lo]}' ≠ '${a[hi]}' → the word is NOT a palindrome.`, { [lo]: 'swap', [hi]: 'swap' }); return st; }
        P(2, `'${a[lo]}' == '${a[hi]}' → they match.`, { [lo]: 'compare', [hi]: 'compare' });
        ok[lo] = ok[hi] = 'found'; lo++; hi--;
        P(3, 'Move both pointers one step toward the middle.');
      }
      P(4, 'Pointers met without any mismatch → it IS a palindrome.');
      return st;
    },
  });

  /* ---------- 5. Search in Rotated Sorted Array ---------- */
  SOL.push({
    slug: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', diff: 'Medium', algo: 'binary-search',
    statement: 'A sorted array was rotated at some unknown point (e.g. [1,2,3,4,5] → [4,5,1,2,3]). Find the index of a target in O(log n).',
    approach: ['Plain binary search needs a fully sorted array, but here at least ONE half around mid is always sorted.', 'Find which half is sorted by comparing a[lo] with a[mid].', 'Check whether the target lies inside that sorted half. If yes, search it; if no, search the other half.', 'The window halves every step → O(log n).'],
    time: 'O(log n)', space: 'O(1)',
    code: ['lo = 0; hi = n - 1', 'while lo <= hi:', '  mid = (lo + hi) / 2', '  if a[mid] == target: return mid', '  if a[lo] <= a[mid]:          // left half is sorted', '    if a[lo] <= target < a[mid]: hi = mid-1 else: lo = mid+1', '  else:                        // right half is sorted', '    if a[mid] < target <= a[hi]: lo = mid+1 else: hi = mid-1', 'return -1'],
    fields: [listF('Rotated array', 3, 12, 1, 99), { key: 'target', label: 'Target', type: 'num' }],
    legend: [['compare', 'mid'], ['sorted', 'The sorted half'], ['found', 'Found']],
    random() { const s = uniq(9, 3, 60).sort((x, y) => x - y), k = rnd(1, 7), arr = s.slice(k).concat(s.slice(0, k)); return { arr, target: Math.random() < 0.85 ? pick(arr) : 61 }; },
    run({ arr, target }) {
      const a = arr, n = a.length, st = [], info = `target = ${target}`; let lo = 0, hi = n - 1;
      const P = (line, msg, cls = {}, mid) => st.push({ line, msg, s: A(a, { mode: 'cells', cls, info, ptrs: mid == null ? { lo, hi } : { lo, mid, hi }, dim: lo <= hi ? [lo, hi] : [1, 0] }) });
      P(0, `Search for ${target}. The array is a rotated sorted array.`);
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        P(2, `mid = ${mid}, a[mid] = ${a[mid]}.`, { [mid]: 'compare' }, mid);
        if (a[mid] === target) { P(3, `a[${mid}] == ${target} → found at index ${mid}!`, { [mid]: 'found' }, mid); return st; }
        const cls = { [mid]: 'compare' };
        if (a[lo] <= a[mid]) {
          for (let x = lo; x <= mid; x++) cls[x] = x === mid ? 'compare' : 'sorted';
          if (a[lo] <= target && target < a[mid]) { P(5, `a[lo]=${a[lo]} ≤ a[mid]=${a[mid]} → the LEFT half is sorted. ${target} lies between ${a[lo]} and ${a[mid]} → search left.`, cls, mid); hi = mid - 1; }
          else { P(5, `The LEFT half (${a[lo]}…${a[mid]}) is sorted but ${target} is not inside it → search the right half.`, cls, mid); lo = mid + 1; }
        } else {
          for (let x = mid; x <= hi; x++) cls[x] = x === mid ? 'compare' : 'sorted';
          if (a[mid] < target && target <= a[hi]) { P(7, `a[lo]=${a[lo]} > a[mid]=${a[mid]} → the RIGHT half is sorted. ${target} lies between ${a[mid]} and ${a[hi]} → search right.`, cls, mid); lo = mid + 1; }
          else { P(7, `The RIGHT half (${a[mid]}…${a[hi]}) is sorted but ${target} is not inside it → search the left half.`, cls, mid); hi = mid - 1; }
        }
      }
      P(8, `The window is empty → ${target} is not in the array (return −1).`);
      return st;
    },
  });

  /* ---------- 6. Best Time to Buy and Sell Stock ---------- */
  SOL.push({
    slug: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', diff: 'Easy', algo: 'kadane',
    statement: 'Each number is a stock price on one day. Buy on one day and sell on a LATER day for the maximum profit.',
    approach: ['For each day, the best you can do if you sell today is: today\'s price − the cheapest price seen so far.', 'So walk through the days once, tracking the lowest price so far (minPrice).', 'At each day compute the profit of selling today and keep the maximum.', 'One pass, two variables → O(n) time, O(1) space.'],
    time: 'O(n)', space: 'O(1)',
    code: ['minPrice = a[0]; best = 0', 'for each later day i:', '  minPrice = min(minPrice, a[i])     // cheapest day to have bought', '  best = max(best, a[i] - minPrice)  // profit if we sell today', 'return best'],
    fields: [listF('Prices', 3, 12, 1, 99)],
    legend: [['pivot', 'Cheapest day so far (buy)'], ['compare', 'Today'], ['sorted', 'Best buy/sell days'], ['found', 'Final answer']],
    random() { return { arr: randArr(9, 3, 30) }; },
    run({ arr }) {
      const p = arr, n = p.length, st = []; let minI = 0, best = 0, bb = -1, bs = -1;
      const P = (line, msg, i, cls = {}) => { const c = {}; if (bb >= 0) { c[bb] = 'sorted'; c[bs] = 'sorted'; } c[minI] = 'pivot'; Object.assign(c, cls); st.push({ line, msg, s: A(p, { cls: c, ptrs: i >= 0 ? { today: i } : {}, info: `cheapest so far = ${p[minI]} · best profit = ${best}` }) }); };
      P(0, `Day 0: price ${p[0]}. Treat it as the cheapest price seen so far. Best profit starts at 0.`, -1);
      for (let i = 1; i < n; i++) {
        if (p[i] < p[minI]) { minI = i; P(2, `Day ${i}: price ${p[i]} is the new cheapest → a better day to have bought.`, i, { [i]: 'pivot' }); }
        else P(2, `Day ${i}: price ${p[i]} is not cheaper than ${p[minI]} → keep the earlier buy day.`, i, { [i]: 'compare' });
        const profit = p[i] - p[minI];
        if (profit > best) { best = profit; bb = minI; bs = i; P(3, `Sell today: ${p[i]} − ${p[minI]} = ${profit} → new best profit!`, i, { [i]: 'compare' }); }
        else P(3, `Sell today: ${p[i]} − ${p[minI]} = ${profit}, not better than ${best}.`, i, { [i]: 'compare' });
      }
      const c = {}; if (bb >= 0) { c[bb] = 'pivot'; c[bs] = 'found'; }
      st.push({ line: 4, msg: best > 0 ? `Max profit = ${best}: buy on day ${bb} (price ${p[bb]}), sell on day ${bs} (price ${p[bs]}).` : 'Prices only fall, so the best choice is to not trade: profit 0.', s: A(p, { cls: c, info: `best profit = ${best}` }) });
      return st;
    },
  });

  /* ---------- 7. Longest Substring Without Repeating Characters ---------- */
  SOL.push({
    slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', diff: 'Medium', algo: 'sliding-window',
    statement: 'Find the length of the longest stretch of consecutive characters in which no character appears twice.',
    approach: ['Use a window [left, right] that always contains NO repeated letter.', 'Move right one step at a time, adding a new character.', 'If that character already appears inside the window, jump left to just after its previous position — the repeat is gone.', 'Record the window length each time. Each character is handled once → O(n).'],
    time: 'O(n)', space: 'O(k)  (k = alphabet size)',
    code: ['left = 0; best = 0; last = {}   // last index of each char', 'for right from 0 to n-1:', '  if s[right] was seen at index ≥ left:', '    left = last[s[right]] + 1      // jump past the duplicate', '  last[s[right]] = right; best = max(best, right-left+1)', 'return best'],
    fields: [{ key: 's', label: 'String', type: 'text', max: 12 }],
    legend: [['active', 'Current window'], ['swap', 'Duplicate'], ['sorted', 'Best window so far'], ['found', 'Answer']],
    random() { return { s: pick(['ABCABCBB', 'PWWKEW', 'ABBA', 'DVDF', 'ABCDEFAB', 'BBBBB']) }; },
    run({ s }) {
      const a = s.split(''), n = a.length, st = [], last = {}; let l = 0, best = 0, bl = 0, br = -1;
      const P = (line, msg, r, cls = {}) => { const c = {}; for (let x = bl; x <= br; x++) c[x] = 'sorted'; for (let x = l; x <= r; x++) c[x] = 'active'; Object.assign(c, cls); st.push({ line, msg, s: A(a, { mode: 'cells', cls: c, win: r >= l ? [l, r] : null, ptrs: r >= 0 ? { right: r } : {}, info: `window = "${a.slice(l, r + 1).join('')}" · best length = ${best}` }) }); };
      P(0, 'Start with an empty window.', -1);
      for (let r = 0; r < n; r++) {
        const ch = a[r], prev = last[ch]; let dup = false;
        if (prev !== undefined && prev >= l) {
          dup = true;
          P(2, `Add '${ch}' at ${r}: it already appears at index ${prev}, inside the window → duplicate!`, r, { [prev]: 'swap', [r]: 'swap' });
          l = prev + 1;
          P(3, `Move left to ${l}, just past the old '${ch}', so the window has no repeats again.`, r);
        }
        last[ch] = r;
        if (r - l + 1 > best) { best = r - l + 1; bl = l; br = r; }
        P(4, `${dup ? '' : `'${ch}' is new to the window — extend it. `}Window "${a.slice(l, r + 1).join('')}" has length ${r - l + 1}. Best = ${best}.`, r);
      }
      const c = {}; for (let x = bl; x <= br; x++) c[x] = 'found';
      st.push({ line: 5, msg: `The longest substring without repeats has length ${best}.`, s: A(a, { mode: 'cells', cls: c, info: `best length = ${best}` }) });
      return st;
    },
  });

  /* ---------- 8. Sort Colors ---------- */
  SOL.push({
    slug: 'sort-colors', title: 'Sort Colors', diff: 'Medium', algo: 'quick-sort',
    statement: 'The array only contains 0, 1 and 2 (red, white, blue). Sort it in place in a single pass, without using a library sort.',
    approach: ['This is the "Dutch national flag" problem — a 3-way partition, like quick sort with two pivots.', 'Keep three zones: everything before low is 0, everything after high is 2, and between low and mid is 1. Between mid and high is still unknown.', 'Look at a[mid]: a 0 is swapped to the front (low), a 1 is already fine, a 2 is swapped to the back (high).', 'After a swap with high we do NOT move mid — the value swapped in is still unchecked.'],
    time: 'O(n)', space: 'O(1)',
    code: ['low = 0; mid = 0; high = n - 1', 'while mid <= high:', '  if a[mid] == 0: swap(a[low], a[mid]); low++; mid++', '  elif a[mid] == 1: mid++', '  else: swap(a[mid], a[high]); high--'],
    fields: [listF('Array of 0/1/2', 3, 12, 0, 2)],
    legend: [['swap', '0 (red)'], ['', '1 (white)'], ['active', '2 (blue)']],
    random() { return { arr: Array.from({ length: 10 }, () => rnd(0, 2)) }; },
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = []; let low = 0, mid = 0, high = n - 1;
      const P = (line, msg, done) => { const c = {}; a.forEach((v, i) => { if (v === 0) c[i] = 'swap'; else if (v === 2) c[i] = 'active'; }); st.push({ line, msg, s: A(a, { mode: 'cells', cls: c, ptrs: { low, mid, high }, dim: !done && mid <= high ? [mid, high] : null, info: 'faded = already placed · bright = still to check' }) }); };
      P(0, 'low and mid start at the left, high at the right. Everything is unchecked.');
      while (mid <= high) {
        const v = a[mid];
        if (v === 0) { [a[low], a[mid]] = [a[mid], a[low]]; low++; mid++; P(2, `a[mid] was 0 (red): swap it to the front zone, then advance low and mid.`); }
        else if (v === 1) { mid++; P(3, `a[mid] was 1 (white): already in the middle zone → just advance mid.`); }
        else { [a[mid], a[high]] = [a[high], a[mid]]; high--; P(4, `a[mid] was 2 (blue): swap it to the back zone and shrink high. Do not move mid — the swapped-in value is unchecked.`); }
      }
      P(1, 'mid passed high → every value is placed: all 0s, then 1s, then 2s.', true);
      return st;
    },
  });

  /* ---------- 9. Number of Islands ---------- */
  const COL = ['sorted', 'pivot', 'compare', 'swap'];
  SOL.push({
    slug: 'number-of-islands', title: 'Number of Islands', diff: 'Medium', algo: 'dfs',
    statement: 'A grid contains 1 (land) and 0 (water). An island is a group of land cells connected up, down, left or right. Count the islands.',
    approach: ['Scan the grid cell by cell.', 'When you find land that has not been visited, that is a NEW island: add 1 to the count.', 'Then run DFS from that cell to mark every connected land cell as visited, so it is never counted again.', 'Every cell is visited a constant number of times → O(rows × cols).'],
    time: 'O(R·C)', space: 'O(R·C)',
    code: ['count = 0', 'for each cell (r, c):', '  if grid[r][c] is unvisited land:', '    count++; dfs(r, c)        // mark the whole island', 'return count', '', 'dfs(r, c):', '  if out of bounds, water, or visited: return', '  mark (r, c) visited', '  dfs on up, down, left, right'],
    fields: [],
    legend: [['active', 'Cell being visited'], ['sorted', 'Island A / C…'], ['pivot', 'Island B / D…']],
    random() {
      const R = 5, C = 6; const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => (Math.random() < 0.45 ? 1 : 0)));
      if (!grid.flat().includes(1)) grid[2][2] = 1; return { grid };
    },
    run({ grid }) {
      const R = grid.length, C = grid[0].length, st = [], vis = grid.map(r => r.map(() => null));
      const rows = Array.from({ length: R }, (_, i) => 'r' + i), cols = Array.from({ length: C }, (_, i) => 'c' + i); let count = 0;
      const P = (line, msg, act) => {
        const cls = {}, cells = grid.map((row, r) => row.map((v, c) => {
          const k = `${r},${c}`;
          if (v === 0) cls[k] = 'water'; else if (vis[r][c]) cls[k] = COL[(vis[r][c].charCodeAt(0) - 65) % 4];
          return vis[r][c] || v;
        }));
        if (act) cls[act] = 'active';
        st.push({ line, msg, s: G(rows, cols, cells, cls, `islands counted so far: ${count}   (1 = land, 0 = water, letters = counted islands)`) });
      };
      function dfs(r, c, id) {
        if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] === 0 || vis[r][c]) return;
        vis[r][c] = id; P(8, `Visit land cell (${r},${c}) and mark it as part of island ${id}. Then try its 4 neighbours.`, `${r},${c}`);
        dfs(r - 1, c, id); dfs(r + 1, c, id); dfs(r, c - 1, id); dfs(r, c + 1, id);
      }
      P(0, 'Scan the grid for land. Water cells are faded.');
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        if (grid[r][c] === 1 && !vis[r][c]) {
          count++; const id = String.fromCharCode(64 + count);
          P(3, `Unvisited land at (${r},${c}) → a NEW island! count = ${count}. Flood-fill it with DFS.`, `${r},${c}`);
          dfs(r, c, id);
        }
      }
      P(4, `Scan complete → ${count} island${count === 1 ? '' : 's'}.`);
      return st;
    },
  });

  /* ---------- 10. Rotting Oranges ---------- */
  SOL.push({
    slug: 'rotting-oranges', title: 'Rotting Oranges', diff: 'Medium', algo: 'bfs',
    statement: 'In a grid, 1 is a fresh orange, 2 is rotten, 0 is empty. Every minute, fresh oranges next to a rotten one (up/down/left/right) become rotten. How many minutes until none are fresh? Return −1 if impossible.',
    approach: ['Rot spreads outward like a ripple — one "layer" per minute. That is BFS.', 'Start BFS from ALL rotten oranges at once (a multi-source BFS) and count the fresh ones.', 'Each minute, process everything currently in the queue and rot their fresh neighbours.', 'When the queue runs dry: if fresh oranges remain they were unreachable → −1, otherwise the minute count is the answer.'],
    time: 'O(R·C)', space: 'O(R·C)',
    code: ['queue = all rotten oranges; fresh = number of fresh; minutes = 0', 'while queue not empty and fresh > 0:', '  for each orange in the queue (this minute):', '    rot its fresh neighbours; fresh--; enqueue them', '  minutes++', 'return minutes if fresh == 0 else -1'],
    fields: [],
    legend: [['sorted', '1 = fresh'], ['swap', '2 = rotten'], ['active', 'Rotted this minute']],
    random() {
      const R = 5, C = 6; const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => { const x = Math.random(); return x < 0.15 ? 0 : x < 0.27 ? 2 : 1; }));
      if (!grid.flat().includes(2)) grid[rnd(0, R - 1)][rnd(0, C - 1)] = 2; return { grid };
    },
    run({ grid }) {
      const R = grid.length, C = grid[0].length, g = grid.map(r => r.slice()), st = [];
      const rows = Array.from({ length: R }, (_, i) => 'r' + i), cols = Array.from({ length: C }, (_, i) => 'c' + i);
      let queue = [], fresh = 0, minutes = 0;
      g.forEach((row, r) => row.forEach((v, c) => { if (v === 2) queue.push([r, c]); if (v === 1) fresh++; }));
      const P = (line, msg, nw = []) => {
        const cls = {}; g.forEach((row, r) => row.forEach((v, c) => { cls[`${r},${c}`] = v === 0 ? 'water' : v === 1 ? 'sorted' : 'swap'; }));
        nw.forEach(([r, c]) => cls[`${r},${c}`] = 'active');
        st.push({ line, msg, s: { ...G(rows, cols, g, cls, `minute ${minutes} · fresh oranges left: ${fresh}`), aux: { title: 'Rotten queue (row,col)', items: queue.map(q => q.join(',')) } } });
      };
      P(0, `All ${queue.length} rotten orange${queue.length === 1 ? '' : 's'} go into the queue (they all start spreading at minute 0). ${fresh} fresh orange${fresh === 1 ? '' : 's'} to go.`);
      while (queue.length && fresh > 0) {
        const next = [];
        for (const [r, c] of queue) for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < R && nc < C && g[nr][nc] === 1) { g[nr][nc] = 2; fresh--; next.push([nr, nc]); }
        }
        if (!next.length) { queue = []; break; }
        minutes++; queue = next;
        P(3, `Minute ${minutes}: ${next.length} fresh orange${next.length === 1 ? '' : 's'} next to rotten ones turn rotten (highlighted blue).`, next);
      }
      P(5, fresh === 0 ? `No fresh oranges left → answer = ${minutes} minute${minutes === 1 ? '' : 's'}.` : `${fresh} fresh orange${fresh === 1 ? ' is' : 's are'} unreachable (cut off by empty cells) → answer = −1.`);
      return st;
    },
  });

  /* ---------- 11. Climbing Stairs ---------- */
  SOL.push({
    slug: 'climbing-stairs', title: 'Climbing Stairs', diff: 'Easy', algo: 'coin-change',
    statement: 'You climb a staircase of n steps, taking 1 or 2 steps at a time. In how many distinct ways can you reach the top?',
    approach: ['To stand on step i, your last move came from step i−1 (a 1-step) or from step i−2 (a 2-step).', 'So ways(i) = ways(i−1) + ways(i−2) — the Fibonacci sequence!', 'Fill a table from the bottom up: ways(0) = 1 (do nothing) and ways(1) = 1.', 'We only need the previous two values, so space can even be reduced to O(1).'],
    time: 'O(n)', space: 'O(n)',
    code: ['dp[0] = 1; dp[1] = 1', 'for i from 2 to n:', '  dp[i] = dp[i-1] + dp[i-2]   // arrive from 1 step below or 2 steps below', 'return dp[n]'],
    fields: [{ key: 'n', label: 'Steps n', type: 'num', lo: 1, hi: 12 }],
    legend: [['active', 'dp[i] being computed'], ['compare', 'The two cells it adds'], ['found', 'Answer']],
    random() { return { n: rnd(5, 9) }; },
    run({ n }) {
      const dp = Array(n + 1).fill(null), st = [], cols = Array.from({ length: n + 1 }, (_, i) => i);
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(['ways'], cols, [dp], cls, `staircase with ${n} step${n === 1 ? '' : 's'} · column = step number`) });
      dp[0] = 1; dp[1] = 1;
      P(0, 'There is 1 way to be on step 0 (do nothing) and 1 way to reach step 1 (one single step).');
      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        P(2, `Step ${i}: come from step ${i - 1} (${dp[i - 1]} ways) or from step ${i - 2} (${dp[i - 2]} ways) → ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} ways.`, { [`0,${i}`]: 'active', [`0,${i - 1}`]: 'compare', [`0,${i - 2}`]: 'compare' });
      }
      P(3, `There are ${dp[n]} distinct ways to climb ${n} steps.`, { [`0,${n}`]: 'found' });
      return st;
    },
  });

  /* ---------- 12. House Robber ---------- */
  SOL.push({
    slug: 'house-robber', title: 'House Robber', diff: 'Medium', algo: 'coin-change',
    statement: 'Each number is the money in a house along a street. You cannot rob two adjacent houses. What is the most you can steal?',
    approach: ['At house i you have two choices: skip it (keep the best from house i−1), or rob it (its money + the best up to house i−2, since i−1 is off limits).', 'dp[i] = max(dp[i−1], dp[i−2] + money[i]).', 'Fill left to right. The last cell is the answer.', 'Trace back to see which houses were actually robbed.'],
    time: 'O(n)', space: 'O(n)',
    code: ['dp[0] = a[0]; dp[1] = max(a[0], a[1])', 'for i from 2 to n-1:', '  skip = dp[i-1]            // do not rob house i', '  rob  = dp[i-2] + a[i]     // rob house i, skip its neighbour', '  dp[i] = max(skip, rob)', 'return dp[n-1]'],
    fields: [listF('Money per house', 2, 10, 1, 30)],
    legend: [['active', 'dp[i] being computed'], ['compare', 'Skip / rob sources'], ['found', 'Houses robbed']],
    random() { return { arr: randArr(7, 1, 9) }; },
    run({ arr }) {
      const a = arr, n = a.length, dp = Array(n).fill(null), st = [], cols = a.map((_, i) => 'house ' + i);
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(['money', 'best total'], cols, [a, dp], cls, 'You may not rob two neighbouring houses') });
      dp[0] = a[0]; dp[1] = Math.max(a[0], a[1]);
      P(0, `House 0: best is ${a[0]}. House 1: best is max(${a[0]}, ${a[1]}) = ${dp[1]} — you can only take one of the first two.`, { '1,0': 'active', '1,1': 'active' });
      for (let i = 2; i < n; i++) {
        const skip = dp[i - 1], rob = dp[i - 2] + a[i]; dp[i] = Math.max(skip, rob);
        P(i >= 2 ? 4 : 0, `House ${i}: skip → ${skip}, or rob → ${dp[i - 2]} + ${a[i]} = ${rob}. Best = ${dp[i]}.`, { [`1,${i}`]: 'active', [`1,${i - 1}`]: 'compare', [`1,${i - 2}`]: 'compare', [`0,${i}`]: 'compare' });
      }
      const path = {}, robbed = []; let i = n - 1;
      while (i >= 0) { if (i >= 1 && dp[i] === dp[i - 1]) i--; else { robbed.push(i); path[`0,${i}`] = 'found'; i -= 2; } }
      P(5, `Maximum loot = ${dp[n - 1]}, by robbing house${robbed.length > 1 ? 's' : ''} ${robbed.reverse().join(', ')}.`, path);
      return st;
    },
  });

  /* ---------- 13. Edit Distance ---------- */
  SOL.push({
    slug: 'edit-distance', title: 'Edit Distance', diff: 'Medium', algo: 'lcs',
    statement: 'What is the minimum number of single-letter edits (insert, delete, replace) needed to turn word A into word B?',
    approach: ['dp[i][j] = fewest edits to turn the first i letters of A into the first j letters of B.', 'Turning a word into an empty word takes i deletions; building a word from empty takes j insertions — that fills row 0 and column 0.', 'If the new letters match, no edit is needed: copy the diagonal.', 'Otherwise take 1 + the cheapest of: replace (diagonal), delete (up), insert (left).'],
    time: 'O(m·n)', space: 'O(m·n)',
    code: ['dp[i][0] = i; dp[0][j] = j       // to/from an empty word', 'for i in 1..m: for j in 1..n:', '  if A[i] == B[j]:', '    dp[i][j] = dp[i-1][j-1]       // letters match: free', '  else:', '    dp[i][j] = 1 + min(dp[i-1][j-1],   // replace', '                       dp[i-1][j],     // delete', '                       dp[i][j-1])     // insert', 'return dp[m][n]'],
    fields: [{ key: 'a', label: 'From word', type: 'text', max: 8 }, { key: 'b', label: 'To word', type: 'text', max: 8 }],
    legend: [['active', 'Cell being filled'], ['compare', 'Cells it can come from'], ['found', 'Traceback path']],
    random() { return pick([{ a: 'HORSE', b: 'ROS' }, { a: 'KITTEN', b: 'SITTING' }, { a: 'CAT', b: 'CUT' }, { a: 'SUNDAY', b: 'SATURDAY' }]); },
    run({ a, b }) {
      const m = a.length, n = b.length, st = [], dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
      for (let j = 0; j <= n; j++) dp[0][j] = j; for (let i = 0; i <= m; i++) dp[i][0] = i;
      const rows = ['∅', ...a], cols = ['∅', ...b], info = `turn "${a}" into "${b}"`;
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(rows, cols, dp, cls, info) });
      P(0, 'First row/column: turning a word into an empty word costs one deletion per letter; building from empty costs one insertion per letter.');
      for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
        const cell = `${i},${j}`;
        if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1]; P(3, `'${a[i - 1]}' == '${b[j - 1]}' → no edit needed, copy the diagonal: ${dp[i][j]}.`, { [cell]: 'active', [`${i - 1},${j - 1}`]: 'compare' }); }
        else {
          const rep = dp[i - 1][j - 1], del = dp[i - 1][j], ins = dp[i][j - 1]; dp[i][j] = 1 + Math.min(rep, del, ins);
          P(5, `'${a[i - 1]}' ≠ '${b[j - 1]}' → 1 + min(replace ${rep}, delete ${del}, insert ${ins}) = ${dp[i][j]}.`, { [cell]: 'active', [`${i - 1},${j - 1}`]: 'compare', [`${i - 1},${j}`]: 'compare', [`${i},${j - 1}`]: 'compare' });
        }
      }
      let i = m, j = n; const path = { [`${i},${j}`]: 'found' };
      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { i--; j--; }
        else if (i > 0 && j > 0 && dp[i - 1][j - 1] === dp[i][j] - 1) { i--; j--; }
        else if (i > 0 && dp[i - 1][j] === dp[i][j] - 1) i--;
        else j--;
        path[`${i},${j}`] = 'found';
      }
      P(8, `Minimum edits = ${dp[m][n]}. The green path shows the sequence of edits.`, path);
      return st;
    },
  });

  /* ---------- 14. Jump Game II ---------- */
  SOL.push({
    slug: 'jump-game-ii', title: 'Jump Game II', diff: 'Medium', algo: 'jump-game',
    statement: 'Each number is the maximum jump length from that cell. You can always reach the end. What is the minimum number of jumps?',
    approach: ['Think in "layers", like BFS: everything reachable with 1 jump, then with 2 jumps, and so on.', 'curEnd is the last cell reachable with the current number of jumps; farthest is the furthest cell reachable with one more.', 'Scan left to right updating farthest. When you reach curEnd, you must jump again: jumps++ and curEnd = farthest.', 'One pass → O(n).'],
    time: 'O(n)', space: 'O(1)',
    code: ['jumps = 0; curEnd = 0; farthest = 0', 'for i from 0 to n-2:', '  farthest = max(farthest, i + a[i])', '  if i == curEnd:            // used up the range of this jump', '    jumps++; curEnd = farthest', 'return jumps'],
    fields: [listF('Jump lengths', 3, 12, 1, 9)],
    legend: [['active', 'Current cell i'], ['sorted', 'Reachable with current jumps'], ['compare', 'Farthest reach']],
    random() { return { arr: Array.from({ length: 9 }, () => rnd(1, 4)) }; },
    run({ arr }) {
      const a = arr, n = a.length, st = []; let jumps = 0, curEnd = 0, far = 0;
      const P = (line, msg, i) => {
        const c = {}; for (let x = 0; x <= Math.min(curEnd, n - 1); x++) c[x] = 'sorted'; c[Math.min(far, n - 1)] = 'compare'; if (i >= 0) c[i] = 'active';
        st.push({ line, msg, s: A(a, { mode: 'cells', cls: c, ptrs: { ...(i >= 0 ? { i } : {}), curEnd: Math.min(curEnd, n - 1), far: Math.min(far, n - 1) }, info: `jumps = ${jumps} · range of current jump ends at ${curEnd} · farthest = ${far}` }) });
      };
      P(0, 'Start at index 0 with zero jumps. The range reachable so far is just cell 0.', 0);
      for (let i = 0; i < n - 1; i++) {
        far = Math.max(far, i + a[i]);
        if (i === curEnd) { jumps++; curEnd = far; P(4, `Reached the end of the current range at ${i} → we must jump. jumps = ${jumps}; the new range extends to ${Math.min(curEnd, n - 1)}.`, i); }
        else P(2, `From ${i} we can reach ${i + a[i]}, so farthest = ${far}. Still inside the current range (ends at ${curEnd}), no new jump yet.`, i);
        if (curEnd >= n - 1) break;
      }
      P(5, `The end is reachable → the minimum number of jumps is ${jumps}.`, -1);
      return st;
    },
  });

  /* ---------- 15. Subsets ---------- */
  SOL.push({
    slug: 'subsets', title: 'Subsets', diff: 'Medium', algo: 'n-queens',
    statement: 'Given a list of distinct numbers, return all possible subsets (the power set), including the empty one.',
    approach: ['Build subsets with backtracking. The current choices live in a list called path.', 'Every path you ever reach is a valid subset, so record it immediately.', 'Then, for each remaining number: choose it (push), explore deeper, and un-choose it (pop) to try the next number.', 'n numbers give 2ⁿ subsets, which is why the time is O(n·2ⁿ).'],
    time: 'O(n·2ⁿ)', space: 'O(n)',
    code: ['result = []', 'dfs(start, path):', '  result.add(copy of path)         // every path is a valid subset', '  for i from start to n-1:', '    path.push(a[i])                // choose', '    dfs(i + 1, path)               // explore', '    path.pop()                     // un-choose (backtrack)'],
    fields: [listF('Numbers', 1, 4, 1, 9)],
    legend: [['sorted', 'Chosen (in path)'], ['active', 'Number just considered']],
    random() { return { arr: uniq(3, 1, 9) }; },
    run({ arr }) {
      const a = arr, n = a.length, st = [], path = [], res = [];
      const fmt = (p) => '[' + p.map(i => a[i]).join(',') + ']';
      const P = (line, msg, act = -1) => { const c = {}; path.forEach(i => c[i] = 'sorted'); if (act >= 0) c[act] = 'active'; st.push({ line, msg, s: S(a, { mode: 'cells', cls: c, info: `path = ${fmt(path)}` }, { title: `Subsets found (${res.length} of ${2 ** n})`, items: res }) }); };
      function dfs(start) {
        res.push(fmt(path)); P(2, `Record the current path ${fmt(path)} as a subset${path.length ? '' : ' (the empty subset)'}.`);
        for (let i = start; i < n; i++) {
          path.push(i); P(4, `Choose ${a[i]} → path = ${fmt(path)}.`, i);
          dfs(i + 1);
          path.pop(); P(6, `Un-choose ${a[i]} (backtrack) → path = ${fmt(path)}.`, i);
        }
      }
      P(0, `Start with an empty path. We expect 2^${n} = ${2 ** n} subsets in total.`);
      dfs(0);
      P(0, `Done — all ${res.length} subsets generated.`);
      return st;
    },
  });

  window.SOLUTIONS = SOL;
})();
