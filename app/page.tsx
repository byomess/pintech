import Head from "next/head";
import { ToolsProvider, Tool } from "@/contexts/tools-context";
// import { getTools } from '@/api/pintech';

import { TagsSection } from "./components/tags-section";
import { ToolsSection } from "./components/tools-section";

import tools from "@/app/api/tools/data.json";

// const fetchTools = async (): Promise<Tool[]> => {
//   const tools: Tool[] = await getTools();
//   return tools;
// }

const Home: React.FC = async () => {
  // const tools = await fetchTools();
  return (
    <ToolsProvider tools={tools}>
      <div className="flex flex-col lg:flex-row bg-background-blue-lighter text-white min-h-screen">
        <Head>
          <title>pintech</title>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
        </Head>

        <TagsSection />

        <ToolsSection />
      </div>
    </ToolsProvider>
  );
};

export default Home;
