// ========================
// 🔧 KAIZEN CONFIGURATION
// ========================
// 
// ⚠️  IMPORTANT: Configure this file FIRST before running the app!
//
// This file controls which features are enabled in your application.
// Choose the features you want, then follow the setup guide for those features only.
//
//
// 🚀 Want to see all examples?
//    Check out config.example.ts for pre-made configurations:
//    - Full SaaS Config (all features)
//    - Frontend Only Config (static site)
//    - Auth Only Config (user management)
//    - Payments Only Config (billing without auth)
//    - Static Config (no dynamic features)
//
// 💡 Pro tip: Start simple and add features as you need them!

export interface AppConfig {
  features: {
    auth: boolean;        // Enable Authentication
    payments: boolean;    // Enable Billing  
    convex: boolean;      // Enable Convex
    email: boolean;       // Enable Email
    monitoring: boolean;  // Enable Monitoring
  };
  services: {
    betterAuth: { enabled: false, mode: "b2c" },
    clerk?: {
      enabled: boolean;
      publishableKey?: string;
      secretKey?: string;
    };
    polar?: {
      enabled: boolean;
      accessToken?: string;
      organizationId?: string;
      webhookSecret?: string;
    };
    convex?: {
      enabled: boolean;
      deployment?: string;
      url?: string;
    };
    stripe?: {
      enabled: boolean;
      apiKey?: string;
      webhookSecret?: string;
    };
    resend?: {
      enabled: boolean;
      apiKey?: string;
      webhookSecret?: string;
    };
    openai?: {
      enabled: boolean;
      apiKey?: string;
    };
    sentry?: {
      enabled: boolean;
      dsn?: string;
      tracesSampleRate?: number;
      environment?: string;
      // Note: For Convex backend errors, use built-in exception reporting via Dashboard
      // See: https://docs.convex.dev/production/integrations/exception-reporting
    };
    openstatus?: {
      enabled: boolean;
      apiKey?: string;
      projectId?: string;
      webhookUrl?: string;
    };
  };
  ui: {
    showPricing: boolean;   // Show pricing page and components
    showDashboard: boolean; // Show dashboard routes  
    showChat: boolean;      // Show AI chat functionality
    showAuth: boolean;      // Show login/signup buttons
  };
}

// ========================
// 🌐 ENV VARIABLE HELPER
// ========================
// Access env vars safely in both Node (process.env) and browser (import.meta.env)
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key] !== undefined) {
    return (import.meta as any).env[key] as string;
  }
  return undefined;
};

// ========================
// 🎯 YOUR CONFIGURATION
// ========================
// Edit these values to enable/disable features:

export const config: AppConfig = {
  features: {
    auth: true,         // Enable/disable Authentication
    payments: true,    // Enable/disable Billing
    convex: true,       // Enable/disable Convex
    email: false,      // Enable/disable Email
    monitoring: false,  // Enable/disable Monitoring
  },
  services: {
    betterAuth: {
      enabled: false,
      mode: "b2c",
    },
    clerk: {
      enabled: true,
      publishableKey: getEnvVar('VITE_CLERK_PUBLISHABLE_KEY'),
      secretKey: getEnvVar('CLERK_SECRET_KEY'),
    },
    polar: {
      enabled: false,
      accessToken: getEnvVar('POLAR_ACCESS_TOKEN'),
      organizationId: getEnvVar('POLAR_ORGANIZATION_ID'),
      webhookSecret: getEnvVar('POLAR_WEBHOOK_SECRET'),
    },
    convex: {
      enabled: true,
      deployment: getEnvVar('CONVEX_DEPLOYMENT'),
      url: getEnvVar('VITE_CONVEX_URL'),
    },
    stripe: {
      enabled: false,
      apiKey: getEnvVar('STRIPE_API_KEY'),
      webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
    },
    resend: {
      enabled: false,
      apiKey: getEnvVar('RESEND_API_KEY'),
      webhookSecret: getEnvVar('RESEND_WEBHOOK_SECRET'),
    },
    openai: {
      enabled: false,
      apiKey: getEnvVar('OPENAI_API_KEY'),
    },
    sentry: {
      enabled: false,
      dsn: getEnvVar('VITE_SENTRY_DSN') || getEnvVar('SENTRY_DSN'),
      tracesSampleRate: 0.2,
      environment: getEnvVar('SENTRY_ENVIRONMENT'),
    },
    openstatus: {
      enabled: false,
      apiKey: getEnvVar('OPENSTATUS_API_KEY'),
      projectId: getEnvVar('OPENSTATUS_PROJECT_ID'),
      webhookUrl: getEnvVar('OPENSTATUS_WEBHOOK_URL'),
    },
  },
  ui: {
    showAuth: true,       // Show sign-in/sign-up routes
    showPricing: true,    // Show pricing page and components
    showDashboard: true,  // Show dashboard routes
    showChat: true,       // Show AI chat functionality
  },
};

