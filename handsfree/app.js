// Create a new instance. Use one instance for each camera
window.handsfree = new Handsfree({})

let strokeColor = '#000'

/**
 * Create a simple plugin that displays pointer values on every frame
 */
Handsfree.use('p5.facePaint', {
  // Plugin properties
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,

  // Contains our P5 instance
  p5: null,

  /**
   * Called exactly once when the plugin is first used
   */
  onUse() {
    this.p5 = new p5((p) => {
      const $canvasWrap = document.querySelector('#canvas-wrap')

      // Setup P5 canvas
      p.setup = () => {
        const $canvas = p.createCanvas(
          $canvasWrap.clientWidth,
          $canvasWrap.clientHeight
        )
        $canvas.parent($canvasWrap)
        p.strokeWeight(6)
      }

      // Match canvas size to window
      p.windowResized = () => {
        p.resizeCanvas($canvasWrap.clientWidth, $canvasWrap.clientHeight)
      }
    })
  },

  onFrame({ head }) {
    // Setup point coordinates
    this.lastX = this.x
    this.lastY = this.y
		
    this.x = head.pointer.x + 10
    this.y = head.pointer.y + 10

    this.p5.stroke(this.p5.color(strokeColor))

    // Draw lines
    if (head.state.mouthOpen) {
      this.p5.line(this.x, this.y, this.lastX, this.lastY)
    }

  },

  
})

/**
 * Delete with clear
 */
handsfree.on('clear', () => {
  Handsfree.plugins['p5.facePaint'].p5.clear()
})


