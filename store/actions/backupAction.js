export const BACKUP = 'BACKUP';

export const BackupData = (content) => ({
    type: BACKUP,
    data: content,
  });