import React from 'react'
import { Outlet } from 'react-router'
import { Header } from '~/components/Header'

type Props = {}

function RootLayout({}: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans text-gray-900">
        <Header />
        <Outlet />

    </div>
  )
}

export default RootLayout