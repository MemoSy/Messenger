import getConversationById from "@/app/actions/getConversationById";
import getMassages from "@/app/actions/getMassages";
import EmptyState from "@/app/components/EmptyState";
import Header from './components/Header'
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
  conversationId: string;
}

const page = async ({params}: {params: IParams}) => {
  const conversation = await getConversationById(params.conversationId)
  const massages = await getMassages(params.conversationId)

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="flex h-full flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="flex h-full flex-col">
        <Header conversation={conversation} />
        <Body initialMassages={massages} />
        <Form />
      </div>
    </div>
  )
}

export default page
