module Types
  class CrassNode < Types::FlexibleStruct
    NODES = Types::Array.of(Types::CrassNode)
    DEEP_EACHES = %i[each_child each_prelude each_token each_value].freeze

    attribute :node, Types::Strict::Symbol
    attribute? :name, Types::Strict::String
    attribute? :raw, Types::Strict::String
    attribute? :pos, Types::Strict::Integer
    attribute? :repr, Types::String
    attribute? :type, Types::Symbol
    attribute? :value, Types::HTTP_URI | Types::String | Types::Integer | NODES | Types::Any
    attribute? :children, NODES
    attribute? :tokens, NODES
    attribute? :prelude, NODES
    attribute? :selector, Types::CrassNode
    attribute? :important, Types::Bool

    def deep_enumerator
      Enumerator.new do |y|
        catch(:prune) do
          y << self

          DEEP_EACHES.each do |m|
            public_send(m, deep: true) do |v|
              y << v
            end
          end
        end
      end
    end

    def each_child(deep: false)
      return enum_for(__method__) unless block_given?

      Array(children).each do |child|
        catch :prune do
          yield child

          if deep
            child.each_child(deep: true) do |cc|
              yield cc
            end
          end
        end
      end
    end

    def each_prelude(deep: false)
      return enum_for(__method__) unless block_given?

      Array(prelude).each do |prelude|
        catch :prune do
          yield prelude

          if deep
            prelude.each_prelude(deep: true) do |pre|
              yield pre
            end
          end
        end
      end
    end

    def each_token(deep: false)
      return enum_for(__method__) unless block_given?

      Array(tokens).each do |token|
        catch :prune do
          yield token

          if deep
            token.each_token(deep: true) do |tt|
              yield tt
            end
          end
        end
      end
    end

    def each_value(deep: false)
      return enum_for(__method__) unless block_given?

      return unless value.is_a?(Array)

      value.each do |v|
        catch :prune do
          yield v

          if deep
            v.each_value(deep: true) do |vv|
              yield vv
            end
          end
        end
      end
    end

    def has_remote_value?
      url_node? && Types::HTTP_SCHEME[value]
    end

    def url_node?
      node == :url
    end

    class << self
      def prune!
        throw :prune
      end
    end
  end
end
