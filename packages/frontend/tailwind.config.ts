/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  important: true,
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/**/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#009688",
        secondary: "#87ceeb",
        success: "#01B81A",
        pink: "#f2eafb",
        warning: "#FA8B0C",
        danger: "#ff4d4f",
        info: "#00AAFF",
        link: "#1890ff",
        dark: "#0A0A0A",
        body: "#404040",
        "theme-gray": "#404040",
        "theme-grayDark": "rgb(255, 255, 255, .06)",
        light: "#747474",
        lightDark: "rgb(255, 255, 255, .06)",
        "light-extra": "#a0a0a0",
        "light-extraDark": "rgb(255, 255, 255, .06)",
        violet: "#5840ff",
        section: "#f4f5f7",
        breadcrumbs: "#666D92",
        active: "#01b81a",
        done: "#01b81a",
        deactivated: "#FA8B0C",
        pending: "#FA8B0C",
        blocked: "#ff0f0f",
        early: "#8231d3",
        late: "#fa8b0c",
        progress: "#ff4d4f",
        complete: "#01b81a",
        "google-plus": "rgb(240, 101, 72)",
        google: "rgb(241, 67, 54)",
        facebook: "rgb(58, 88, 155)",
        youtube: "#FF0000",
        twitter: "rgb(3, 169, 244)",
        github: "rgb(9, 14, 48)",
        linkedin: "rgb(0, 122, 185)",
        instagram: "rgb(209, 32, 143)",
        dribbble: "#c2185b",
        medium: "#66cdaa",
        "primary-transparent": "rgba(130, 49, 211, 0.082)",
        "secondary-transparent": "rgba(88, 64, 255, 0.082)",
        "link-transparent": "rgba(88, 64, 255, 0.082)",
        "success-transparent": "rgb( 1, 184, 26, 0.082)",
        "pink-transparent": "rgb(242, 234, 251, 0.082)",
        "warning-transparent": "rgba(250, 139, 12, 0.082)",
        "danger-transparent": "rgb( 255, 15, 15, .082)",
        "info-transparent": "rgba(0, 170, 255, 0.082)",
        "dark-transparent": "rgba(10, 10, 10, 0.082)",
        "theme-gray-transparent": "rgba(64, 64, 64, 0.082)",
        "active-transparent": "rgb( 1, 184, 26, 0.082)",
        "done-transparent": "rgb( 1, 184, 26, 0.082)",
        "deactivated-transparent": "rgba(250, 139, 12, 0.082)",
        "pending-transparent": "rgba(250, 139, 12, 0.082)",
        "blocked-transparent": "rgba(255, 15, 15, 0.082)",
        "google-plus-transparent": "rgba(240, 101, 72, 0.063)",
        "google-transparent": "rgba(241, 67, 54, 0.063)",
        "facebook-transparent": "rgba(58, 88, 155, 0.063)",
        "twitter-transparent": "rgba(3, 169, 244, 0.063)",
        "github-transparent": "rgba(3, 169, 244, 0.063)",
        "linkedin-transparent": "rgba(0, 122, 185, 0.063)",
        "instagram-transparent": "rgba(209, 32, 143, 0.063)",
        "shadow-transparent": "rgba(130, 49, 211, 0.02)",
        "primary-hbr": "#6726A8",
        "secondary-hbr": "#3520C8",
        "success-hbr": "#0D811D",
        "info-hbr": "#0787C7",
        "warning-hbr": "#D9790A",
        "danger-hbr": "#CB0000",
        "dark-hbr": "#272525",
        "gray-hbr": "#585858",
        "light-hbr": "#585858",
        "light-extra-hbr": "#585858",
        regular: "#F1F2F6",
        normal: "#E3E6EF",
        deep: "#C6D0DC",
        regularDark: "rgb(255, 255, 255, .06)",
        normalDark: "rgb(255, 255, 255, .06)",
        deepDark: "rgb(255, 255, 255, .06)",
        regularBG: "#F8F9FB",
        normalBG: "#F4F5F7",
        deepBG: "#EFF0F3",
        insideBG: "#efeffe",
        white: "#ffffff",
        regularBGdark: "rgb(255, 255, 255, .10)",
        normalBGdark: "rgb(255, 255, 255, .10)",
        deepBGdark: "rgb(255, 255, 255, .10)",
        whiteDark: "rgb(255, 255, 255, .10)",
        currentColor: "currentColor",
      },
      boxShadow: {
        regular: "0 5px 20px rgba(160,160,160,0.05)",
        pricing: "0 5px 20px rgba(146,153,184,0.2)",
        action: "0 5px 20px rgba(64, 64, 64, 0.08)",
        box: "0 15px 25px rgba(146,153,184,0.2)",
        boxLarge: "0 10px 40px rgba(146,153,184,0.2)",
        custom: "0 15px 50px #9299b820",
        dot: "0 0 0 1px #fff",
        btn: "0 8px 13px rgba(130, 49 ,211, 0.13)",
        faq: "0 15px 40px rgba(116, 116 ,116, 0.08)",
      },
      borderWidth: {
        1: "1px",
        5: "5px",
      },
      borderRadius: {
        4: "4px",
        6: "6px",
        10: "10px",
      },
      fontFamily: {
        Jost: ["Jost", "sans-serif"],
        Awesome: ["FontAwesome"],
      },
      fontSize: {
        10: ["10px", "14px"],
        11: ["11px", "15px"],
        13: ["13px", "18px"],
        15: ["15px", "24px"],
        17: ["17px", "26px"],
        22: ["22px", "30px"],
        42: ["42px", "62px"],
        58: ["58px", "86px"],
      },
      zIndex: {
        998: "998",
        99998: "99998",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      "4xl": { max: "1699px" },
      "3xl": { max: "1599px" },
      "2xl": { max: "1299px" },
      xl: { max: "1199px" },
      lg: { max: "991px" },
      md: { max: "767px" },
      sm: { max: "575px" },
      ssm: { max: "480px" },
      xs: { max: "380px" },
      xxs: { max: "320px" },
      "min-xxs": "320px",
      "min-xs": "380px",
      "min-ssm": "480px",
      "min-sm": "575px",
      "min-md": "768px",
      "min-lg": "991px",
      "min-xl": "1199px",
      "min-2xl": "1299px",
      "min-3xl": "1599px",
      "min-4xl": "1699px",
      "old-sm": "640px",
      "old-md": "768px",
      "old-lg": "1024px",
      "old-xl": "1280px",
      "old-2xl": "1536px",
    },
  },
  plugins: [],
}
