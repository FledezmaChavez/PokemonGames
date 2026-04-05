import type { Pokemon } from '../types/pokemon';

const BASE_URL = 'http://localhost:5165/api/pokemon';

export async function getPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/${name}`);

  if (!response.ok) {
    throw new Error(`Pokemon "${name}" not found.`);
  }

  return response.json();
}


export async function getPokemonsByGeneration(identifier: string | number) : Promise<string[]> {
  const response = await fetch(`http://localhost:5165/api/pokemon/generation/${identifier}`);

  if (!response.ok) {
    throw new Error(`Generation "${identifier}" not found.`);
  }

  return response.json();

 
} 