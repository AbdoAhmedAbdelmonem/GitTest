export interface GoogleDriveAuth {
  access_token: string
  expires_at: number
}

export declare function getGoogleDriveAccessToken(): Promise<string>;
export declare function uploadFileToDrive(file: File, parentId: string): Promise<any>;
export declare function deleteFileFromDrive(fileId: string): Promise<any>;
export declare function renameFileInDrive(fileId: string, newName: string): Promise<any>;