import startsWith from "lodash/startsWith";
import resolver from "./resolver";
import sumBy from "lodash/sumBy";
import cloneDeep from "lodash/cloneDeep";

export default class DraggableEventHelper {
  static syntheticDraggable = (blockType, opts = {}) => {
    const options = {
      ...DraggableEventHelper.defaultOptions(),
      ...opts
    };
    return {
      type: DraggableEventHelper.isTopType(blockType) ? "TOP" : "BOTTOM",
      draggableId: blockType,
      source: {
        droppableId: options.source.name
      },
      destination: {
        droppableId: options.destination.name,
        index: -1
      }
    };
  };

  static isTopType = type => {
    return !!resolver.typeToBlockComponent(type).top;
  };

  static defaultOptions = () => {
    return {
      source: {
        name: "available"
      },
      destination: {
        name: "current"
      }
    };
  };

  constructor(draggable, blocks, options = {}) {
    this.options = { ...this.defaultOptions, ...options };
    this.draggable = draggable;
    this._blocks = blocks;
  }

  get block() {
    if (this.isMove) return this.movedBlock;
    if (this.isInsert) return this.insertedBlock;
  }

  get blocks() {
    let blocks = this.clonedBlocks;
    const block = this.block;
    if (this.isMove) {
      blocks = blocks.filter(b => b.id !== block.id);
    }
    blocks.splice(block.attributes.position - 1, 0, block);
    return blocks;
  }

  get defaultOptions() {
    return this.constructor.defaultOptions();
  }

  get clonedBlocks() {
    return Array.from(this._blocks);
  }

  get draggedFromSource() {
    if (!this.draggable.source) return false;
    return startsWith(
      this.draggable.source.droppableId,
      this.options.source.name
    );
  }

  get draggedFromDestination() {
    if (!this.draggable.source) return false;
    return startsWith(
      this.draggable.source.droppableId,
      this.options.destination.name
    );
  }

  get draggedToDestination() {
    if (!this.draggable.destination) return false;
    return startsWith(
      this.draggable.destination.droppableId,
      this.options.destination.name
    );
  }

  get destinationIndex() {
    if (!this.draggable.destination) return null;
    const index = this.draggable.destination.index;
    if (index === -1) return this.autoIndex;
    return index;
  }

  get autoIndex() {
    if (this.isTopType(this.type)) return this.topCount; // no +1 because index is from 0;
    return this._blocks.length;
  }

  get actionable() {
    return this.action != null;
  }

  get isMove() {
    return this.draggedFromDestination && this.draggedToDestination;
  }

  get isInsert() {
    return this.draggedFromSource && this.draggedToDestination;
  }

  get action() {
    if (this.isMove) return "move";
    if (this.isInsert) return "insert";
    return null;
  }

  get isTop() {
    return this.draggable.type === "TOP";
  }

  isTopBlock(block) {
    return this.isTopType(block.attributes.type);
  }

  isTopType(type) {
    return this.constructor.isTopType(type);
  }

  get topCount() {
    return sumBy(this._blocks, block => (this.isTopBlock(block) ? 1 : 0));
  }

  get type() {
    return this.draggable.draggableId;
  }

  get uuid() {
    return this.draggable.draggableId;
  }

  get position() {
    const index = this.destinationIndex;
    const offset = 1; // position starts from 1, index from 0
    if (this.isTop) return index + offset;
    // Blocks in the bottom list have to add the top count.
    return index + this.topCount + offset;
  }

  findBlock(id) {
    return this._blocks.find(block => block.id === id);
  }

  cloneBlock(id) {
    return cloneDeep(this.findBlock(id));
  }

  get insertedBlock() {
    return {
      id: "pending",
      attributes: {
        type: this.type,
        position: this.position,
        renderable: true
      },
      relationships: {}
    };
  }

  get movedBlock() {
    const block = this.cloneBlock(this.uuid);
    block.attributes.position = this.position;
    return block;
  }
}
