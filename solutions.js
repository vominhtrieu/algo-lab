/* Animated walkthroughs of specific practice problems.
   Each solution has the same shape as an algorithm (fields/random/run/code/legend) so the
   normal player can run it. Statements are short paraphrases, not the original text.
   Every solution carries a `vi` block with its Vietnamese statement/approach; live messages use T(en, vi). */
(function () {
  const { A, G, rnd, randArr, uniq, pick } = window.ALGO_DATA.H;
  const T = (en, vi) => (window.LANG === 'vi' ? vi : en);
  const S = (arr, o = {}, aux = null) => { const s = A(arr, o); if (aux) s.aux = aux; return s; };
  const listF = (label, min, max, lo, hi, key = 'arr') => ({ key, label, type: 'list', min, max, lo, hi });
  const SOL = [];

  /* ---------- 1. Two Sum ---------- */
  SOL.push({
    slug: 'two-sum', title: 'Two Sum', diff: 'Easy', algo: 'linear-search',
    statement: 'Given an array of numbers and a target, return the positions of two numbers that add up to the target.',
    approach: ['Checking every pair costs O(n²). Instead, remember every number you have already seen in a hash map (value → index).', 'For each number x, the partner you need is target − x. Look it up in the map in O(1).', 'If it is there, you are done. If not, store x and move on. One pass → O(n).'],
    vi: { statement: 'Cho một mảng số và một giá trị mục tiêu, trả về vị trí của hai số có tổng bằng mục tiêu.', approach: ['Kiểm tra mọi cặp tốn O(n²). Thay vào đó, hãy nhớ mọi số đã gặp trong một bảng băm (giá trị → chỉ số).', 'Với mỗi số x, "người bạn đồng hành" cần tìm là target − x. Tra nó trong bảng chỉ mất O(1).', 'Nếu có trong bảng thì xong. Nếu không, lưu x lại và đi tiếp. Một lượt duyệt → O(n).'] },
    time: 'O(n)', space: 'O(n)',
    code: ['seen = {}   // value → index', 'for i from 0 to n-1:', '  need = target - a[i]', '  if need in seen: return [seen[need], i]', '  seen[a[i]] = i', 'return no pair'],
    fields: [listF('Array', 3, 12, 1, 99), { key: 'target', label: 'Target', type: 'num' }],
    legend: [['active', 'Current number'], ['found', 'The pair']],
    random() { const arr = uniq(8, 1, 25); const i = rnd(0, 6), j = rnd(i + 1, 7); return { arr, target: arr[i] + arr[j] }; },
    run({ arr, target }) {
      const st = [], seen = new Map(), info = T(`target = ${target}`, `mục tiêu = ${target}`);
      const P = (line, msg, cls = {}, ptrs = {}) => st.push({ line, msg, s: S(arr, { mode: 'cells', cls, ptrs, info }, { title: T('seen (value → index)', 'đã gặp (giá trị → chỉ số)'), items: [...seen].map(([v, i]) => `${v}→${i}`) }) });
      P(0, T('Start with an empty map of numbers we have already seen.', 'Bắt đầu với một bảng rỗng chứa các số đã gặp.'));
      for (let i = 0; i < arr.length; i++) {
        const need = target - arr[i];
        P(2, T(`a[${i}] = ${arr[i]}. To reach ${target} we need ${target} − ${arr[i]} = ${need}. Have we seen ${need}?`, `a[${i}] = ${arr[i]}. Để đạt ${target} ta cần ${target} − ${arr[i]} = ${need}. Đã gặp ${need} chưa?`), { [i]: 'active' }, { i });
        if (seen.has(need)) { const j = seen.get(need); P(3, T(`Yes! ${need} is at index ${j}. ${need} + ${arr[i]} = ${target} → answer [${j}, ${i}].`, `Có! ${need} nằm ở chỉ số ${j}. ${need} + ${arr[i]} = ${target} → đáp án [${j}, ${i}].`), { [i]: 'found', [j]: 'found' }, { i, j }); return st; }
        seen.set(arr[i], i);
        P(4, T(`No. Remember ${arr[i]} (index ${i}) for later numbers.`, `Chưa. Ghi nhớ ${arr[i]} (chỉ số ${i}) cho các số phía sau.`), { [i]: 'active' }, { i });
      }
      P(5, T('Reached the end — no two numbers add up to the target.', 'Đến cuối rồi — không có hai số nào có tổng bằng mục tiêu.'));
      return st;
    },
  });

  /* ---------- 2. 3Sum ---------- */
  SOL.push({
    slug: '3sum', title: '3Sum', diff: 'Medium', algo: 'two-pointers',
    statement: 'Find all unique triples in the array whose three numbers add up to 0.',
    approach: ['Sort the array. Sorting lets us use two pointers and makes duplicates sit next to each other.', 'Fix the first number a[i]. Now we need two numbers to its right that add up to −a[i] — that is exactly the sorted pair-sum problem.', 'Use lo = i+1 and hi = n−1. Sum too small → lo++. Too big → hi−−. Zero → save the triple, move both.', 'Skip repeated values (for i and for lo) so the same triple is not reported twice.'],
    vi: { statement: 'Tìm tất cả các bộ ba khác nhau trong mảng mà ba số cộng lại bằng 0.', approach: ['Sắp xếp mảng. Việc sắp xếp cho phép dùng hai con trỏ và đưa các giá trị trùng nhau về cạnh nhau.', 'Cố định số đầu tiên a[i]. Giờ ta cần hai số ở bên phải nó có tổng bằng −a[i] — đúng là bài toán tìm cặp có tổng trên mảng đã sắp xếp.', 'Dùng lo = i+1 và hi = n−1. Tổng quá nhỏ → lo++. Quá lớn → hi−−. Bằng 0 → lưu bộ ba, dịch cả hai.', 'Bỏ qua các giá trị lặp lại (cho i và cho lo) để cùng một bộ ba không bị báo cáo hai lần.'] },
    time: 'O(n²)', space: 'O(1) extra',
    code: ['sort(a)', 'for i from 0 to n-3:', '  if i > 0 and a[i] == a[i-1]: continue     // skip duplicates', '  lo = i + 1; hi = n - 1', '  while lo < hi:', '    sum = a[i] + a[lo] + a[hi]', '    if sum == 0: save triple; lo++; hi--; skip equal lo values', '    elif sum < 0: lo++      // need a bigger sum', '    else: hi--              // need a smaller sum'],
    fields: [listF('Array', 3, 10, -9, 9)],
    legend: [['active', 'Fixed number a[i]'], ['compare', 'lo and hi'], ['found', 'Triple that sums to 0']],
    random() { return { arr: Array.from({ length: 8 }, () => rnd(-5, 5)) }; },
    run({ arr }) {
      const st = [], a = arr.slice().sort((x, y) => x - y), n = a.length, res = [];
      const P = (line, msg, v, cls = {}, ptrs = {}) => st.push({ line, msg, s: S(v, { mode: 'cells', cls, ptrs, info: T('goal: a[i] + a[lo] + a[hi] = 0', 'mục tiêu: a[i] + a[lo] + a[hi] = 0') }, { title: T('Triples found', 'Các bộ ba tìm được'), items: res.map(t => `[${t}]`) }) });
      P(0, T('This is the original array. Step 1: sort it.', 'Đây là mảng ban đầu. Bước 1: sắp xếp nó.'), arr);
      P(0, T('Sorted. Now fix one number at a time and search for a pair to its right.', 'Đã sắp xếp. Giờ cố định từng số một và tìm một cặp ở bên phải nó.'), a);
      for (let i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] === a[i - 1]) { P(2, T(`a[${i}] = ${a[i]} is the same as the one before — skip it (would repeat triples).`, `a[${i}] = ${a[i]} giống số liền trước — bỏ qua (sẽ lặp bộ ba).`), a, { [i]: 'swap' }, { i }); continue; }
        if (a[i] > 0) { P(1, T(`a[${i}] = ${a[i]} is positive and everything to the right is bigger, so no triple can sum to 0. Stop.`, `a[${i}] = ${a[i]} là số dương và mọi số bên phải đều lớn hơn, nên không bộ ba nào có tổng 0. Dừng.`), a, { [i]: 'swap' }, { i }); break; }
        let lo = i + 1, hi = n - 1;
        P(3, T(`Fix a[${i}] = ${a[i]}. We need two numbers to its right that add up to ${-a[i]}. Put lo = ${lo}, hi = ${hi}.`, `Cố định a[${i}] = ${a[i]}. Cần hai số bên phải có tổng ${-a[i]}. Đặt lo = ${lo}, hi = ${hi}.`), a, { [i]: 'active', [lo]: 'compare', [hi]: 'compare' }, { i, lo, hi });
        while (lo < hi) {
          const s = a[i] + a[lo] + a[hi], cls = { [i]: 'active', [lo]: 'compare', [hi]: 'compare' };
          P(5, T(`Add them up: ${a[i]} + ${a[lo]} + ${a[hi]} = ${s}.`, `Cộng lại: ${a[i]} + ${a[lo]} + ${a[hi]} = ${s}.`), a, cls, { i, lo, hi });
          if (s === 0) {
            res.push([a[i], a[lo], a[hi]]); cls[i] = cls[lo] = cls[hi] = 'found';
            P(6, T(`${s} = 0 ✔ Save the triple, then move both pointers inward.`, `${s} = 0 ✔ Lưu bộ ba, rồi dịch cả hai con trỏ vào trong.`), a, cls, { i, lo, hi });
            lo++; hi--; while (lo < hi && a[lo] === a[lo - 1]) lo++;
          } else if (s < 0) { P(7, T(`${s} < 0: too small → move lo right for a bigger number.`, `${s} < 0: quá nhỏ → dịch lo sang phải để lấy số lớn hơn.`), a, cls, { i, lo, hi }); lo++; }
          else { P(8, T(`${s} > 0: too big → move hi left for a smaller number.`, `${s} > 0: quá lớn → dịch hi sang trái để lấy số nhỏ hơn.`), a, cls, { i, lo, hi }); hi--; }
        }
      }
      P(1, T(`Done — ${res.length} unique triple${res.length === 1 ? '' : 's'} found.`, `Xong — tìm được ${res.length} bộ ba khác nhau.`), a);
      return st;
    },
  });

  /* ---------- 3. Container With Most Water ---------- */
  SOL.push({
    slug: 'container-with-most-water', title: 'Container With Most Water', diff: 'Medium', algo: 'two-pointers',
    statement: 'Each number is the height of a vertical line. Choose two lines that, together with the x-axis, hold the most water.',
    approach: ['Water held = (distance between the lines) × (height of the shorter line).', 'Start with the widest container: lo at the left end, hi at the right end.', 'Moving the taller line inward cannot help: width shrinks and the height is still capped by the shorter line. So always move the pointer at the shorter line, hoping for a taller one.', 'Track the best area. One pass → O(n).'],
    vi: { statement: 'Mỗi số là chiều cao của một đường thẳng đứng. Chọn hai đường sao cho cùng với trục x chúng chứa được nhiều nước nhất.', approach: ['Lượng nước chứa được = (khoảng cách giữa hai đường) × (chiều cao của đường thấp hơn).', 'Bắt đầu với bình rộng nhất: lo ở đầu trái, hi ở đầu phải.', 'Dịch đường cao hơn vào trong không giúp ích gì: chiều rộng giảm mà chiều cao vẫn bị giới hạn bởi đường thấp hơn. Vì vậy luôn dịch con trỏ ở đường thấp hơn, hy vọng gặp đường cao hơn.', 'Theo dõi diện tích tốt nhất. Một lượt duyệt → O(n).'] },
    time: 'O(n)', space: 'O(1)',
    code: ['lo = 0; hi = n - 1; best = 0', 'while lo < hi:', '  area = min(h[lo], h[hi]) * (hi - lo)', '  best = max(best, area)', '  move the pointer at the shorter line inward'],
    fields: [listF('Heights', 3, 12, 1, 20)],
    legend: [['compare', 'Current two lines'], ['sorted', 'Best pair so far'], ['found', 'Final best pair']],
    random() { return { arr: randArr(9, 1, 14) }; },
    run({ arr }) {
      const h = arr, n = h.length, st = []; let lo = 0, hi = n - 1, best = 0, bl = 0, bh = 0;
      const P = (line, msg, cls = {}) => { const c = {}; if (best > 0) { c[bl] = 'sorted'; c[bh] = 'sorted'; } Object.assign(c, cls); st.push({ line, msg, s: A(h, { cls: c, ptrs: { lo, hi }, dim: lo < hi ? [lo, hi] : null, info: T(`best area so far = ${best}`, `diện tích tốt nhất đến giờ = ${best}`) }) }); };
      P(0, T('Start with the widest possible container: first and last line.', 'Bắt đầu với bình rộng nhất có thể: cột đầu và cột cuối.'), { [lo]: 'compare', [hi]: 'compare' });
      while (lo < hi) {
        const w = hi - lo, mh = Math.min(h[lo], h[hi]), area = mh * w, cur = { [lo]: 'compare', [hi]: 'compare' };
        P(2, T(`Width = ${hi} − ${lo} = ${w}. Height is limited by the shorter line: min(${h[lo]}, ${h[hi]}) = ${mh}. Area = ${area}.`, `Chiều rộng = ${hi} − ${lo} = ${w}. Chiều cao bị giới hạn bởi cột thấp hơn: min(${h[lo]}, ${h[hi]}) = ${mh}. Diện tích = ${area}.`), cur);
        if (area > best) { best = area; bl = lo; bh = hi; P(3, T(`${area} beats the previous best — remember this pair.`, `${area} vượt kết quả tốt nhất trước đó — ghi nhớ cặp này.`), cur); }
        if (h[lo] < h[hi]) { P(4, T(`Line ${lo} (${h[lo]}) is the shorter one. Moving ${hi} inward could never raise the height, so move lo right.`, `Cột ${lo} (${h[lo]}) là cột thấp hơn. Dịch ${hi} vào trong không thể làm tăng chiều cao, nên dịch lo sang phải.`), cur); lo++; }
        else { P(4, T(`Line ${hi} (${h[hi]}) is the shorter (or equal) one, so move hi left.`, `Cột ${hi} (${h[hi]}) là cột thấp hơn (hoặc bằng), nên dịch hi sang trái.`), cur); hi--; }
      }
      P(1, T(`Pointers met. The largest container holds ${best} units of water.`, `Hai con trỏ gặp nhau. Bình lớn nhất chứa ${best} đơn vị nước.`), { [bl]: 'found', [bh]: 'found' });
      return st;
    },
  });

  /* ---------- 4. Valid Palindrome ---------- */
  SOL.push({
    slug: 'valid-palindrome', title: 'Valid Palindrome', diff: 'Easy', algo: 'two-pointers',
    statement: 'A palindrome reads the same forwards and backwards. Decide whether the given word is one. (Here: letters only; the real problem also ignores spaces and punctuation.)',
    approach: ['Compare the first and last letters.', 'If they differ, it cannot be a palindrome.', 'If they match, move both pointers toward the middle and repeat.', 'If the pointers meet without a mismatch, it is a palindrome. O(n) time, O(1) space.'],
    vi: { statement: 'Palindrome là chuỗi đọc xuôi hay ngược đều giống nhau. Hãy xác định từ cho trước có phải palindrome không. (Ở đây: chỉ có chữ cái; bài thật còn bỏ qua dấu cách và dấu câu.)', approach: ['So sánh chữ cái đầu và chữ cái cuối.', 'Nếu khác nhau thì không thể là palindrome.', 'Nếu giống nhau, dịch cả hai con trỏ vào giữa và lặp lại.', 'Nếu hai con trỏ gặp nhau mà không có chỗ nào khác nhau, đó là palindrome. Thời gian O(n), bộ nhớ O(1).'] },
    time: 'O(n)', space: 'O(1)',
    code: ['lo = 0; hi = n - 1', 'while lo < hi:', '  if s[lo] != s[hi]: return false', '  lo++; hi--', 'return true'],
    fields: [{ key: 's', label: 'Word', type: 'text', max: 10 }],
    legend: [['compare', 'Letters being compared'], ['found', 'Matching pair'], ['swap', 'Mismatch']],
    random() { return { s: pick(['RACECAR', 'LEVEL', 'ABCBA', 'HELLO', 'NOON', 'ABCDA', 'MADAM', 'ABBA']) }; },
    run({ s }) {
      const a = s.split(''), n = a.length, st = []; let lo = 0, hi = n - 1; const ok = {};
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: A(a, { mode: 'cells', cls: { ...ok, ...cls }, ptrs: { lo, hi }, dim: lo < hi ? [lo, hi] : null, info: T(`word = "${s}"`, `từ = "${s}"`) }) });
      P(0, T('Put one pointer at each end of the word.', 'Đặt một con trỏ ở mỗi đầu của từ.'));
      while (lo < hi) {
        if (a[lo] !== a[hi]) { P(2, T(`'${a[lo]}' ≠ '${a[hi]}' → the word is NOT a palindrome.`, `'${a[lo]}' ≠ '${a[hi]}' → từ này KHÔNG phải palindrome.`), { [lo]: 'swap', [hi]: 'swap' }); return st; }
        P(2, T(`'${a[lo]}' == '${a[hi]}' → they match.`, `'${a[lo]}' == '${a[hi]}' → khớp nhau.`), { [lo]: 'compare', [hi]: 'compare' });
        ok[lo] = ok[hi] = 'found'; lo++; hi--;
        P(3, T('Move both pointers one step toward the middle.', 'Dịch cả hai con trỏ một bước vào giữa.'));
      }
      P(4, T('Pointers met without any mismatch → it IS a palindrome.', 'Hai con trỏ gặp nhau mà không có chỗ nào không khớp → ĐÚNG là palindrome.'));
      return st;
    },
  });

  /* ---------- 5. Search in Rotated Sorted Array ---------- */
  SOL.push({
    slug: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', diff: 'Medium', algo: 'binary-search',
    statement: 'A sorted array was rotated at some unknown point (e.g. [1,2,3,4,5] → [4,5,1,2,3]). Find the index of a target in O(log n).',
    approach: ['Plain binary search needs a fully sorted array, but here at least ONE half around mid is always sorted.', 'Find which half is sorted by comparing a[lo] with a[mid].', 'Check whether the target lies inside that sorted half. If yes, search it; if no, search the other half.', 'The window halves every step → O(log n).'],
    vi: { statement: 'Một mảng đã sắp xếp bị xoay tại một điểm chưa biết (ví dụ [1,2,3,4,5] → [4,5,1,2,3]). Tìm chỉ số của một giá trị trong O(log n).', approach: ['Tìm kiếm nhị phân thường cần mảng sắp xếp hoàn toàn, nhưng ở đây luôn có ít nhất MỘT nửa quanh mid đã được sắp xếp.', 'Xác định nửa nào đã sắp xếp bằng cách so a[lo] với a[mid].', 'Kiểm tra giá trị cần tìm có nằm trong nửa đã sắp xếp đó không. Nếu có thì tìm trong nó; nếu không thì tìm nửa còn lại.', 'Cửa sổ giảm một nửa mỗi bước → O(log n).'] },
    time: 'O(log n)', space: 'O(1)',
    code: ['lo = 0; hi = n - 1', 'while lo <= hi:', '  mid = (lo + hi) / 2', '  if a[mid] == target: return mid', '  if a[lo] <= a[mid]:          // left half is sorted', '    if a[lo] <= target < a[mid]: hi = mid-1 else: lo = mid+1', '  else:                        // right half is sorted', '    if a[mid] < target <= a[hi]: lo = mid+1 else: hi = mid-1', 'return -1'],
    fields: [listF('Rotated array', 3, 12, 1, 99), { key: 'target', label: 'Target', type: 'num' }],
    legend: [['compare', 'mid'], ['sorted', 'The sorted half'], ['found', 'Found']],
    random() { const s = uniq(9, 3, 60).sort((x, y) => x - y), k = rnd(1, 7), arr = s.slice(k).concat(s.slice(0, k)); return { arr, target: Math.random() < 0.85 ? pick(arr) : 61 }; },
    run({ arr, target }) {
      const a = arr, n = a.length, st = [], info = T(`target = ${target}`, `cần tìm = ${target}`); let lo = 0, hi = n - 1;
      const P = (line, msg, cls = {}, mid) => st.push({ line, msg, s: A(a, { mode: 'cells', cls, info, ptrs: mid == null ? { lo, hi } : { lo, mid, hi }, dim: lo <= hi ? [lo, hi] : [1, 0] }) });
      P(0, T(`Search for ${target}. The array is a rotated sorted array.`, `Tìm ${target}. Mảng là một mảng đã sắp xếp bị xoay.`));
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        P(2, T(`mid = ⌊(${lo} + ${hi}) / 2⌋ = ${mid}, a[mid] = ${a[mid]}.`, `mid = ⌊(${lo} + ${hi}) / 2⌋ = ${mid}, a[mid] = ${a[mid]}.`), { [mid]: 'compare' }, mid);
        if (a[mid] === target) { P(3, T(`a[${mid}] == ${target} → found at index ${mid}!`, `a[${mid}] == ${target} → tìm thấy tại chỉ số ${mid}!`), { [mid]: 'found' }, mid); return st; }
        P(3, T(`a[mid] = ${a[mid]} ≠ ${target}, so keep looking.`, `a[mid] = ${a[mid]} ≠ ${target}, nên tiếp tục tìm.`), { [mid]: 'compare' }, mid);
        const cls = { [mid]: 'compare' };
        if (a[lo] <= a[mid]) {
          for (let x = lo; x <= mid; x++) cls[x] = x === mid ? 'compare' : 'sorted';
          P(4, T(`a[lo] = ${a[lo]} ≤ a[mid] = ${a[mid]} → the LEFT half (${a[lo]}…${a[mid]}) is sorted.`, `a[lo] = ${a[lo]} ≤ a[mid] = ${a[mid]} → nửa TRÁI (${a[lo]}…${a[mid]}) đã được sắp xếp.`), cls, mid);
          if (a[lo] <= target && target < a[mid]) { P(5, T(`${a[lo]} ≤ ${target} < ${a[mid]}: the target lies inside the sorted left half → hi = ${mid - 1}.`, `${a[lo]} ≤ ${target} < ${a[mid]}: giá trị cần tìm nằm trong nửa trái đã sắp xếp → hi = ${mid - 1}.`), cls, mid); hi = mid - 1; }
          else { P(5, T(`${target} is not inside ${a[lo]}…${a[mid]} → it can only be in the right half → lo = ${mid + 1}.`, `${target} không nằm trong ${a[lo]}…${a[mid]} → chỉ có thể ở nửa phải → lo = ${mid + 1}.`), cls, mid); lo = mid + 1; }
        } else {
          for (let x = mid; x <= hi; x++) cls[x] = x === mid ? 'compare' : 'sorted';
          P(6, T(`a[lo] = ${a[lo]} > a[mid] = ${a[mid]} → the RIGHT half (${a[mid]}…${a[hi]}) is sorted.`, `a[lo] = ${a[lo]} > a[mid] = ${a[mid]} → nửa PHẢI (${a[mid]}…${a[hi]}) đã được sắp xếp.`), cls, mid);
          if (a[mid] < target && target <= a[hi]) { P(7, T(`${a[mid]} < ${target} ≤ ${a[hi]}: the target lies inside the sorted right half → lo = ${mid + 1}.`, `${a[mid]} < ${target} ≤ ${a[hi]}: giá trị cần tìm nằm trong nửa phải đã sắp xếp → lo = ${mid + 1}.`), cls, mid); lo = mid + 1; }
          else { P(7, T(`${target} is not inside ${a[mid]}…${a[hi]} → it can only be in the left half → hi = ${mid - 1}.`, `${target} không nằm trong ${a[mid]}…${a[hi]} → chỉ có thể ở nửa trái → hi = ${mid - 1}.`), cls, mid); hi = mid - 1; }
        }
      }
      P(8, T(`The window is empty → ${target} is not in the array (return −1).`, `Cửa sổ rỗng → ${target} không có trong mảng (trả về −1).`));
      return st;
    },
  });

  /* ---------- 6. Best Time to Buy and Sell Stock ---------- */
  SOL.push({
    slug: 'best-time-to-buy-and-sell-stock', title: 'Best Time to Buy and Sell Stock', diff: 'Easy', algo: 'kadane',
    statement: 'Each number is a stock price on one day. Buy on one day and sell on a LATER day for the maximum profit.',
    approach: ['For each day, the best you can do if you sell today is: today\'s price − the cheapest price seen so far.', 'So walk through the days once, tracking the lowest price so far (minPrice).', 'At each day compute the profit of selling today and keep the maximum.', 'One pass, two variables → O(n) time, O(1) space.'],
    vi: { statement: 'Mỗi số là giá cổ phiếu trong một ngày. Mua vào một ngày và bán vào một ngày SAU ĐÓ để lợi nhuận lớn nhất.', approach: ['Với mỗi ngày, lợi nhuận tốt nhất nếu bán hôm nay là: giá hôm nay − giá thấp nhất đã thấy cho đến giờ.', 'Vì vậy duyệt các ngày một lần, theo dõi giá thấp nhất cho đến giờ (minPrice).', 'Mỗi ngày tính lợi nhuận nếu bán hôm nay và giữ giá trị lớn nhất.', 'Một lượt duyệt, hai biến → thời gian O(n), bộ nhớ O(1).'] },
    time: 'O(n)', space: 'O(1)',
    code: ['minPrice = a[0]; best = 0', 'for each later day i:', '  minPrice = min(minPrice, a[i])     // cheapest day to have bought', '  best = max(best, a[i] - minPrice)  // profit if we sell today', 'return best'],
    fields: [listF('Prices', 3, 12, 1, 99)],
    legend: [['pivot', 'Cheapest day so far (buy)'], ['compare', 'Today'], ['sorted', 'Best buy/sell days'], ['found', 'Final answer']],
    random() { return { arr: randArr(9, 3, 30) }; },
    run({ arr }) {
      const p = arr, n = p.length, st = []; let minI = 0, best = 0, bb = -1, bs = -1;
      const P = (line, msg, i, cls = {}) => { const c = {}; if (bb >= 0) { c[bb] = 'sorted'; c[bs] = 'sorted'; } c[minI] = 'pivot'; Object.assign(c, cls); st.push({ line, msg, s: A(p, { cls: c, ptrs: i >= 0 ? { today: i } : {}, info: T(`cheapest so far = ${p[minI]} · best profit = ${best}`, `rẻ nhất đến giờ = ${p[minI]} · lợi nhuận tốt nhất = ${best}`) }) }); };
      P(0, T(`Day 0: price ${p[0]}. Treat it as the cheapest price seen so far. Best profit starts at 0.`, `Ngày 0: giá ${p[0]}. Coi đây là giá rẻ nhất đến giờ. Lợi nhuận tốt nhất bắt đầu là 0.`), -1);
      for (let i = 1; i < n; i++) {
        if (p[i] < p[minI]) { minI = i; P(2, T(`Day ${i}: price ${p[i]} is the new cheapest → a better day to have bought.`, `Ngày ${i}: giá ${p[i]} là rẻ nhất mới → ngày mua tốt hơn.`), i, { [i]: 'pivot' }); }
        else P(2, T(`Day ${i}: price ${p[i]} is not cheaper than ${p[minI]} → keep the earlier buy day.`, `Ngày ${i}: giá ${p[i]} không rẻ hơn ${p[minI]} → giữ ngày mua trước đó.`), i, { [i]: 'compare' });
        const profit = p[i] - p[minI];
        if (profit > best) { best = profit; bb = minI; bs = i; P(3, T(`Sell today: ${p[i]} − ${p[minI]} = ${profit} → new best profit!`, `Bán hôm nay: ${p[i]} − ${p[minI]} = ${profit} → lợi nhuận tốt nhất mới!`), i, { [i]: 'compare' }); }
        else P(3, T(`Sell today: ${p[i]} − ${p[minI]} = ${profit}, not better than ${best}.`, `Bán hôm nay: ${p[i]} − ${p[minI]} = ${profit}, không hơn ${best}.`), i, { [i]: 'compare' });
      }
      const c = {}; if (bb >= 0) { c[bb] = 'pivot'; c[bs] = 'found'; }
      st.push({ line: 4, msg: best > 0 ? T(`Max profit = ${best}: buy on day ${bb} (price ${p[bb]}), sell on day ${bs} (price ${p[bs]}).`, `Lợi nhuận tối đa = ${best}: mua ngày ${bb} (giá ${p[bb]}), bán ngày ${bs} (giá ${p[bs]}).`) : T('Prices only fall, so the best choice is to not trade: profit 0.', 'Giá chỉ giảm, nên tốt nhất là không giao dịch: lợi nhuận 0.'), s: A(p, { cls: c, info: T(`best profit = ${best}`, `lợi nhuận tốt nhất = ${best}`) }) });
      return st;
    },
  });

  /* ---------- 7. Longest Substring Without Repeating Characters ---------- */
  SOL.push({
    slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', diff: 'Medium', algo: 'sliding-window',
    statement: 'Find the length of the longest stretch of consecutive characters in which no character appears twice.',
    approach: ['Use a window [left, right] that always contains NO repeated letter.', 'Move right one step at a time, adding a new character.', 'If that character already appears inside the window, jump left to just after its previous position — the repeat is gone.', 'Record the window length each time. Each character is handled once → O(n).'],
    vi: { statement: 'Tìm độ dài của đoạn ký tự liên tiếp dài nhất mà không ký tự nào xuất hiện hai lần.', approach: ['Dùng cửa sổ [left, right] luôn KHÔNG chứa chữ cái nào lặp lại.', 'Dịch right từng bước, thêm một ký tự mới.', 'Nếu ký tự đó đã có trong cửa sổ, nhảy left tới ngay sau vị trí trước đó của nó — chỗ lặp biến mất.', 'Ghi lại độ dài cửa sổ mỗi lần. Mỗi ký tự được xử lý một lần → O(n).'] },
    time: 'O(n)', space: 'O(k)  (k = alphabet size)',
    code: ['left = 0; best = 0; last = {}   // last index of each char', 'for right from 0 to n-1:', '  if s[right] was seen at index ≥ left:', '    left = last[s[right]] + 1      // jump past the duplicate', '  last[s[right]] = right; best = max(best, right-left+1)', 'return best'],
    fields: [{ key: 's', label: 'String', type: 'text', max: 12 }],
    legend: [['active', 'Current window'], ['swap', 'Duplicate'], ['sorted', 'Best window so far'], ['found', 'Answer']],
    random() { return { s: pick(['ABCABCBB', 'PWWKEW', 'ABBA', 'DVDF', 'ABCDEFAB', 'BBBBB']) }; },
    run({ s }) {
      const a = s.split(''), n = a.length, st = [], last = {}; let l = 0, best = 0, bl = 0, br = -1;
      const P = (line, msg, r, cls = {}) => { const c = {}; for (let x = bl; x <= br; x++) c[x] = 'sorted'; for (let x = l; x <= r; x++) c[x] = 'active'; Object.assign(c, cls); const w = a.slice(l, r + 1).join(''); st.push({ line, msg, s: A(a, { mode: 'cells', cls: c, win: r >= l ? [l, r] : null, ptrs: r >= 0 ? { right: r } : {}, info: T(`window = "${w}" · best length = ${best}`, `cửa sổ = "${w}" · dài nhất = ${best}`) }) }); };
      P(0, T('Start with an empty window.', 'Bắt đầu với cửa sổ rỗng.'), -1);
      for (let r = 0; r < n; r++) {
        const ch = a[r], prev = last[ch]; let dup = false;
        if (prev !== undefined && prev >= l) {
          dup = true;
          P(2, T(`Add '${ch}' at ${r}: it already appears at index ${prev}, inside the window → duplicate!`, `Thêm '${ch}' ở ${r}: nó đã xuất hiện tại chỉ số ${prev}, nằm trong cửa sổ → trùng lặp!`), r, { [prev]: 'swap', [r]: 'swap' });
          l = prev + 1;
          P(3, T(`Move left to ${l}, just past the old '${ch}', so the window has no repeats again.`, `Dịch left tới ${l}, ngay sau '${ch}' cũ, để cửa sổ không còn trùng lặp.`), r);
        }
        last[ch] = r;
        if (r - l + 1 > best) { best = r - l + 1; bl = l; br = r; }
        const w = a.slice(l, r + 1).join('');
        P(4, T(`${dup ? '' : `'${ch}' is new to the window — extend it. `}Window "${w}" has length ${r - l + 1}. Best = ${best}.`, `${dup ? '' : `'${ch}' là ký tự mới trong cửa sổ — mở rộng cửa sổ. `}Cửa sổ "${w}" có độ dài ${r - l + 1}. Tốt nhất = ${best}.`), r);
      }
      const c = {}; for (let x = bl; x <= br; x++) c[x] = 'found';
      st.push({ line: 5, msg: T(`The longest substring without repeats has length ${best}.`, `Chuỗi con dài nhất không lặp có độ dài ${best}.`), s: A(a, { mode: 'cells', cls: c, info: T(`best length = ${best}`, `dài nhất = ${best}`) }) });
      return st;
    },
  });

  /* ---------- 8. Sort Colors ---------- */
  SOL.push({
    slug: 'sort-colors', title: 'Sort Colors', diff: 'Medium', algo: 'quick-sort',
    statement: 'The array only contains 0, 1 and 2 (red, white, blue). Sort it in place in a single pass, without using a library sort.',
    approach: ['This is the "Dutch national flag" problem — a 3-way partition, like quick sort with two pivots.', 'Keep three zones: everything before low is 0, everything after high is 2, and between low and mid is 1. Between mid and high is still unknown.', 'Look at a[mid]: a 0 is swapped to the front (low), a 1 is already fine, a 2 is swapped to the back (high).', 'After a swap with high we do NOT move mid — the value swapped in is still unchecked.'],
    vi: { statement: 'Mảng chỉ chứa 0, 1 và 2 (đỏ, trắng, xanh). Sắp xếp nó tại chỗ trong một lượt duyệt, không dùng hàm sắp xếp có sẵn.', approach: ['Đây là bài "cờ quốc gia Hà Lan" — phân hoạch 3 phần, giống quick sort với hai chốt.', 'Giữ ba vùng: mọi thứ trước low là 0, mọi thứ sau high là 2, và giữa low và mid là 1. Giữa mid và high vẫn chưa biết.', 'Nhìn a[mid]: số 0 được đổi ra phía trước (low), số 1 đã ổn, số 2 được đổi ra phía sau (high).', 'Sau khi đổi với high ta KHÔNG tăng mid — giá trị vừa đổi vào vẫn chưa được kiểm tra.'] },
    time: 'O(n)', space: 'O(1)',
    code: ['low = 0; mid = 0; high = n - 1', 'while mid <= high:', '  if a[mid] == 0: swap(a[low], a[mid]); low++; mid++', '  elif a[mid] == 1: mid++', '  else: swap(a[mid], a[high]); high--'],
    fields: [listF('Array of 0/1/2', 3, 12, 0, 2)],
    legend: [['swap', '0 (red)'], ['', '1 (white)'], ['active', '2 (blue)']],
    random() { return { arr: Array.from({ length: 10 }, () => rnd(0, 2)) }; },
    run({ arr }) {
      const a = arr.slice(), n = a.length, st = []; let low = 0, mid = 0, high = n - 1;
      const P = (line, msg, done) => { const c = {}; a.forEach((v, i) => { if (v === 0) c[i] = 'swap'; else if (v === 2) c[i] = 'active'; }); st.push({ line, msg, s: A(a, { mode: 'cells', cls: c, ptrs: { low, mid, high }, dim: !done && mid <= high ? [mid, high] : null, info: T('faded = already placed · bright = still to check', 'mờ = đã đặt xong · sáng = còn phải kiểm tra') }) }); };
      P(0, T('low and mid start at the left, high at the right. Everything is unchecked.', 'low và mid bắt đầu ở bên trái, high ở bên phải. Chưa kiểm tra phần tử nào.'));
      while (mid <= high) {
        const v = a[mid];
        if (v === 0) { [a[low], a[mid]] = [a[mid], a[low]]; low++; mid++; P(2, T('a[mid] was 0 (red): swap it to the front zone, then advance low and mid.', 'a[mid] là 0 (đỏ): đổi nó ra vùng phía trước, rồi tăng low và mid.')); }
        else if (v === 1) { mid++; P(3, T('a[mid] was 1 (white): already in the middle zone → just advance mid.', 'a[mid] là 1 (trắng): đã ở đúng vùng giữa → chỉ tăng mid.')); }
        else { [a[mid], a[high]] = [a[high], a[mid]]; high--; P(4, T('a[mid] was 2 (blue): swap it to the back zone and shrink high. Do not move mid — the swapped-in value is unchecked.', 'a[mid] là 2 (xanh): đổi nó ra vùng phía sau và thu nhỏ high. Không tăng mid — giá trị vừa đổi vào chưa được kiểm tra.')); }
      }
      P(1, T('mid passed high → every value is placed: all 0s, then 1s, then 2s.', 'mid vượt qua high → mọi giá trị đã vào đúng chỗ: toàn số 0, rồi số 1, rồi số 2.'), true);
      return st;
    },
  });

  /* ---------- 9. Number of Islands (detailed) ---------- */
  const COL = ['sorted', 'pivot', 'compare', 'swap'];
  SOL.push({
    slug: 'number-of-islands', title: 'Number of Islands', diff: 'Medium', algo: 'dfs',
    statement: 'A grid contains 1 (land) and 0 (water). An island is a group of land cells connected up, down, left or right. Count the islands.',
    approach: ['Scan the grid cell by cell.', 'When you find land that has not been visited, that is a NEW island: add 1 to the count.', 'Then run DFS from that cell to mark every connected land cell as visited, so it is never counted again.', 'For every land cell DFS checks its 4 neighbours: stop at the border, at water, or at cells already visited; otherwise go there.', 'Every cell is visited a constant number of times → O(rows × cols).'],
    vi: { statement: 'Một lưới chứa 1 (đất) và 0 (nước). Đảo là một nhóm ô đất nối với nhau theo hướng lên, xuống, trái, phải. Đếm số đảo.', approach: ['Quét lưới từng ô một.', 'Khi gặp ô đất chưa thăm, đó là một ĐẢO MỚI: tăng đếm thêm 1.', 'Rồi chạy DFS từ ô đó để đánh dấu mọi ô đất liên thông là đã thăm, để không bao giờ đếm lại.', 'Với mỗi ô đất, DFS xét 4 ô kề: dừng ở biên lưới, ở nước, hoặc ở ô đã thăm; ngược lại thì đi tới đó.', 'Mỗi ô được thăm một số lần không đổi → O(hàng × cột).'] },
    time: 'O(R·C)', space: 'O(R·C)',
    code: ['count = 0', 'for each cell (r, c):', '  if grid[r][c] is unvisited land:', '    count++; dfs(r, c)        // mark the whole island', 'return count', '', 'dfs(r, c):', '  if out of bounds, water, or visited: return', '  mark (r, c) visited', '  dfs on up, down, left, right'],
    fields: [],
    legend: [['active', 'Cell being visited'], ['compare', 'Neighbour being checked'], ['sorted', 'Island A / C…'], ['pivot', 'Island B / D…']],
    random() {
      const R = 4, C = 5; const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => (Math.random() < 0.5 ? 1 : 0)));
      if (!grid.flat().includes(1)) grid[2][2] = 1; return { grid };
    },
    run({ grid }) {
      const R = grid.length, C = grid[0].length, st = [], vis = grid.map(r => r.map(() => null));
      const rows = Array.from({ length: R }, (_, i) => 'r' + i), cols = Array.from({ length: C }, (_, i) => 'c' + i); let count = 0;
      const DIRS = [[-1, 0, 'up', 'lên'], [1, 0, 'down', 'xuống'], [0, -1, 'left', 'trái'], [0, 1, 'right', 'phải']];
      const P = (line, msg, extra = {}) => {
        const cls = {}, cells = grid.map((row, r) => row.map((v, c) => {
          const k = `${r},${c}`;
          if (v === 0) cls[k] = 'water'; else if (vis[r][c]) cls[k] = COL[(vis[r][c].charCodeAt(0) - 65) % 4];
          return vis[r][c] || v;
        }));
        Object.assign(cls, extra);
        st.push({ line, msg, s: G(rows, cols, cells, cls, T(`islands counted so far: ${count}   (1 = land, 0 = water, letters = counted islands)`, `số đảo đã đếm: ${count}   (1 = đất, 0 = nước, chữ cái = đảo đã đếm)`)) });
      };
      function dfs(r, c, id) {
        vis[r][c] = id;
        P(8, T(`DFS: visit land cell (${r},${c}) and mark it as part of island ${id}. Now try its 4 neighbours.`, `DFS: thăm ô đất (${r},${c}) và đánh dấu thuộc đảo ${id}. Giờ thử 4 ô kề.`), { [`${r},${c}`]: 'active' });
        for (const [dr, dc, en, vi] of DIRS) {
          const nr = r + dr, nc = c + dc, here = { [`${r},${c}`]: 'active' };
          if (nr < 0 || nc < 0 || nr >= R || nc >= C) { P(7, T(`From (${r},${c}), the ${en} neighbour is outside the grid → stop.`, `Từ (${r},${c}), ô ${vi} nằm ngoài lưới → dừng.`), here); continue; }
          here[`${nr},${nc}`] = 'compare';
          if (grid[nr][nc] === 0) { P(7, T(`${en} neighbour (${nr},${nc}) is water → stop.`, `ô ${vi} (${nr},${nc}) là nước → dừng.`), here); continue; }
          if (vis[nr][nc]) { P(7, T(`${en} neighbour (${nr},${nc}) was already visited → stop.`, `ô ${vi} (${nr},${nc}) đã được thăm → dừng.`), here); continue; }
          P(9, T(`${en} neighbour (${nr},${nc}) is unvisited land → go there.`, `ô ${vi} (${nr},${nc}) là đất chưa thăm → đi tới đó.`), here);
          dfs(nr, nc, id);
          P(9, T(`Back at (${r},${c}) — try the next direction.`, `Quay lại (${r},${c}) — thử hướng tiếp theo.`), { [`${r},${c}`]: 'active' });
        }
      }
      P(0, T('Scan the grid for land, left to right, top to bottom. Water cells are faded.', 'Quét lưới tìm đất, từ trái sang phải, từ trên xuống dưới. Ô nước bị làm mờ.'));
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        const here = { [`${r},${c}`]: 'compare' };
        if (grid[r][c] === 0) { P(1, T(`Scan (${r},${c}): water → skip.`, `Quét (${r},${c}): là nước → bỏ qua.`), here); continue; }
        if (vis[r][c]) { P(2, T(`Scan (${r},${c}): land, but already part of island ${vis[r][c]} → skip.`, `Quét (${r},${c}): là đất nhưng đã thuộc đảo ${vis[r][c]} → bỏ qua.`), here); continue; }
        count++; const id = String.fromCharCode(64 + count);
        P(3, T(`Scan (${r},${c}): unvisited land → a NEW island! count = ${count}. Flood-fill it with DFS.`, `Quét (${r},${c}): đất chưa thăm → một ĐẢO MỚI! count = ${count}. Loang hết đảo bằng DFS.`), { [`${r},${c}`]: 'active' });
        dfs(r, c, id);
      }
      P(4, T(`Scan complete → ${count} island${count === 1 ? '' : 's'}.`, `Quét xong → ${count} đảo.`));
      return st;
    },
  });

  /* ---------- 10. Rotting Oranges (detailed) ---------- */
  SOL.push({
    slug: 'rotting-oranges', title: 'Rotting Oranges', diff: 'Medium', algo: 'bfs',
    statement: 'In a grid, 1 is a fresh orange, 2 is rotten, 0 is empty. Every minute, fresh oranges next to a rotten one (up/down/left/right) become rotten. How many minutes until none are fresh? Return −1 if impossible.',
    approach: ['Rot spreads outward like a ripple — one "layer" per minute. That is BFS.', 'Start BFS from ALL rotten oranges at once (a multi-source BFS) and count the fresh ones.', 'Each minute, take every rotten orange currently in the queue, look at its 4 neighbours, and rot the fresh ones (adding them to the queue for the NEXT minute).', 'When the queue runs dry: if fresh oranges remain they were unreachable → −1, otherwise the minute count is the answer.'],
    vi: { statement: 'Trong một lưới, 1 là cam tươi, 2 là cam thối, 0 là ô trống. Mỗi phút, cam tươi kề cam thối (trên/dưới/trái/phải) sẽ bị thối. Sau bao nhiêu phút thì không còn cam tươi? Trả về −1 nếu không thể.', approach: ['Sự thối lan ra như gợn sóng — mỗi phút một "tầng". Đó chính là BFS.', 'Bắt đầu BFS từ TẤT CẢ cam thối cùng lúc (BFS nhiều nguồn) và đếm số cam tươi.', 'Mỗi phút, lấy từng quả cam thối đang có trong hàng đợi, xét 4 ô kề, và làm thối những quả tươi (cho chúng vào hàng đợi của phút TIẾP THEO).', 'Khi hàng đợi cạn: nếu còn cam tươi thì chúng không thể tới được → −1, ngược lại số phút là đáp án.'] },
    time: 'O(R·C)', space: 'O(R·C)',
    code: ['queue = all rotten oranges; fresh = number of fresh; minutes = 0', 'while queue not empty and fresh > 0:', '  for each orange in the queue (this minute):', '    rot its fresh neighbours; fresh--; enqueue them', '  minutes++', 'return minutes if fresh == 0 else -1'],
    fields: [],
    legend: [['sorted', '1 = fresh'], ['swap', '2 = rotten'], ['active', 'Rotten orange being processed'], ['compare', 'Neighbour being checked']],
    random() {
      const R = 4, C = 5; const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => { const x = Math.random(); return x < 0.15 ? 0 : x < 0.27 ? 2 : 1; }));
      if (!grid.flat().includes(2)) grid[rnd(0, R - 1)][rnd(0, C - 1)] = 2; return { grid };
    },
    run({ grid }) {
      const R = grid.length, C = grid[0].length, g = grid.map(r => r.slice()), st = [];
      const rows = Array.from({ length: R }, (_, i) => 'r' + i), cols = Array.from({ length: C }, (_, i) => 'c' + i);
      const DIRS = [[-1, 0, 'up', 'trên'], [1, 0, 'down', 'dưới'], [0, -1, 'left', 'trái'], [0, 1, 'right', 'phải']];
      let queue = [], fresh = 0, minutes = 0, next = [], pending = [];
      g.forEach((row, r) => row.forEach((v, c) => { if (v === 2) queue.push([r, c]); if (v === 1) fresh++; }));
      const P = (line, msg, extra = {}) => {
        const cls = {}; g.forEach((row, r) => row.forEach((v, c) => { cls[`${r},${c}`] = v === 0 ? 'water' : v === 1 ? 'sorted' : 'swap'; }));
        Object.assign(cls, extra);
        const items = [...pending.map(q => q.join(',')), ...next.map(q => '→' + q.join(','))];
        st.push({ line, msg, s: { ...G(rows, cols, g, cls, T(`minute ${minutes + (pending.length ? 1 : 0)} · fresh oranges left: ${fresh}`, `phút ${minutes + (pending.length ? 1 : 0)} · cam tươi còn lại: ${fresh}`)), aux: { title: T('Queue: this minute, →next minute (row,col)', 'Hàng đợi: phút này, →phút sau (hàng,cột)'), items } } });
      };
      pending = queue.slice();
      P(0, T(`All ${queue.length} rotten orange${queue.length === 1 ? '' : 's'} go into the queue (they all start spreading at minute 0). ${fresh} fresh orange${fresh === 1 ? '' : 's'} to go.`, `Cả ${queue.length} quả cam thối vào hàng đợi (tất cả bắt đầu lan từ phút 0). Còn ${fresh} quả cam tươi.`));
      while (queue.length && fresh > 0) {
        next = []; pending = queue.slice();
        P(1, T(`Minute ${minutes + 1} begins: ${queue.length} rotten orange${queue.length === 1 ? '' : 's'} will spread to their neighbours.`, `Phút ${minutes + 1} bắt đầu: ${queue.length} quả cam thối sẽ lây sang các ô kề.`));
        for (const [r, c] of queue) {
          pending.shift();
          P(2, T(`Process the rotten orange at (${r},${c}) — look at its 4 neighbours.`, `Xử lý quả cam thối tại (${r},${c}) — xét 4 ô kề của nó.`), { [`${r},${c}`]: 'active' });
          for (const [dr, dc, en, vi] of DIRS) {
            const nr = r + dr, nc = c + dc, base = { [`${r},${c}`]: 'active' };
            if (nr < 0 || nc < 0 || nr >= R || nc >= C) { P(3, T(`${en} of (${r},${c}) is outside the grid → ignore.`, `Ô ${vi} của (${r},${c}) nằm ngoài lưới → bỏ qua.`), base); continue; }
            base[`${nr},${nc}`] = 'compare';
            if (g[nr][nc] === 0) P(3, T(`${en} (${nr},${nc}) is empty → nothing to rot.`, `Ô ${vi} (${nr},${nc}) là ô trống → không có gì để làm thối.`), base);
            else if (g[nr][nc] === 2) P(3, T(`${en} (${nr},${nc}) is already rotten → ignore.`, `Ô ${vi} (${nr},${nc}) đã thối → bỏ qua.`), base);
            else { g[nr][nc] = 2; fresh--; next.push([nr, nc]); base[`${nr},${nc}`] = 'active'; P(3, T(`${en} (${nr},${nc}) is FRESH → it rots! Enqueue it for next minute. ${fresh} fresh left.`, `Ô ${vi} (${nr},${nc}) là cam TƯƠI → bị thối! Cho vào hàng đợi cho phút sau. Còn ${fresh} quả tươi.`), base); }
          }
        }
        pending = [];
        if (!next.length) { P(5, T('Nobody new rotted this minute → the spreading has stopped.', 'Không quả nào bị thối thêm trong phút này → sự lây lan đã dừng.')); queue = []; break; }
        minutes++; queue = next; pending = [];
        P(4, T(`End of minute ${minutes}: ${next.length} more orange${next.length === 1 ? '' : 's'} rotted. minutes = ${minutes}.`, `Hết phút ${minutes}: có thêm ${next.length} quả cam bị thối. minutes = ${minutes}.`));
        pending = queue.slice(); next = [];
      }
      pending = []; next = [];
      P(5, fresh === 0 ? T(`No fresh oranges left → answer = ${minutes} minute${minutes === 1 ? '' : 's'}.`, `Không còn cam tươi → đáp án = ${minutes} phút.`) : T(`${fresh} fresh orange${fresh === 1 ? ' is' : 's are'} unreachable (cut off by empty cells) → answer = −1.`, `${fresh} quả cam tươi không với tới được (bị chặn bởi ô trống) → đáp án = −1.`));
      return st;
    },
  });

  /* ---------- 11. Climbing Stairs ---------- */
  SOL.push({
    slug: 'climbing-stairs', title: 'Climbing Stairs', diff: 'Easy', algo: 'coin-change',
    statement: 'You climb a staircase of n steps, taking 1 or 2 steps at a time. In how many distinct ways can you reach the top?',
    approach: ['To stand on step i, your last move came from step i−1 (a 1-step) or from step i−2 (a 2-step).', 'So ways(i) = ways(i−1) + ways(i−2) — the Fibonacci sequence!', 'Fill a table from the bottom up: ways(0) = 1 (do nothing) and ways(1) = 1.', 'We only need the previous two values, so space can even be reduced to O(1).'],
    vi: { statement: 'Bạn leo cầu thang n bậc, mỗi lần bước 1 hoặc 2 bậc. Có bao nhiêu cách khác nhau để lên đến đỉnh?', approach: ['Để đứng ở bậc i, bước cuối của bạn đến từ bậc i−1 (bước 1) hoặc từ bậc i−2 (bước 2).', 'Vậy ways(i) = ways(i−1) + ways(i−2) — chính là dãy Fibonacci!', 'Điền bảng từ dưới lên: ways(0) = 1 (không làm gì) và ways(1) = 1.', 'Ta chỉ cần hai giá trị trước đó, nên bộ nhớ thậm chí có thể giảm còn O(1).'] },
    time: 'O(n)', space: 'O(n)',
    code: ['dp[0] = 1; dp[1] = 1', 'for i from 2 to n:', '  dp[i] = dp[i-1] + dp[i-2]   // arrive from 1 step below or 2 steps below', 'return dp[n]'],
    fields: [{ key: 'n', label: 'Stairs n', type: 'num', lo: 1, hi: 12 }],
    legend: [['active', 'dp[i] being computed'], ['compare', 'The two cells it adds'], ['found', 'Answer']],
    random() { return { n: rnd(5, 9) }; },
    run({ n }) {
      const dp = Array(n + 1).fill(null), st = [], cols = Array.from({ length: n + 1 }, (_, i) => i);
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G([T('ways', 'số cách')], cols, [dp], cls, T(`staircase with ${n} step${n === 1 ? '' : 's'} · column = step number`, `cầu thang ${n} bậc · cột = số bậc`)) });
      dp[0] = 1; dp[1] = 1;
      P(0, T('There is 1 way to be on step 0 (do nothing) and 1 way to reach step 1 (one single step).', 'Có 1 cách đứng ở bậc 0 (không làm gì) và 1 cách lên bậc 1 (một bước đơn).'));
      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        P(2, T(`Step ${i}: come from step ${i - 1} (${dp[i - 1]} ways) or from step ${i - 2} (${dp[i - 2]} ways) → ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} ways.`, `Bậc ${i}: đến từ bậc ${i - 1} (${dp[i - 1]} cách) hoặc từ bậc ${i - 2} (${dp[i - 2]} cách) → ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]} cách.`), { [`0,${i}`]: 'active', [`0,${i - 1}`]: 'compare', [`0,${i - 2}`]: 'compare' });
      }
      P(3, T(`There are ${dp[n]} distinct ways to climb ${n} steps.`, `Có ${dp[n]} cách khác nhau để leo ${n} bậc.`), { [`0,${n}`]: 'found' });
      return st;
    },
  });

  /* ---------- 12. House Robber (detailed) ---------- */
  SOL.push({
    slug: 'house-robber', title: 'House Robber', diff: 'Medium', algo: 'coin-change',
    statement: 'Each number is the money in a house along a street. You cannot rob two adjacent houses. What is the most you can steal?',
    approach: ['At house i you have two choices: skip it (keep the best from house i−1), or rob it (its money + the best up to house i−2, since i−1 is off limits).', 'dp[i] = max(dp[i−1], dp[i−2] + money[i]).', 'Fill left to right: first compute the "skip" value, then the "rob" value, then keep the larger. The last cell is the answer.', 'Trace back to see which houses were actually robbed.'],
    vi: { statement: 'Mỗi số là số tiền trong một ngôi nhà dọc con phố. Bạn không được trộm hai nhà liền kề. Số tiền nhiều nhất có thể lấy là bao nhiêu?', approach: ['Ở nhà i có hai lựa chọn: bỏ qua nó (giữ kết quả tốt nhất tới nhà i−1), hoặc trộm nó (tiền của nó + kết quả tốt nhất tới nhà i−2, vì nhà i−1 bị cấm).', 'dp[i] = max(dp[i−1], dp[i−2] + tiền[i]).', 'Điền từ trái sang phải: trước hết tính giá trị "bỏ qua", rồi giá trị "trộm", rồi giữ giá trị lớn hơn. Ô cuối là đáp án.', 'Truy ngược để biết những nhà nào thật sự bị trộm.'] },
    time: 'O(n)', space: 'O(n)',
    code: ['dp[0] = a[0]; dp[1] = max(a[0], a[1])', 'for i from 2 to n-1:', '  skip = dp[i-1]            // do not rob house i', '  rob  = dp[i-2] + a[i]     // rob house i, skip its neighbour', '  dp[i] = max(skip, rob)', 'return dp[n-1]'],
    fields: [listF('Money per house', 2, 10, 1, 30)],
    legend: [['active', 'dp[i] being computed'], ['compare', 'Skip / rob sources'], ['found', 'Houses robbed']],
    random() { return { arr: randArr(7, 1, 9) }; },
    run({ arr }) {
      const a = arr, n = a.length, dp = Array(n).fill(null), st = [], cols = a.map((_, i) => T('house ', 'nhà ') + i);
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G([T('money', 'tiền'), T('best total', 'tổng tốt nhất')], cols, [a, dp], cls, T('You may not rob two neighbouring houses', 'Không được trộm hai nhà liền kề')) });
      dp[0] = a[0]; dp[1] = Math.max(a[0], a[1]);
      P(0, T(`House 0: best is ${a[0]}. House 1: best is max(${a[0]}, ${a[1]}) = ${dp[1]} — you can only take one of the first two.`, `Nhà 0: tốt nhất là ${a[0]}. Nhà 1: tốt nhất là max(${a[0]}, ${a[1]}) = ${dp[1]} — chỉ được lấy một trong hai nhà đầu.`), { '1,0': 'active', '1,1': 'active' });
      for (let i = 2; i < n; i++) {
        const skip = dp[i - 1], rob = dp[i - 2] + a[i];
        P(2, T(`House ${i}, option 1 — SKIP it: keep the best so far from house ${i - 1} → skip = ${skip}.`, `Nhà ${i}, lựa chọn 1 — BỎ QUA: giữ kết quả tốt nhất từ nhà ${i - 1} → skip = ${skip}.`), { [`1,${i}`]: 'active', [`1,${i - 1}`]: 'compare' });
        P(3, T(`House ${i}, option 2 — ROB it: ${a[i]} + best up to house ${i - 2} (${dp[i - 2]}) = ${rob}. (House ${i - 1} is off limits.)`, `Nhà ${i}, lựa chọn 2 — TRỘM: ${a[i]} + tốt nhất tới nhà ${i - 2} (${dp[i - 2]}) = ${rob}. (Nhà ${i - 1} bị cấm.)`), { [`1,${i}`]: 'active', [`1,${i - 2}`]: 'compare', [`0,${i}`]: 'compare' });
        dp[i] = Math.max(skip, rob);
        P(4, T(`Keep the larger: max(${skip}, ${rob}) = ${dp[i]} → dp[${i}] = ${dp[i]}.`, `Giữ giá trị lớn hơn: max(${skip}, ${rob}) = ${dp[i]} → dp[${i}] = ${dp[i]}.`), { [`1,${i}`]: 'active' });
      }
      const path = {}, robbed = []; let i = n - 1;
      while (i >= 0) { if (i >= 1 && dp[i] === dp[i - 1]) i--; else { robbed.push(i); path[`0,${i}`] = 'found'; i -= 2; } }
      P(5, T(`Maximum loot = ${dp[n - 1]}, by robbing house${robbed.length > 1 ? 'es' : ''} ${robbed.reverse().join(', ')}.`, `Số tiền tối đa = ${dp[n - 1]}, bằng cách trộm nhà ${robbed.join(', ')}.`), path);
      return st;
    },
  });

  /* ---------- 13. Edit Distance (detailed) ---------- */
  SOL.push({
    slug: 'edit-distance', title: 'Edit Distance', diff: 'Medium', algo: 'lcs',
    statement: 'What is the minimum number of single-letter edits (insert, delete, replace) needed to turn word A into word B?',
    approach: ['dp[i][j] = fewest edits to turn the first i letters of A into the first j letters of B.', 'Turning a word into an empty word takes i deletions; building a word from empty takes j insertions — that fills row 0 and column 0.', 'If the new letters match, no edit is needed: copy the diagonal.', 'Otherwise look at three neighbours — replace (diagonal), delete (up), insert (left) — take the cheapest and add 1.'],
    vi: { statement: 'Cần tối thiểu bao nhiêu phép sửa một chữ cái (chèn, xóa, thay thế) để biến từ A thành từ B?', approach: ['dp[i][j] = số phép sửa ít nhất để biến i chữ đầu của A thành j chữ đầu của B.', 'Biến một từ thành từ rỗng cần i lần xóa; dựng một từ từ rỗng cần j lần chèn — đó là hàng 0 và cột 0.', 'Nếu hai chữ mới giống nhau thì không cần sửa: chép ô chéo.', 'Ngược lại xét ba ô kề — thay thế (ô chéo), xóa (ô trên), chèn (ô trái) — lấy cái rẻ nhất rồi cộng 1.'] },
    time: 'O(m·n)', space: 'O(m·n)',
    code: ['dp[i][0] = i; dp[0][j] = j       // to/from an empty word', 'for i in 1..m: for j in 1..n:', '  if A[i] == B[j]:', '    dp[i][j] = dp[i-1][j-1]       // letters match: free', '  else:', '    dp[i][j] = 1 + min(dp[i-1][j-1],   // replace', '                       dp[i-1][j],     // delete', '                       dp[i][j-1])     // insert', 'return dp[m][n]'],
    fields: [{ key: 'a', label: 'From word', type: 'text', max: 8 }, { key: 'b', label: 'To word', type: 'text', max: 8 }],
    legend: [['active', 'Cell being filled'], ['compare', 'Cells it can come from'], ['found', 'Traceback path']],
    random() { return pick([{ a: 'HORSE', b: 'ROS' }, { a: 'CAT', b: 'CUT' }, { a: 'KITTEN', b: 'SITTING' }, { a: 'SUN', b: 'SATURDAY' }]); },
    run({ a, b }) {
      const m = a.length, n = b.length, st = [], dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
      for (let j = 0; j <= n; j++) dp[0][j] = j; for (let i = 0; i <= m; i++) dp[i][0] = i;
      const rows = ['∅', ...a], cols = ['∅', ...b], info = T(`turn "${a}" into "${b}"`, `biến "${a}" thành "${b}"`);
      const P = (line, msg, cls = {}) => st.push({ line, msg, s: G(rows, cols, dp, cls, info) });
      P(0, T('First row/column: turning a word into an empty word costs one deletion per letter; building from empty costs one insertion per letter.', 'Hàng/cột đầu: biến một từ thành từ rỗng tốn mỗi chữ một lần xóa; dựng từ từ rỗng tốn mỗi chữ một lần chèn.'));
      for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
        const cell = `${i},${j}`;
        P(2, T(`Cell (${i},${j}): compare '${a[i - 1]}' (from word) with '${b[j - 1]}' (to word).`, `Ô (${i},${j}): so sánh '${a[i - 1]}' (từ gốc) với '${b[j - 1]}' (từ đích).`), { [cell]: 'active' });
        if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1]; P(3, T(`Same letter → no edit needed. Copy the diagonal: ${dp[i][j]}.`, `Giống nhau → không cần sửa. Chép ô chéo: ${dp[i][j]}.`), { [cell]: 'active', [`${i - 1},${j - 1}`]: 'compare' }); }
        else {
          const rep = dp[i - 1][j - 1], del = dp[i - 1][j], ins = dp[i][j - 1];
          P(5, T(`Different letters → try the 3 edits: replace (diagonal) = ${rep}, delete (up) = ${del}, insert (left) = ${ins}.`, `Khác nhau → thử 3 phép sửa: thay thế (ô chéo) = ${rep}, xóa (ô trên) = ${del}, chèn (ô trái) = ${ins}.`), { [cell]: 'active', [`${i - 1},${j - 1}`]: 'compare', [`${i - 1},${j}`]: 'compare', [`${i},${j - 1}`]: 'compare' });
          dp[i][j] = 1 + Math.min(rep, del, ins);
          P(5, T(`Take the cheapest and pay 1 edit: 1 + min(${rep}, ${del}, ${ins}) = ${dp[i][j]}.`, `Lấy cái rẻ nhất và trả 1 phép sửa: 1 + min(${rep}, ${del}, ${ins}) = ${dp[i][j]}.`), { [cell]: 'active' });
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
      P(8, T(`Minimum edits = ${dp[m][n]}. The green path shows the sequence of edits.`, `Số lần sửa tối thiểu = ${dp[m][n]}. Đường xanh lá cho thấy chuỗi các phép sửa.`), path);
      return st;
    },
  });

  /* ---------- 14. Jump Game II ---------- */
  SOL.push({
    slug: 'jump-game-ii', title: 'Jump Game II', diff: 'Medium', algo: 'jump-game',
    statement: 'Each number is the maximum jump length from that cell. You can always reach the end. What is the minimum number of jumps?',
    approach: ['Think in "layers", like BFS: everything reachable with 1 jump, then with 2 jumps, and so on.', 'curEnd is the last cell reachable with the current number of jumps; farthest is the furthest cell reachable with one more.', 'Scan left to right updating farthest. When you reach curEnd, you must jump again: jumps++ and curEnd = farthest.', 'One pass → O(n).'],
    vi: { statement: 'Mỗi số là độ dài nhảy tối đa từ ô đó. Bạn luôn đến được đích. Số bước nhảy tối thiểu là bao nhiêu?', approach: ['Hãy nghĩ theo "tầng" như BFS: mọi thứ đến được với 1 bước nhảy, rồi với 2 bước nhảy, và cứ thế.', 'curEnd là ô cuối cùng đến được với số bước nhảy hiện tại; farthest là ô xa nhất đến được nếu nhảy thêm một bước.', 'Duyệt từ trái sang phải cập nhật farthest. Khi tới curEnd, bạn phải nhảy tiếp: jumps++ và curEnd = farthest.', 'Một lượt duyệt → O(n).'] },
    time: 'O(n)', space: 'O(1)',
    code: ['jumps = 0; curEnd = 0; farthest = 0', 'for i from 0 to n-2:', '  farthest = max(farthest, i + a[i])', '  if i == curEnd:            // used up the range of this jump', '    jumps++; curEnd = farthest', 'return jumps'],
    fields: [listF('Jump lengths', 3, 12, 1, 9)],
    legend: [['active', 'Current cell i'], ['sorted', 'Reachable with current jumps'], ['compare', 'Farthest reach']],
    random() { return { arr: Array.from({ length: 9 }, () => rnd(1, 4)) }; },
    run({ arr }) {
      const a = arr, n = a.length, st = []; let jumps = 0, curEnd = 0, far = 0;
      const P = (line, msg, i) => {
        const c = {}; for (let x = 0; x <= Math.min(curEnd, n - 1); x++) c[x] = 'sorted'; c[Math.min(far, n - 1)] = 'compare'; if (i >= 0) c[i] = 'active';
        st.push({ line, msg, s: A(a, { mode: 'cells', cls: c, ptrs: { ...(i >= 0 ? { i } : {}), curEnd: Math.min(curEnd, n - 1), far: Math.min(far, n - 1) }, info: T(`jumps = ${jumps} · range of current jump ends at ${curEnd} · farthest = ${far}`, `bước nhảy = ${jumps} · phạm vi bước nhảy hiện tại kết thúc tại ${curEnd} · xa nhất = ${far}`) }) });
      };
      P(0, T('Start at index 0 with zero jumps. The range reachable so far is just cell 0.', 'Bắt đầu tại chỉ số 0 với 0 bước nhảy. Phạm vi đến được lúc này chỉ là ô 0.'), 0);
      for (let i = 0; i < n - 1; i++) {
        far = Math.max(far, i + a[i]);
        P(2, T(`From ${i} we can reach ${i + a[i]}, so farthest = ${far}.`, `Từ ${i} có thể đến ${i + a[i]}, nên farthest = ${far}.`), i);
        if (i === curEnd) { jumps++; curEnd = far; P(4, T(`Reached the end of the current range at ${i} → we must jump. jumps = ${jumps}; the new range extends to ${Math.min(curEnd, n - 1)}.`, `Đến cuối phạm vi hiện tại tại ${i} → phải nhảy. jumps = ${jumps}; phạm vi mới kéo dài tới ${Math.min(curEnd, n - 1)}.`), i); }
        else P(3, T(`i = ${i} is still inside the current range (ends at ${curEnd}) → no new jump yet.`, `i = ${i} vẫn trong phạm vi hiện tại (kết thúc tại ${curEnd}) → chưa cần nhảy thêm.`), i);
        if (curEnd >= n - 1) break;
      }
      P(5, T(`The end is reachable → the minimum number of jumps is ${jumps}.`, `Đã đến được đích → số bước nhảy tối thiểu là ${jumps}.`), -1);
      return st;
    },
  });

  /* ---------- 15. Subsets ---------- */
  SOL.push({
    slug: 'subsets', title: 'Subsets', diff: 'Medium', algo: 'n-queens',
    statement: 'Given a list of distinct numbers, return all possible subsets (the power set), including the empty one.',
    approach: ['Build subsets with backtracking. The current choices live in a list called path.', 'Every path you ever reach is a valid subset, so record it immediately.', 'Then, for each remaining number: choose it (push), explore deeper, and un-choose it (pop) to try the next number.', 'n numbers give 2ⁿ subsets, which is why the time is O(n·2ⁿ).'],
    vi: { statement: 'Cho một danh sách các số khác nhau, trả về mọi tập con có thể (tập lũy thừa), kể cả tập rỗng.', approach: ['Xây tập con bằng quay lui. Các lựa chọn hiện tại nằm trong một danh sách gọi là path.', 'Mọi path bạn từng đi tới đều là một tập con hợp lệ, nên ghi lại ngay.', 'Sau đó với mỗi số còn lại: chọn nó (push), đi sâu hơn, rồi bỏ chọn (pop) để thử số tiếp theo.', 'n số cho 2ⁿ tập con, đó là lý do thời gian là O(n·2ⁿ).'] },
    time: 'O(n·2ⁿ)', space: 'O(n)',
    code: ['result = []', 'dfs(start, path):', '  result.add(copy of path)         // every path is a valid subset', '  for i from start to n-1:', '    path.push(a[i])                // choose', '    dfs(i + 1, path)               // explore', '    path.pop()                     // un-choose (backtrack)'],
    fields: [listF('Numbers', 1, 4, 1, 9)],
    legend: [['sorted', 'Chosen (in path)'], ['active', 'Number just considered']],
    random() { return { arr: uniq(3, 1, 9) }; },
    run({ arr }) {
      const a = arr, n = a.length, st = [], path = [], res = [];
      const fmt = (p) => '[' + p.map(i => a[i]).join(',') + ']';
      const P = (line, msg, act = -1) => { const c = {}; path.forEach(i => c[i] = 'sorted'); if (act >= 0) c[act] = 'active'; st.push({ line, msg, s: S(a, { mode: 'cells', cls: c, info: `path = ${fmt(path)}` }, { title: T(`Subsets found (${res.length} of ${2 ** n})`, `Tập con đã tìm (${res.length}/${2 ** n})`), items: res }) }); };
      function dfs(start) {
        res.push(fmt(path)); P(2, T(`Record the current path ${fmt(path)} as a subset${path.length ? '' : ' (the empty subset)'}.`, `Ghi lại path hiện tại ${fmt(path)} làm một tập con${path.length ? '' : ' (tập rỗng)'}.`));
        for (let i = start; i < n; i++) {
          path.push(i); P(4, T(`Choose ${a[i]} → path = ${fmt(path)}.`, `Chọn ${a[i]} → path = ${fmt(path)}.`), i);
          dfs(i + 1);
          path.pop(); P(6, T(`Un-choose ${a[i]} (backtrack) → path = ${fmt(path)}.`, `Bỏ chọn ${a[i]} (quay lui) → path = ${fmt(path)}.`), i);
        }
      }
      P(0, T(`Start with an empty path. We expect 2^${n} = ${2 ** n} subsets in total.`, `Bắt đầu với path rỗng. Dự kiến tổng cộng 2^${n} = ${2 ** n} tập con.`));
      dfs(0);
      P(0, T(`Done — all ${res.length} subsets generated.`, `Xong — đã sinh ${res.length} tập con.`));
      return st;
    },
  });

  window.SOLUTIONS = SOL;
})();
