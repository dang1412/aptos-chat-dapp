export class ChatService {
  pc: RTCPeerConnection

  static _instance: ChatService | null = null
  static getInstance(): ChatService {
    if (ChatService._instance === null) {
      ChatService._instance = new ChatService()
    }

    return ChatService._instance
  }

  constructor() {
    const pc = this.pc = new RTCPeerConnection()

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        console.log('Candidate', ev.candidate)
      } else {
        console.log('Gathering done')
        // send the local SDP (after creating offer or answer)
        this.sendOfferOrAnswer()
      }
    }

    pc.onicecandidateerror = (ev) => {
      console.log('Error', ev)
    }
  }

  async createOffer() {
    await this.requestMediaStream()

    const offer = await this.pc.createOffer()
    console.log('offer', offer)
    await this.pc.setLocalDescription(offer)
  }

  // Call this function before creating offer or answer
  // so it could get the ICECandidate and update the local SDP after setLocalDescription
  private async requestMediaStream() {
    // Request media stream to trigger permissions dialog (this is just for testing)
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    // Add the stream to the connection to use it in the offer
    stream.getTracks().forEach(track => this.pc.addTrack(track, stream))
  }

  // send the local SDP
  private sendOfferOrAnswer() {
    // send offer to ipfs
    // request store onchain
    console.log('Updated local SDP', this.pc.localDescription)
  }

  /**
   * This function is for receiving SDP offer or answer
   * @param data 
   */
  async receiveSDP(data: string) {
    const sdp = JSON.parse(data) as RTCSessionDescriptionInit
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  /**
   * Receive offer then create an answer
   * @param offer 
   */
  async receiveOfferThenAnswer(offer: string ) {
    await this.receiveSDP(offer)

    await this.requestMediaStream()

    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
  }
}
