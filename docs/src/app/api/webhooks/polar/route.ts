import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('polar-signature');
    
    // TODO: Verify webhook signature with Polar.sh
    // This is important for security to ensure the webhook is actually from Polar.sh
    
    const event = JSON.parse(body);
    
    console.log('Polar.sh webhook received:', event.type);
    
    switch (event.type) {
      case 'subscription.created':
        // Handle new subscription
        console.log('New subscription created:', event.data);
        break;
        
      case 'subscription.updated':
        // Handle subscription update
        console.log('Subscription updated:', event.data);
        break;
        
      case 'subscription.canceled':
        // Handle subscription cancellation
        console.log('Subscription canceled:', event.data);
        break;
        
      case 'subscription.expired':
        // Handle subscription expiration
        console.log('Subscription expired:', event.data);
        break;
        
      default:
        console.log('Unhandled webhook event type:', event.type);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Polar.sh webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
