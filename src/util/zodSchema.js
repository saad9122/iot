const DeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format'),
  location: z.string().optional(),
  description: z.string().optional(),
  setTemperature: z.number().optional(),
  reverseRelay: z.boolean().default(false),
});
