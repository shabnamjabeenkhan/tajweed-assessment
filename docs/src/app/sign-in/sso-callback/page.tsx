import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-fd-background p-4">
      <div className="w-full max-w-md">
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
