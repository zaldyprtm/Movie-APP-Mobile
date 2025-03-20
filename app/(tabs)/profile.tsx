import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const Profile = () => {
  return (
    <View className='bg-primary flex-1'>
        <View className='flex justify-center items-center flex-1 flex-col gap-5'>
          <Image source={icons.person} className='size-10' tintColor="#Fff" />
          <Text className='text-gray-500 text-base'>
            Profile
          </Text>
        </View>

    </View>
  )
}

export default Profile