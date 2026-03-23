import { PublicKey } from "@solana/web3.js";

export const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export const PROGRAM_ID = new PublicKey(
  "2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc"
);

export const PLATFORM_PDA = new PublicKey(
  "H521DctKNez4czYGdW33ZwQCZHc53R86pGP5VuCkcNQm"
);

export const LOYALTY_MINT = new PublicKey(
  "CRJqookT2EuxZtCJmG8Z69S1qUSTV2rHGh62CQowwFsZ"
);

export const PLATFORM_AUTHORITY = new PublicKey(
  "EPasYQuqK2ix9jnn8SVdiJc1FWWXq5SHfHt8mwt7U9ZW"
);

export const LOYALTY_DECIMALS = 6;
export const LOYALTY_POINTS_PER_SOL = 1000;
export const PLATFORM_FEE_BPS = 50; // 0.5%

export const PLATFORM_SEED = "platform";
export const MERCHANT_SEED = "merchant";
export const PAYMENT_SEED = "payment";

// Solana Explorer URL
export const EXPLORER_URL = "https://explorer.solana.com";
export const getExplorerUrl = (signature: string) =>
  `${EXPLORER_URL}/tx/${signature}?cluster=devnet`;
export const getAddressUrl = (address: string) =>
  `${EXPLORER_URL}/address/${address}?cluster=devnet`;
