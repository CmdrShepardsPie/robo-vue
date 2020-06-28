<template>
  <div
    :class="[
      'square',
      {
        selected,
        hovered,
        dragging,
        selectable,
        occupied
      }
    ]"
    @mousedown.stop="select($event)"
    @mouseup.stop="select($event)"
    @mouseleave.stop="hover($event)"
    @mouseenter.stop="hover($event)"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Square } from '@/logic/classes/square';

@Component({
  name: 'square-component'
})
export default class SquareComponent extends Vue {
  @Prop({ required: true }) square!: Square;
  @Prop({ required: true }) selectable!: boolean;
  // @Prop({ required: true }) listenElement!: HTMLElement;
  @Prop({ default: false }) selected!: boolean;

  // selected = false;
  hovered = false;
  dragging = false;
  mousedown = false;
  occupied = false;
  // listening = false;

  select(event: MouseEvent) {
    // if (this.listening) {
    //   window.removeEventListener('mouseup', this.select);
    //   this.listening = false;
    // }
    if (!this.selectable) {
      return;
    }
    if (event.type === 'mousedown') {
      this.mousedown = true;
    } else if (event.type === 'mouseup') {
      this.mousedown = false;
    }
    if (event.type === 'mousedown' && !this.selected) {
      this.emitSelected(true);
    } else if (event.type === 'mousedown' && this.selected) {
      this.emitSelected(false);
    } else if (event.type === 'mouseup' && this.selected && this.dragging) {
      this.emitSelected(false);
    } else if (event.type === 'mouseup' && this.selected && !this.hovered) {
      this.emitSelected(false);
    }
    this.dragging = false;
  }

  hover(event: MouseEvent) {
    if (event.type === 'mouseenter') {
      this.hovered = true;
    } else if (event.type === 'mouseleave') {
      this.hovered = false;
    }
    if (event.type === 'mouseleave' && this.selected) {
      if (this.mousedown) {
        this.dragging = true;
      }
      // if (!this.listening) {
      //   this.listenElement.addEventListener('mouseup', this.select);
      //   this.listening = true;
      // }
    } else if (event.type === 'mouseleave' && !this.selected) {
      this.dragging = false;
    }
  }

  // @Watch('selected')
  @Emit('selected')
  // I don't like using eslint-disable statements but I'm not going to worry about it for this prototype
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  emitSelected(selected: boolean) {}

  @Watch('hovered')
  @Emit('hovered')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  emitHovered(hovered: boolean) {}

  @Watch('dragging')
  @Emit('dragging')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  emitDragging(dragging: boolean) {}

  beforeDestroy() {
    // if (this.listening) {
    //   window.removeEventListener('mouseup', this.select);
    //   this.listening = false;
    // }
  }
}
</script>

<style lang="scss" scoped>
.square {
  display: flex;
  flex-direction: row;
  width: 5rem;
  background-color: #ccc;
  box-shadow: #aaa inset 0 0 2px;
  &.hovered {
    background-color: #bbd;
  }
  &.selected {
    background-color: #bdb;
  }
  &.occupied {
    background-color: #bbb;
  }
  &:not(.selectable) {
    background-color: #dbb;
  }
}
</style>
