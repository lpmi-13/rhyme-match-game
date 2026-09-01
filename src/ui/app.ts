import { RHYME_SOUNDS, type RhymeSound } from '../data/words';
import {
  RhymeRound,
  createRhymeSelections,
  rhymeDescription,
  type CardSelectionResult,
  type RhymeSelection,
} from '../domain/game';

const RESULT_DELAY_MS = 650;

export class RhymeMatchApp {
  private readonly root: HTMLElement;
  private selections = createRhymeSelections();
  private selectedRhyme: RhymeSound = 'ɪt';
  private round: RhymeRound | null = null;
  private resultTimer: number | null = null;

  constructor() {
    const root = document.querySelector<HTMLElement>('#app');
    if (!root) throw new Error('Missing required application root: #app');
    this.root = root;
  }

  mount(): void {
    this.renderLanding();
  }

  private renderLanding(): void {
    this.clearResultTimer();
    this.round = null;
    document.body.className = '';
    document.title = 'Rhyme Match — English rhyme practice';

    this.root.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to rhyme choices</a>
      <div class="site-shell">
        <header class="site-header">
          <a class="brand" href="#main-content" aria-label="Rhyme Match home">
            <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
            <span>Rhyme Match</span>
          </a>
          <span class="arcade-score" aria-hidden="true"><b>1UP</b> HI-SCORE&nbsp;00600</span>
          <a class="header-link" href="#how-to-play">How to play <span aria-hidden="true">↓</span></a>
        </header>

        <main class="landing-main" id="main-content">
          <section class="hero-copy" aria-labelledby="page-title">
            <p class="arcade-callout" aria-hidden="true">Round 01 // choose your ending</p>
            <p class="eyebrow"><span>Arcade pronunciation practice</span> 30 rhyme families</p>
            <h1 id="page-title">Hear the ending.<em>Match the rhyme.</em></h1>
            <p class="hero-intro">
              Build an instinct for English rhyme by finding six words with the same final sound.
            </p>

            <form id="rhyme-form">
              <label class="rhyme-select-label" for="rhyme-select">
                <span>Choose a rhyme</span>
                <select class="rhyme-select" id="rhyme-select" name="rhyme">
                  ${this.selections.map((selection) => this.rhymeOption(selection)).join('')}
                </select>
              </label>

              <div class="start-row">
                <button class="primary-action" type="submit">
                  Start matching <span aria-hidden="true">▶</span>
                </button>
                <span id="round-summary">12 cards · find 6 rhymes · 3 misses allowed</span>
              </div>
            </form>
          </section>

          <aside class="rhythm-board" aria-label="Selected rhyme preview">
            <div class="board-topline">
              <span><i aria-hidden="true"></i> Rhyme monitor</span>
              <span>Final sound</span>
            </div>
            <div class="board-screen">
              <p>Reference word</p>
              <strong id="preview-word"></strong>
              <span class="rhyme-sound" id="preview-sound"></span>
              <span id="preview-name">Match the sound, not the spelling.</span>
            </div>
            <div class="beat-track" id="preview-beats" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i class="is-strong"></i>
            </div>
            <p class="board-note">Sound labels use broad IPA. Pronunciation can vary by accent.</p>
          </aside>
        </main>

        <section class="how-to" id="how-to-play" aria-labelledby="how-title">
          <div>
            <p class="section-number">01</p>
            <h2 id="how-title">One ending.<br />Twelve words.</h2>
          </div>
          <ol>
            <li><span>Choose</span><p>Pick a reference word from one of thirty rhyme families.</p></li>
            <li><span>Compare</span><p>Say each word aloud and listen to its final stressed sound.</p></li>
            <li><span>Match</span><p>Find all six rhymes before making three misses.</p></li>
          </ol>
        </section>

        <footer class="site-footer">
          <p>Made for focused English practice.</p>
          <p>Thirty common rhyme families, shown with broad IPA endings.</p>
        </footer>
      </div>
    `;
    resetScroll();

    const form = element<HTMLFormElement>('#rhyme-form');
    const select = element<HTMLSelectElement>('#rhyme-select');
    select.addEventListener('change', () => {
      if (isRhymeSound(select.value)) {
        this.selectedRhyme = select.value;
        this.updatePreview();
      }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.startRound(this.selectionFor(this.selectedRhyme));
    });
    this.updatePreview();
  }

  private rhymeOption(selection: RhymeSelection): string {
    const selected = selection.rhyme === this.selectedRhyme ? ' selected' : '';
    return `<option value="${escapeHtml(selection.rhyme)}"${selected}>${escapeHtml(selection.word)} — /${escapeHtml(selection.rhyme)}/</option>`;
  }

  private updatePreview(): void {
    const selection = this.selectionFor(this.selectedRhyme);
    element('#preview-word').textContent = selection.word;
    element('#preview-sound').textContent = `/${selection.rhyme}/`;
  }

  private startRound(selection: RhymeSelection): void {
    this.clearResultTimer();
    this.round = new RhymeRound(selection);
    this.renderGame();
  }

  private renderGame(): void {
    const round = this.requireRound();
    document.body.className = 'is-playing';
    document.title = `${round.selection.word} · Rhyme Match`;

    this.root.innerHTML = `
      <a class="skip-link" href="#word-grid">Skip to word cards</a>
      <div class="game-screen" tabindex="-1">
        <header class="game-header">
          <a class="brand brand-light" href="#" id="game-home" aria-label="Leave this round">
            <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
            <span>Rhyme Match</span>
          </a>
          <span class="arcade-score game-score" aria-hidden="true"><b>1UP</b> READY!</span>

          <div class="target-lockup">
            <span>Rhyme with</span>
            <h1 id="game-title">${escapeHtml(round.selection.word)}</h1>
            ${rhymeTag(round.selection.rhyme)}
          </div>

          <div class="game-stats" aria-label="Round progress">
            <p><span>Matched</span><strong id="match-count">0 / 6</strong></p>
            <p><span>Misses</span><strong id="miss-count">0 / 3</strong></p>
            <button type="button" id="change-rhyme">Change rhyme</button>
          </div>
        </header>

        <main class="game-main">
          <div class="game-brief">
            <div>
              <p>Ending /${escapeHtml(round.selection.rhyme)}/</p>
              <h2>Which words rhyme with ${escapeHtml(round.selection.word)}?</h2>
            </div>
            <p class="feedback" id="feedback" role="status" aria-live="polite">
              Say a word aloud, then tap it to check.
            </p>
          </div>

          <div class="word-grid" id="word-grid">
            ${round.cards
              .map(
                (cardItem, index) => `
              <button
                class="word-card"
                type="button"
                data-card-id="${escapeHtml(cardItem.id)}"
                data-match="${String(cardItem.rhyme === round.selection.rhyme)}"
                aria-label="Check ${escapeHtml(cardItem.word)}"
              >
                <span class="card-number">${String(index + 1).padStart(2, '0')}</span>
                <strong>${escapeHtml(cardItem.word)}</strong>
                <span class="card-hint">Tap to check</span>
              </button>
            `,
              )
              .join('')}
          </div>
        </main>

        <footer class="game-footer">
          <p><span aria-hidden="true">●</span> Find all six rhymes</p>
          <p>${rhymeDescription(round.selection.rhyme)}</p>
        </footer>
      </div>
    `;
    resetScroll();

    element<HTMLAnchorElement>('#game-home').addEventListener('click', (event) => {
      event.preventDefault();
      this.returnToLanding();
    });
    element<HTMLButtonElement>('#change-rhyme').addEventListener('click', () =>
      this.returnToLanding(),
    );
    element('#word-grid').addEventListener('click', (event) => this.handleCardClick(event));
    element<HTMLElement>('.game-screen').focus({ preventScroll: true });
  }

  private handleCardClick(event: Event): void {
    const button = (event.target as Element).closest<HTMLButtonElement>('.word-card');
    if (!button || button.disabled) return;
    const cardId = button.dataset.cardId;
    if (!cardId) return;

    const result = this.requireRound().selectCard(cardId);
    if (result.kind === 'ignored') return;
    this.revealCard(button, result);
    this.updateRoundStatus(result);

    const round = this.requireRound();
    if (round.status !== 'active') {
      for (const cardButton of document.querySelectorAll<HTMLButtonElement>('.word-card')) {
        cardButton.disabled = true;
      }
      this.resultTimer = window.setTimeout(
        () => this.renderResult(),
        reducedMotion() ? 0 : RESULT_DELAY_MS,
      );
    }
  }

  private revealCard(
    button: HTMLButtonElement,
    result: Exclude<CardSelectionResult, { kind: 'ignored' }>,
  ): void {
    const isMatch = result.kind === 'match';
    button.disabled = true;
    button.dataset.state = isMatch ? 'match' : 'miss';
    button.setAttribute(
      'aria-label',
      `${result.card.word}: ${isMatch ? 'rhymes with the reference word' : 'different ending sound'}`,
    );
    const hint = button.querySelector<HTMLElement>('.card-hint');
    if (hint) {
      hint.innerHTML = `${rhymeTag(result.card.rhyme)}<span>${isMatch ? 'Same rhyme' : 'Different ending'}</span>`;
    }
  }

  private updateRoundStatus(result: Exclude<CardSelectionResult, { kind: 'ignored' }>): void {
    const round = this.requireRound();
    element('#match-count').textContent = `${round.matches} / 6`;
    element('#miss-count').textContent = `${round.misses} / 3`;
    const feedback = element('#feedback');

    if (result.kind === 'match') {
      feedback.textContent = `Rhyme — ${result.card.word} shares the same ending sound.`;
      feedback.dataset.tone = 'success';
    } else {
      feedback.textContent = `Different ending — listen again to ${result.card.word}.`;
      feedback.dataset.tone = 'error';
    }
  }

  private renderResult(): void {
    this.resultTimer = null;
    const round = this.requireRound();
    const won = round.status === 'won';
    document.body.className = 'is-result';
    document.title = `${won ? 'Round complete' : 'Round over'} · Rhyme Match`;

    this.root.innerHTML = `
      <main class="result-screen" id="main-content">
        <div class="result-card" data-result="${round.status}">
          <div class="result-signal" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i>
          </div>
          <p class="eyebrow"><span>${won ? 'Rhyme complete' : 'Round complete'}</span> /${escapeHtml(round.selection.rhyme)}/</p>
          <h1>${won ? 'Rhyme locked in.' : 'Reset. Listen. Try again.'}</h1>
          <p class="result-message">
            ${
              won
                ? `You found all six words that rhyme with “${escapeHtml(round.selection.word)}”.`
                : `Three words had a different ending. You still found ${round.matches} of the six rhymes.`
            }
          </p>

          <dl class="result-stats">
            <div><dt>Matches</dt><dd>${round.matches} / 6</dd></div>
            <div><dt>Misses</dt><dd>${round.misses} / 3</dd></div>
            <div><dt>Rhyme</dt><dd>/${escapeHtml(round.selection.rhyme)}/</dd></div>
          </dl>

          <div class="result-actions">
            <button class="primary-action" type="button" id="play-again">
              Play this rhyme <span aria-hidden="true">↻</span>
            </button>
            <button class="text-action" type="button" id="choose-rhyme">Choose another rhyme</button>
          </div>
        </div>
      </main>
    `;
    resetScroll();

    element<HTMLButtonElement>('#play-again').addEventListener('click', () => {
      this.selections = createRhymeSelections();
      this.startRound(this.selectionFor(this.selectedRhyme));
    });
    element<HTMLButtonElement>('#choose-rhyme').addEventListener('click', () => {
      this.selections = createRhymeSelections();
      this.renderLanding();
    });
    element<HTMLButtonElement>('#play-again').focus({ preventScroll: true });
  }

  private returnToLanding(): void {
    this.selections = createRhymeSelections();
    this.renderLanding();
  }

  private selectionFor(rhyme: RhymeSound): RhymeSelection {
    const selection = this.selections.find((item) => item.rhyme === rhyme);
    if (!selection) throw new Error(`Missing selection for rhyme /${rhyme}/.`);
    return selection;
  }

  private requireRound(): RhymeRound {
    if (!this.round) throw new Error('No rhyme-matching round is active.');
    return this.round;
  }

  private clearResultTimer(): void {
    if (this.resultTimer !== null) window.clearTimeout(this.resultTimer);
    this.resultTimer = null;
  }
}

function rhymeTag(rhyme: RhymeSound): string {
  return `<span class="rhyme-sound" aria-label="Ending sound /${escapeHtml(rhyme)}/">/${escapeHtml(rhyme)}/</span>`;
}

function element<T extends HTMLElement = HTMLElement>(selector: string): T {
  const match = document.querySelector<T>(selector);
  if (!match) throw new Error(`Missing required element: ${selector}`);
  return match;
}

function isRhymeSound(value: string): value is RhymeSound {
  return RHYME_SOUNDS.some((rhyme) => rhyme === value);
}

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resetScroll(): void {
  window.scrollTo({ top: 0, behavior: 'auto' });
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return value.replace(/[&<>"']/g, (character) => entities[character] ?? character);
}
