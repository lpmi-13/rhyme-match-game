import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RhymeMatchApp } from '../src/ui/app';

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<div id="app"></div>';
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Rhyme Match app', () => {
  it('renders a focused start screen with just the essential controls', () => {
    new RhymeMatchApp().mount();

    expect(document.querySelector('.start-panel')).not.toBeNull();
    expect(document.querySelector('h1')?.textContent).toBe('Rhyme Match');
    expect(document.querySelector('select[name="rhyme"]')).not.toBeNull();
    expect(document.querySelector('.rhythm-board')).toBeNull();
    expect(document.querySelector('.how-to')).toBeNull();
  });

  it('starts a different rhyme family after a win', () => {
    new RhymeMatchApp().mount();
    document.querySelector<HTMLFormElement>('#rhyme-form')?.requestSubmit();

    const firstRhyme = document.querySelector('.target-lockup .rhyme-sound')?.textContent;
    const matches = document.querySelectorAll<HTMLButtonElement>('.word-card[data-match="true"]');
    expect(matches).toHaveLength(6);
    for (const match of matches) match.click();
    vi.runAllTimers();

    const nextButton = document.querySelector<HTMLButtonElement>('#play-again');
    expect(nextButton?.textContent).toContain('Next rhyme');
    nextButton?.click();

    const nextRhyme = document.querySelector('.target-lockup .rhyme-sound')?.textContent;
    expect(nextRhyme).toBeTruthy();
    expect(nextRhyme).not.toBe(firstRhyme);
  });
});
