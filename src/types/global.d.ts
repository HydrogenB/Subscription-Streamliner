interface Window {
  gtag: (
    event: string,
    eventName: string,
    params?: {
      [key: string]: any;
    }
  ) => void;
}
