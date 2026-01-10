import { FormDiscord } from "@/components/forms/notifications/form-discord";
import { FormEmail } from "@/components/forms/notifications/form-email";
import { FormGoogleChat } from "@/components/forms/notifications/form-google-chat";
import { FormNtfy } from "@/components/forms/notifications/form-ntfy";
import { FormOpsGenie } from "@/components/forms/notifications/form-opsgenie";
import { FormPagerDuty } from "@/components/forms/notifications/form-pagerduty";
import { FormSlack } from "@/components/forms/notifications/form-slack";
import { FormSms } from "@/components/forms/notifications/form-sms";
import { FormTelegram } from "@/components/forms/notifications/form-telegram";
import { FormWebhook } from "@/components/forms/notifications/form-webhook";
import { FormWhatsApp } from "@/components/forms/notifications/form-whatsapp";
import {
  DiscordIcon,
  GoogleIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@pingora/icons";
import { OpsGenieIcon } from "@pingora/icons";
import { PagerDutyIcon } from "@pingora/icons";
import { SlackIcon } from "@pingora/icons";
import { sendTestDiscordMessage as sendTestDiscord } from "@pingora/notification-discord";
import { sendTest as sendTestNtfy } from "@pingora/notification-ntfy";
import { sendTest as sendTestOpsGenie } from "@pingora/notification-opsgenie";
import { sendTest as sendTestPagerDuty } from "@pingora/notification-pagerduty";
import { sendTestSlackMessage as sendTestSlack } from "@pingora/notification-slack";
import { sendTest as sendTestTelegram } from "@pingora/notification-telegram";
import { sendTest as sendWhatsAppTest } from "@pingora/notification-twillio-whatsapp";
import { sendTest as sendTestWebhook } from "@pingora/notification-webhook";
import {
  BellIcon,
  Cog,
  Mail,
  MessageCircle,
  Trash2,
  Webhook,
} from "lucide-react";

export const actions = [
  {
    id: "edit",
    label: "Settings",
    icon: Cog,
    variant: "default" as const,
  },
  {
    id: "delete",
    label: "Delete",
    icon: Trash2,
    variant: "destructive" as const,
  },
] as const;

export type NotifierAction = (typeof actions)[number];

export const getActions = (
  props: Partial<Record<NotifierAction["id"], () => Promise<void> | void>>,
): (NotifierAction & { onClick?: () => Promise<void> | void })[] => {
  return actions.map((action) => ({
    ...action,
    onClick: props[action.id as keyof typeof props],
  }));
};

// List of the notifiers

export const config = {
  slack: {
    icon: SlackIcon,
    label: "Slack",
    form: FormSlack,
    sendTest: sendTestSlack,
  },
  discord: {
    icon: DiscordIcon,
    label: "Discord",
    form: FormDiscord,
    sendTest: sendTestDiscord,
  },
  email: {
    icon: Mail,
    label: "Email",
    form: FormEmail,
    // TODO: add sendTest
    sendTest: undefined,
  },
  sms: {
    icon: MessageCircle,
    label: "SMS",
    form: FormSms,
    // TODO: add sendTest
    sendTest: undefined,
  },
  webhook: {
    icon: Webhook,
    label: "Webhook",
    form: FormWebhook,
    sendTest: sendTestWebhook,
  },
  opsgenie: {
    icon: OpsGenieIcon,
    label: "OpsGenie",
    form: FormOpsGenie,
    sendTest: sendTestOpsGenie,
  },
  "google-chat": {
    icon: GoogleIcon,
    label: "Google Chat",
    form: FormGoogleChat,
    sendTest: sendTestWebhook,
  },
  pagerduty: {
    icon: PagerDutyIcon,
    label: "PagerDuty",
    form: FormPagerDuty,
    sendTest: sendTestPagerDuty,
  },
  ntfy: {
    icon: BellIcon, // TODO: add svg icon
    label: "Ntfy",
    form: FormNtfy,
    sendTest: sendTestNtfy,
  },
  telegram: {
    icon: TelegramIcon,
    label: "Telegram",
    form: FormTelegram,
    sendTest: sendTestTelegram,
  },
  whatsapp: {
    icon: WhatsappIcon,
    label: "WhatsApp",
    form: FormWhatsApp,
    sendTest: sendWhatsAppTest,
  },
};

export type NotifierProvider = keyof typeof config;
