import { AppLang } from '../types';

type Dict = Record<string, string>;

const I18N: Record<AppLang, Dict> = {
  'en-US': {
    notes:'Notes', vault:'Vault', newNote:'New Note', addCredential:'Add Credential', credentialVault:'Credential Vault',
    all:'All', general:'General', work:'Work', personal:'Personal', ideas:'Ideas', important:'Important',
    creds:'Creds', selectOrCreate:'Select a note or create a new one', startWriting:'Start writing...', untitledNote:'Untitled note',
    settings:'Settings', newPin:'New PIN (4-8 digits)', confirmPin:'Confirm PIN', appLanguage:'Application Language',
    backup:'Backup — export all data as JSON', restore:'Restore — import from backup', downloadBackup:'Download Backup',
    importBackup:'Import Backup File', close:'Close', savePin:'Save PIN', type:'Type', nameTitle:'Name / Title', noteLabel:'Notes',
    cancel:'Cancel', saveCredential:'Save Credential', addCredentialTitle:'Add Credential', editCredentialTitle:'Edit Credential',
    rename:'Rename', duplicate:'Duplicate', exportPdf:'Export as PDF', deleteNote:'Delete Note', noNotes:'No notes found',
    noCredentials:'No credentials found', openNoteFirst:'Open a note first', incorrectPin:'Incorrect PIN',
    pinMin:'PIN must be at least 4 digits', pinMismatch:'PINs do not match', pinUpdated:'PIN updated successfully',
    noteDeleted:'Note deleted', noteDuplicated:'Note duplicated', credentialSaved:'Credential saved', credentialDeleted:'Credential deleted',
    copied:'Copied to clipboard', nothingToCopy:'Nothing to copy', backupDownloaded:'Backup downloaded', importSuccess:'Import successful',
    invalidBackup:'Invalid backup file', saved:'Saved', deleteThisNote:'Delete this note permanently?', deleteThisNoteShort:'Delete this note?',
    deleteThisCred:'Delete this credential?', enterUrl:'Enter URL:', rows:'Rows:', columns:'Columns:',
    importConfirm:'Import {notes} notes and {creds} credentials? New items will be merged with existing data.',
    languageUpdated:'Language updated', enterName:'Please enter a name', downloadFile:'Download File'
  },
  'bn-BD': {
    notes:'নোট', vault:'ভল্ট', newNote:'নতুন নোট', addCredential:'ক্রেডেনশিয়াল যোগ করুন', credentialVault:'ক্রেডেনশিয়াল ভল্ট',
    all:'সব', general:'জেনারেল', work:'কাজ', personal:'ব্যক্তিগত', ideas:'আইডিয়া', important:'গুরুত্বপূর্ণ',
    creds:'ক্রেডস', selectOrCreate:'একটি নোট নির্বাচন করুন বা নতুন নোট তৈরি করুন', startWriting:'লেখা শুরু করুন...', untitledNote:'শিরোনামহীন নোট',
    settings:'সেটিংস', newPin:'নতুন PIN (৪-৮ সংখ্যা)', confirmPin:'PIN নিশ্চিত করুন', appLanguage:'অ্যাপের ভাষা',
    backup:'ব্যাকআপ', restore:'রিস্টোর', downloadBackup:'ব্যাকআপ ডাউনলোড', importBackup:'ব্যাকআপ ফাইল ইমপোর্ট',
    close:'বন্ধ', savePin:'PIN সেভ', type:'ধরন', nameTitle:'নাম / শিরোনাম', noteLabel:'নোট',
    cancel:'বাতিল', saveCredential:'ক্রেডেনশিয়াল সেভ', addCredentialTitle:'ক্রেডেনশিয়াল যোগ করুন', editCredentialTitle:'ক্রেডেনশিয়াল সম্পাদনা',
    rename:'নাম পরিবর্তন', duplicate:'কপি তৈরি', exportPdf:'PDF এক্সপোর্ট', deleteNote:'নোট মুছুন', noNotes:'কোনো নোট পাওয়া যায়নি',
    noCredentials:'কোনো ক্রেডেনশিয়াল পাওয়া যায়নি', openNoteFirst:'আগে একটি নোট খুলুন', incorrectPin:'ভুল PIN',
    pinMin:'PIN কমপক্ষে ৪ সংখ্যা হতে হবে', pinMismatch:'PIN মিলছে না', pinUpdated:'PIN সফলভাবে আপডেট হয়েছে',
    noteDeleted:'নোট মুছে ফেলা হয়েছে', noteDuplicated:'নোট কপি করা হয়েছে', credentialSaved:'ক্রেডেনশিয়াল সেভ হয়েছে', credentialDeleted:'ক্রেডেনশিয়াল মুছে ফেলা হয়েছে',
    copied:'ক্লিপবোর্ডে কপি হয়েছে', nothingToCopy:'কপি করার কিছু নেই', backupDownloaded:'ব্যাকআপ ডাউনলোড হয়েছে', importSuccess:'ইমপোর্ট সফল',
    invalidBackup:'ব্যাকআপ ফাইল সঠিক নয়', saved:'সেভ হয়েছে', deleteThisNote:'এই নোট স্থায়ীভাবে মুছবেন?', deleteThisNoteShort:'এই নোট মুছবেন?',
    deleteThisCred:'এই ক্রেডেনশিয়াল মুছবেন?', enterUrl:'URL দিন:', rows:'সারি:', columns:'কলাম:',
    importConfirm:'{notes}টি নোট এবং {creds}টি ক্রেডেনশিয়াল ইমপোর্ট করবেন?',
    languageUpdated:'ভাষা আপডেট হয়েছে', enterName:'একটি নাম লিখুন', downloadFile:'ফাইল ডাউনলোড'
  },
  'hi-IN': {
    notes:'नोट्स', vault:'वॉल्ट', newNote:'नया नोट', addCredential:'क्रेडेंशियल जोड़ें', credentialVault:'क्रेडेंशियल वॉल्ट',
    all:'सभी', general:'जनरल', work:'काम', personal:'व्यक्तिगत', ideas:'आइडियाज', important:'महत्वपूर्ण',
    creds:'क्रेड्स', selectOrCreate:'नोट चुनें या नया नोट बनाएं', startWriting:'लिखना शुरू करें...', untitledNote:'बिना शीर्षक नोट',
    settings:'सेटिंग्स', newPin:'नया PIN (4-8 अंक)', confirmPin:'PIN पुष्टि करें', appLanguage:'ऐप भाषा',
    backup:'बैकअप', restore:'रिस्टोर', downloadBackup:'बैकअप डाउनलोड', importBackup:'बैकअप फ़ाइल इम्पोर्ट',
    close:'बंद करें', savePin:'PIN सेव करें', type:'टाइप', nameTitle:'नाम / शीर्षक', noteLabel:'नोट्स',
    cancel:'रद्द करें', saveCredential:'क्रेडेंशियल सेव करें', addCredentialTitle:'क्रेडेंशियल जोड़ें', editCredentialTitle:'क्रेडेंशियल संपादित करें',
    rename:'रीनेम', duplicate:'डुप्लीकेट', exportPdf:'PDF एक्सपोर्ट', deleteNote:'नोट हटाएं', noNotes:'कोई नोट नहीं मिला',
    noCredentials:'कोई क्रेडेंशियल नहीं मिला', openNoteFirst:'पहले एक नोट खोलें', incorrectPin:'गलत PIN',
    pinMin:'PIN कम से कम 4 अंक का होना चाहिए', pinMismatch:'PIN मेल नहीं खा रहे', pinUpdated:'PIN अपडेट हुआ',
    noteDeleted:'नोट हटाया गया', noteDuplicated:'नोट डुप्लीकेट किया गया', credentialSaved:'क्रेडेंशियल सेव हुआ', credentialDeleted:'क्रेडेंशियल हटाया गया',
    copied:'क्लिपबोर्ड पर कॉपी किया गया', nothingToCopy:'कॉपी करने के लिए कुछ नहीं', backupDownloaded:'बैकअप डाउनलोड हुआ', importSuccess:'इम्पोर्ट सफल',
    invalidBackup:'अमान्य बैकअप फ़ाइल', saved:'सेव हुआ', deleteThisNote:'इस नोट को हमेशा के लिए हटाना है?', deleteThisNoteShort:'इस नोट को हटाना है?',
    deleteThisCred:'इस क्रेडेंशियल को हटाना है?', enterUrl:'URL दर्ज करें:', rows:'पंक्तियाँ:', columns:'कॉलम:',
    importConfirm:'{notes} नोट्स और {creds} क्रेडेंशियल इम्पोर्ट करें?',
    languageUpdated:'भाषा अपडेट हो गई', enterName:'कृपया नाम दर्ज करें', downloadFile:'फ़ाइल डाउनलोड करें'
  },
  'es-ES': {
    notes:'Notas', vault:'Boveda', newNote:'Nueva nota', addCredential:'Agregar credencial', credentialVault:'Boveda de credenciales',
    all:'Todas', general:'General', work:'Trabajo', personal:'Personal', ideas:'Ideas', important:'Importante',
    creds:'Creds', selectOrCreate:'Selecciona una nota o crea una nueva', startWriting:'Empieza a escribir...', untitledNote:'Nota sin titulo',
    settings:'Configuracion', newPin:'Nuevo PIN (4-8 digitos)', confirmPin:'Confirmar PIN', appLanguage:'Idioma de la aplicacion',
    backup:'Respaldo', restore:'Restaurar', downloadBackup:'Descargar respaldo', importBackup:'Importar archivo de respaldo',
    close:'Cerrar', savePin:'Guardar PIN', type:'Tipo', nameTitle:'Nombre / Titulo', noteLabel:'Notas',
    cancel:'Cancelar', saveCredential:'Guardar credencial', addCredentialTitle:'Agregar credencial', editCredentialTitle:'Editar credencial',
    rename:'Renombrar', duplicate:'Duplicar', exportPdf:'Exportar a PDF', deleteNote:'Eliminar nota', noNotes:'No se encontraron notas',
    noCredentials:'No se encontraron credenciales', openNoteFirst:'Primero abre una nota', incorrectPin:'PIN incorrecto',
    pinMin:'El PIN debe tener al menos 4 digitos', pinMismatch:'Los PIN no coinciden', pinUpdated:'PIN actualizado',
    noteDeleted:'Nota eliminada', noteDuplicated:'Nota duplicada', credentialSaved:'Credencial guardada', credentialDeleted:'Credencial eliminada',
    copied:'Copiado al portapapeles', nothingToCopy:'Nada para copiar', backupDownloaded:'Respaldo descargado', importSuccess:'Importacion exitosa',
    invalidBackup:'Archivo de respaldo invalido', saved:'Guardado', deleteThisNote:'Eliminar esta nota permanentemente?', deleteThisNoteShort:'Eliminar esta nota?',
    deleteThisCred:'Eliminar esta credencial?', enterUrl:'Ingresa URL:', rows:'Filas:', columns:'Columnas:',
    importConfirm:'Importar {notes} notas y {creds} credenciales?',
    languageUpdated:'Idioma actualizado', enterName:'Ingresa un nombre', downloadFile:'Descargar archivo'
  }
};

export function t(lang: AppLang, key: string, vars: Record<string, string | number> = {}): string {
  const dict = I18N[lang] || I18N['en-US'];
  let str = dict[key] || I18N['en-US'][key] || key;
  Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, String(vars[k])); });
  return str;
}

export { I18N };
