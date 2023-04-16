type ImageCldProps = {
  secure_url: string;
  public_id: string;
};

export type AuthorInfo = {
  pseudonym: string;
  about: string;
  email: string;
  website: string;
  walletAddress: string;
  backDocument: ImageCldProps;
  frontDocument: ImageCldProps;
  facebook: string;
  instagram: string;
  linkedIn: string;
  twitter: string;
  phoneNumber: string;
  picture: ImageCldProps;
};
