declare module "bcrypt" {
  export function hash(
    data: string | Buffer,
    saltOrRounds: string | number
  ): Promise<string>;

  const bcrypt: {
    hash: typeof hash;
  };

  export default bcrypt;
}
