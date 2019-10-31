module Packaging
  module EpubV3
    # A proxy that wraps a {Collaborator} (and its {Maker}) for a given {Text}.
    #
    # Its {CollaboratorRole role} is determined upon creation and is used to
    # determine where it is inserted in the Epub metadata.
    class CollaboratorItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:id, :kind)
      include Dux.comparable(:position)

      attribute :collaborator, Types.Instance(Collaborator)
      attribute :display_seq, Types::Integer
      attribute :kind, Types::ENUM_OF_TYPE[CollaboratorRole]
      attribute :maker, Types.Instance(Maker)

      delegate :creator?, :contributor?, :gepub_add_method, to: :kind
      delegate :id, :position, to: :collaborator, prefix: true
      delegate :id, to: :maker, prefix: true
      delegate :name, to: :maker

      # @return [(String, Hash)]
      def to_gepub_args
        [name, { display_seq: display_seq }]
      end
    end
  end
end
