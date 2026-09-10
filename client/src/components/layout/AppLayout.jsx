import React from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-pure-white text-carbon-ink">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 max-w-[1200px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
