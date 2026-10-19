'use client'
import { useClerk, useUser } from "@clerk/nextjs"

//with Clerk
const Login = () => {
    const { openSignIn, signOut } = useClerk();
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) return null;

  return (
    <button onClick={() => (isSignedIn ? signOut() : openSignIn())}
            className="py-2 px-8 border-light-bg/60 cursor-pointer border rounded-full hover:border-light-bg hover:scale-110 duration-300">

            {isSignedIn ? "Logout" : "Login"}
      </button>
  )
}

export default Login