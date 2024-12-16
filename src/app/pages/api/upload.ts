/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
// pages/api/upload.ts
import { createRouter } from 'next-connect';
import multer from 'multer';
import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

// Multer configuration for handling file uploads
const upload = multer();

// Create router for handling API routes
const handler = createRouter<NextApiRequest, NextApiResponse>();

// Use multer middleware for file upload
handler.use((req, res, next) => {
  upload.single('file')(req as any, res, next);
});

handler.post(async (req, res) => {
  const form = new IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing form data' });
    }

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Type assertion for Multer file
    const file = files.file[0] as unknown as Express.Multer.File;

    const fs = require('fs');
    fs.readFile(file.path, 'utf8', (err: Error, data: string) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading file' });
      }
      
      res.json({ text: data });
    });
  });
});

export default handler.handler();
export const config = {
  api: {
    bodyParser: false,
  },
};