module Packaging
  module EpubV3
    module BookCompilation
      class AddCollaborators
        include Packaging::PipelineOperation

        # @param [Packaging::EpubV3::BookContext] context
        # @return [void]
        def call(context)
          context.with!(:book, :compiled_text) do |book, compiled_text|
            compiled_text.collaborators.each do |collaborator|
              book.public_send(collaborator.gepub_add_method, *collaborator.to_gepub_args)
            end
          end
        end
      end
    end
  end
end
