module Concerns
  module HasSortTitle
    extend ActiveSupport::Concern

    included do
      # This will expose a callback `after_update_sort_title`,
      # in case we ever need to do something further
      # with its computation
      define_model_callbacks :update_sort_title, only: %i[after]

      after_commit :update_sort_title!, on: %i[create update]

      delegate :sort_title_updater, to: :class
    end

    def sort_title_needs_update?
      computed = compute_sort_title

      computed.presence if computed != sort_title
    end

    # @return [void]
    # rubocop:disable Rails/SkipsModelValidations
    def update_sort_title!
      computed = sort_title_needs_update?

      return unless computed.present?

      run_callbacks :update_sort_title do
        update_column :sort_title, computed
      end
    end
    # rubocop:enable Rails/SkipsModelValidations

    private

    # @return [String]
    # rubocop:disable Metrics/AbcSize
    def compute_sort_title
      return instance_eval(&sort_title_updater) if sort_title_updater.is_a? Proc
      return sort_title_updater.call self if sort_title_updater.respond_to? :call
      return __send__ sort_title_updater if respond_to? sort_title_updater
      raise "cannot update sort title with #{sort_title_updater.inspect}"
    end
    # rubocop:enable Metrics/AbcSize

    class_methods do
      # rubocop:disable Style/PredicateName
      def has_sort_title(updater = nil, &updater_block)
        if updater.blank? && updater_block.nil?
          raise ArgumentError, "Must specify some sort of updater"
        end

        @sort_title_updater = block_given? ? updater_block : updater
      end
      # rubocop:enable Style/PredicateName

      # @!attribute [r] sort_title_updater
      # @return [Symbol, #call]
      attr_reader :sort_title_updater
    end
  end
end
