import { userProfile } from '@/actions/user'
import React from 'react'
import UserProfilePage from './_components/userProfile'
export const dynamic = 'force-dynamic';
const ProfilePage = async() => {
    const user = await userProfile()
  return (
    <>
        <UserProfilePage user={user}/>
    </>
  )
}

export default ProfilePage
