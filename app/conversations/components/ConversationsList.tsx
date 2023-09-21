'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullConversationType } from "@/app/types"
import { Conversation, User } from "@prisma/client"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { MdOutlineGroupAdd } from 'react-icons/md'
import ConversationsBox from "./ConversationsBox"
import GroupChatModel from "./GroupChatModel"

interface ConversationsListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  initialItems,
  users
}) => {
  const [items, setitems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter()

  const { conversationId, isOpen } = useConversation()

  return (
    <>
    <GroupChatModel
      users={users}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
      <aside className={clsx(`
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
      `,
        isOpen ? 'hidden' : 'block w-full left-0'
      )}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Massages 📑
            </div>
            <div onClick={() => setIsModalOpen(true)} className="
              rounded-full
              p-2
              bg-gray-100
              text-gray-600
              cursor-pointer
              hover:opacity-75
              transition
            ">
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) =>(
            <ConversationsBox key={item.id} data={item} selected={conversationId === item.id} />
          ))}
        </div>
      </aside>
    </>
  )
}

export default ConversationsList