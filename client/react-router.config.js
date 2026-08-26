export default {
  ssr: true,
  appDirectory: "app",
  future: {
    unstable_optimizeDeps: true,
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_passThroughRequests: true,
    v8_viteEnvironmentApi: true
  }
};
