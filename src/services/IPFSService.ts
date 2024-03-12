import { IPFSHTTPClient, create } from 'ipfs-http-client'

export const IPFS_ADDR = 'https://api.millionpixelland.com'

export class IPFSService {
  static instance: IPFSService
  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService()
    }

    return IPFSService.instance
  }

  private ipfs: IPFSHTTPClient

  constructor() {
    this.ipfs = create({ url: IPFS_ADDR })
  }

  async add(data: Blob | string): Promise<string> {
    const { cid } = await this.ipfs.add(data)

    return cid.toString()
  }

  async fetch<T>(cid: string): Promise<T> {
    return fetch(`${IPFS_ADDR}/ipfs/${cid}`).then(res => res.json())
  }
}
