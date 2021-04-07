RSpec.shared_examples_for "a model with formatted attributes" do
  let(:fa_config) { described_class.formatted_attributes }

  context "class-level configuration" do
    subject { fa_config }

    it "has formatted attributes defined" do
      expect(described_class).to have_formatted_attributes
    end

    its(:keys) { are_expected.to all satisfy("be found") { |key| key.in? fa_config } }
    its(:paths) { are_expected.to all satisfy("be found") { |path| path.in? fa_config } }
  end

  context "derived methods" do
    let(:instance) { described_class.new }

    it "has a fa_cache attribute" do
      expect(instance).to respond_to(:fa_cache)

      expect(instance.fa_cache).to be_a_kind_of(FormattedAttributes::CacheType)
    end

    it "defines all expected methods" do
      fa_config.derived_method_names.each do |method_name|
        expect(instance).to respond_to method_name
      end
    end

    it "can look up keys" do
      fa_config.keys.each do |key|
        expect do
          instance.formatted_attribute key
        end.to execute_safely
      end
    end

    context "with metadata" do
      before do
        skip "does not use metadata" unless described_class < ::Metadata && described_class.metadata_properties.present?
      end

      let(:instance) { FactoryBot.create described_class.model_name.singular }

      it "tracks changes to formatted metadata" do
        property = described_class.metadata_properties.first

        first_value = "first value"

        expect do
          instance.metadata[property] = first_value

          instance.save!
        end.to execute_safely.and change { instance.public_send(:"#{property}_formatted") }.to(first_value)

        expect(instance.metadata_formatted).to include_json(property => first_value)

        second_value = "second value"

        expect do
          instance.metadata[property] = second_value

          instance.save!
        end.to execute_safely.and change { instance.public_send(:"#{property}_formatted") }.from(first_value).to(second_value)

        expect(instance.metadata_formatted).to include_json(property => second_value)
      end
    end
  end
end
