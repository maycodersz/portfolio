/**
 * Card sizing strategy:
 * - Width: fills its container (w-full)
 * - Height: derived from aspect-ratio 4/5 (= width × 1.25)
 * - max-height caps the card on tall viewports so it doesn't become absurdly large
 *
 * On mobile → width is the constraint (card fills narrow screen)
 * On desktop → max-height is the constraint (card stops growing at 70dvh)
 */
export const CARD_DECK_STAGE_STYLE = {
  maxHeight: 'min(70dvh, calc(100dvh - 8rem))',
} as const
