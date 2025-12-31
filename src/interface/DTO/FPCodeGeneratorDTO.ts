export default interface FPCodeGeneratorDTO {
  PhoneNumberCountryId?: number;
  PhoneNumber?: string;
  Email?: string;
  WhatsAppNumberCountryId?: number;
  WhatsAppNumber?: string;
  captchaId: string;
  userEnteredCaptchaCode: string;
}
