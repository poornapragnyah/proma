'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'
import { validateToken } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { UserRoleProvider } from '@/contexts/userContext'
import {BackButton} from '@/components/BackButton'

const layout = ({children}) => {
  const router = useRouter();

  useEffect(() => {
    validateToken(router);
  }, [router]);
  return (
    <UserRoleProvider>
    <div><Navbar/>
    {children}
    </div>
    </UserRoleProvider>
  )
}

export default layout