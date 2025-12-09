import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/react-router";

export default function DebugAuth() {
  const { getToken, isSignedIn } = useAuth();
  const debugInfo = useQuery(api.users.debugAuthConfig);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0a0a0a', color: '#fff' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Authentication Debug Info</h1>
        
        <div className="space-y-4">
          <div className="bg-neutral-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Clerk Status</h2>
            <p>Signed In: {isSignedIn ? "✅ Yes" : "❌ No"}</p>
            {isSignedIn && getToken && (
              <TokenInfo getToken={getToken} />
            )}
          </div>

          {debugInfo === undefined ? (
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p>Loading debug info...</p>
            </div>
          ) : debugInfo === null ? (
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500">
              <p className="text-red-400">❌ Could not load debug info. Check console for errors.</p>
            </div>
          ) : (
            <>
              <div className="bg-neutral-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Convex Authentication Status</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Has Identity:</strong>{" "}
                    {debugInfo.hasIdentity ? (
                      <span className="text-green-400">✅ Yes</span>
                    ) : (
                      <span className="text-red-400">❌ No</span>
                    )}
                  </p>
                  <p>
                    <strong>Token Issuer:</strong>{" "}
                    <code className="bg-neutral-900 px-2 py-1 rounded">
                      {debugInfo.identityIssuer || "N/A"}
                    </code>
                  </p>
                  <p>
                    <strong>Configured Domain (Env Var):</strong>{" "}
                    <code className="bg-neutral-900 px-2 py-1 rounded">
                      {debugInfo.envVar}
                    </code>
                  </p>
                  <p>
                    <strong>Issuer Matches Env Var:</strong>{" "}
                    {debugInfo.issuerMatchesEnvVar ? (
                      <span className="text-green-400">✅ Yes</span>
                    ) : (
                      <span className="text-red-400">❌ No</span>
                    )}
                  </p>
                  <p>
                    <strong>Expected Domain:</strong>{" "}
                    <code className="bg-neutral-900 px-2 py-1 rounded">
                      {debugInfo.expectedDomain}
                    </code>
                  </p>
                </div>
              </div>

              {!debugInfo.hasIdentity && (
                <div className="bg-red-900/20 p-4 rounded-lg border border-red-500">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">❌ Problem Detected</h3>
                  <p className="mb-2">No identity found. This usually means:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Clerk JWT token is not being passed to Convex</li>
                    <li>Convex auth.config.ts domain doesn't match Clerk issuer URL</li>
                    <li>VITE_CLERK_FRONTEND_API_URL env var not set in Convex Dashboard</li>
                  </ul>
                  <p className="mt-2 text-sm">
                    Check Convex Production logs for <code>[auth.config.ts]</code> messages to see what domain is configured.
                  </p>
                </div>
              )}

              {debugInfo.hasIdentity && !debugInfo.issuerMatchesEnvVar && (
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">⚠️ Issuer Mismatch</h3>
                  <p className="mb-2">The token issuer doesn't match the configured domain:</p>
                  <div className="space-y-1 ml-4">
                    <p>
                      <strong>Token Issuer:</strong> <code>{debugInfo.identityIssuer}</code>
                    </p>
                    <p>
                      <strong>Configured Domain:</strong> <code>{debugInfo.envVar}</code>
                    </p>
                  </div>
                  <p className="mt-2 text-sm">
                    These must match <strong>EXACTLY</strong> (including protocol: https://).
                    Update <code>VITE_CLERK_FRONTEND_API_URL</code> in Convex Production Dashboard to match the token issuer.
                  </p>
                </div>
              )}

              {debugInfo.hasIdentity && debugInfo.issuerMatchesEnvVar && (
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-500">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Everything Looks Good!</h3>
                  <p>Issuer matches configured domain. If you're still experiencing issues, check:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>JWT template has <code>aud: "convex"</code> claim</li>
                    <li>Token lifetime is sufficient (not expired)</li>
                    <li>ConvexProviderWithClerk is passing tokens correctly</li>
                  </ul>
                </div>
              )}

              <div className="bg-neutral-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Raw Debug Data</h2>
                <pre className="bg-neutral-900 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-sm text-neutral-400">
          <p>💡 <strong>Tip:</strong> Share this page URL with developers for debugging.</p>
          <p>🔒 <strong>Security:</strong> Delete this route after debugging is complete.</p>
        </div>
      </div>
    </div>
  );
}

function TokenInfo({ getToken }: { getToken: (options?: { template?: string }) => Promise<string | null> }) {
  const [tokenInfo, setTokenInfo] = React.useState<{ length?: number; preview?: string } | null>(null);

  React.useEffect(() => {
    getToken({ template: "convex" })
      .then((token) => {
        if (token) {
          setTokenInfo({
            length: token.length,
            preview: token.substring(0, 50) + "...",
          });
        } else {
          setTokenInfo({ length: 0 });
        }
      })
      .catch((error) => {
        console.error("Error getting token:", error);
        setTokenInfo(null);
      });
  }, [getToken]);

  if (tokenInfo === null) {
    return <p>Loading token info...</p>;
  }

  if (tokenInfo.length === 0) {
    return <p className="text-red-400">❌ Token is null</p>;
  }

  return (
    <div>
      <p>Token Length: {tokenInfo.length} characters</p>
      <p>Token Preview: <code className="bg-neutral-900 px-2 py-1 rounded text-xs">{tokenInfo.preview}</code></p>
    </div>
  );
}

