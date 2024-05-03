import React from "react";
import {
  FaFacebookSquare,
  FaRedditSquare,
  FaTwitterSquare,
  FaWhatsappSquare,
} from "react-icons/fa";

export const ShareButton = ({ url, title }) => {
  return (
    <div className="w-full flex justify-between">
      <a target="_blank" rel="noreferrer" href="/">
        <FaFacebookSquare className="text-[#3b5598 h-auto] text-[50px]" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.reddit.com/submit.com?url=${url}&title=${title}`}
      >
        <FaRedditSquare className="text-[#3b5598 h-auto] text-[50px]" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet?url=${url}`}
      >
        <FaTwitterSquare className="text-[#3b5598 h-auto] text-[50px]" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://api.whatsapp.com/send/?text=${url}`}
      >
        <FaWhatsappSquare className="text-[#3b5598 h-auto] text-[50px]" />
      </a>
    </div>
  );
};
