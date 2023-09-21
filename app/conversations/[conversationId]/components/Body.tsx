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
    axios.post(`/api/conversations/${conversationId}/seen`);
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

    pusherClient.bind('messages:new', massageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', massageHandler)
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
