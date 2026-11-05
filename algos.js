/* AlgoLab — algorithm catalogue. Each algorithm precomputes an array of steps:
   { line: <code line to highlight>, msg: <explanation>, s: <visual state> }
   The UI (app.js) just replays those steps. */
(function () {
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const randArr = (n, lo = 5, hi = 60) => Array.from({ length: n }, () => rnd(lo, hi));
  const uniq = (n, lo, hi) => { const s = new Set(); while (s.size < n) s.add(rnd(lo, hi)); return [...s]; };
  const pick = (arr) => arr[rnd(0, arr.length - 1)];

  /* ---------- visual state builders ---------- */
  function A(arr, o = {}) {
    return { type: 'array', mode: o.mode || 'bars', arr: arr.slice(), cls: o.cls || {}, ptrs: o.ptrs || {},
             dim: o.dim || null, win: o.win || null, info: o.info || '' };
  }
  function G(rows, cols, cells, cls, info) {
    return { type: 'grid', rows, cols, cells: cells.map(r => r.map(v => (v === Infinity ? '∞' : v))), cls: { ...cls }, info: info || '' };
  }

  /* ---------- categories ---------- */
  const CATS = [
    { id: 'sorting', name: 'Sorting', hue: 215, blurb: 'Put values in order — the foundation of many other techniques.' },
    { id: 'searching', name: 'Searching', hue: 160, blurb: 'Find an item fast by scanning or by halving the search space.' },
    { id: 'pointers', name: 'Two Pointers & Sliding Window', hue: 30, blurb: 'Turn nested loops into a single pass over arrays and strings.' },
    { id: 'graph', name: 'Graph Traversal & Paths', hue: 285, blurb: 'Explore networks of nodes and edges, and find shortest routes.' },
    { id: 'dp', name: 'Dynamic Programming', hue: 340, blurb: 'Solve big problems by remembering answers to overlapping sub-problems.' },
    { id: 'greedy', name: 'Greedy', hue: 95, blurb: 'Make the best local choice at each step and never look back.' },
    { id: 'backtracking', name: 'Backtracking', hue: 0, blurb: 'Build a solution step by step, undoing choices that lead nowhere.' },
  ];

  /* ---------- shared field definitions ---------- */
  const arrField = (o = {}) => ({ key: 'arr', label: o.label || 'Array', type: 'list', min: 3, max: o.max || 14, lo: o.lo ?? 1, hi: o.hi ?? 99 });
  const sortFields = [arrField()];
  const sortRandom = () => ({ arr: randArr(rnd(8, 11), 4, 60) });
  const sortLegend = [['compare', 'Comparing'], ['swap', 'Swapping / writing'], ['pivot', 'Pivot / minimum'], ['sorted', 'In final position']];

  const L = (...lines) => lines;
  const ALGOS = [];

  /* =====================  SORTING  ===================== */
  ALGOS.push({
    id: 'bubble-sort', name: 'Bubble Sort', cat: 'sorting', time: 'O(n²)', space: 'O(1)',
    blurb: 'Repeatedly swap neighbouring values that are out of order; the largest value "bubbles" to the end on every pass.',
    how: ['Walk through the array comparing each pair of neighbours.', 'If the left one is bigger, swap them.', 'After one pass the biggest value is at the end — it is now fixed.', 'Repeat on the shorter unsorted part. If a pass makes no swaps, stop early.'],
    code: L('for i from 0 to n-2:', '  swapped = false', '  for j from 0 to n-i-2:', '    if a[j] > a[j+1]:', '      swap(a[j], a[j+1]); swapped = true', '  if not swapped: break'),
    fields: sortFields, random: sortRandom, legend: sortLegend,
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = [], done = new Set();
      const P = (line, msg, cls = {}, ptrs = {}) => { const c = {}; done.forEach(i => c[i] = 'sorted'); Object.assign(c, cls); st.push({ line, msg, s: A(a, { cls: c, ptrs }) }); };
      P(0, 'Start: bubble the largest value to the right on every pass.');
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          P(3, `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}.`, { [j]: 'compare', [j + 1]: 'compare' }, { j });
          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true;
            P(4, `${a[j + 1]} > ${a[j]}, so swap them.`, { [j]: 'swap', [j + 1]: 'swap' }, { j });
          }
        }
        done.add(n - i - 1);
        P(2, `Pass ${i + 1} done — a[${n - i - 1}] = ${a[n - i - 1]} is in its final place.`);
        if (!swapped) { for (let k = 0; k < n - i - 1; k++) done.add(k); P(5, 'No swaps in this pass, so the array is already sorted — stop early.'); return st; }
      }
      done.add(0); P(0, 'Sorted!'); return st;
    },
    problems: [['Sort Colors', 'sort-colors', 'Medium'], ['Merge Sorted Array', 'merge-sorted-array', 'Easy'], ['Squares of a Sorted Array', 'squares-of-a-sorted-array', 'Easy'], ['Sort an Array', 'sort-an-array', 'Medium']],
  });

  ALGOS.push({
    id: 'selection-sort', name: 'Selection Sort', cat: 'sorting', time: 'O(n²)', space: 'O(1)',
    blurb: 'Find the smallest remaining value and put it at the front. Few swaps, but always O(n²) comparisons.',
    how: ['Treat the left part as sorted (empty at first).', 'Scan the unsorted part to find its minimum.', 'Swap that minimum into the first unsorted position.', 'Grow the sorted part by one and repeat.'],
    code: L('for i from 0 to n-2:', '  min = i', '  for j from i+1 to n-1:', '    if a[j] < a[min]: min = j', '  swap(a[i], a[min])'),
    fields: sortFields, random: sortRandom, legend: sortLegend,
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = [], done = new Set();
      const P = (line, msg, cls = {}, ptrs = {}) => { const c = {}; done.forEach(i => c[i] = 'sorted'); Object.assign(c, cls); st.push({ line, msg, s: A(a, { cls: c, ptrs }) }); };
      for (let i = 0; i < n - 1; i++) {
        let min = i;
        P(1, `Position ${i}: assume a[${i}]=${a[i]} is the smallest so far.`, { [i]: 'pivot' }, { i, min });
        for (let j = i + 1; j < n; j++) {
          const better = a[j] < a[min];
          P(3, `Is a[${j}]=${a[j]} < current minimum ${a[min]}? ${better ? 'Yes — new minimum.' : 'No.'}`, { [min]: 'pivot', [j]: 'compare' }, { i, min, j });
          if (better) min = j;
        }
        if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; P(4, `Swap the minimum ${a[i]} into position ${i}.`, { [i]: 'swap', [min]: 'swap' }, { i }); }
        else P(4, `a[${i}] is already the minimum — no swap needed.`, { [i]: 'pivot' }, { i });
        done.add(i);
      }
      done.add(n - 1); P(0, 'Sorted!'); return st;
    },
    problems: [['Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Medium'], ['Relative Sort Array', 'relative-sort-array', 'Easy'], ['Height Checker', 'height-checker', 'Easy'], ['Sort Colors', 'sort-colors', 'Medium']],
  });

  ALGOS.push({
    id: 'insertion-sort', name: 'Insertion Sort', cat: 'sorting', time: 'O(n²)', space: 'O(1)',
    blurb: 'Grow a sorted prefix by sliding each new value left into its correct slot — like sorting a hand of playing cards.',
    how: ['The first element alone is a sorted prefix.', 'Take the next element and compare it with the one on its left.', 'Keep swapping left while the left neighbour is bigger.', 'Stop when it fits; the prefix is now one longer. Great for nearly-sorted data.'],
    code: L('for i from 1 to n-1:', '  j = i', '  while j > 0 and a[j-1] > a[j]:', '    swap(a[j-1], a[j]); j = j - 1'),
    fields: sortFields, random: sortRandom, legend: [['active', 'Value being inserted'], ['compare', 'Comparing'], ['swap', 'Swapping'], ['sorted', 'Sorted prefix']],
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = []; let cur = 1;
      const P = (line, msg, cls = {}, ptrs = {}) => { const c = {}; for (let k = 0; k < cur; k++) c[k] = 'sorted'; Object.assign(c, cls); st.push({ line, msg, s: A(a, { cls: c, ptrs }) }); };
      for (let i = 1; i < n; i++) {
        cur = i; let j = i;
        P(0, `Take a[${i}]=${a[i]} and slide it left into the sorted prefix.`, { [i]: 'active' }, { i });
        while (j > 0) {
          P(2, `Is a[${j - 1}]=${a[j - 1]} > a[${j}]=${a[j]}?`, { [j - 1]: 'compare', [j]: 'compare' }, { i });
          if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; P(3, 'Yes — swap to move it left.', { [j - 1]: 'swap', [j]: 'swap' }, { i }); j--; }
          else break;
        }
      }
      cur = n; P(0, 'Sorted!'); return st;
    },
    problems: [['Insertion Sort List', 'insertion-sort-list', 'Medium'], ['Sort List', 'sort-list', 'Medium'], ['Largest Number', 'largest-number', 'Medium'], ['Sort Colors', 'sort-colors', 'Medium']],
  });

  ALGOS.push({
    id: 'merge-sort', name: 'Merge Sort', cat: 'sorting', time: 'O(n log n)', space: 'O(n)',
    blurb: 'Divide and conquer: split the array in half, sort each half recursively, then merge the two sorted halves.',
    how: ['Split the range in the middle until each piece has one element.', 'A single element is already sorted.', 'Merge two sorted halves by repeatedly taking the smaller front value.', 'Merging bigger and bigger pieces rebuilds the whole sorted array. Stable and always O(n log n).'],
    code: L('mergeSort(l, r):', '  if l >= r: return', '  m = floor((l + r) / 2)', '  mergeSort(l, m)', '  mergeSort(m + 1, r)', '  merge(l, m, r)', '', 'merge(l, m, r):  // two sorted halves -> one', '  L = a[l..m]; R = a[m+1..r]', '  while both halves non-empty:', '    write the smaller front value to a[k]; k++', '  copy whatever is left over'),
    fields: sortFields, random: () => ({ arr: randArr(rnd(7, 10), 4, 60) }),
    legend: [['active', 'Left half'], ['pivot', 'Right half'], ['swap', 'Value written'], ['sorted', 'Merged']],
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = [];
      const P = (line, msg, cls, lo, hi, ptrs = {}) => st.push({ line, msg, s: A(a, { cls, dim: [lo, hi], ptrs }) });
      function merge(l, m, r) {
        const Lh = a.slice(l, m + 1), Rh = a.slice(m + 1, r + 1); let i = 0, j = 0, k = l;
        const base = () => { const c = {}; for (let x = l; x <= m; x++) c[x] = 'active'; for (let x = m + 1; x <= r; x++) c[x] = 'pivot'; return c; };
        while (i < Lh.length && j < Rh.length) {
          const takeL = Lh[i] <= Rh[j];
          a[k] = takeL ? Lh[i] : Rh[j];
          const c = base(); c[k] = 'swap';
          P(10, `Compare ${Lh[i]} (left) and ${Rh[j]} (right) → write ${a[k]} to a[${k}].`, c, l, r, { k });
          takeL ? i++ : j++; k++;
        }
        while (i < Lh.length) { a[k] = Lh[i++]; const c = base(); c[k] = 'swap'; P(11, `Right half is empty — copy ${a[k]} from the left half.`, c, l, r, { k }); k++; }
        while (j < Rh.length) { a[k] = Rh[j++]; const c = base(); c[k] = 'swap'; P(11, `Left half is empty — copy ${a[k]} from the right half.`, c, l, r, { k }); k++; }
        const c = {}; for (let x = l; x <= r; x++) c[x] = 'sorted';
        P(5, `Merged a[${l}..${r}] into a sorted run.`, c, l, r);
      }
      function ms(l, r) {
        if (l >= r) return;
        const m = (l + r) >> 1; const c = {}; for (let x = l; x <= m; x++) c[x] = 'active'; for (let x = m + 1; x <= r; x++) c[x] = 'pivot';
        P(2, `Split a[${l}..${r}] into [${l}..${m}] and [${m + 1}..${r}].`, c, l, r);
        ms(l, m); ms(m + 1, r); merge(l, m, r);
      }
      P(0, 'Start: recursively split, then merge.', {}, 0, n - 1);
      ms(0, n - 1);
      const c = {}; for (let x = 0; x < n; x++) c[x] = 'sorted'; st.push({ line: 0, msg: 'Sorted!', s: A(a, { cls: c }) });
      return st;
    },
    problems: [['Sort List', 'sort-list', 'Medium'], ['Merge Two Sorted Lists', 'merge-two-sorted-lists', 'Easy'], ['Merge k Sorted Lists', 'merge-k-sorted-lists', 'Hard'], ['Count of Smaller Numbers After Self', 'count-of-smaller-numbers-after-self', 'Hard'], ['Reverse Pairs', 'reverse-pairs', 'Hard']],
  });

  ALGOS.push({
    id: 'quick-sort', name: 'Quick Sort', cat: 'sorting', time: 'O(n log n) avg · O(n²) worst', space: 'O(log n)',
    blurb: 'Pick a pivot, move smaller values to its left and larger to its right, then sort each side recursively.',
    how: ['Choose the last element as the pivot.', 'Sweep j across the range; whenever a[j] < pivot, swap it into the "smaller" zone (index i).', 'Finally swap the pivot into position i — it is now exactly where it belongs.', 'Recursively sort the left and right parts.'],
    code: L('quickSort(lo, hi):', '  if lo >= hi: return', '  pivot = a[hi]; i = lo', '  for j from lo to hi-1:', '    if a[j] < pivot:', '      swap(a[i], a[j]); i++', '  swap(a[i], a[hi])   // pivot lands in its final spot', '  quickSort(lo, i-1); quickSort(i+1, hi)'),
    fields: sortFields, random: sortRandom, legend: sortLegend,
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = [], done = new Set();
      const P = (line, msg, cls, ptrs, lo, hi) => { const c = {}; done.forEach(i => c[i] = 'sorted'); Object.assign(c, cls); st.push({ line, msg, s: A(a, { cls: c, ptrs, dim: [lo, hi] }) }); };
      function qs(lo, hi) {
        if (lo > hi) return;
        if (lo === hi) { done.add(lo); P(1, `Single element a[${lo}] is already in place.`, {}, {}, lo, hi); return; }
        const p = a[hi]; let i = lo;
        P(2, `Range [${lo}..${hi}]: pivot = a[${hi}] = ${p}.`, { [hi]: 'pivot' }, { i }, lo, hi);
        for (let j = lo; j < hi; j++) {
          P(4, `Is a[${j}]=${a[j]} < pivot ${p}?`, { [hi]: 'pivot', [j]: 'compare' }, { i, j }, lo, hi);
          if (a[j] < p) {
            if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; P(5, `Yes — swap a[${i}] and a[${j}], grow the "smaller" zone.`, { [hi]: 'pivot', [i]: 'swap', [j]: 'swap' }, { i, j }, lo, hi); }
            else P(5, `Yes — already at i, just grow the "smaller" zone.`, { [hi]: 'pivot', [i]: 'swap' }, { i, j }, lo, hi);
            i++;
          }
        }
        [a[i], a[hi]] = [a[hi], a[i]]; done.add(i);
        P(6, `Swap pivot ${p} into index ${i} — it is now in its final position.`, { [i]: 'pivot' }, {}, lo, hi);
        qs(lo, i - 1); qs(i + 1, hi);
      }
      P(0, 'Start quick sort.', {}, {}, 0, n - 1);
      qs(0, n - 1);
      for (let k = 0; k < n; k++) done.add(k); P(0, 'Sorted!', {}, {}, 0, n - 1);
      return st;
    },
    problems: [['Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Medium'], ['Sort Colors', 'sort-colors', 'Medium'], ['Top K Frequent Elements', 'top-k-frequent-elements', 'Medium'], ['K Closest Points to Origin', 'k-closest-points-to-origin', 'Medium']],
  });

  ALGOS.push({
    id: 'heap-sort', name: 'Heap Sort', cat: 'sorting', time: 'O(n log n)', space: 'O(1)',
    blurb: 'Turn the array into a max-heap, then repeatedly move the biggest value (the root) to the end.',
    how: ['A max-heap keeps every parent ≥ its children; node i has children 2i+1 and 2i+2.', 'Build the heap by sifting down every non-leaf node, starting from the last.', 'Swap the root (maximum) with the last heap element — it is now sorted.', 'Sift the new root down to restore the heap, shrink the heap by one, repeat.'],
    code: L('for i from n/2-1 down to 0: siftDown(i, n)   // build max-heap', 'for end from n-1 down to 1:', '  swap(a[0], a[end])        // max goes to the end', '  siftDown(0, end)', '', 'siftDown(i, size):', '  largest = max of a[i] and its children (2i+1, 2i+2)', '  if largest != i: swap(a[i], a[largest]); continue down'),
    fields: sortFields, random: () => ({ arr: randArr(rnd(8, 10), 4, 60) }),
    legend: [['pivot', 'Node being sifted'], ['compare', 'Its children'], ['swap', 'Swapping'], ['sorted', 'In final position']],
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = [], done = new Set();
      const P = (line, msg, cls = {}, size = n) => { const c = {}; done.forEach(i => c[i] = 'sorted'); Object.assign(c, cls); st.push({ line, msg, s: A(a, { cls: c, dim: [0, size - 1] }) }); };
      function sift(i, size) {
        while (true) {
          const l = 2 * i + 1, r = 2 * i + 2; let big = i; const cls = { [i]: 'pivot' };
          if (l < size) cls[l] = 'compare'; if (r < size) cls[r] = 'compare';
          P(6, `Compare a[${i}]=${a[i]} with its ${l < size ? 'children' : 'children (none — it is a leaf)'}.`, cls, size);
          if (l < size && a[l] > a[big]) big = l; if (r < size && a[r] > a[big]) big = r;
          if (big === i) { P(7, `${a[i]} is ≥ its children — heap property holds here.`, { [i]: 'active' }, size); return; }
          [a[i], a[big]] = [a[big], a[i]];
          P(7, `Swap with the larger child (${a[i]}) and keep sifting down.`, { [i]: 'swap', [big]: 'swap' }, size);
          i = big;
        }
      }
      P(0, 'Phase 1: build a max-heap.');
      for (let i = (n >> 1) - 1; i >= 0; i--) sift(i, n);
      P(1, 'Heap built — the largest value is at index 0.', { 0: 'active' });
      for (let end = n - 1; end >= 1; end--) {
        [a[0], a[end]] = [a[end], a[0]]; done.add(end);
        P(2, `Move the max ${a[end]} to index ${end}; it is now sorted.`, { 0: 'swap', [end]: 'swap' }, end + 1);
        P(3, 'Sift the new root down to restore the heap.', {}, end);
        sift(0, end);
      }
      done.add(0); P(1, 'Sorted!');
      return st;
    },
    problems: [['Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream', 'Easy'], ['Last Stone Weight', 'last-stone-weight', 'Easy'], ['Top K Frequent Elements', 'top-k-frequent-elements', 'Medium'], ['Find Median from Data Stream', 'find-median-from-data-stream', 'Hard']],
  });

  /* =====================  SEARCHING  ===================== */
  const searchFields = [arrField({ label: 'Array' }), { key: 'target', label: 'Target', type: 'num' }];
  ALGOS.push({
    id: 'linear-search', name: 'Linear Search', cat: 'searching', time: 'O(n)', space: 'O(1)',
    blurb: 'Check every element one by one until you find the target. Works on any array, sorted or not.',
    how: ['Start at index 0.', 'Compare the current element with the target.', 'If equal, return its index.', 'If you reach the end, the target is not present.'],
    code: L('for i from 0 to n-1:', '  if a[i] == target:', '    return i', 'return -1'),
    fields: searchFields, legend: [['compare', 'Checking'], ['found', 'Found']],
    random() { const arr = uniq(9, 3, 60); return { arr, target: Math.random() < 0.8 ? pick(arr) : 61 + rnd(0, 20) }; },
    run({ arr, target }) {
      const st = [], info = `target = ${target}`;
      st.push({ line: 0, msg: `Looking for ${target}. Start at index 0.`, s: A(arr, { mode: 'cells', info }) });
      for (let i = 0; i < arr.length; i++) {
        const hit = arr[i] === target;
        st.push({ line: 1, msg: `a[${i}] = ${arr[i]} ${hit ? '==' : '≠'} ${target}${hit ? '' : ' — keep going.'}`, s: A(arr, { mode: 'cells', info, cls: { [i]: 'compare' }, ptrs: { i } }) });
        if (hit) { st.push({ line: 2, msg: `Found ${target} at index ${i}!`, s: A(arr, { mode: 'cells', info, cls: { [i]: 'found' }, ptrs: { i } }) }); return st; }
      }
      st.push({ line: 3, msg: `Reached the end — ${target} is not in the array (return -1).`, s: A(arr, { mode: 'cells', info }) });
      return st;
    },
    problems: [['Two Sum', 'two-sum', 'Easy'], ['Contains Duplicate', 'contains-duplicate', 'Easy'], ['Missing Number', 'missing-number', 'Easy'], ['Richest Customer Wealth', 'richest-customer-wealth', 'Easy']],
  });

  ALGOS.push({
    id: 'binary-search', name: 'Binary Search', cat: 'searching', time: 'O(log n)', space: 'O(1)',
    blurb: 'On a sorted array, look at the middle and throw away the half that cannot contain the target.',
    how: ['The array must be sorted (it is sorted for you here).', 'Keep a window [lo, hi]; look at the middle element.', 'If it equals the target — done. If it is too small, the answer is to the right: lo = mid + 1. If too big, hi = mid - 1.', 'Each step halves the window, so 1,000,000 items need only ~20 steps.'],
    code: L('lo = 0; hi = n - 1', 'while lo <= hi:', '  mid = floor((lo + hi) / 2)', '  if a[mid] == target: return mid', '  else if a[mid] < target: lo = mid + 1', '  else: hi = mid - 1', 'return -1'),
    fields: searchFields, legend: [['compare', 'Middle element'], ['found', 'Found'], ['dim', 'Discarded']],
    random() { const arr = uniq(12, 3, 95).sort((x, y) => x - y); return { arr, target: Math.random() < 0.85 ? pick(arr) : 96 + rnd(0, 3) }; },
    normalize: (inp) => ({ ...inp, arr: inp.arr.slice().sort((x, y) => x - y) }),
    run({ arr, target }) {
      const a = arr, st = [], info = `target = ${target}`; let lo = 0, hi = a.length - 1;
      const P = (line, msg, cls = {}, ptrs = {}) => st.push({ line, msg, s: A(a, { mode: 'cells', info, cls, ptrs, dim: lo <= hi ? [lo, hi] : [1, 0] }) });
      P(0, `Search for ${target} in the sorted array. Window = whole array.`, {}, { lo, hi });
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        P(2, `mid = floor((${lo} + ${hi}) / 2) = ${mid}, a[${mid}] = ${a[mid]}.`, { [mid]: 'compare' }, { lo, mid, hi });
        if (a[mid] === target) { P(3, `a[${mid}] == ${target} — found at index ${mid}!`, { [mid]: 'found' }, { lo, mid, hi }); return st; }
        if (a[mid] < target) { P(4, `${a[mid]} < ${target}: target must be on the right → lo = ${mid + 1}.`, { [mid]: 'compare' }, { lo, mid, hi }); lo = mid + 1; }
        else { P(5, `${a[mid]} > ${target}: target must be on the left → hi = ${mid - 1}.`, { [mid]: 'compare' }, { lo, mid, hi }); hi = mid - 1; }
      }
      P(6, `lo passed hi — the window is empty, so ${target} is not in the array.`);
      return st;
    },
    problems: [['Binary Search', 'binary-search', 'Easy'], ['Search Insert Position', 'search-insert-position', 'Easy'], ['First Bad Version', 'first-bad-version', 'Easy'], ['Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium'], ['Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array', 'Medium'], ['Koko Eating Bananas', 'koko-eating-bananas', 'Medium'], ['Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Hard']],
  });

  /* =====================  TWO POINTERS & SLIDING WINDOW  ===================== */
  ALGOS.push({
    id: 'two-pointers', name: 'Two Pointers — Pair Sum', cat: 'pointers', time: 'O(n)', space: 'O(1)',
    blurb: 'In a sorted array, find two numbers that add up to a target by walking one pointer in from each end.',
    how: ['Put lo at the start and hi at the end of the sorted array.', 'If a[lo] + a[hi] equals the target — done.', 'If the sum is too small, move lo right to get a bigger number.', 'If the sum is too big, move hi left. Every step discards one element, so one pass is enough.'],
    code: L('lo = 0; hi = n - 1', 'while lo < hi:', '  sum = a[lo] + a[hi]', '  if sum == target: return [lo, hi]', '  if sum < target: lo++      // need a bigger sum', '  else: hi--                 // need a smaller sum', 'return no pair'),
    fields: searchFields, legend: [['compare', 'Current pair'], ['found', 'Answer']],
    random() {
      const arr = uniq(9, 1, 30).sort((x, y) => x - y);
      if (Math.random() < 0.85) { const i = rnd(0, 7), j = rnd(i + 1, 8); return { arr, target: arr[i] + arr[j] }; }
      return { arr, target: arr[0] + arr[1] - 1 };
    },
    normalize: (inp) => ({ ...inp, arr: inp.arr.slice().sort((x, y) => x - y) }),
    run({ arr, target }) {
      const a = arr, st = [], info = `target sum = ${target}`; let lo = 0, hi = a.length - 1;
      const P = (line, msg, cls = {}, ptrs = {}) => st.push({ line, msg, s: A(a, { mode: 'cells', info, cls, ptrs, dim: lo < hi ? [lo, hi] : [1, 0] }) });
      P(0, 'Place one pointer at each end of the sorted array.', {}, { lo, hi });
      while (lo < hi) {
        const sum = a[lo] + a[hi];
        P(2, `a[${lo}] + a[${hi}] = ${a[lo]} + ${a[hi]} = ${sum}.`, { [lo]: 'compare', [hi]: 'compare' }, { lo, hi });
        if (sum === target) { P(3, `${sum} equals the target — pair found at indices ${lo} and ${hi}!`, { [lo]: 'found', [hi]: 'found' }, { lo, hi }); return st; }
        if (sum < target) { P(4, `${sum} < ${target}: too small — move lo right to a bigger number.`, { [lo]: 'compare', [hi]: 'compare' }, { lo, hi }); lo++; }
        else { P(5, `${sum} > ${target}: too big — move hi left to a smaller number.`, { [lo]: 'compare', [hi]: 'compare' }, { lo, hi }); hi--; }
      }
      P(6, 'The pointers met — no pair adds up to the target.');
      return st;
    },
    problems: [['Two Sum II – Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted', 'Medium'], ['Valid Palindrome', 'valid-palindrome', 'Easy'], ['3Sum', '3sum', 'Medium'], ['Container With Most Water', 'container-with-most-water', 'Medium'], ['Trapping Rain Water', 'trapping-rain-water', 'Hard']],
  });

  ALGOS.push({
    id: 'sliding-window', name: 'Sliding Window — Max Sum', cat: 'pointers', time: 'O(n)', space: 'O(1)',
    blurb: 'Find the best sum of any k consecutive elements by sliding a window and updating the sum instead of recomputing it.',
    how: ['Add up the first k elements — that is the first window.', 'Slide right by one: add the new element entering on the right and subtract the one leaving on the left.', 'Keep track of the best sum seen so far.', 'Each element enters and leaves once, so the total work is O(n) instead of O(n·k).'],
    code: L('windowSum = sum(a[0..k-1]); best = windowSum', 'for r from k to n-1:', '  windowSum += a[r] - a[r-k]   // add new, drop old', '  best = max(best, windowSum)', 'return best'),
    fields: [arrField({ lo: -9, hi: 99 }), { key: 'k', label: 'Window size k', type: 'num' }],
    legend: [['active', 'Current window'], ['sorted', 'Best window so far'], ['found', 'Final answer']],
    random() { return { arr: randArr(rnd(9, 11), 1, 20), k: rnd(2, 4) }; },
    run({ arr, k }) {
      const a = arr, n = a.length, st = []; k = Math.max(1, Math.min(k, n));
      let sum = 0; for (let i = 0; i < k; i++) sum += a[i];
      let best = sum, bl = 0;
      const P = (line, msg, l, final) => {
        const cls = {}; for (let x = bl; x < bl + k; x++) cls[x] = final ? 'found' : 'sorted';
        if (!final) for (let x = l; x < l + k; x++) cls[x] = 'active';
        st.push({ line, msg, s: A(a, { mode: 'cells', cls, win: final ? null : [l, l + k - 1], info: `window sum = ${sum} · best = ${best}  (k = ${k})` }) });
      };
      P(0, `First window a[0..${k - 1}] sums to ${sum}. That is the best so far.`, 0);
      for (let r = k; r < n; r++) {
        const l = r - k + 1; sum += a[r] - a[r - k];
        P(2, `Slide right: add a[${r}]=${a[r]}, drop a[${r - k}]=${a[r - k]} → sum = ${sum}.`, l);
        if (sum > best) { best = sum; bl = l; P(3, `${sum} beats the old best — remember this window.`, l); }
        else P(3, `${sum} does not beat ${best}.`, l);
      }
      P(4, `Maximum sum of ${k} consecutive elements = ${best}.`, bl, true);
      return st;
    },
    problems: [['Maximum Average Subarray I', 'maximum-average-subarray-i', 'Easy'], ['Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium'], ['Minimum Size Subarray Sum', 'minimum-size-subarray-sum', 'Medium'], ['Permutation in String', 'permutation-in-string', 'Medium'], ['Sliding Window Maximum', 'sliding-window-maximum', 'Hard']],
  });

  /* =====================  GRAPHS  ===================== */
  const GN = [['A', 70, 190], ['B', 190, 70], ['C', 190, 310], ['D', 330, 170], ['E', 330, 310], ['F', 460, 70], ['G', 470, 240], ['H', 580, 150]];
  const GE = [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 5], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'G', 3], ['F', 'H', 3], ['G', 'H', 4]];
  const ids = GN.map(n => n[0]);
  const adj = {}; ids.forEach(i => adj[i] = []);
  GE.forEach(([u, v, w]) => { adj[u].push([v, w]); adj[v].push([u, w]); });
  ids.forEach(i => adj[i].sort((x, y) => (x[0] < y[0] ? -1 : 1)));
  const ek = (u, v) => (u < v ? u + v : v + u);
  const graphFields = [{ key: 'start', label: 'Start node', type: 'select', options: ids }];
  const graphRandom = () => ({ start: pick(ids) });
  const gs = (nodeCls, edgeCls, sub, auxTitle, items, weighted) => ({ type: 'graph', nodeCls: { ...nodeCls }, edgeCls: { ...edgeCls }, sub: { ...sub }, aux: { title: auxTitle, items: items.slice() }, weighted: !!weighted });

  ALGOS.push({
    id: 'bfs', name: 'Breadth-First Search', cat: 'graph', time: 'O(V + E)', space: 'O(V)',
    blurb: 'Explore a graph level by level using a queue — first everything 1 step away, then 2 steps, and so on.',
    how: ['Put the start node in a queue and mark it visited.', 'Take the node at the front of the queue.', 'Add each unvisited neighbour to the back of the queue (and mark it visited).', 'Because the queue is first-in-first-out, nodes are reached in order of distance — BFS finds shortest paths in unweighted graphs.'],
    code: L('queue = [start]; visited = {start}', 'while queue is not empty:', '  u = queue.dequeue()', '  for each neighbor v of u:', '    if v not in visited:', '      visited.add(v); queue.enqueue(v)'),
    fields: graphFields, random: graphRandom,
    legend: [['current', 'Being processed'], ['frontier', 'In the queue'], ['done', 'Finished'], ['tree', 'Discovery edge']],
    run({ start }) {
      const st = [], nodeCls = {}, edgeCls = {}, sub = {}, lvl = {}; const queue = [start];
      const P = (line, msg) => st.push({ line, msg, s: gs(nodeCls, edgeCls, sub, 'Queue (front → back)', queue) });
      nodeCls[start] = 'frontier'; lvl[start] = 0; sub[start] = 'L0';
      P(0, `Start at ${start}: enqueue it and mark visited. Labels show the BFS level (distance in edges).`);
      while (queue.length) {
        const u = queue.shift(); nodeCls[u] = 'current';
        P(2, `Dequeue ${u} and look at its neighbours.`);
        for (const [v] of adj[u]) {
          const key = ek(u, v);
          if (!(v in lvl)) {
            edgeCls[key] = 'look'; P(4, `Neighbour ${v} is unvisited.`);
            lvl[v] = lvl[u] + 1; sub[v] = 'L' + lvl[v]; nodeCls[v] = 'frontier'; edgeCls[key] = 'tree'; queue.push(v);
            P(5, `Mark ${v} visited (level ${lvl[v]}) and enqueue it.`);
          } else {
            const old = edgeCls[key]; edgeCls[key] = 'look'; P(4, `Neighbour ${v} was already visited — skip.`);
            if (old) edgeCls[key] = old; else delete edgeCls[key];
          }
        }
        nodeCls[u] = 'done'; P(1, `${u} is fully explored.`);
      }
      P(1, 'Queue is empty — every reachable node has been visited.');
      return st;
    },
    problems: [['Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'Medium'], ['Number of Islands', 'number-of-islands', 'Medium'], ['Rotting Oranges', 'rotting-oranges', 'Medium'], ['01 Matrix', '01-matrix', 'Medium'], ['Shortest Path in Binary Matrix', 'shortest-path-in-binary-matrix', 'Medium'], ['Word Ladder', 'word-ladder', 'Hard']],
  });

  ALGOS.push({
    id: 'dfs', name: 'Depth-First Search', cat: 'graph', time: 'O(V + E)', space: 'O(V)',
    blurb: 'Go as deep as possible along one path, then backtrack and try the next branch. Uses recursion (or a stack).',
    how: ['Visit a node and mark it.', 'For each unvisited neighbour, recurse into it immediately.', 'When a node has no unvisited neighbours left, return to the caller (backtrack).', 'Great for connectivity, cycle detection, topological sort and exploring every possibility.'],
    code: L('dfs(u):', '  visited.add(u)', '  for each neighbor v of u:', '    if v not in visited:', '      dfs(v)      // go deeper'),
    fields: graphFields, random: graphRandom,
    legend: [['current', 'Current node'], ['frontier', 'On the call stack'], ['done', 'Finished'], ['tree', 'Tree edge']],
    run({ start }) {
      const st = [], nodeCls = {}, edgeCls = {}, sub = {}, path = []; let order = 0;
      const P = (line, msg) => st.push({ line, msg, s: gs(nodeCls, edgeCls, sub, 'Recursion stack (bottom → top)', path) });
      function dfs(u, parent) {
        if (parent) nodeCls[parent] = 'frontier';
        path.push(u); nodeCls[u] = 'current'; sub[u] = '#' + (++order);
        P(1, `Visit ${u} (visit #${order}) and push it on the call stack.`);
        for (const [v] of adj[u]) {
          const key = ek(u, v);
          if (!(v in sub)) {
            edgeCls[key] = 'look'; P(3, `Neighbour ${v} is unvisited → go deeper.`);
            edgeCls[key] = 'tree'; dfs(v, u);
            P(2, `Back at ${u} — check its next neighbour.`);
          } else {
            const old = edgeCls[key]; edgeCls[key] = 'look'; P(3, `Neighbour ${v} was already visited — skip.`);
            if (old) edgeCls[key] = old; else delete edgeCls[key];
          }
        }
        path.pop(); nodeCls[u] = 'done'; if (parent) nodeCls[parent] = 'current';
        P(0, `${u} has no more unvisited neighbours — return (backtrack).`);
      }
      dfs(start, null);
      return st;
    },
    problems: [['Number of Islands', 'number-of-islands', 'Medium'], ['Max Area of Island', 'max-area-of-island', 'Medium'], ['Clone Graph', 'clone-graph', 'Medium'], ['Course Schedule', 'course-schedule', 'Medium'], ['Path Sum', 'path-sum', 'Easy'], ['Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'Medium']],
  });

  ALGOS.push({
    id: 'dijkstra', name: "Dijkstra's Shortest Path", cat: 'graph', time: 'O((V + E) log V)', space: 'O(V)',
    blurb: 'Find the cheapest route from a start node to every other node in a graph with non-negative edge weights.',
    how: ['Set every distance to ∞ except the start (0).', 'Repeatedly pick the unfinished node with the smallest distance — that distance is now final.', 'Relax its edges: if going through it gives a shorter path to a neighbour, update the neighbour.', 'A priority queue makes "pick the smallest" fast. Green edges form the shortest-path tree.'],
    code: L('dist[all] = ∞; dist[start] = 0; pq = [(0, start)]', 'while pq is not empty:', '  (d, u) = pq.popMin()', '  if u already finalized: continue', '  finalize u', '  for each edge (u, v, w):', '    if d + w < dist[v]:', '      dist[v] = d + w; prev[v] = u; pq.push((dist[v], v))'),
    fields: graphFields, random: graphRandom,
    legend: [['current', 'Node being finalized'], ['frontier', 'Has a tentative distance'], ['done', 'Distance final'], ['look', 'Edge being relaxed'], ['tree', 'Shortest-path edge']],
    run({ start }) {
      const st = [], dist = {}, fin = new Set(), prevEdge = {}; ids.forEach(i => dist[i] = Infinity); dist[start] = 0;
      let pq = [[0, start]];
      const P = (line, msg, cur = null, look = null) => {
        const nodeCls = {}, edgeCls = {}, sub = {};
        ids.forEach(id => { sub[id] = dist[id] === Infinity ? '∞' : String(dist[id]); if (fin.has(id)) nodeCls[id] = 'done'; else if (dist[id] !== Infinity) nodeCls[id] = 'frontier'; });
        if (cur) nodeCls[cur] = 'current';
        Object.values(prevEdge).forEach(k => edgeCls[k] = 'tree');
        if (look) edgeCls[look] = 'look';
        const items = pq.slice().sort((x, y) => x[0] - y[0] || (x[1] < y[1] ? -1 : 1)).map(([d, v]) => `${v}:${d}`);
        st.push({ line, msg, s: gs(nodeCls, edgeCls, sub, 'Priority queue  node:distance (smallest first)', items, true) });
      };
      P(0, `Distances start at ∞, except ${start} = 0. Numbers on nodes are the current best distance.`);
      while (pq.length) {
        pq.sort((x, y) => x[0] - y[0] || (x[1] < y[1] ? -1 : 1));
        const [d, u] = pq.shift();
        if (fin.has(u)) { P(3, `Popped stale entry for ${u} — already finalized, skip.`); continue; }
        fin.add(u); P(4, `Pop ${u} (distance ${d}) — the smallest unfinished node. Its distance is now final.`, u);
        for (const [v, w] of adj[u]) {
          if (fin.has(v)) continue;
          const nd = d + w, key = ek(u, v);
          P(6, `Edge ${u}–${v} (weight ${w}): ${d} + ${w} = ${nd} vs current dist[${v}] = ${dist[v] === Infinity ? '∞' : dist[v]}.`, u, key);
          if (nd < dist[v]) { dist[v] = nd; prevEdge[v] = key; pq.push([nd, v]); P(7, `Shorter path found! dist[${v}] = ${nd} (via ${u}).`, u, key); }
        }
      }
      P(1, 'Done. Green edges show the shortest path from the start to every node.');
      return st;
    },
    problems: [['Network Delay Time', 'network-delay-time', 'Medium'], ['Path With Minimum Effort', 'path-with-minimum-effort', 'Medium'], ['Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'Medium'], ['Path with Maximum Probability', 'path-with-maximum-probability', 'Medium'], ['Swim in Rising Water', 'swim-in-rising-water', 'Hard']],
  });

  /* =====================  DYNAMIC PROGRAMMING  ===================== */
  ALGOS.push({
    id: 'lcs', name: 'Longest Common Subsequence', cat: 'dp', time: 'O(m·n)', space: 'O(m·n)',
    blurb: 'Find the longest sequence of characters that appears in both strings in the same order (not necessarily contiguous).',
    how: ['dp[i][j] = LCS length of the first i characters of A and the first j characters of B.', 'If A[i] == B[j], extend the diagonal: dp[i][j] = dp[i-1][j-1] + 1.', 'Otherwise take the better of dropping a character from A (up) or from B (left).', 'Walk back from the bottom-right corner to rebuild the actual subsequence.'],
    code: L('for i in 1..m: for j in 1..n:', '  if A[i] == B[j]:', '    dp[i][j] = dp[i-1][j-1] + 1', '  else:', '    dp[i][j] = max(dp[i-1][j], dp[i][j-1])', '// walk back from dp[m][n] to rebuild the subsequence'),
    fields: [{ key: 'a', label: 'String A', type: 'text', max: 8 }, { key: 'b', label: 'String B', type: 'text', max: 8 }],
    legend: [['active', 'Cell being filled'], ['compare', 'Cells it depends on'], ['found', 'Traceback path']],
    random() { return pick([{ a: 'ABCBDAB', b: 'BDCABA' }, { a: 'AGGTAB', b: 'GXTXAYB' }, { a: 'HELLO', b: 'YELLOW' }, { a: 'ALGORITHM', b: 'ALTRUISM' }, { a: 'STONE', b: 'LONGEST' }]); },
    run({ a, b }) {
      const m = a.length, n = b.length, st = [];
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
      for (let j = 0; j <= n; j++) dp[0][j] = 0; for (let i = 0; i <= m; i++) dp[i][0] = 0;
      const rows = ['∅', ...a], cols = ['∅', ...b], info = `A = "${a}"   B = "${b}"`;
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(rows, cols, dp, cls, info) });
      P(0, 'An empty string shares nothing with any string, so row 0 and column 0 are 0.');
      for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
        const cell = `${i},${j}`;
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          P(2, `'${a[i - 1]}' == '${b[j - 1]}' → diagonal + 1 = ${dp[i][j]}.`, { [cell]: 'active', [`${i - 1},${j - 1}`]: 'compare' });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          P(4, `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(up ${dp[i - 1][j]}, left ${dp[i][j - 1]}) = ${dp[i][j]}.`, { [cell]: 'active', [`${i - 1},${j}`]: 'compare', [`${i},${j - 1}`]: 'compare' });
        }
      }
      let i = m, j = n, res = ''; const path = {};
      while (i > 0 && j > 0) {
        path[`${i},${j}`] = 'found';
        if (a[i - 1] === b[j - 1]) { res = a[i - 1] + res; i--; j--; } else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
      }
      P(5, `LCS length = ${dp[m][n]}. Tracing back gives "${res}".`, path);
      return st;
    },
    problems: [['Longest Common Subsequence', 'longest-common-subsequence', 'Medium'], ['Edit Distance', 'edit-distance', 'Medium'], ['Delete Operation for Two Strings', 'delete-operation-for-two-strings', 'Medium'], ['Longest Palindromic Subsequence', 'longest-palindromic-subsequence', 'Medium'], ['Shortest Common Supersequence', 'shortest-common-supersequence', 'Hard'], ['Distinct Subsequences', 'distinct-subsequences', 'Hard']],
  });

  ALGOS.push({
    id: 'knapsack', name: '0/1 Knapsack', cat: 'dp', time: 'O(n·W)', space: 'O(n·W)',
    blurb: 'Pick items (each at most once) to maximise total value without exceeding a weight limit.',
    how: ['dp[i][c] = best value using only the first i items with capacity c.', 'Skip item i: value is dp[i-1][c].', 'Take item i (if it fits): value is dp[i-1][c - weight] + its value.', 'Keep the better choice. The answer is in the bottom-right cell; trace back to see which items were taken.'],
    code: L('for i in 1..n: for c in 0..W:', '  dp[i][c] = dp[i-1][c]                 // skip item i', '  if w[i] <= c:', '    dp[i][c] = max(dp[i][c], dp[i-1][c - w[i]] + v[i])   // take it', '// answer: dp[n][W]; trace back to list the items'),
    fields: [],
    legend: [['active', 'Cell being filled'], ['compare', 'Skip / take sources'], ['found', 'Chosen items path']],
    random() {
      const n = 4; return { w: Array.from({ length: n }, () => rnd(1, 5)), v: Array.from({ length: n }, () => rnd(2, 9)), cap: rnd(6, 8) };
    },
    run({ w, v, cap }) {
      const n = w.length, st = [], dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(null));
      for (let c = 0; c <= cap; c++) dp[0][c] = 0;
      const rows = ['no items', ...w.map((x, i) => `item ${i + 1} (w=${x}, v=${v[i]})`)], cols = Array.from({ length: cap + 1 }, (_, c) => c);
      const info = `capacity W = ${cap}  ·  columns are capacities 0…${cap}`;
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(rows, cols, dp, cls, info) });
      P(0, 'With no items the best value is 0 for every capacity.');
      for (let i = 1; i <= n; i++) for (let c = 0; c <= cap; c++) {
        const wi = w[i - 1], vi = v[i - 1], skip = dp[i - 1][c]; dp[i][c] = skip;
        const cls = { [`${i},${c}`]: 'active', [`${i - 1},${c}`]: 'compare' };
        if (wi <= c) {
          const take = dp[i - 1][c - wi] + vi; cls[`${i - 1},${c - wi}`] = 'compare'; dp[i][c] = Math.max(skip, take);
          P(3, `Item ${i} (w=${wi}, v=${vi}) at capacity ${c}: skip = ${skip}, take = ${dp[i - 1][c - wi]} + ${vi} = ${take} → ${dp[i][c]}.`, cls);
        } else P(1, `Item ${i} (w=${wi}) is heavier than capacity ${c} → must skip: ${skip}.`, cls);
      }
      let c = cap; const path = {}, chosen = [];
      for (let i = n; i > 0; i--) { path[`${i},${c}`] = 'found'; if (dp[i][c] !== dp[i - 1][c]) { chosen.push(i); c -= w[i - 1]; } }
      path[`0,${c}`] = 'found';
      P(4, `Best value = ${dp[n][cap]}. ${chosen.length ? 'Items taken: ' + chosen.reverse().join(', ') + '.' : 'No item fits.'}`, path);
      return st;
    },
    problems: [['Partition Equal Subset Sum', 'partition-equal-subset-sum', 'Medium'], ['Target Sum', 'target-sum', 'Medium'], ['Last Stone Weight II', 'last-stone-weight-ii', 'Medium'], ['Ones and Zeroes', 'ones-and-zeroes', 'Medium']],
  });

  ALGOS.push({
    id: 'coin-change', name: 'Coin Change (Min Coins)', cat: 'dp', time: 'O(amount · coins)', space: 'O(amount)',
    blurb: 'Fewest coins needed to make an amount. A greedy "biggest coin first" approach can fail — DP always works.',
    how: ['dp[a] = fewest coins that make amount a. dp[0] = 0, everything else starts at ∞.', 'For each amount a and each coin c ≤ a, try using that coin: dp[a-c] + 1.', 'Keep the minimum over all coins.', 'Try coins 1, 3, 4 with amount 6: greedy gives 4+1+1 (3 coins) but DP finds 3+3 (2 coins).'],
    code: L('dp[0] = 0; dp[1..amount] = ∞', 'for a from 1 to amount:', '  for each coin c where c <= a:', '    dp[a] = min(dp[a], dp[a - c] + 1)', 'return dp[amount]   // ∞ means impossible (-1)'),
    fields: [{ key: 'coins', label: 'Coins', type: 'list', min: 1, max: 5, lo: 1, hi: 20 }, { key: 'amount', label: 'Amount', type: 'num' }],
    legend: [['active', 'dp[a] being computed'], ['compare', 'dp[a − coin]'], ['found', 'Coins used']],
    random() { return { coins: pick([[1, 3, 4], [1, 5, 6], [2, 3, 7], [1, 2, 5], [2, 5]]), amount: rnd(7, 12) }; },
    run({ coins, amount }) {
      const cs = [...new Set(coins)].sort((x, y) => x - y), dp = Array(amount + 1).fill(Infinity); dp[0] = 0;
      const st = [], cols = Array.from({ length: amount + 1 }, (_, i) => i), info = `coins = [${cs.join(', ')}]   amount = ${amount}`;
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(['min coins'], cols, [dp], cls, info) });
      P(0, 'Making amount 0 takes 0 coins; every other amount starts as ∞ (unknown).');
      for (let a = 1; a <= amount; a++) for (const c of cs) {
        if (c > a) continue;
        const cand = dp[a - c] + 1, cls = { [`0,${a}`]: 'active', [`0,${a - c}`]: 'compare' };
        if (dp[a - c] === Infinity) P(3, `Amount ${a}, coin ${c}: dp[${a - c}] is ∞ — cannot use this coin.`, cls);
        else if (cand < dp[a]) { const was = dp[a] === Infinity ? '∞' : dp[a]; dp[a] = cand; P(3, `Amount ${a}, coin ${c}: dp[${a - c}] + 1 = ${cand} — better than ${was}.`, cls); }
        else P(3, `Amount ${a}, coin ${c}: dp[${a - c}] + 1 = ${cand} — not better than ${dp[a]}.`, cls);
      }
      if (dp[amount] === Infinity) { P(4, `Amount ${amount} cannot be made with these coins (return -1).`); return st; }
      const path = { [`0,${amount}`]: 'found' }, used = []; let a = amount;
      while (a > 0) { const c = cs.find(c => c <= a && dp[a - c] + 1 === dp[a]); used.push(c); a -= c; path[`0,${a}`] = 'found'; }
      P(4, `Minimum coins = ${dp[amount]}: ${used.join(' + ')} = ${amount}.`, path);
      return st;
    },
    problems: [['Coin Change', 'coin-change', 'Medium'], ['Coin Change II', 'coin-change-ii', 'Medium'], ['Perfect Squares', 'perfect-squares', 'Medium'], ['Climbing Stairs', 'climbing-stairs', 'Easy'], ['Min Cost Climbing Stairs', 'min-cost-climbing-stairs', 'Easy'], ['House Robber', 'house-robber', 'Medium']],
  });

  ALGOS.push({
    id: 'kadane', name: "Kadane's — Max Subarray", cat: 'dp', time: 'O(n)', space: 'O(1)',
    blurb: 'Find the contiguous subarray with the largest sum in one pass by deciding at each element: extend the run or start fresh.',
    how: ['Keep cur = the best sum of a subarray that ends at the current index.', 'At each element choose the larger of: start over at a[i], or extend the previous run (cur + a[i]).', 'Track the best value of cur seen anywhere.', 'A negative running sum only hurts, so it is dropped as soon as starting fresh is better.'],
    code: L('cur = best = a[0]', 'for i from 1 to n-1:', '  cur = max(a[i], cur + a[i])   // extend the run or restart here', '  best = max(best, cur)', 'return best'),
    fields: [arrField({ lo: -9, hi: 9 })],
    legend: [['active', 'Current run'], ['sorted', 'Best run so far'], ['found', 'Answer']],
    random() { return { arr: Array.from({ length: 9 }, () => rnd(-8, 9)) }; },
    run({ arr }) {
      const a = arr, n = a.length, st = []; let cur = a[0], best = a[0], s = 0, bs = 0, be = 0;
      const P = (line, msg, i, final) => {
        const cls = {}; for (let x = bs; x <= be; x++) cls[x] = final ? 'found' : 'sorted';
        if (!final) for (let x = s; x <= i; x++) cls[x] = 'active';
        st.push({ line, msg, s: A(a, { mode: 'cells', cls, ptrs: final ? {} : { i }, info: `cur = ${cur} · best = ${best}` }) });
      };
      P(0, `Start with the first element: cur = best = ${a[0]}.`, 0);
      for (let i = 1; i < n; i++) {
        const ext = cur + a[i];
        if (a[i] > ext) { cur = a[i]; s = i; P(2, `${a[i]} alone is bigger than extending (${ext}) → restart the run here.`, i); }
        else { cur = ext; P(2, `Extending the run: ${cur - a[i]} + ${a[i]} = ${cur}.`, i); }
        if (cur > best) { best = cur; bs = s; be = i; P(3, `${cur} is a new best!`, i); } else P(3, `${cur} does not beat best (${best}).`, i);
      }
      P(4, `Maximum subarray sum = ${best} (indices ${bs}…${be}).`, n - 1, true);
      return st;
    },
    problems: [['Maximum Subarray', 'maximum-subarray', 'Medium'], ['Maximum Product Subarray', 'maximum-product-subarray', 'Medium'], ['Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Easy'], ['Maximum Sum Circular Subarray', 'maximum-sum-circular-subarray', 'Medium']],
  });

  /* =====================  GREEDY  ===================== */
  ALGOS.push({
    id: 'jump-game', name: 'Jump Game (Greedy)', cat: 'greedy', time: 'O(n)', space: 'O(1)',
    blurb: 'Each number is the maximum jump length from that cell. Can you reach the last index? Just track the farthest reachable position.',
    how: ['Keep reach = the farthest index you can get to so far.', 'Walk left to right. If you stand on an index beyond reach, you are stuck.', 'Otherwise update reach = max(reach, i + a[i]).', 'If reach covers the last index, you win. No need to try every jump combination — the greedy choice is enough.'],
    code: L('reach = 0', 'for i from 0 to n-1:', '  if i > reach: return false      // stuck: cannot even get to i', '  reach = max(reach, i + a[i])', '  if reach >= n-1: return true', 'return true'),
    fields: [arrField({ lo: 0, hi: 9 })],
    legend: [['active', 'Current index'], ['sorted', 'Reachable'], ['swap', 'Unreachable (stuck)']],
    random() { return { arr: Math.random() < 0.5 ? [2, 3, 1, 1, 4, 0, 2, 1] : [3, 2, 1, 0, 4, 1, 2, 1] }; },
    run({ arr }) {
      const a = arr, n = a.length, st = []; let reach = 0;
      const P = (line, msg, i, bad) => {
        const cls = {}; for (let x = 0; x <= Math.min(reach, n - 1); x++) cls[x] = 'sorted'; cls[i] = bad ? 'swap' : 'active';
        st.push({ line, msg, s: A(a, { mode: 'cells', cls, ptrs: { i, reach: Math.min(reach, n - 1) }, info: `reach = ${reach}` }) });
      };
      P(0, 'Start with reach = 0: we can only stand on index 0.', 0);
      for (let i = 0; i < n; i++) {
        if (i > reach) { P(2, `Index ${i} is beyond reach (${reach}) — we are stuck, so the last index is unreachable. Return false.`, i, true); return st; }
        const old = reach; reach = Math.max(reach, i + a[i]);
        P(3, `From ${i}, jump up to ${a[i]} → reach = max(${old}, ${i} + ${a[i]}) = ${reach}.`, i);
        if (reach >= n - 1) { P(4, `reach (${reach}) ≥ last index ${n - 1} — we can make it! Return true.`, i); return st; }
      }
      P(5, 'Done.', n - 1); return st;
    },
    problems: [['Jump Game', 'jump-game', 'Medium'], ['Jump Game II', 'jump-game-ii', 'Medium'], ['Gas Station', 'gas-station', 'Medium'], ['Assign Cookies', 'assign-cookies', 'Easy'], ['Best Time to Buy and Sell Stock II', 'best-time-to-buy-and-sell-stock-ii', 'Medium'], ['Non-overlapping Intervals', 'non-overlapping-intervals', 'Medium']],
  });

  /* =====================  BACKTRACKING  ===================== */
  ALGOS.push({
    id: 'n-queens', name: 'N-Queens', cat: 'backtracking', time: 'O(n!)', space: 'O(n)',
    blurb: 'Place n queens on an n×n board so that none attack each other. Try a square, recurse, and undo (backtrack) when stuck.',
    how: ['Place queens one row at a time.', 'For a row, try each column; skip squares attacked by earlier queens (same column or diagonal).', 'If safe, place the queen and move to the next row.', 'If no column works in a row, return to the previous row, remove its queen and try its next column. This animation stops at the first solution.'],
    code: L('place(row):', '  if row == n: solution found!', '  for col from 0 to n-1:', '    if no queen attacks (row, col):', '      queens[row] = col', '      place(row + 1)', '      remove queens[row]     // backtrack'),
    fields: [{ key: 'n', label: 'Board size n', type: 'select', options: [4, 5, 6, 8] }],
    legend: [['try', 'Trying'], ['bad', 'Conflict'], ['ok', 'Safe — placed']],
    random() { return { n: pick([5, 6]) }; },
    run({ n }) {
      const q = Array(n).fill(-1), st = []; let found = false;
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: { type: 'board', n, queens: q.slice(), cls, info: `n = ${n} · queens placed: ${q.filter(x => x >= 0).length}` } });
      const attacker = (r, c) => { for (let k = 0; k < r; k++) if (q[k] === c || Math.abs(q[k] - c) === r - k) return k; return -1; };
      function place(r) {
        if (r === n) { found = true; P(1, 'All queens are placed — a valid solution!'); return; }
        for (let c = 0; c < n && !found; c++) {
          P(2, `Row ${r}: try column ${c}.`, { [`${r},${c}`]: 'try' });
          const k = attacker(r, c);
          if (k >= 0) { P(3, `Queen at (${k},${q[k]}) attacks (${r},${c}) — skip.`, { [`${r},${c}`]: 'bad', [`${k},${q[k]}`]: 'bad' }); continue; }
          q[r] = c; P(4, `Safe! Place a queen at (${r},${c}) and move on to row ${r + 1}.`, { [`${r},${c}`]: 'ok' });
          place(r + 1);
          if (!found) { q[r] = -1; P(6, `Dead end further down — backtrack: remove the queen from row ${r}.`, { [`${r},${c}`]: 'try' }); }
        }
      }
      P(0, `Place ${n} queens, one per row, backtracking when stuck.`);
      place(0);
      return st;
    },
    problems: [['N-Queens', 'n-queens', 'Hard'], ['N-Queens II', 'n-queens-ii', 'Hard'], ['Permutations', 'permutations', 'Medium'], ['Subsets', 'subsets', 'Medium'], ['Combination Sum', 'combination-sum', 'Medium'], ['Word Search', 'word-search', 'Medium'], ['Sudoku Solver', 'sudoku-solver', 'Hard']],
  });

  window.ALGO_DATA = { CATS, ALGOS, GN, GE, ids, ek, H: { A, G, rnd, randArr, uniq, pick } };
})();
