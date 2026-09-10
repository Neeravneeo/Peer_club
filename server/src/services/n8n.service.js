import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const N8N_BASE_URL = process.env.N8N_WEBHOOK_BASE_URL || 'http://localhost:5678/webhook';
const N8N_SECRET = process.env.N8N_WEBHOOK_SECRET || 'peer_club_n8n_secret_token_123';

/**
 * Dispatches an event payload asynchronously to n8n webhooks.
 * Safe and non-blocking: network or timeout errors are logged and will not break user flow.
 */
export async function triggerN8nWebhook(eventType, payloadData, userContext) {
  const payload = {
    eventType,
    timestamp: new Date().toISOString(),
    userId: userContext?.id,
    userEmail: userContext?.email,
    userName: userContext?.name,
    data: payloadData,
  };

  // Asynchronous non-blocking dispatch
  try {
    const webhookUrl = `${N8N_BASE_URL.replace(/\/+$/, '')}/${eventType.replace('.', '-')}`;

    axios
      .post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-Secret': N8N_SECRET,
        },
        timeout: 4000,
      })
      .then((res) => {
        console.log(`[n8n] Successfully dispatched '${eventType}' webhook (status: ${res.status})`);
      })
      .catch((err) => {
        console.warn(`[n8n] Webhook '${eventType}' dispatch failed: ${err.message}`);
      });
  } catch (err) {
    console.warn(`[n8n] Error initiating webhook '${eventType}':`, err.message);
  }
}
