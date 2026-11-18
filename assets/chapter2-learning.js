(function () {
  'use strict';
  const kidPayoffs = { PR: [0, 1], PK: [-2, -1], AR: [1, 0], AK: [-1, -2] };
  function kidnappingOutcome(state, plan) {
    if (!['P', 'A'].includes(state) || !['RR', 'RK', 'KR', 'KK'].includes(plan)) return null;
    const index = state === 'P' ? 0 : 1;
    const terminal = state + plan[index];
    return { state, plan, index, terminal, payoff: kidPayoffs[terminal].slice(), path: [state, terminal], offPath: (state === 'P' ? 'A' : 'P') + plan[1 - index] };
  }
  function reaction(q1, a = 13, c = 1) {
    if (!(a > c && c > 0 && q1 >= 0)) throw new RangeError('Require a > c > 0 and q1 >= 0.');
    const q2 = Math.max((a - c - q1) / 2, 0);
    const price = Math.max(a - q1 - q2, 0);
    return { q1, q2, price, profit1: q1 * (price - c), profit2: q2 * (price - c) };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { kidnappingOutcome, reaction };
  if (typeof document === 'undefined') return;
  const fmt = n => Number(n.toFixed(4)).toString().replace('-', '−');
  const pair = p => '(' + p.map(fmt).join(', ') + ')';
  function highlight(root, path = [], offPath = [], warning = []) {
    root.querySelectorAll('[data-edge]').forEach(edge => {
      const id = edge.dataset.edge;
      edge.classList.toggle('path-active', path.includes(id));
      edge.classList.toggle('path-continuation', offPath.includes(id));
      edge.classList.toggle('path-warning', warning.includes(id));
    });
    root.querySelectorAll('[data-terminal]').forEach(label => label.classList.toggle('terminal-active', path.includes(label.dataset.terminal)));
  }
  document.querySelectorAll('[data-kidnapping-lab]').forEach(lab => {
    const stateSelect = lab.querySelector('[data-state-action]');
    const planSelect = lab.querySelector('[data-kidnap-plan]');
    const output = lab.querySelector('[data-kidnap-result]');
    const reading = lab.querySelector('[data-plan-reading]');
    function update() {
      const plan = planSelect.value;
      const word = action => action === 'R' ? 'release' : 'kill';
      reading.textContent = plan ? plan + ' = (' + word(plan[0]) + ' after P; ' + word(plan[1]) + ' after A).' : 'Select a complete plan to read both instructions.';
      lab.querySelectorAll('[data-profile]').forEach(cell => { cell.classList.remove('profile-active'); cell.removeAttribute('aria-current'); });
      const result = kidnappingOutcome(stateSelect.value, plan);
      highlight(lab);
      if (!result) { output.textContent = "Select the State's action and a complete plan to trace a path and fill its matrix cell."; return; }
      highlight(lab, result.path, [result.offPath]);
      const cell = lab.querySelector('[data-profile="' + result.state + '-' + plan + '"]');
      cell.textContent = pair(result.payoff);
      cell.classList.add('profile-active');
      cell.setAttribute('aria-current', 'true');
      cell.setAttribute('aria-label', result.state + ', ' + plan + ': ' + pair(result.payoff));
      const same = ['RR','RK','KR','KK'].filter(candidate => candidate[result.index] === plan[result.index]);
      const unusedState = result.state === 'P' ? 'A' : 'P';
      output.textContent = 'Profile (' + result.state + ', ' + plan + '): read the ' + (result.index === 0 ? 'first' : 'second') + ' letter. Path ' + result.state + ' → ' + plan[result.index] + '. Terminal payoff (State, kidnapper) = ' + pair(result.payoff) + '. Both (' + result.state + ', ' + same[0] + ') and (' + result.state + ', ' + same[1] + ') reach this terminal: they differ only in the instruction after ' + unusedState + ', which is off path. They remain different complete strategies.';
    }
    stateSelect.addEventListener('change', update);
    planSelect.addEventListener('change', update);
    lab.querySelector('[data-reset-kidnap]').addEventListener('click', () => {
      stateSelect.value = ''; planSelect.value = '';
      lab.querySelectorAll('[data-profile]').forEach(cell => { cell.textContent = '?'; cell.removeAttribute('aria-label'); });
      update();
    });
    update();
  });
  document.querySelectorAll('[data-strategy-builder]').forEach(lab => {
    const fields = lab.querySelectorAll('select');
    const output = lab.querySelector('[data-strategy-result]');
    const update = () => {
      const p = fields[0].value, a = fields[1].value;
      output.textContent = p && a ? 'Complete plan: ' + p + a + ' = (' + p + ' after P, ' + a + ' after A). Two independent binary instructions give 2 × 2 = 4 possible pure strategies.' : 'Choose an instruction at both nodes. One action alone is not a complete plan.';
    };
    fields.forEach(field => field.addEventListener('change', update)); update();
  });
  const stages = {
    entry: [
      { text: 'Start at the last decision node: the incumbent moves after entry.', path: [], off: [] },
      { text: 'At the incumbent node, compare its own (second) payoff: A gives 2 and F gives 1. Since 2 > 1, choose A. This continuation is optimal even if entry never occurs.', path: [], off: ['EA'] },
      { text: 'Return to the entrant: E followed by A gives 1, whereas S gives 0. Choose E. Complete SPE: (E, A), with payoff (1, 2).', path: ['E','EA'], off: [] }
    ],
    kidnapping: [
      { text: 'Solve both final kidnapper decisions before returning to the State.', path: [], off: [] },
      { text: 'After P, compare the kidnapper’s second payoff: release gives 1; kill gives −1. Choose R because 1 > −1.', path: [], off: ['PR'] },
      { text: 'After A, release gives 0; kill gives −2. Choose R because 0 > −2. Both decisions are now solved: the complete kidnapper plan is RR.', path: [], off: ['PR','AR'] },
      { text: 'The State anticipates RR. P gives 0 and A gives 1, so choose A. Complete SPE: (A, RR); realized path A → R; payoffs (1, 0). Release after P remains the optimal off-path instruction.', path: ['A','AR'], off: ['PR'] }
    ]
  };
  document.querySelectorAll('[data-induction]').forEach(lab => {
    const sequence = stages[lab.dataset.induction]; let index = 0;
    const previous = lab.querySelector('[data-bi-prev]'), next = lab.querySelector('[data-bi-next]');
    const update = () => {
      const stage = sequence[index]; highlight(lab, stage.path, stage.off);
      lab.querySelector('[data-bi-result]').textContent = stage.text;
      lab.querySelector('[data-bi-count]').textContent = index + ' / ' + (sequence.length - 1);
      previous.disabled = index === 0; next.disabled = index === sequence.length - 1;
    };
    previous.addEventListener('click',()=>{if(index>0)index--;update();});
    next.addEventListener('click',()=>{if(index<sequence.length-1)index++;update();});
    lab.querySelector('[data-bi-reset]').addEventListener('click',()=>{index=0;update();});update();
  });
  document.querySelectorAll('[data-entry-comparison]').forEach(lab => {
    const output = lab.querySelector('[data-entry-result]');
    lab.querySelectorAll('[data-entry-view]').forEach(button => button.addEventListener('click',()=>{
      const mode=button.dataset.entryView;
      lab.querySelectorAll('[data-entry-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button && mode!=='reset')));
      if(mode==='nash'){
        highlight(lab,['S'],[],['EF']);
        output.textContent='Under (S, F), the realized payoff is (0, 3). Holding F fixed, entering would give −1 < 0. Holding S fixed, switching F to A leaves the incumbent at 3. Hence neither player gains from a unilateral change: this is Nash. The dashed coral branch is the unused threat.';
      } else if(mode==='deviation'){
        highlight(lab,['E','EA'],[],['EF']);
        output.textContent='Now examine the proper subgame after E, even though it is off path under (S, F). The incumbent gets 2 from A and 1 from F. Switching F → A gains 1. The threat to fight is not credible, so (S, F) fails subgame perfection.';
      } else if(mode==='spe'){
        highlight(lab,['E','EA']);
        output.textContent='Under (E, A), the entrant prefers 1 to 0 and the incumbent prefers 2 to 1 after entry. Choices are optimal in the whole game and in the proper subgame. This is the unique SPE, with payoff (1, 2).';
      } else { highlight(lab);output.textContent='Choose a profile or test its continuation. Nash and subgame perfection ask different optimality questions.'; }
    }));
  });
  document.querySelectorAll('[data-reaction]').forEach(lab => {
    const slider=lab.querySelector('[data-quantity]');
    const update=()=>{
      const result=reaction(Number(slider.value)), x=70+result.q1/18*490, y=270-result.q2/6*230;
      lab.querySelector('[data-reaction-dot]').setAttribute('cx',x);lab.querySelector('[data-reaction-dot]').setAttribute('cy',y);
      lab.querySelector('[data-reaction-guides]').setAttribute('d',`M70 ${y}H${x}V270`);
      lab.querySelector('[data-reaction-result]').textContent='Selected q₁ = '+fmt(result.q1)+'; realized q₂ = f*(q₁) = '+fmt(result.q2)+'. Price = '+fmt(result.price)+'. Profits (firm 1, firm 2) = '+pair([result.profit1,result.profit2])+'. The entire cyan curve is still the follower’s strategy.';
    };
    slider.addEventListener('input',update);
    lab.querySelector('[data-show-spe]').addEventListener('click',event=>{
      const marker=lab.querySelector('[data-spe-marker]'), show=marker.hasAttribute('hidden');
      marker.toggleAttribute('hidden',!show);event.currentTarget.textContent=show?'Hide the SPE outcome':'Show the SPE outcome on the curve';event.currentTarget.setAttribute('aria-pressed',String(show));
    });update();
  });
  let queue=Promise.resolve();
  function typeset(box){if(window.MathJax && MathJax.startup && MathJax.startup.promise)queue=queue.then(()=>MathJax.startup.promise).then(()=>MathJax.typesetPromise([box])).catch(console.error);}
  document.querySelectorAll('details').forEach(details=>{
    const summary=details.querySelector('summary');const label=summary.querySelector('.disclosure-label');const legacyLabel=label?null:summary.firstChild.textContent;
    const refresh=()=>{if(label)label.textContent=(details.classList.contains('correction-question')?'':(details.open?'Hide ':'Show '))+label.dataset.label;else if(legacyLabel)summary.firstChild.textContent=legacyLabel.replace('Show ',details.open?'Hide ':'Show ');if(details.open)typeset(details.querySelector('.solution')||details);};
    details.addEventListener('toggle',refresh);refresh();
  });
  function revealStep(){
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(_){return;}
    if(!id)return;const target=document.getElementById(id);if(!target)return;
    // A collection anchor never expands its children. Only an explicitly linked step opens.
    let current=target;while(current){if(current.tagName==='DETAILS')current.open=true;current=current.parentElement;}
    const scroll=()=>target.scrollIntoView({block:'start',behavior:'instant'});
    if(window.MathJax && MathJax.startup && MathJax.startup.promise)MathJax.startup.promise.then(()=>queue).then(scroll).catch(console.error);else scroll();
  }
  window.addEventListener('hashchange',revealStep);window.addEventListener('load',revealStep);revealStep();
})();
