import type { Preview } from "@storybook/react";

import "../app/globals.css";
import "../styles/storybook.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f5f4fb" },
        { name: "dark", value: "#0b1120" }
      ]
    }
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: ["light", "dark"]
      }
    }
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;
      document.documentElement.setAttribute("data-theme", theme);
      return (
        <div className="storybook-wrapper">
          <Story />
        </div>
      );
    }
  ]
};

export default preview;
