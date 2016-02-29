import { select } from '../select';
import { expect } from 'chai';

describe('utils/select', () => {

  const maker1 = { attributes: { id: '1' } };
  const maker2 = { attributes: { id: '2' } };
  const text1 = { attributes: { id: '1' } };
  const text2 = { attributes: { id: '2' } };

  const entities = {
    makers: {
      1: maker1,
      2: maker2
    },
    texts: {
      1: text1,
      2: text2
    }
  };

  const relationships = {
    creators: {
      data: [
        {
          id: '1',
          type: 'makers'
        },
        {
          id: '2',
          type: 'makers'
        }

      ]
    },
    texts: {
      data: [
        {
          id: '1',
          type: 'texts'
        },
        {
          id: '2',
          type: 'texts'
        }
      ]
    },
    publishedText: {
      data: {
        id: '1',
        type: 'texts'
      }
    },
    toc_section: {
      data: { id: '1', type: 'section' }
    }
  };

  const results = select({ relationships }, entities);

  it('should return an object with a corresponding key for each relationship', () => {
    expect(Object.keys(results)).to.deep.equal(Object.keys(relationships));
  });

  it('should return relationships with the same number of entities', () => {
    expect(results.texts.length).to.equal(relationships.texts.data.length);
  });

  it('should return an object when the relationship is an object rather than an array', () => {
    expect(results.publishedText).to.deep.equal(text1);
  });

  it('should return a collection of entities with the correct IDs', () => {
    const expectedIds = relationships.texts.data.map((entityData) => {
      return entityData.id;
    });
    const resultingIds = results.texts.map((entity) => {
      return entity.attributes.id;
    });
    expect(expectedIds).to.deep.equal(resultingIds);
  });

});
