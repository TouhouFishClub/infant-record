<template>
  <svg
    :width="`${width}px`"
    :height="`${height}px`"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    id="logo-svg"
    data-llp-composed="123"
  >
    <path
      d="M880.213333 395.093333a31.786667 31.786667 0 0 1-26.88-15.573333 385.706667 385.706667 0 0 0-91.52-104.32 32.426667 32.426667 0 0 1-5.12-45.013333 32 32 0 0 1 45.013334-5.12 449.92 449.92 0 0 1 106.666666 121.6A31.786667 31.786667 0 0 1 896 390.4a30.293333 30.293333 0 0 1-15.786667 4.693333zM165.12 395.093333A30.293333 30.293333 0 0 1 149.333333 390.4a31.786667 31.786667 0 0 1-11.093333-43.733333A450.56 450.56 0 0 1 522.666667 128a32 32 0 0 1 0 64A386.56 386.56 0 0 0 192 379.52a31.786667 31.786667 0 0 1-26.88 15.573333z"
      p-id="1521"
      :fill="fillColor[0]"
      data-llp-id="logo-step-1"
      :data-llp-duration="duration"
      :data-llp-delay="stepDelay * 0"
      data-llp-ease="easeInOutExpo"
      :data-llp-stroke-color="fillColor[0]"
      :class="[forceShow ? 'path-complete' : '']"
    ></path>
    <path
      d="M565.333333 341.333333a32 32 0 0 1 0-64A101.76 101.76 0 0 0 661.333333 170.666667a101.76 101.76 0 0 0-96-106.666667 32 32 0 0 1 0-64A165.76 165.76 0 0 1 725.333333 170.666667a165.76 165.76 0 0 1-160 170.666666zM522.666667 1024C362.666667 1024 220.8 936.106667 139.946667 787.84 61.013333 776.746667 0 700.373333 0 608 0 507.946667 71.68 426.666667 160 426.666667a32 32 0 0 1 0 64C106.666667 490.666667 64 543.36 64 608S106.666667 725.333333 160 725.333333a31.786667 31.786667 0 0 1 28.586667 17.706667C256 878.933333 381.653333 960 522.666667 960a384 384 0 0 0 354.56-236.373333 31.146667 31.146667 0 0 1 14.506666-16 106.666667 106.666667 0 0 0 57.6-99.626667c0-64-42.666667-117.333333-96-117.333333a32 32 0 0 1 0-64c88.32 0 160 81.28 160 181.333333a170.666667 170.666667 0 0 1-81.706666 150.613333A448 448 0 0 1 522.666667 1024z"
      p-id="1522"
      :fill="fillColor[1]"
      data-llp-id="logo-step-2"
      :data-llp-duration="duration"
      :data-llp-delay="stepDelay * 1"
      data-llp-ease="easeInOutExpo"
      :data-llp-stroke-color="fillColor[1]"
      :class="[forceShow ? 'path-complete' : '']"
    ></path>
    <path
      d="M394.666667 640a32 32 0 0 1-32-32v-42.666667a32 32 0 0 1 64 0v42.666667a32 32 0 0 1-32 32zM629.333333 640a32 32 0 0 1-32-32v-42.666667a32 32 0 0 1 64 0v42.666667a32 32 0 0 1-32 32zM512 822.186667A131.2 131.2 0 0 1 391.466667 746.666667a32 32 0 1 1 58.24-26.453334 70.186667 70.186667 0 0 0 124.586666 0A32 32 0 1 1 632.533333 746.666667 131.2 131.2 0 0 1 512 822.186667z"
      p-id="1523"
      :fill="fillColor[2]"
      data-llp-id="logo-step-3"
      :data-llp-duration="duration"
      :data-llp-delay="stepDelay * 2"
      data-llp-ease="easeInOutExpo"
      :data-llp-stroke-color="fillColor[2]"
      :class="[forceShow ? 'path-complete' : '']"
    ></path>
  </svg>
</template>

<script>
  import LazyLinePainter from 'lazy-line-painter'
  export default {
    name: "Logo",
    data() {
      return {
        forceShow: false
      }
    },
    props: {
      width: {
        type: Number,
        default: 200
      },
      height: {
        type: Number,
        default: 200
      },
      duration: {
        type: Number,
        default: 1000
      },
      stepDelay: {
        type: Number,
        default: 200
      },
      strokeWidth: {
        type: Number,
        default: 10
      },
      fillColor: {
        type: Array,
        default () {
          return [
            '#f36392',
            '#f36392',
            '#f36392'
          ]
        }
      }
    },
    methods: {
      run() {
        try {
          if(document.implementation.hasFeature("http://www.w3.org/TR/SVG2/feature#GraphicsAttribute", 2.0)) {
            const el = document.querySelector('#logo-svg')
            const logoAnimation = new LazyLinePainter(el, {
              strokeWidth: this.strokeWidth,
              strokeJoin: 'miter'
              // ease: 'easeInOutExpo'
            })

            logoAnimation.on('start:all', event => {
              event.el.classList.remove('path-complete')
            })
            logoAnimation.on('complete:all', event => {
              event.el.classList.add('path-complete')
            })
            logoAnimation.on('complete', () => {
              setTimeout(() => {
                this.$emit('logoComplete')
              }, 500)
            })
            logoAnimation.paint()
          } else {
            this.forceShow = true
          }
        } catch (e) {
          this.forceShow = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  path {
    fill-opacity: 0;
    transition: fill-opacity 0s ease-in-out, stroke-width 0s ease-in-out;
    &.path-complete {
      transition-duration: 0.5s;
      fill-opacity: 1;
      stroke-width: 0!important;
    }
  }
</style>