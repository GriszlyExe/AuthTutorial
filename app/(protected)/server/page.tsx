
import { UserInfo } from '@/components/user-info';
import { useCurrentUser } from '@/hook/use-current-user'
import { currentUser } from '@/lib/auth'
import React from 'react'

const ServerPage =  async () => {
    // const user = useCurrentUser();
    const user = await currentUser();
  return (
    <UserInfo
    user={user}
    label='Server Component'
    />

    // <div>{JSON.stringify(user)}</div>
  )
}

export default ServerPage
