export const CRED_FIELDS: Record<string, {id: string; label: string; type: string; ph: string}[]> = {
  Website: [
    {id:'url', label:'URL', type:'text', ph:'https://example.com'},
    {id:'username', label:'Username / Email', type:'text', ph:'user@email.com'},
    {id:'password', label:'Password', type:'password', ph:'••••••••'},
  ],
  Social: [
    {id:'platform', label:'Platform', type:'text', ph:'Facebook, Instagram...'},
    {id:'username', label:'Username / Email', type:'text', ph:'user@email.com'},
    {id:'password', label:'Password', type:'password', ph:'••••••••'},
    {id:'phone', label:'Linked Phone', type:'text', ph:'+1 000 000 0000'},
  ],
  Email: [
    {id:'email', label:'Email Address', type:'text', ph:'user@gmail.com'},
    {id:'password', label:'Password', type:'password', ph:'••••••••'},
    {id:'imap', label:'IMAP Server', type:'text', ph:'imap.gmail.com'},
  ],
  Banking: [
    {id:'bank', label:'Bank Name', type:'text', ph:'Bank name'},
    {id:'accountNo', label:'Account Number', type:'text', ph:'0000000000'},
    {id:'routing', label:'Routing / Sort Code', type:'text', ph:'000000'},
    {id:'username', label:'Online Username', type:'text', ph:'username'},
    {id:'password', label:'Online Password', type:'password', ph:'••••••••'},
    {id:'pin', label:'ATM PIN', type:'password', ph:'••••'},
  ],
  Card: [
    {id:'cardName', label:'Card Name', type:'text', ph:'Visa Gold — HSBC'},
    {id:'cardNo', label:'Card Number', type:'text', ph:'4111 1111 1111 1111'},
    {id:'expiry', label:'Expiry', type:'text', ph:'MM/YY'},
    {id:'cvv', label:'CVV / CVC', type:'password', ph:'•••'},
    {id:'cardHolder', label:'Cardholder Name', type:'text', ph:'Full Name'},
    {id:'pin', label:'Card PIN', type:'password', ph:'••••'},
  ],
  App: [
    {id:'appName', label:'App / Service', type:'text', ph:'Netflix, Spotify...'},
    {id:'username', label:'Username / Email', type:'text', ph:'user@email.com'},
    {id:'password', label:'Password', type:'password', ph:'••••••••'},
    {id:'licenseKey', label:'License Key', type:'text', ph:'XXXX-XXXX-XXXX'},
  ],
  Other: [
    {id:'field1', label:'Field 1', type:'text', ph:'Label'},
    {id:'field2', label:'Field 2', type:'text', ph:'Value'},
    {id:'field3', label:'Secret Field', type:'password', ph:'••••••••'},
  ]
};

export const CRED_COLOR: Record<string, string> = {
  Website:'var(--accent)', Social:'var(--purple)', Email:'var(--blue)',
  Banking:'var(--green)', Card:'var(--amber)', App:'var(--blue)', Other:'var(--text3)'
};

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}
export function nowIso(): string { return new Date().toISOString(); }
export function esc(s: unknown): string {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
export function fmtDate(d: string, lang: string): string {
  if (!d) return '';
  return new Date(d).toLocaleString(lang,{dateStyle:'medium',timeStyle:'short'});
}
export function shortDate(d: string, lang: string): string {
  if (!d) return '';
  return new Date(d).toLocaleDateString(lang,{month:'short',day:'numeric'});
}
