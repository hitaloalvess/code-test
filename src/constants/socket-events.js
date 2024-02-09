
export const socketEvents = {
  TELEMETRY: (mac, userId) => `hardware/update/telemetry/${mac}/${userId}`,
}
