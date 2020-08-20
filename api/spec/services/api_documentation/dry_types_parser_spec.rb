require 'rails_helper'

RSpec.describe ::APIDocumentation::DryTypesParser do
  let(:types) { Dry::Types }
  let(:serializer_types) { ::Types::Serializer }

  describe 'when converting' do
    describe 'primitive types' do
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

      it 'should convert a date time' do
        expect(
          described_class.convert(types['date_time'])
        ).to eq({
          type: 'string',
          format: 'date-time'
        })
      end
    end

    describe 'additional information on primitive types' do
      it 'should be able to attach metadata information' do
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

      it 'should convert an optional date time' do
        expect(
          described_class.convert(types['date_time'].optional)
        ).to eq({
          type: 'string',
          format: 'date-time',
          'x-nullable': true
        })
      end

      it 'should not add a non-swagger defined meta' do
        expect(
          described_class.convert(types['string'].meta(foo: true))
        ).to eq described_class.convert(types['string'])
      end

      describe "when noting uniqueness" do
        it 'should create a description if none exists' do
          expect(
            described_class.convert(types['string'].meta(unique: true))
          ).to eq({
            type: 'string',
            description: 'Must be unique.'
          })
        end

        it 'should append to an existing description' do
          expect(
            described_class.convert(types['string'].meta(unique: true, description: "Test."))
          ).to eq({
            type: 'string',
            description: 'Test. Must be unique.'
          })
        end
      end
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
        ).to eq({ type: 'object' })
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

      it 'should assign a required attributes to hash elements' do
        expect(
          described_class.convert(types['hash'].schema(name: types['string']).meta(required: ['name']))
        ).to eq({
          type: 'object',
          required: ['name'],
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
              data: described_class.convert(serializer_types::Pointer.optional)
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
                name: described_class.convert(types['string'])
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

  describe 'when getting read only attributes' do
    it 'should return a read only attribute' do
      expect(
        described_class.read_only_attributes({
          foo: types['string'].meta(read_only: true)
        })
      ).to eq([ :foo ])
    end

    it 'should not return an attribute that does not have read_only' do
      expect(
        described_class.read_only_attributes({
          foo: types['string'].meta(bar: true)
        })
      ).to eq([])
    end
  end
end
