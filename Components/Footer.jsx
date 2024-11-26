import React from "react";

const Footer = () => {
  const productList = ["Market", "ERC20 Token", "Donation"];
  const contactList = ["support@sahayog.com", "info@example.com", "Contact us"];
  const usefulLink = ["Home", "About us", "Company Bio"];
  return (
    <>
      <footer className="text-center text-white backgroundMain lg:text-left">
        <div className="mx-6 py-10 text-center md:text-left">
          <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              <h6>Sahayog</h6>
              {/* <p>
                Here you can use rows and columns to organize your footer
                content.
              </p> */}
            </div>
            <div className="">
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Products
              </h6>
              {productList.map((el, i) => (
                <p className="mb-4" key={i + 1}>
                  <a href="#!">{el}</a>
                </p>
              ))}
            </div>
            <div className="">
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                Useful Links
              </h6>
              {usefulLink.map((el, i) => (
                <p className="mb-4" key={i + 1}>
                  <a href="#!">{el}</a>
                </p>
              ))}
            </div>
          </div>
          <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
            Contact
          </h6>
          {contactList.map((el, i) => (
            <p className="mb-4" key={i + 1}>
              <a href="#!">{el}</a>
            </p>
          ))}
          <div className="backgroundMain p-6 text-center">
            <span>2024 Copyright Sahayog</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
