module Updates
  module Meta
    module HasPosition
      extend ActiveSupport::Concern

      RELATIVE_POSITIONS = %w(up down top bottom).freeze

      included do
        interface :position, methods: %i(to_s), default: nil

        after_save :update_relative_position!
      end

      # @api private
      def model_acts_as_list?
        model.kind_of? ActiveRecord::Acts::List::InstanceMethods
      end

      # @api private
      def relative_position?
        position.in? RELATIVE_POSITIONS
      end

      # @api private
      # @return [void]
      def update_relative_position!
        return unless model_acts_as_list? && relative_position?

        case position
        when "up"
          model.move_higher
        when "down"
          model.move_lower
        when "top"
          model.move_to_top
        when "bottom"
          model.move_to_bottom
        end

        # https://github.com/swanandp/acts_as_list/issues/23
        model.reload
      end

      # @return [<Symbol>]
      def inputs_to_exclude
        super.tap do |a|
          a << :position if relative_position? || !model_acts_as_list?
        end
      end
    end
  end
end
