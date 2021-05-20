export default class DraggableEventHelper {
  constructor(draggable, categories, mappings) {
    this.draggable = draggable;
    this._categories = categories;
    this._mappings = mappings;
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

  get sourceCategoryId() {
    return this.getCategoryId(this.sourceId);
  }

  get sourceMapping() {
    return this._mappings[this.sourceCategoryId];
  }

  get destination() {
    return this.draggable.destination;
  }

  get destinationId() {
    return this.destination.droppableId;
  }

  get destinationCategoryId() {
    return this.getCategoryId(this.destinationId);
  }

  get destinationMapping() {
    return this._mappings[this.destinationCategoryId];
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
    return this.type === "categories";
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
    const idMatches = this.sourceId === this.destinationId;
    const indexMatches = this.source.index === this.destination.index;
    return !idMatches || !indexMatches;
  }

  get action() {
    if (this.isCategory) return "sortCategories";
    if (this.destinationIsSource) return "sortMappings";
    return "migrateMapping";
  }

  get sortedCategory() {
    const category = this.findCategory(this.uuid);
    category.position = this.newPosition;
    return category;
  }

  get sortedCategories() {
    let results = this.clonedCategories;
    const category = this.sortedCategory;

    results = results.filter(r => r.id !== category.id);
    results.splice(category.position - 1, 0, category);

    return results;
  }

  get sortedCollectable() {
    return {
      id: this.uuid,
      type: this.type,
      groupingId: this.destinationCategoryId,
      position: this.newPosition
    };
  }

  get sortedType() {
    let results = this.clonedDestinationMappingType;
    const collectable = this.uuid;

    results = results.filter(r => r !== collectable);
    results.splice(this.destination.index, 0, collectable);

    return results;
  }

  get updatedSourceType() {
    let results = this.clonedSourceMappingType;
    const removedCollectable = this.uuid;

    results = results.filter(r => r !== removedCollectable);

    return results;
  }

  get updatedDestinationType() {
    const hasExistingMapping =
      this.destinationMapping && this.destinationMapping[this.type];

    if (!hasExistingMapping) return [this.uuid];

    return this.sortedType;
  }

  get clonedCategories() {
    return Array.from(this._categories);
  }

  get clonedSourceMappingType() {
    return Array.from(this.sourceMapping[this.type]);
  }

  get clonedDestinationMappingType() {
    return Array.from(this.destinationMapping[this.type]);
  }

  get destinationIsSource() {
    return this.source.droppableId === this.destination.droppableId;
  }

  findCategory(id) {
    return this._categories.find(category => category.id === id);
  }

  getCategoryId(droppableId) {
    const regex = /_.*$/;
    return droppableId.replace(regex, "");
  }
}
