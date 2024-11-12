'use client'

import { UserInfo } from '@/components/user-info';
import { useCurrentUser } from '@/hook/use-current-user'
import { currentUser } from '@/lib/auth'
import React from 'react'

const ClientPage = () => {
    const user = useCurrentUser();
    // const user = await currentUser();
  return (
    <UserInfo
    user={user}
    label='Client Component'
    />

    // <div>{JSON.stringify(user)}</div>
  )
}

export default ClientPage
