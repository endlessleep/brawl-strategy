# GAMETHEORY — Game Theory (M1)

Study platform for Game Theory (Master 1 Economics), published at
[GitHub Pages](https://endlessleep.github.io/brawl-strategy/chapter1.html).

## Course navigation

1. **01 — Normal Form Games & Dominance** — `chapter1.html`, Sections 1–2.
2. **02 — Nash Equilibrium in Pure Strategies** — `nash-equilibrium.html`, Section 3.
3. **03 — Mixed Strategies & Dominance** — `mixed-strategies.html`, Sections 4–5.
4. **04 — Nash Equilibrium in Mixed Strategies** — `mixed-nash-equilibrium.html`, Sections 6–7.

`index.html` redirects to the first lesson. `mixed-dominance.html` redirects to
Section 5 of the combined third lesson, preserving bookmarked section fragments.
The former standalone dominance example links to the consolidated IESDS correction.
Links to collapsed solutions open the relevant correction automatically.

## Exercise sessions

**Session 1 — Pure Strategies** is at `exercise-session-1.html`, in a separate
Exercises group below the course links in every sidebar. The five exercises cover
Nash equilibrium and dominance, Bertrand competition, free riding, majority
judgment, and war of attrition. Each of the 13 questions has an independent,
keyboard-accessible correction button and a direct link to its solution.

Corrections retain the question order and develop every comparison and proof.
Bertrand profits use the correct price-order cases. The median proof treats a
truthful median equal to the preferred score separately. War-of-attrition costs
stop at the first concession, and the equilibrium thresholds are `v_i / c`,
including equality. The free-riding welfare result specifies `N >= 2`.

## Professor revision integration

The supplied `gametheory_professor_revision.zip` is the content baseline. The
three 2×2 mixed Nash corrections enumerate supports before imposing indifference,
checking unused actions, and distinguishing equilibrium probabilities from payoffs.
Their three existing best-response graphs are retained.

The added T/B versus L/M/R exercise checks all seven nonempty supports of Player 2.
The {L,M} candidate is rejected because R gives a higher payoff; {M,R} requires an
inadmissible mixing probability for Player 2. Only {L,R} survives, giving strategies
(1/3, 2/3) and (1/6, 0, 5/6), with payoffs (11/3, 16/3).

The mixed-dominance example is presented once, with the professor's `b` row label
and the successive deletions M, then m. The first-price auction correction,
nonnegative Cournot best responses, continued Cournot elimination intervals, and
the distinction between pure and mixed equilibrium sets are retained. Cross-references
and summary statements agree with these corrections.

Malformed inequality markup in the supplied HTML has been repaired so mathematical
steps remain visible. Existing colors, typography, cards, matrices, sidebar and
chapter progress bar are preserved. The original `images/` and `assets/` files
are unchanged; responsive containment keeps wide formulas and tables scrollable.

## Validation

- Exact rational support enumeration for all three 2×2 games and the 2×3 game.
- Dominance comparisons, equilibrium payoffs and the six Cournot elimination rounds.
- All 53 collapsible corrections, formulas, images, course/exercise navigation and old links.
- Chromium and WebKit browser checks on desktop and emulated iPad portrait/landscape
  layouts. These are browser/emulation checks, not a physical-iPad test.
- Exercise and section anchors are preserved. The duplicated dominance example was consolidated.
- Session 1: all 13 independent buttons, keyboard controls and correction deep links;
  all five sidebars on desktop and emulated iPad in Chromium and WebKit.
- Independent exact-arithmetic checks of the exercise results, including the
  median proof cases and war-of-attrition boundary conditions.

Course text uses direct explanations, with concise introductions. The opinion
discussion and editorial comments about source documents have been removed.
