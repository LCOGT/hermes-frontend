import { useStateStore } from '@/stores/state';

export function useLogout() {
  const stateStore = useStateStore();

  function logout(reload = true) {
    stateStore.mid_login = false;
    stateStore.clearProfile();
    if (reload) {
      location.reload();
    }
  }

  return { logout };
}
