# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint across all files
npm run preview   # Preview production build locally
```

No test runner is configured.

## Architecture

This is a React 19 + TypeScript + Vite single-page app that lets users search for a Pokémon by name and displays a card with its details.

**Data flow:**
1. `App.tsx` owns all state (`pokemon`, `error`, `loading`) and the `handleSearch` async function.
2. `SearchBar` calls `onSearch(name)` — it holds no state beyond the local input value.
3. `getPokemon(name)` in `src/services/pokemonService.ts` fetches from a **local .NET API** at `http://localhost:5165/api/pokemon/{name}`. The backend must be running separately for the app to work.
4. The response is typed as `Pokemon` (`src/types/pokemon.ts`) and passed directly to `PokemonCard`.

**Styling:**
- CSS Modules (`.module.css`) are used for all component styles — no CSS-in-JS, no Tailwind.
- Global design tokens (CSS custom properties: `--bg`, `--glass`, `--text`, `--red`, `--font`, `--mono`) are declared in `src/index.css` and used across all module files.
- `Chakra Petch` (display) and `Space Mono` (monospace) are loaded from Google Fonts in `index.css`.
- Type-specific badge colors for all 18 Pokémon types are defined in `PokemonCard.module.css` as `.fire`, `.water`, etc. — applied via `styles[type]` dynamic class lookup.

**Sprite source:** Official artwork from the PokeAPI GitHub CDN:
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
