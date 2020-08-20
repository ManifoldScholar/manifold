module CachedExternalSources
  # @api private
  class Container
    include IntrospectiveContainer

    register_simple_callables :fetch, :fetch_content_type, :possibly_download, :pipeline
  end
end
