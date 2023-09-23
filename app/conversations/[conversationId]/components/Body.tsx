"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import React, { useEffect, useRef, useState } from "react";
import MassageBox from "./MassageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMassages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMassages = [] }) => {

  
  const [massages, setMassages] = useState(initialMassages);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
    .catch((error) => console.log(error))
  }, [conversationId]);

  

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView()

    const massageHandler = (massage: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMassages((current) => {
        if (find(current , { id: massage.id })) {
          return current
        }
        
        return [...current, massage]
      })

      bottomRef?.current?.scrollIntoView()
    }

    const updateMassageHandler = (newMessage: FullMessageType) => {
      setMassages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
  
        return currentMessage;
      }))
    };

    pusherClient.bind('messages:new', massageHandler)
    pusherClient.bind('messages:update', updateMassageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', massageHandler)
      pusherClient.unbind('messages:update', updateMassageHandler)
    }
  }, [conversationId]);

  return (
    <div className="overflow-y-auto flex-1">
      {massages.map((massage, i) => (
        <MassageBox
          isLast={i === massages.length - 1}
          key={massage.id}
          data={massage}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
