import { mapOptional, Optional } from '@/lib/util/mapOptional';
import { atom } from 'jotai';

export interface DashboardSettings {
  defaultAwsRegion: string;
}

const DEFAULT_DASHBOARD_SETTINGS: DashboardSettings = { defaultAwsRegion: '' };

export const dashboardSettingsAtom = atom(
  getFromLocalStorage() ?? DEFAULT_DASHBOARD_SETTINGS,
  (get, set, update: DashboardSettings) => {
    set(dashboardSettingsAtom, update);
    saveToLocalStorage(update);
  },
);

function saveToLocalStorage(dashboardSettings: DashboardSettings) {
  localStorage.setItem('dashboard', JSON.stringify(dashboardSettings));
}

function getFromLocalStorage(): Optional<DashboardSettings> {
  return mapOptional(
    localStorage.getItem('dashboard'),
    (dashboardSettingsFromLS) => JSON.parse(dashboardSettingsFromLS) as DashboardSettings,
  );
}
