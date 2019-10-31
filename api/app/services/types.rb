module Types
  include Dry.Types

  CALLABLE = Types.Interface(:call)

  ENUM_OF_TYPE = ->(klass) { Types.Constructor(klass) { |v| klass.build(v) } }

  HTTP_METHOD = Types::Coercible::Symbol.enum(:get, :head, :post, :put, :delete)

  MONADIC_RESULT = Instance(Dry::Monads::Result).constructor do |v|
    case v
    when Dry::Monads::Result then v
    when StandardError then Dry::Monads.Failure(v)
    else
      Dry::Monads.Success(v)
    end
  end

  NOKOGIRI_DOCUMENT = Types.Instance(Nokogiri::XML::Document)
  NOKOGIRI_FRAGMENT = Types.Instance(Nokogiri::XML::DocumentFragment)
  NOKOGIRI_NODE = Types.Instance(Nokogiri::XML::Node)

  URI = Types.Constructor(Types.Instance(Addressable::URI)) do |value|
    begin
      case value
      when Addressable::URI then value
      when String
        Addressable::URI.parse value
      else
        Dry::Types::Undefined
      end
    rescue Addressable::URI::InvalidURIError, TypeError
      Dry::Types::Undefined
    end
  end

  RULE_PREDICATE = ->(predicate_name, *curried_args) do
    predicate = Dry::Logic::Predicates[predicate_name]

    rule = Dry::Logic::Rule::Predicate.new(predicate)

    curried_args.present? ? rule.curry(*curried_args) : rule
  end

  RULE_INCLUSION = ->(*list) do
    RULE_PREDICATE.call(:included_in?, list)
  end

  RULE_TYPE = ->(type) do
    RULE_PREDICATE.call(:type?, type)
  end

  HTTP_SCHEME = RULE_TYPE.call(Addressable::URI) & Dry::Logic::Operations::Attr.new(RULE_INCLUSION.("http", "https"), name: :scheme)

  HTTP_URI = URI.constrained_type.new(URI, rule: HTTP_SCHEME)

  class FlexibleStruct < Dry::Struct
    extend Memoist

    transform_keys(&:to_sym)

    transform_types do |type|
      if type.default?
        type.constructor do |value|
          value.nil? ? Dry::Types::Undefined : value
        end
      else
        type
      end
    end
  end
end
