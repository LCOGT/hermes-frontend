// Runtime configuration. In deployed environments this file is replaced by a
// ConfigMap generated from the Helm values (see helm-chart/templates/configmap.yaml).
// An empty backendUrl makes the app fall back to the build-time VITE_* value,
// which is what we want for local `npm run dev`.
window.APP_CONFIG = {
  backendUrl: '',
};
