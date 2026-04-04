# MemoryGrid — Component Breakdown

## What it does

`MemoryGrid` renders a memory card game grid. Each pokemon appears twice in randomly placed cells. Cards start face-down. Clicking a card flips it. If two flipped cards share the same pokemon name they stay revealed; if not, both flip back after one second.

---

## TypeScript Interfaces

```ts
interface PokemonCell {
  id: number;
  name: string;
}
```

Describes the shape of each pokemon object the component expects. `id` is the PokeAPI numeric ID used to build the image URL; `name` is used for match comparison.

```ts
interface Props {
  pokemons: PokemonCell[];
}
```

Declares the component's public API. `pokemons` is an array of `PokemonCell` objects. TypeScript will error at the call site if the wrong shape is passed.

---

## Generic function — `shuffle<T>`

```ts
function shuffle<T>(arr: T[]): T[] {
```

`<T>` is a **type parameter** (generic). It means the function works on an array of *any* type — `string[]`, `number[]`, `PokemonCell[]` — without losing type information. The caller does not need to specify `T`; TypeScript infers it from the argument.

The algorithm is **Fisher-Yates**: iterates from the last index down to 1 and swaps each element with a random earlier position. This guarantees a uniformly random permutation.

---

## `ARTWORK_URL`

```ts
const ARTWORK_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
```

A module-level arrow function typed as `(id: number) => string`. Defined outside the component so it is never re-created on renders. Builds the official artwork URL from a numeric pokemon ID.

---

## State

```ts
const [matched, setMatched] = useState<boolean[]>(() => Array(cells.length).fill(false));
```

`matched` is an array of booleans, one per cell. `true` means the card has been permanently revealed (part of a matched pair). The initializer is a **lazy init function** — `() => Array(...)` — so the array is only created once, not on every render.

```ts
const [selected, setSelected] = useState<number[]>([]);
```

Holds the indices of the currently active (flipped but not yet matched) cards. Length is always 0, 1, or 2.

```ts
const [locked, setLocked] = useState(false);
```

Prevents any clicks while a failed pair is still visible (during the 1-second timeout before they flip back).

---

## `useMemo`

```ts
const cells = useMemo(
  () => shuffle([...pokemons, ...pokemons]),
  [pokemons]
);
```

Duplicates the pokemons array (creating one card per pokemon × 2), then shuffles it. `useMemo` caches the result so the shuffle only runs again if the `pokemons` prop changes — not on every re-render caused by state updates.

---

## `isVisible`

```ts
function isVisible(i: number): boolean {
  return matched[i] || selected.includes(i);
}
```

Returns `true` if cell `i` should show its face-up side. A cell is visible if it is part of a confirmed match (`matched[i]`) or currently selected (`selected.includes(i)`). Used both to drive the CSS flip class and to guard against re-clicking.

---

## `handleClick`

```ts
function handleClick(i: number) {
  if (locked || isVisible(i)) return;
  ...
}
```

**Guard clause**: exits immediately if the board is locked or the card is already showing.

**First card selected:**
```ts
if (selected.length === 0) {
  setSelected([i]);
  return;
}
```
Saves the index and waits for a second click.

**Second card selected — match:**
```ts
if (cells[first].name === cells[i].name) {
  setMatched((prev) => { ... });
  setSelected([]);
}
```
Updates `matched` for both indices and clears `selected`. The functional update form `(prev) => ...` is used to avoid stale state — it always receives the latest value of `matched`.

**Second card selected — no match:**
```ts
setLocked(true);
setTimeout(() => {
  setSelected([]);
  setLocked(false);
}, 1000);
```
Locks the board so no new clicks register, then after 1000 ms clears `selected` (flipping both cards back) and unlocks.

---

## Grid layout

```ts
const cols = Math.ceil(Math.sqrt(cells.length));
```

Calculates column count by taking the square root of the total cells and rounding up. This keeps the grid roughly square regardless of how many pokemons are passed. The value is applied inline:

```tsx
style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
```

---

## CSS flip mechanic

Each cell is two layers:

| Layer | Class | Visible when |
|---|---|---|
| `.cardFront` | Face-down (pokeball) | default |
| `.cardBack` | Face-up (image + name) | `isVisible(i) === true` |

Both faces use `backface-visibility: hidden`. The `.card` wrapper rotates 180° on the Y axis when `.cardFlipped` is applied, hiding the front and revealing the back.
