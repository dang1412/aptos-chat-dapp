import React, { useCallback, useState } from 'react'
import { Input, Button, Space, Divider  } from 'antd'


import { ChatService, IPFSService } from '@/services'

export const ManualOffer = () => {

  const [offerCID, setOfferCID] = useState('')
  const [answeredCID, setAnsweredCID] = useState('')

  const createOffer = useCallback(() => {
    const chatService = ChatService.getInstance()
    const ipfsService = IPFSService.getInstance()
    chatService.sendOfferOrAnswer = async (local) => {
      const cid = await ipfsService.add(local)
      setOfferCID(cid)
    }

    // create channel
    chatService.createChannel('message')
    // create offer
    chatService.createOffer()
  }, [])

  const receiveAnswer = useCallback(async () => {
    const chatService = ChatService.getInstance()
    const ipfsService = IPFSService.getInstance()
    const sdp = await ipfsService.fetch<RTCSessionDescriptionInit>(answeredCID)
    console.log('received', sdp)
    await chatService.receiveSDP(sdp)
  }, [answeredCID])

  return (
    <>
      <Divider style={{ color: 'white' }}>Offer Side</Divider>

      <Button type="primary" onClick={createOffer}>Create Offer</Button>
      <span style={{overflowWrap: 'break-word', color: 'white'}}>{offerCID}</span>
      <Space.Compact style={{ width: '100%' }}>
        <Input defaultValue="" onChange={(e) => setAnsweredCID(e.target.value)} />
        <Button type="primary" onClick={receiveAnswer}>Answer</Button>
      </Space.Compact>
    </>
  )
}