export const CREATELOGBOOK = 'CREATELOGBOOK';

export const CreateLogbookData = (content) => ({
    type: CREATELOGBOOK,
    data: content,
  });