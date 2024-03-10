export class ChatService {
  pc: RTCPeerConnection

  constructor() {
    const pc = this.pc = new RTCPeerConnection()

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        console.log('Candidate', ev.candidate)
      } else {
        console.log('Gathering done', pc.localDescription)
        this.sendOfferOrAnswer()
      }
    }

    pc.onicecandidateerror = (ev) => {
      console.log('Error', ev)
    }
  }

  async createOffer() {
    // Request media stream to trigger permissions dialog (this is just for testing)
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    // Add the stream to the connection to use it in the offer
    stream.getTracks().forEach(track => this.pc.addTrack(track, stream))

    const offer = await this.pc.createOffer()
    console.log('offer', offer)
    await this.pc.setLocalDescription(offer)
  }

  private sendOfferOrAnswer() {
    // send offer to ipfs
    // request store onchain
  }

  async receiveAnswer(answer: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer))
  }

  async receiveOffer(offer: RTCSessionDescription ) {
    await this.pc.setRemoteDescription(offer)

    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
  }
}
