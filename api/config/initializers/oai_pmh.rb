# frozen_string_literal: true

module ManifoldOAI
  # The `oai` gem renders `setDescription` by passing the string into Builder, which
  # escapes it as text. OAI-PMH requires `setDescription` to wrap a namespaced XML
  # element, so inject XML descriptions raw and omit any non-XML description.
  module ListSetsWithXMLDescriptions
    def to_xml
      raise ::OAI::SetException unless provider.model.sets

      response do |r|
        r.ListSets do
          provider.model.sets.each do |set|
            r.set do
              r.setSpec set.spec
              r.setName set.name

              description = set.description if set.respond_to?(:description)
              next unless description.to_s.strip.start_with?("<")

              r.setDescription { r << description }
            end
          end
        end
      end
    end
  end
end

OAI::Provider::Response::ListSets.prepend(ManifoldOAI::ListSetsWithXMLDescriptions)
