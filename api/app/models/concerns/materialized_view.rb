module MaterializedView
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable
  include View

  included do
    config.refreshes_concurrently = true
  end

  class_methods do
    # @return [void]
    def refresh!(concurrently: config.refreshes_concurrently, cascade: false)
      Scenic.database.refresh_materialized_view(table_name, concurrently: concurrently, cascade: cascade)
    end

    # @api private
    # @return [void]
    def refreshes_concurrently!
      config.refreshes_concurrently = true
    end
  end
end
