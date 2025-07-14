type EventHandler = (...args: any[]) => void;

/**
 * Simple event bus for SDK events
 */
export class EventBus {
  private listeners: { [event: string]: EventHandler[] } = {};

  /**
   * Register an event listener
   */
  on(event: string, handler: EventHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }

  /**
   * Remove an event listener
   */
  off(event: string, handler: EventHandler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    for (const handler of this.listeners[event]) {
      handler(...args);
    }
  }
}

export const eventBus = new EventBus(); 