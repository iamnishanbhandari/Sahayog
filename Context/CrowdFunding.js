import React, { createContext, useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { CrowdFundingABI, CrowdFundingAddress } from "../Context/contants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.utils.parseUnits(amount, "ether"),
        Math.floor(new Date(deadline).getTime() / 1000)
      );

      await transaction.wait();
      console.log("Campaign created successfully", transaction);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const getCampaigns = async () => {
    try {
      console.log("Fetching campaigns...");
      const campaigns = await contract.getCampaigns();
      console.log("Raw campaigns data:", campaigns);

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        pId: i,
      }));

      console.log("Parsed campaigns data:", parsedCampaigns);
      setCampaigns(parsedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getUserCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    try {
      const allCampaigns = await contract.getCampaigns();
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const currentUser = accounts[0];

      const filteredCampaigns = allCampaigns.filter(
        (campaign) => campaign.owner === currentUser
      );

      return filteredCampaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        pId: i,
      }));
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
    }
  };

  const donate = async (pId, amount) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const donationTransaction = await contract.donateToCampaign(pId, {
        value: ethers.utils.parseEther(amount),
      });
      await donationTransaction.wait();
      return donationTransaction;
    } catch (error) {
      console.error("Error donating to campaign:", error);
    }
  };

  const getDonations = async (pId) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    try {
      const donations = await contract.getDonators(pId);
      return donations[0].map((donator, i) => ({
        donator,
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      }));
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.log("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };


  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      getCampaigns();
    }
  }, [currentAccount]);

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        setCurrentAccount,
        createCampaign,
        campaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
