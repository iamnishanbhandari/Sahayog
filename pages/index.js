import React, { useContext, useEffect, useState } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Hero, Card, PupUp } from "../Components";

const Index = () => {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
  } = useContext(CrowdFundingContext);

  const [allCampaign, setAllCampaign] = useState([]);
  const [userCampaign, setUserCampaign] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const allData = await getCampaigns();
        const userData = await getUserCampaigns();
        setAllCampaign(allData);
        setUserCampaign(userData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaignData();
  }, [getCampaigns, getUserCampaigns]);

  return (
    <>
      <Hero titleData={titleData} createCampaign={createCampaign} />

      <Card
        title="All Listed Campaign"
        allcampaign={allCampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

      <Card
        title="Your Created Campaign"
        allcampaign={userCampaign}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

      {openModel && (
        <PupUp
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default Index;
