import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-fd-background p-4">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            baseTheme: dark,
          }}
        />
      </div>
    </div>
  );
}
