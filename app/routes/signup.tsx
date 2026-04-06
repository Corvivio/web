import { SignUp } from "@clerk/react-router"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/signin"
        fallbackRedirectUrl="/"
        appearance={{ variables: { colorPrimary: "oklch(0.553 0.195 38.402)" } }}
      />
    </div>
  )
}
