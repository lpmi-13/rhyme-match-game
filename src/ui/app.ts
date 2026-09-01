import { RHYME_SOUNDS, type RhymeSound } from '../data/words';
import {
  type CardSelectionResult,
  chooseNextRhyme,
  createRhymeSelections,
  RhymeRound,
  type RhymeSelection,
  rhymeDescription,
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
    document.body.className = 'is-menu';
    document.title = 'Rhyme Match — English rhyme practice';

    this.root.innerHTML = `
      <a class="skip-link" href="#rhyme-form">Skip to rhyme choices</a>
      <div class="start-view">
        <main class="start-screen" id="main-content">
          <section class="start-panel" aria-labelledby="page-title">
            <header class="start-title">
            <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
              <div>
                <p>English rhyme game</p>
                <h1 id="page-title">Rhyme Match</h1>
              </div>
            </header>

            <p class="start-instruction">Choose a reference word, then find the words with the same final sound.</p>

            <form id="rhyme-form">
              <label class="rhyme-select-label" for="rhyme-select">
                <span>Choose a rhyme</span>
                <select class="rhyme-select" id="rhyme-select" name="rhyme">
                  ${this.selections.map((selection) => this.rhymeOption(selection)).join('')}
                </select>
              </label>

              <div class="start-action">
                <span>6 matches · 3 misses</span>
                <button class="primary-action" type="submit">
                  Start matching <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>

            <p class="start-source">Rhyme labels use broad IPA. Pronunciation can vary by accent.</p>
          </section>
        </main>
      </div>
    `;
    resetScroll();

    const form = element<HTMLFormElement>('#rhyme-form');
    const select = element<HTMLSelectElement>('#rhyme-select');
    select.addEventListener('change', () => {
      if (isRhymeSound(select.value)) {
        this.selectedRhyme = select.value;
      }
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.startRound(this.selectionFor(this.selectedRhyme));
    });
  }

  private rhymeOption(selection: RhymeSelection): string {
    const selected = selection.rhyme === this.selectedRhyme ? ' selected' : '';
    return `<option value="${escapeHtml(selection.rhyme)}"${selected}>${escapeHtml(selection.word)} — /${escapeHtml(selection.rhyme)}/</option>`;
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
              ${won ? 'Next rhyme <span aria-hidden="true">→</span>' : 'Try this rhyme <span aria-hidden="true">↻</span>'}
            </button>
            <button class="text-action" type="button" id="choose-rhyme">Choose another rhyme</button>
          </div>
        </div>
      </main>
    `;
    resetScroll();

    element<HTMLButtonElement>('#play-again').addEventListener('click', () => {
      this.selections = createRhymeSelections();
      if (won) this.selectedRhyme = chooseNextRhyme(round.selection.rhyme);
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
