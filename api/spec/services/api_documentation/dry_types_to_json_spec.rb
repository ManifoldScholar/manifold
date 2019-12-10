require 'rails_helper'

RSpec.describe ::ApiDocumentation::DryTypesToJson do
  let(:types) { Dry::Types }
  let(:serializer_types) { ::Types::Serializer }

  describe 'when defining primitive types' do
    it 'should convert a string' do
      expect(
        described_class.convert(types['string'])
      ).to eq({
        type: 'string'
      })
    end

    it 'should convert a bool' do
      expect(
        described_class.convert(types['bool'])
      ).to eq({
        type: 'boolean'
      })
    end

    it 'should convert a integer' do
      expect(
        described_class.convert(types['integer'])
      ).to eq({
        type: 'integer'
      })
    end

    it 'should convert a float' do
      expect(
        described_class.convert(types['float'])
      ).to eq({
        type: 'number',
        format: 'float'
      })
    end

    it 'should convert a datetime' do
      expect(
        described_class.convert(types['date_time'])
      ).to eq({
        type: 'string',
        format: 'date-time'
      })
    end
  end

  it 'should be able to attatch metadata information' do
    expect(
      described_class.convert(types['string'].meta(example: 'foo'))
    ).to eq({
      type: 'string',
      example: 'foo'
    })
  end

  it 'should convert an optional string' do
    expect(
      described_class.convert(types['string'].optional)
    ).to eq({
      type: 'string',
      'x-nullable': true
    })
  end

  it 'should convert an optional datetime' do
    expect(
      described_class.convert(types['date_time'].optional)
    ).to eq({
      type: 'string',
      format: 'date-time',
      'x-nullable': true
    })
  end

  describe 'complex types' do
    it 'should convert an optional enum string' do
      expect(
        described_class.convert(types['string'].optional.enum('one', 'two'))
      ).to eq({
        type: 'string',
        enum: ['one', 'two'],
        'x-nullable': true
      })
    end

    it 'should convert an enum string' do
      expect(
        described_class.convert(types['string'].enum('one', 'two'))
      ).to eq({
        type: 'string',
        enum: ['one', 'two']
      })
    end

    it 'should convert an optional float' do
      expect(
        described_class.convert(types['float'].optional)
      ).to eq({
        type: 'number',
        format: 'float',
        'x-nullable': true
      })
    end

    it 'should convert an empty hash' do
      expect(
        described_class.convert(types['hash'])
      ).to eq({})
    end

    it 'should convert an array with a simple type' do
      expect(
        described_class.convert(types['array'].of(types['string']))
      ).to eq({
        type: 'array',
        items: {
          type: 'string'
        }
      })
    end

    it 'should convert a hash with content' do
      expect(
        described_class.convert(types['hash'].schema(name: types['string']))
      ).to eq({
        type: 'object',
        properties: {
          name: described_class.convert(types['string'])
        }
      })
    end

    describe 'custom serializer types' do
      it 'should convert a pointer' do
        expect(
          described_class.convert(serializer_types::Pointer)
        ).to eq({
          type: 'object',
          properties: {
            id: described_class.convert(serializer_types::ID),
            type: described_class.convert(types['string'])
          }
        })
      end

      it 'should convert a resource' do
        expect(
          described_class.convert(serializer_types::Resource)
        ).to eq({
          type: 'object',
          properties: {
            data: described_class.convert(serializer_types::Pointer)
          }
        })
      end

      it 'should convert an array of hashes' do
        expect(
          described_class.convert(types['array'].of(types['hash'].schema(name: types['string'])))
        ).to eq({
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: 'string' }
            }
          }
        })
      end

      it 'should convert a collection' do
        expect(
          described_class.convert(serializer_types::Collection)
        ).to eq({
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: described_class.convert(serializer_types::Pointer)
            }
          }
        })
      end
    end
  end
end
