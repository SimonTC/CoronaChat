type P2PMediaStreamConstructorOptions = MediaStreamConstraints & {
  muted?: boolean
};

export default class P2PMediaStream {
  #options: P2PMediaStreamConstructorOptions;
  #mediaStream: MediaStream;
  #mediaElement: HTMLAudioElement | HTMLVideoElement;

  constructor(options?: P2PMediaStreamConstructorOptions) {
    this.#options = {
      audio: true,
      muted: true
    };

    if (options) {
      this.#options = {
        ...this.#options,
        ...options
      };
    }
  }

  get mediaStream() {
    return this.#mediaStream;
  }

  get mediaElement() {
    return this.#mediaElement;
  }

  setup(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.getUserMedia) {
        const errorElement = document.createElement("div");
        errorElement.innerText = "Media is not supported on your browser or connection is not secure.";
        document.body.appendChild(errorElement);
        reject("Unsupported media");
      } else if (!this.#mediaStream) {
        navigator.getUserMedia(this.#options, stream => {
          this.#mediaStream = stream;
    
          this.#mediaElement = this.#options.video
            ? document.createElement("video")
            : document.createElement("audio");
    
          this.#mediaElement.setAttribute("autoplay", "autoplay");
          this.#mediaElement.setAttribute("muted", this.#options.muted ? "true" : "false");
          this.#mediaElement.setAttribute("controls", "");
    
          document.body.appendChild(this.#mediaElement);
    
          if ("srcObject" in this.#mediaElement) {
            this.#mediaElement.srcObject = stream;
          } else {
            (this.#mediaElement as any).src = window.URL.createObjectURL(stream); // for older browsers
          }

          resolve();
        }, () => {
          reject("Access denied for audio/video.");
        });
      } else {
        reject("Media stream is already set up.");
      }
    });
  }

  remove() {
    document.body.removeChild(this.#mediaElement);
  }
}
