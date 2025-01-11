'use server'

import { signOut } from "next-auth/react"

export default async function logOutUser() {
    await signOut({callbackUrl: '/'});
}