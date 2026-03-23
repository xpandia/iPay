export type IpayProtocol = {
  version: "0.1.0";
  name: "ipay_protocol";
  instructions: [
    {
      name: "initializePlatform";
      accounts: [
        { name: "platform"; isMut: true; isSigner: false },
        { name: "authority"; isMut: true; isSigner: true },
        { name: "loyaltyMint"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "rent"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "platformFee"; type: "u16" },
        { name: "loyaltyRate"; type: "u16" }
      ];
    },
    {
      name: "registerMerchant";
      accounts: [
        { name: "merchant"; isMut: true; isSigner: false },
        { name: "platform"; isMut: false; isSigner: false },
        { name: "owner"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "name"; type: "string" },
        { name: "metadata"; type: "string" }
      ];
    },
    {
      name: "updateMerchant";
      accounts: [
        { name: "merchant"; isMut: true; isSigner: false },
        { name: "owner"; isMut: false; isSigner: true }
      ];
      args: [
        { name: "name"; type: { option: "string" } },
        { name: "metadata"; type: { option: "string" } }
      ];
    },
    {
      name: "processPayment";
      accounts: [
        { name: "platform"; isMut: true; isSigner: false },
        { name: "merchant"; isMut: true; isSigner: false },
        { name: "payer"; isMut: true; isSigner: true },
        { name: "merchantOwner"; isMut: true; isSigner: false },
        { name: "platformAuthority"; isMut: true; isSigner: false },
        { name: "loyaltyMint"; isMut: true; isSigner: false },
        { name: "payerLoyaltyAta"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "associatedTokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "amount"; type: "u64" }];
    },
    {
      name: "redeemLoyalty";
      accounts: [
        { name: "platform"; isMut: true; isSigner: false },
        { name: "merchant"; isMut: true; isSigner: false },
        { name: "redeemer"; isMut: true; isSigner: true },
        { name: "merchantOwner"; isMut: true; isSigner: false },
        { name: "loyaltyMint"; isMut: true; isSigner: false },
        { name: "redeemerLoyaltyAta"; isMut: true; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "loyaltyAmount"; type: "u64" }];
    }
  ];
  accounts: [
    {
      name: "Platform";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "loyaltyMint"; type: "publicKey" },
          { name: "platformFee"; type: "u16" },
          { name: "loyaltyRate"; type: "u16" },
          { name: "totalPayments"; type: "u64" },
          { name: "totalMerchants"; type: "u32" },
          { name: "bump"; type: "u8" }
        ];
      };
    },
    {
      name: "Merchant";
      type: {
        kind: "struct";
        fields: [
          { name: "owner"; type: "publicKey" },
          { name: "platform"; type: "publicKey" },
          { name: "name"; type: "string" },
          { name: "metadata"; type: "string" },
          { name: "totalReceived"; type: "u64" },
          { name: "totalTransactions"; type: "u32" },
          { name: "isActive"; type: "bool" },
          { name: "bump"; type: "u8" }
        ];
      };
    }
  ];
};

export const IDL: IpayProtocol = {
  version: "0.1.0",
  name: "ipay_protocol",
  instructions: [
    {
      name: "initializePlatform",
      accounts: [
        { name: "platform", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "loyaltyMint", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [
        { name: "platformFee", type: "u16" },
        { name: "loyaltyRate", type: "u16" },
      ],
    },
    {
      name: "registerMerchant",
      accounts: [
        { name: "merchant", isMut: true, isSigner: false },
        { name: "platform", isMut: false, isSigner: false },
        { name: "owner", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "name", type: "string" },
        { name: "metadata", type: "string" },
      ],
    },
    {
      name: "updateMerchant",
      accounts: [
        { name: "merchant", isMut: true, isSigner: false },
        { name: "owner", isMut: false, isSigner: true },
      ],
      args: [
        { name: "name", type: { option: "string" } },
        { name: "metadata", type: { option: "string" } },
      ],
    },
    {
      name: "processPayment",
      accounts: [
        { name: "platform", isMut: true, isSigner: false },
        { name: "merchant", isMut: true, isSigner: false },
        { name: "payer", isMut: true, isSigner: true },
        { name: "merchantOwner", isMut: true, isSigner: false },
        { name: "platformAuthority", isMut: true, isSigner: false },
        { name: "loyaltyMint", isMut: true, isSigner: false },
        { name: "payerLoyaltyAta", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
    {
      name: "redeemLoyalty",
      accounts: [
        { name: "platform", isMut: true, isSigner: false },
        { name: "merchant", isMut: true, isSigner: false },
        { name: "redeemer", isMut: true, isSigner: true },
        { name: "merchantOwner", isMut: true, isSigner: false },
        { name: "loyaltyMint", isMut: true, isSigner: false },
        { name: "redeemerLoyaltyAta", isMut: true, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "loyaltyAmount", type: "u64" }],
    },
  ],
  accounts: [
    {
      name: "Platform",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "loyaltyMint", type: "publicKey" },
          { name: "platformFee", type: "u16" },
          { name: "loyaltyRate", type: "u16" },
          { name: "totalPayments", type: "u64" },
          { name: "totalMerchants", type: "u32" },
          { name: "bump", type: "u8" },
        ],
      },
    },
    {
      name: "Merchant",
      type: {
        kind: "struct",
        fields: [
          { name: "owner", type: "publicKey" },
          { name: "platform", type: "publicKey" },
          { name: "name", type: "string" },
          { name: "metadata", type: "string" },
          { name: "totalReceived", type: "u64" },
          { name: "totalTransactions", type: "u32" },
          { name: "isActive", type: "bool" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
};
