%w[app/services spec/support].each { |path| Spring.watch(path) }
