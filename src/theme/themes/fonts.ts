import ZainRegular from "../../assets/fonts/Zain_Regular.ttf";
import ZainLight from "../../assets/fonts/Zain_Light.ttf";
import ZainExtraLight from "../../assets/fonts/Zain_ExtraLight.ttf";
import ZainBold from "../../assets/fonts/Zain_Bold.ttf";
import ZainExtraBold from "../../assets/fonts/Zain_ExtraBold.ttf";
import ZainBlack from "../../assets/fonts/Zain_Black.ttf";
import ZainItalic from "../../assets/fonts/Zain_Italic.ttf";

export const zainFontFaces = `
  @font-face {
    font-family: "Zain";
    src: url(${ZainExtraLight}) format("truetype");
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Zain";
    src: url(${ZainLight}) format("truetype");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Zain";
    src: url(${ZainRegular}) format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Zain";
    src: url(${ZainBold}) format("truetype");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Zain";
    src: url(${ZainExtraBold}) format("truetype");
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Zain";
    src: url(${ZainBlack}) format("truetype");
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Zain";
    src: url(${ZainItalic}) format("truetype");
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
`;