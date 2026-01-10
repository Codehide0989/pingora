export const notifications = [
  {
    id: 1,
    name: "Email",
    provider: "email",
    value: "max@pingora.dev",
  },
];

export type Notification = (typeof notifications)[number];
