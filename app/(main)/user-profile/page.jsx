import { userProfile } from '@/actions/user'
import React from 'react'
import UserProfilePage from './_components/userProfile'

const ProfilePage = async() => {
    const user = await userProfile()
  return (
    <>
        <UserProfilePage user={user}/>
    </>
  )
}

export default ProfilePage