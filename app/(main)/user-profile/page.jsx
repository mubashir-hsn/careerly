import { userProfile } from '@/actions/user'
import React from 'react'
import UserProfilePage from './_components/userProfile'

const ProfilePage = async() => {
    const user = await userProfile()
  return (
    <div>
        <UserProfilePage user={user}/>
    </div>
  )
}

export default ProfilePage