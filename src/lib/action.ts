type Action<T> = (data: T) => void;

export class ActionEvent<T> {
  private listeners: Action<T>[] = [];

  subscribe(listener: Action<T>): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Action<T>): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  invoke(data: T): void {
    for (const listener of this.listeners) {
      listener(data);
    }
  }
}