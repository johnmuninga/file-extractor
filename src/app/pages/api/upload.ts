import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(400).json({ error: `Formidable error: ${err.message}` });
      }

      if (!files.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('Files received:', files);

      const file = files.file[0];

      try {
        console.log('Reading file:', file.filepath);
        const data = await fs.readFile(file.filepath, 'utf8');
        res.status(200).json({ text: data });
      } catch (readErr) {
        console.error('Error reading file:', readErr);
        res.status(500).json({ error: `Error reading file: ${readErr.message}` });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
