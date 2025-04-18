import { writeContract, readContract } from "@wagmi/core";
import { config } from "../wagmi"; // Sesuaikan dengan konfigurasi wagmi Anda
import { parseUnits } from "viem";

// Alamat kontrak smart contract Anda
export const CLOUD_MINING_CONTRACT = process.env.NEXT_PUBLIC_CLOUD_MINING_CONTRACT as `0x${string}`; // Ganti dengan alamat kontrak sebenarnya

// ABI smart contract
export const CloudMiningABI = [
  {
    type: "function",
    name: "transferFromUser",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "depositToUser",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getContractBalance",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getUserBalance",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getAllowance",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approveContract",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
];

// 🔹 Fungsi untuk transfer USDT dari user ke kontrak
export const transferFromUser = async (user: string, amount: string) => {
  const transferValue = parseUnits(amount, 6); // Konversi ke 6 desimal (USDT)
  return await writeContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "transferFromUser",
    args: [user, transferValue],
  });
};

// 🔹 Fungsi untuk menarik saldo dari kontrak ke admin
export const withdraw = async (amount: string) => {
  const withdrawValue = parseUnits(amount, 6);
  return await writeContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "withdraw",
    args: [withdrawValue],
  });
};

// 🔹 Fungsi untuk deposit saldo dari kontrak ke user
export const depositToUser = async (user: string, amount: string) => {
  const depositValue = parseUnits(amount, 6);
  return await writeContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "depositToUser",
    args: [user, depositValue],
  });
};

// 🔹 Fungsi untuk mendapatkan saldo kontrak
export const getContractBalance = async (): Promise<string> => {
  const balance = await readContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "getContractBalance",
  }) as string;
  return balance.toString();
};

// 🔹 Fungsi untuk mendapatkan saldo user
export const getUserBalance = async (user: string): Promise<string> => {
  const balance = await readContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "getUserBalance",
    args: [user],
  }) as string;
  return balance.toString();
};

// 🔹 Fungsi untuk mengecek allowance user ke kontrak
export const getAllowance = async (user: string): Promise<string> => {
  const allowance = await readContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "getAllowance",
    args: [user],
  }) as string;
  return allowance.toString();
};

// 🔹 Fungsi untuk memberikan izin ke kontrak agar bisa menarik USDT user
export const approveContract = async (amount: string) => {
  const approveValue = parseUnits(amount, 6);
  return await writeContract(config, {
    address: CLOUD_MINING_CONTRACT,
    abi: CloudMiningABI,
    functionName: "approveContract",
    args: [approveValue],
  });
};
