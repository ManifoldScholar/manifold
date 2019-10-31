module Types
  class CrassTree < Types::FlexibleStruct
    attribute :children, Types::Array.of(Types::CrassNode)

    def each_child(deep: false)
      return enum_for(__method__, deep: deep) unless block_given?

      if deep
        children.each do |child|
          child.deep_enumerator.each do |dchild|
            yield dchild
          end
        end
      else
        children.each do |child|
          yield child
        end
      end
    end

    # @!attribute [r] remote_resource_nodes
    # @return [<Types::CrassNode>]
    memoize def remote_resource_nodes
      each_child(deep: true).select(&:has_remote_value?)
    end
  end
end
