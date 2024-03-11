import { IPFSHTTPClient, create } from 'ipfs-http-client'

export const IPFS_ADDR = 'https://api.millionpixelland.com'

export class IPFSService {
  private ipfs: IPFSHTTPClient

  constructor() {
    this.ipfs = create({ url: IPFS_ADDR })
  }

  async add(data: Blob | string): Promise<string> {
    const { cid } = await this.ipfs.add(data)

    return cid.toString()
  }

  async fetch(cid: string) {
    return fetch(`${IPFS_ADDR}/ipfs/${cid}`).then(res => res.json())
  }
}
