import { EventEmitter } from "../common/EventEmitter";

export type P2PMediaStreamConstructorOptions = MediaStreamConstraints & {
  muted?: boolean;
  playsInline?: boolean;
};

type P2PMediaStreamEventType = "started";

export default class P2PMediaStream extends EventEmitter<P2PMediaStreamEventType> {
  #options: P2PMediaStreamConstructorOptions;
  #mediaStream: MediaStream;
  #mediaElement: HTMLAudioElement | HTMLVideoElement;

  constructor(options?: P2PMediaStreamConstructorOptions) {
    super();

    this.#options = {
      audio: true,
      video: true,
      muted: false,
      playsInline: true
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

  getUserMedia(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      const userMediaPromise = this._getUserMedia();

      if (!userMediaPromise) {
        const errorElement = document.createElement("div");
        errorElement.innerText = "Media is not supported on your browser or connection is not secure.";
        document.body.appendChild(errorElement);

        reject(new Error("Unsupported media"));
      } else {
        return userMediaPromise
          .then(resolve)
          .catch(() => {
            reject(new Error("Access denied for media stream"));
          })
      }
    });
  }

  attachMediaElement(stream: MediaStream) {
    this.#mediaStream = stream;

    this.#mediaElement = this.#options.video
      ? document.createElement("video")
      : document.createElement("audio");

    this.#mediaElement.muted = this.#options.muted;

    this.#mediaElement.setAttribute("autoplay", "autoplay");

    if (this.#options.playsInline) {
      this.#mediaElement.setAttribute("playsinline", "");
    }

    document.body.appendChild(this.#mediaElement);
    
    if ("srcObject" in this.#mediaElement) {
      this.#mediaElement.srcObject = stream;
    } else {
      (this.#mediaElement as any).src = window.URL.createObjectURL(stream); // for older browsers
    }

    this.fire("started");
  }

  remove() {
    document.body.removeChild(this.#mediaElement);
  }

  private _getUserMedia(): Promise<MediaStream> {
    // @ts-ignore
    const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    if (getUserMedia) {
      const promisifiedGetUserMedia: Promise<MediaStream> = new Promise((resolve, reject) => {
        getUserMedia.call(navigator, this.#options, resolve, reject);
      });
      
      return promisifiedGetUserMedia;
    }

    return null;
  }
}
