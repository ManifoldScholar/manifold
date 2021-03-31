import { cloneDeep } from "lodash";

export default class DraggableEventHelper {
  static defaultOptions = () => {
    return {};
  }

  constructor(draggable, categories, options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.draggable = draggable;
    this._categories = categories;
  }

  get defaultOptions() {
    return this.constructor.defaultOptions();
  }

  get type() {
    return this.draggable.type;
  }

  get source() {
    return this.draggable.source;
  }

  get sourceId() {
    return this.source.droppableId;
  }

  get destination() {
    return this.draggable.destination;
  }

  get destinationId() {
    return this.destination.droppableId;
  }

  get newPosition() {
    const index = this.destination.index;
    const offset = 1; // position starts from 1, index from 0
    return index + offset;
  }

  get uuid() {
    return this.draggable.draggableId;
  }

  get isCategory() {
    return this.type === "CATEGORY";
  }

  get actionable() {
    if (this.isCategory) return this.actionableCategory;
    return this.actionableCollectable;
  }

  get actionableCategory() {
    if (!this.destination) return false;
    return this.source.index !== this.destination.index;
  }

  get actionableCollectable() {
    if (!this.destination) return false;
    return true;
  }

  get collectableAction() {
    if (this.destinationIsSource) return "sort";
    return "migrate";
  }

  get category() {
    const category = this.cloneCategory(this.uuid);
    category.position = this.newPosition;
    return category;
  }

  get resortedCollection() {
    let results = this.clonedCategories;
    const category = this.category;

    results = results.filter(r => r.id !== category.id);
    results.splice(category.position - 1, 0, category);

    return results;
  }

  get repopulatedCategories() {
    let results = this.clonedCategories;

    const destinationCategory = this.withUpdatedMappings(this.destinationCategoryId);

    return results;
  }

  get clonedCategories() {
    return Array.from(this._categories);
  }

  findCategory(id) {
    return this._categories.find(category => category.id === id);
  }

  cloneCategory(id) {
    return cloneDeep(this.findCategory(id));
  }

  getCategoryId(droppableId) {
    const regex = /_.*$/;
    return droppableId.replace(regex, "");
  }

  getMappingType(droppableId) {
    const regex = /[^_]*$/;
    return droppableId.replace(regex, "");
  }

  withUpdatedMappings(id) {
    const category = this.cloneCategory(id);
    console.log(category);

    return category;
  }

  get destinationIsSource() {
    return this.source.droppableId === this.destination.droppableId;
  }

  get sourceCategoryId() {
    return this.getCategoryId(this.sourceId);
  }

  get destinationCategoryId() {
    return this.getCategoryId(this.destinationId);
  }
}
