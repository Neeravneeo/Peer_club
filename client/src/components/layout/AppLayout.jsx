import React from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { BottomTabBar } from './BottomTabBar'

export function AppLayout() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0c0d12] text-[#f7f8f8] selection:bg-[#7952f5]/30 selection:text-white flex flex-col antialiased">
      <TopNav />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-5 md:p-6 lg:p-7 overflow-y-auto w-full max-w-[1600px]">
          <Outlet />
        </main>
      </div>
      <BottomTabBar />
    </div>
  )
}
