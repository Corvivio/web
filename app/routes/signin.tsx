import { SignIn } from "@clerk/react-router"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignIn
        routing="path"
        path="/signin"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
        appearance={{ variables: { colorPrimary: "oklch(0.553 0.195 38.402)" } }}
      />
    </div>
  )
}
