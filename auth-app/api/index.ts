// api/index.ts
import app from '../src/server';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}
