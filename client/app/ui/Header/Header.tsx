"use client"
import React from 'react'
import logo from '../../public/logo.svg'
import Image from "next/image";
import {  UserButton } from '@clerk/nextjs'
const Header = () => {
  return (
    <div>
       <div className="w-full py-4 sticky top-0 z-10 ">
              <div className="flex items-center justify-between">
                <Image src={logo} alt="Logo" />
                <UserButton afterSignOutUrl='/'  />
              </div>
             
            </div>
    </div>
  )
}

export default Header
