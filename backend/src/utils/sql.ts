import randomstring from "randomstring";

export function safeString(text: string): string {
  const boundary = `$BOUNDARY_${randomstring.generate({ length: 32, charset: "alphanumeric" })}_BOUNDARY$` ;
  return `${boundary}${text}${boundary}`;
}
