import styles from "../style";
import { logo } from "../assets";
import { footerLinks } from "../constant";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Footer = () => {
  const { user } = useContext(AuthContext);

  const filteredFooterLinks = footerLinks.map((footerlink) => {
    if (footerlink.title === "Page") {
      if (!user) {
        return {
          ...footerlink,
          links: footerlink.links.filter((link) => link.name !== "Administrator" && link.name !== "My Orders"),
        };
      } else {
        return footerlink;
      }
    } else if (footerlink.title === "Account") {
      if (!user) {
        return {
          ...footerlink,
          links: footerlink.links.filter((link) => link.name !== "My Info" && link.name !== "Update Info"),
        };
      } else {
        return footerlink;
      }
    }
    return footerlink;
  });

  return (
    <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
      <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
        <div className="flex-[1] flex flex-col justify-start mr-10">
          <img
            src={logo}
            alt="footer"
            className="w-[338px] h-[185px] object-contain"
          />
          <p className={`${styles.paragraph} mt-4 max-w-[312px]`}>
            Villa Nyaman @ Pererenan, Providing all you need!
          </p>
        </div>

        <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
          {filteredFooterLinks.map((footerlink) => (
            <div key={footerlink.title} className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}>
              <h4 className="text-gradient font-poppins font-medium text-[18px] leading-[27px] text-dimblue">
                {footerlink.title}
              </h4>
              <ul className="list-none mt-4">
                {footerlink.links.map((link, index) => (
                  <li
                    key={link.name}
                    className={` font-poppins font-normal text-[16px] leading-[24px] hover:text-secondary cursor-pointer ${
                      index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                    }`}
                  >
                    <a href={link.link} className="text-dimblue">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
        <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-black">
          Copyright Ⓒ 2024 Villa Nyaman. All Rights Reserved.
        </p>
      </div>
    </section>
  );
}

export default Footer;