// Helper functions to check feature availability
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature] === true;
};

export const isServiceEnabled = (service: keyof AppConfig['services']): boolean => {
  return config.services[service]?.enabled === true;
};

export const getServiceConfig = <T extends keyof AppConfig['services']>(
  service: T
): AppConfig['services'][T] => {
  return config.services[service];
};

// Validation function to check if required env vars are present for enabled features
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const isServer = typeof window === 'undefined';

  if (isFeatureEnabled('auth') && isServiceEnabled('clerk')) {
    if (!config.services.clerk?.publishableKey) {
      errors.push('VITE_CLERK_PUBLISHABLE_KEY is required when auth is enabled');
    }
    // Only validate server-side secrets on the server
    if (isServer && !config.services.clerk?.secretKey) {
      errors.push('CLERK_SECRET_KEY is required when auth is enabled');
    }
  }

  if (isFeatureEnabled('convex') && isServiceEnabled('convex')) {
    // Only validate server-side deployment on the server
    if (isServer && !config.services.convex?.deployment) {
      errors.push('CONVEX_DEPLOYMENT is required when convex is enabled');
    }
    if (!config.services.convex?.url) {
      errors.push('VITE_CONVEX_URL is required when convex is enabled');
    }
  }

  if (isFeatureEnabled('monitoring') && isServiceEnabled('sentry')) {
    if (!config.services.sentry?.dsn) {
      errors.push('SENTRY_DSN is required when monitoring is enabled');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Environment-specific configs
const NODE_ENV = getEnvVar('NODE_ENV') || 'development';
export const isDevelopment = NODE_ENV === 'development';
export const isProduction = NODE_ENV === 'production';

// Function to sync configuration with environment variables for Convex
export const syncConfigWithEnv = () => {
  // Set environment variables that Convex files expect
  if (typeof process !== 'undefined' && process.env) {
    // Sync feature flags to environment variables for Convex
    process.env.PAYMENTS_ENABLED = isFeatureEnabled('payments') ? 'true' : 'false';
    process.env.EMAIL_ENABLED = isFeatureEnabled('email') ? 'true' : 'false';
    process.env.AUTH_ENABLED = isFeatureEnabled('auth') ? 'true' : 'false';
    process.env.CONVEX_ENABLED = isFeatureEnabled('convex') ? 'true' : 'false';
    process.env.MONITORING_ENABLED = isFeatureEnabled('monitoring') ? 'true' : 'false';
    
    // Also sync service-specific flags
    process.env.CLERK_ENABLED = isServiceEnabled('clerk') ? 'true' : 'false';
    process.env.POLAR_ENABLED = isServiceEnabled('polar') ? 'true' : 'false';
    process.env.RESEND_ENABLED = isServiceEnabled('resend') ? 'true' : 'false';
    process.env.OPENAI_ENABLED = isServiceEnabled('openai') ? 'true' : 'false';
    process.env.SENTRY_ENABLED = isServiceEnabled('sentry') ? 'true' : 'false';
    process.env.OPENSTATUS_ENABLED = isServiceEnabled('openstatus') ? 'true' : 'false';
    
    if (isDevelopment) {
      console.log('🔄 Synced configuration with environment variables');
    }
  }
};

// Runtime config validation (run this in your app startup)
export const initializeConfig = () => {
  // Sync configuration with environment variables first
  syncConfigWithEnv();
  
  const validation = validateConfig();
  
  if (!validation.valid) {
    console.warn('⚠️  Configuration validation failed:');
    validation.errors.forEach(error => console.warn(`   - ${error}`));
    
    if (isProduction) {
      throw new Error('Invalid configuration for production environment');
    }
  }

  // Log enabled features in development (deferred to avoid blocking)
  if (isDevelopment) {
    // Use setTimeout to avoid blocking initial render
    setTimeout(() => {
      console.log('🔧 App Configuration:');
      console.log('   Features:', Object.entries(config.features)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name)
        .join(', ') || 'None');
      console.log('   Services:', Object.entries(config.services)
        .filter(([, service]) => service?.enabled)
        .map(([name]) => name)
        .join(', ') || 'None');
        
      // Log Sentry configuration details
      if (isServiceEnabled('sentry')) {
        const sentryConfig = getServiceConfig('sentry');
        console.log('📊 Sentry Configuration:');
        console.log(`   Frontend: ${sentryConfig?.dsn ? '✅ Enabled' : '❌ No DSN'}`);
        console.log(`   Convex Backend: Use built-in exception reporting via Dashboard`);
        console.log(`   Guide: https://docs.convex.dev/production/integrations/exception-reporting`);
      }
    }, 0);
  }
};

export default config;