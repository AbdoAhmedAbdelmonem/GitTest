import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

let driveClient: any = null;

export const getDriveClient = async () => {
  try {
    // Return cached client if already initialized
    if (driveClient) {
      return driveClient;
    }
    
    console.log("Initializing Google Drive client...");
    
    // Check if service account file exists
    const keyFilePath = path.join(process.cwd(), 'service-account-key.json');
    
    if (!fs.existsSync(keyFilePath)) {
      throw new Error(`Service account key file not found at: ${keyFilePath}`);
    }
    
    try {
      // Load the service account key JSON file
      const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
      const credentials = JSON.parse(keyFileContent);
      
      // Create a JWT client using the service account
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
      
      // Create and cache the Drive client
      driveClient = google.drive({ version: 'v3', auth });
      console.log("Google Drive client initialized successfully");
      
      return driveClient;
    } catch (err: any) {
      console.error("Error initializing Google Drive client:", err.message);
      throw new Error(`Failed to initialize Drive client: ${err.message}`);
    }
  } catch (error: any) {
    console.error("Error in getDriveClient:", error);
    throw error;
  }
};