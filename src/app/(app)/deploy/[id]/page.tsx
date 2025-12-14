import { redirect } from 'next/navigation'
import { getUserId } from '@/actions'
import { findAgentById } from '@/lib/db-queries'
import { DeployView } from './deploy-view'

export default async function DeployPage({
  params,
}: PageProps<'/deploy/[id]'>) {
  const { id } = await params

  const userId = await getUserId()
  if (!userId) {
    redirect('/')
  }

  const agent = await findAgentById(id, userId)

  if (!agent) {
    redirect('/playground?msg=missing_agent_id')
  }

  return <DeployView agent={agent} />
}
