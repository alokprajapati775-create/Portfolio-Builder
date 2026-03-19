// client/src/utils/animationController.js
// Only ONE main animation runs at a time globally to conserve GPU resources

let currentAnimation = null;

export function startAnimation(id, initFn, cleanupFn) {
  // If an animation is already running, stop it first
  if (currentAnimation && currentAnimation.id !== id) {
    console.log(`Animation Controller: Stopping ${currentAnimation.id} before starting ${id}`);
    try {
      currentAnimation.cleanup();
    } catch (e) {
      console.error(`Animation Controller: Fails to cleanup ${currentAnimation.id}:`, e);
    }
    currentAnimation = null;
  }

  // If already running this animation, just return
  if (currentAnimation && currentAnimation.id === id) {
    return;
  }

  // Start new animation
  console.log(`Animation Controller: Starting ${id}`);
  currentAnimation = { id, cleanup: cleanupFn };
  
  if (typeof initFn === 'function') {
    initFn();
  }
}

export function stopCurrentAnimation() {
  if (currentAnimation) {
    console.log(`Animation Controller: Stopping ${currentAnimation.id}`);
    try {
      currentAnimation.cleanup();
    } catch (e) {
      console.error('Animation Controller: Error in cleanup:', e);
    }
    currentAnimation = null;
  }
}

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}
