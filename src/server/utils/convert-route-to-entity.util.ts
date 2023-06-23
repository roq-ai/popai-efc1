const mapping: Record<string, string> = {
  companies: 'company',
  meetings: 'meeting',
  okrs: 'okr',
  'performance-reviews': 'performance_review',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
