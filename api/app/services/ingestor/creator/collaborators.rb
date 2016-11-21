module Ingestor
  module Creator
    # Creates Manifold TextTitles from title Reporters.
    #
    # @author Zach Davis
    class Collaborators < AbstractCreator

      DEFAULT_ATTRIBUTES = {}.freeze
      TEXT_ASSOCIATION_NAME = :collaborators

      def create(inspectors)
        models = inspectors.each_with_index.map do |inspector, _index|
          maker = find_maker(@text.makers, inspector)
          maker.attributes = maker_attributes(inspector)
          collaborator = find_collaborator(@text.collaborators, maker)
          collaborator.attributes = attributes(inspector, maker)
          report(collaborator)
          collaborator
        end
        models
      end

      private

      def find_collaborator(collaborators, maker)
        unless maker.new_record?
          extant_collaborator = find_in_set(collaborators, maker: maker)
        end
        extant_collaborator || collaborators.new
      end

      def find_maker(makers, inspector)
        extant_maker = find_in_set(makers, compare_attr(inspector))
        extant_maker || Maker.new
      end

      def report(collaborator)
        if collaborator.new_record?
          debug "services.ingestor.creator.log.new_collaborator",
                name: collaborator.maker.name,
                role: collaborator.role
        else
          debug "services.ingestor.creator.log.updated_collaborator",
                name: collaborator.maker.name,
                role: collaborator.role
        end
      end

      def compare_attr(inspector)
        {
          name: inspector.name
        }
      end

      def maker_attributes(inspector)
        {
          name: inspector.name
        }
      end

      def attributes(inspector, maker)
        {
          maker: maker,
          role: inspector.role
        }
      end
    end
  end
end
