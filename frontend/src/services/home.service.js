import { apiRequest } from '../lib/api';

export async function getHomeContent() {
  const [categories, listings] = await Promise.all([
    apiRequest('/categories'),
    apiRequest('/listings?limit=6')
  ]);

  return { categories, listings: listings.items || [] };
}
