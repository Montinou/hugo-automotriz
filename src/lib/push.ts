import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:soporte@hugoautomotriz.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

export async function sendPushNotification(
  subscription: string,
  payload: PushPayload
): Promise<boolean> {
  try {
    const pushSubscription = JSON.parse(subscription);
    await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("Push notification failed:", error);
    return false;
  }
}
