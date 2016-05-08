import * as entityStore from '../entityStore';
import { expect } from 'chai';

describe('actions/shared/entityStore', () => {

  it('should create an action with type "ENTITY_STORE_REQUEST"', () => {
    expect(entityStore.request()).to.have.property('type').and.equal('ENTITY_STORE_REQUEST');
  });

  it('should create an action with a payload', () => {
    expect(entityStore.request()).to.have.property('payload');
  });

  it('should create an action with a meta value', () => {
    expect(entityStore.request()).to.have.property('meta').and.to.be.a('string');
  });

  it('should create an action with a meta value that is not empty', () => {
    expect(entityStore.request()).to.have.property('meta').and.not.be.empty;
  });

});
