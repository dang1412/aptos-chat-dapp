import React, { useCallback, useState } from 'react'
import { Input, Button, Space, Divider  } from 'antd'


import { ChatService, IPFSService } from '@/services'

export const ManualAnswer = () => {

  const [offerCID, setOfferCID] = useState('')
  const [answeredCID, setAnsweredCID] = useState('')

  const receiveOffer = useCallback(async () => {
    const chatService = ChatService.getInstance()
    const ipfsService = IPFSService.getInstance()

    chatService.sendOfferOrAnswer = async (local) => {
      const cid = await ipfsService.add(local)
      setAnsweredCID(cid)
    }

    const sdp = await ipfsService.fetch<RTCSessionDescriptionInit>(offerCID)
    chatService.receiveOfferThenAnswer(sdp)
  }, [offerCID])

  return (
    <>
      <Divider style={{ color: 'white' }}>Answer Side</Divider>
      <Space.Compact style={{ width: '100%' }}>
        <Input defaultValue="" onChange={(e) => setOfferCID(e.target.value)} />
        <Button type="primary" onClick={() => receiveOffer()}>Receive</Button>
      </Space.Compact>
      <span style={{overflowWrap: 'break-word', color: 'white'}}>{answeredCID}</span>
    </>
  )
}