<template>
  <div
    :class="[
      'robot',
      {
        selected,
        hovered,
        dragging,
        selectable
      }
    ]"
    @mousedown.stop="select($event)"
    @mouseup.stop="select($event)"
    @mouseleave.stop="hover($event)"
    @mouseenter.stop="hover($event)"
  >
    {{ robot.name }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Emit, Prop, Watch } from 'vue-property-decorator';
import { Robot } from '@/logic/classes/robot';

@Component({
  name: 'robot-component'
})
export default class RobotComponent extends Vue {
  @Prop({ required: true }) robot!: Robot;
  @Prop({ required: true }) selectable!: boolean;
  // @Prop({ required: true }) listenElement!: HTMLElement;
  @Prop({ default: false }) selected!: boolean;

  // selected = false;
  hovered = false;
  dragging = false;
  mousedown = false;
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
.robot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  flex: 1;
  background-color: #eee;
  margin: 6px;
  border-radius: 5px;
  box-shadow: #aaa 0 0 2px;
  // TODO: Do I keep "Ghost" robots for path indication, and do I make them a separate object and/or component?
  /*&-ghost {*/
  /*  background-color: transparent;*/
  /*  animation-fill-mode: both;*/
  /*  &.hover-bot {*/
  /*    background-color: #ddd;*/
  /*    animation: 2s ease-out 0s infinite normal glow;*/
  /*  }*/
  /*  &.warning-path {*/
  /*    background-color: #ffe;*/
  /*  }*/
  /*  &.other-path {*/
  /*    background-color: #bbb;*/
  /*  }*/
  /*}*/
  &.hovered {
    background-color: #ddf;
  }
  &.selected {
    background-color: #dfd;
  }
  &:not(.selectable) {
    background-color: #fdd;
  }
}
@keyframes glow {
  0% {
    background-color: #eee;
  }
  50% {
    background-color: #ddd;
  }
  100% {
    background-color: #ddd;
  }
}
</style>
