export interface Note {
  id: string;
  title: string;
  content: string;
  cat: string;
  created: string;
  updated: string;
}

export interface CredFields {
  [key: string]: string;
}

export interface Cred {
  id: string;
  name: string;
  type: string;
  fields: CredFields;
  notes: string;
  date: string;
}

export type AppTab = 'notes' | 'vault';
export type AppLang = 'en-US' | 'bn-BD' | 'hi-IN' | 'es-ES';

declare global {
  interface Window {
    electronAPI: {
      googleLogin: () => Promise<boolean>;
      googleLogout: () => Promise<boolean>;
      googleStatus: () => Promise<boolean>;
      googleBackup: (dataStr: string) => Promise<boolean>;
      googleRestore: () => Promise<string>;
    };
  }
}
