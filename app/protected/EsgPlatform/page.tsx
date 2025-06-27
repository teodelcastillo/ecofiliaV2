import React from 'react'
import PlatformESG from './components/page'
import { requireUserWithAdminStatus } from '@/lib/requireAdmin'
import { ReportsComingSoonOverlay } from '../reports-for-working/components/reports-coming-soon-overlay'

const page = async () => {
    
const { user, isAdmin } = await requireUserWithAdminStatus()
    
if (!user) {
    return (
        <div className="text-center py-16">
            <p className="text-lg">Debes iniciar sesión para acceder a esta sección.</p>
        </div>
    )
}
    
if (!isAdmin) {
    return (
      <ReportsComingSoonOverlay />
    )
}
  return (
    <PlatformESG />
  )
}

export default page