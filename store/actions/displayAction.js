export const DISPLAY = 'DISPLAY';
export const AIRLINE = 'AIRLINE';

export const DisplayData = (content) => ({
    type: DISPLAY,
    data: content,
  });
export const ProfileData = (content) => ({
    type: AIRLINE,
    data: content,
  });