import { Message } from '@/types'

export class ChatService {
  pc: RTCPeerConnection
  channel: RTCDataChannel | null = null

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
        console.log('Gathering done', pc.localDescription)
        // send the local SDP (after creating offer or answer)
        this.sendOfferOrAnswer(JSON.stringify(pc.localDescription))
      }
    }

    pc.onicecandidateerror = (ev) => {
      console.log('Error', ev)
    }

    pc.ondatachannel = (e) => {
      const channel = e.channel
      console.log('channel created', channel)
      this.setupChannel(channel)
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

  // override
  // send the local SDP
  sendOfferOrAnswer(local: string) {
    // send offer to ipfs
    // request store onchain
    console.log('Updated local SDP', local)
  }

  // override
  onMessage(msg: Message) {}

  /**
   * This function is for receiving SDP offer or answer
   * @param data 
   */
  async receiveSDP(sdp: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  /**
   * Receive offer then create an answer
   * @param offer 
   */
  async receiveOfferThenAnswer(offer: RTCSessionDescriptionInit) {
    await this.receiveSDP(offer)

    await this.requestMediaStream()

    const answer = await this.pc.createAnswer()
    await this.pc.setLocalDescription(answer)
  }

  async createChannel(name: string) {
    const channel = this.pc.createDataChannel(name)
    this.setupChannel(channel)
  }

  private setupChannel(channel: RTCDataChannel) {
    console.log('setupChannel', channel)
    this.channel = channel
    channel.onopen = () => {
      console.log('Channel opened', channel)
    }

    channel.onmessage = (e) => {
      console.log('onmessage', e.data)
      this.onMessage({ content: e.data, self: false })
    }

    channel.onerror = (e) => {
      console.log('Channel error', e)
    }
  }

  sendMessage(content: string) {
    if (!this.channel) return

    this.channel.send(content)
    this.onMessage({ content, self: true })
  }
}
