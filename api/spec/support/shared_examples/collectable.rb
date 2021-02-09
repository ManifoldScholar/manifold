RSpec.shared_examples_for "a collectable" do
  Collections::Mapping.each do |definition|
    collector_name = definition.collector.name

    context "when collected via #{collector_name}" do
      let(:collector_definition) { definition }

      let(:collectable_definition) { collector_definition[described_class] }
      let(:associations) { collectable_definition&.associations }

      let(:collector_factory) { definition.collector.model_name.singular }

      let(:collectable_factory) { associations&.collectable&.singular}

      let(:entry_factory) { associations&.entry&.singular }

      let(:grouping_factory) { associations&.grouping&.singular if collector_definition.has_grouping? }

      let!(:collector) { FactoryBot.create collector_factory }
      let!(:collectable) { FactoryBot.create collectable_factory if collectable_factory.present? }
      let!(:grouping) { FactoryBot.create grouping_factory, grouping_attributes if grouping_factory.present? }
      let(:grouping_attributes) do
        next {} unless collector_definition.has_grouping?

        {}.tap do |h|
          h[collector_factory] = collector
        end
      end

      let!(:entry_attributes) do
        next unless collectable_definition.present?

        {}.tap do |h|
          h[collectable_factory] = collectable
          h[collector_factory] = collector
          h[grouping_factory] = grouping if grouping_factory.present?
        end
      end

      let!(:entry) do
        next unless collectable_definition.present?

        FactoryBot.create entry_factory, entry_attributes
      end

      before(:each) do
        skip "not collected via #{collector_name}" if collectable_definition.blank?
      end

      it "can be collected" do
        expect(collectable.public_send(associations.collecting_collectors)).to include collector
      end
    end
  end
end
