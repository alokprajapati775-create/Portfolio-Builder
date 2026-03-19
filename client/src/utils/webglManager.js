// client/src/utils/webglManager.js
// Tracks all active WebGL contexts to prevent exhaustion

class WebGLManager {
  constructor() {
    this.activeRenderers = new Map();
    this.maxContexts = 4; // Safe limit for most browsers
  }

  register(id, renderer) {
    // If at limit — destroy oldest to make room
    if (this.activeRenderers.size >= this.maxContexts) {
      const oldestId = this.activeRenderers.keys().next().value;
      console.warn(`WebGL Manager: Limit reached. Destroying oldest context: ${oldestId}`);
      this.destroy(oldestId);
    }
    
    this.activeRenderers.set(id, renderer);
    console.log(`WebGL Manager: Registered ${id}. Total active: ${this.activeRenderers.size}`);
  }

  destroy(id) {
    const renderer = this.activeRenderers.get(id);
    if (renderer) {
      try {
        // Dispose of the renderer and force context loss to free GPU memory
        renderer.dispose();
        if (typeof renderer.forceContextLoss === 'function') {
          renderer.forceContextLoss();
        }
      } catch (e) {
        console.error(`WebGL Manager: Error destroying ${id}:`, e);
      }
      this.activeRenderers.delete(id);
      console.log(`WebGL Manager: Destroyed ${id}. Total active: ${this.activeRenderers.size}`);
    }
  }

  destroyAll() {
    console.log('WebGL Manager: Destroying all active contexts');
    this.activeRenderers.forEach((_, id) => {
      this.destroy(id);
    });
    this.activeRenderers.clear();
  }

  isAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }
}

export const webglManager = new WebGLManager();
